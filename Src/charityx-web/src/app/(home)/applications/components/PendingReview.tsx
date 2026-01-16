"use client"

import Image from "next/image"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef
} from "@tanstack/react-table"
import { Application, ApplicationRegisteredResponse, ApplicationStatus, delApplication, updateApplicationAction } from "@/apis/admin"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import approvedImage from "@/assets/home/ic_approved.png"
import rejectedImage from "@/assets/home/ic_rejected.png"
import useModalStore from "@/store/modalStore"
import ApplicationRejectDialog from "./ApplicationRejectDialog"
import ViewDialog from "./ViewDialog"
import { Spinner } from "@/components/ui/spinner"
import DeleteDialog from "./DeleteDialog"
import { it } from "node:test"
import { set } from "zod"

interface RegisteredProps {
  data: ApplicationRegisteredResponse;
  loading: boolean;
  handlePageChange: (page: number, email: string, nonprofitName: string) => void;
}


export default function PendingReview({ data, loading, handlePageChange }: RegisteredProps) {
  const { setApplicationDeleteModalOpen } = useModalStore();
  const [email, setEmail] = useState("")
  const [nonprofit, setNonprofit] = useState("")
  const [selectedData, setSelectedData] = useState<Application | undefined>(undefined)
  const [delData, setDelData] = useState<Application | undefined>(undefined)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  // format date display
  const formatDate = (time: number | string) => {
    const date = new Date(time)
    return date
      .toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      })
      .replace(/\//g, "-")
  }

  // table column definition
  const columns = useMemo<ColumnDef<Application>[]>(
    () => [
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="font-normal">{row.original.email}</div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "nonprofit",
        header: "Nonprofit",
        cell: ({ row }) => (
          <div className="font-normal">{row.original.nonprofitName}</div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "proof",
        header: "Proof",
        cell: ({ row }) => (
          <button className="text-[14px] font-normal text-[#1890FF] hover:underline" onClick={() => {
            setSelectedData(row.original)
            setViewDialogOpen(true)
          }}>
            View
          </button>
        ),
        enableSorting: false
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="font-normal">{`${row.original.firstName} ${row.original.lastName}`}</div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "applicationDate",
        header: "Application Date",
        cell: ({ row }) => (
          <div className="font-normal">
            {formatDate(row.original.mergeDate)}
          </div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <div className="font-normal">
            {row.original.type === 1 ? "New" : "Update"}
          </div>
        ),
        enableSorting: false
      },
      {
        id: "actions",
        header: () => (
          <button className="flex w-full items-center justify-center">
            Actions
          </button>
        ),
        cell: (props) => (
          <div className="flex w-full items-center justify-center gap-4">
            <div className="text-[14px] font-normal text-[#1890FF] hover:underline">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="cursor-pointer">Actions</DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Image
                      src={approvedImage}
                      alt="approved"
                      width={16}
                      height={16}
                      className="size-4"
                    />
                    <div className="text-[#32BB62] font-bold text-sm cursor-pointer" onClick={() => handleApprove(props.row.original)}>Approve</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() =>handleReject(props.row.original)}>
                    <Image
                      src={rejectedImage}
                      alt="reject"
                      width={16}
                      height={16}
                      className="size-4"
                    />
                    <div className="text-[#FE5827] font-bold text-sm">Reject</div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <button className="text-[14px] font-normal cursor-pointer text-[#FE5827] hover:underline" onClick={() => handleDelete(props.row.original)}>
              Delete
            </button>
          </div>
        ),
        enableSorting: false
      }
    ],
    []
  )

  // TanStack React Table instance
  const table = useReactTable({
    data: data.list ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10 // 10 data per page
      }
    }
  })

  const handlePageChangeWithEmail = (page: number) => {
    handlePageChange(page, email, nonprofit)
  }

  // search processing function
  const handleSearch = () => {
      handlePageChange(1, email, nonprofit)
  }

  const handleClear = () => {
    setEmail("")
    setNonprofit("")
    handlePageChange(1, "", "")
  }

  const handleDelete = (item: Application) => {
    console.log("delete parameters:", item)
    setDelData(item);
  }
  const handleApprove = async (item: Application) => {
    console.log("approve parameters:", item)
    const res = await updateApplicationAction({
      userId: item.userId,
      sourceStatus: item.status,
      targetStatus: ApplicationStatus.ACTIVE,
    })
    handlePageChange(data.pageNum, email, nonprofit)
  }
  const handleReject = async (item: Application) => {
    console.log("reject parameters:", item)
    setSelectedData(item)
    setRejectDialogOpen(true);
  }

  const handleRejectDialogOpen = (open: boolean) => {
    console.log("reject dialog open:", open)
    setRejectDialogOpen(open)
  }

  const handleRejectConfirm = async (item: Application, reason: string) => { 
    try {
      await updateApplicationAction({
        userId: item.userId,
        sourceStatus: item.status,
        targetStatus: ApplicationStatus.REJECTED,
        reason: reason,
      })
      handlePageChange(data.pageNum, email, nonprofit)
    } catch (error) {
      console.log("updateApplicationAction error:", error)
    }
  }

  const handleDeleteDialog = (open: boolean) => {
    setDelData(undefined);
  }

  const handleDeleteConfirm = async (item: Application) => {
    try {
      await delApplication({
        userId: item.userId,
        sourceStatus: item.status,
        targetStatus: ApplicationStatus.DELETED,
      })
      handlePageChange(data.pageNum, email, nonprofit)
    } catch (error) {
      console.log("delApplication error:", error)
    }
  }

  return (
    <div>
      {/* search filter bar */}
      <div className="flex items-center gap-4">
        {/* email input box */}
        <Input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="h-10 w-[200px] rounded-[8px] border-[#E9E9E9] text-[14px] placeholder:text-[#020328]/30"
        />

        {/* nonprofit input box */}
        <Input
          placeholder="Nonprofit"
          value={nonprofit}
          onChange={e => setNonprofit(e.target.value)}
          className="h-10 w-[200px] rounded-[8px] border-[#E9E9E9] text-[14px] placeholder:text-[#020328]/30"
        />

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="h-10 w-[82px] cursor-pointer rounded-[8px] bg-[#FE5827] text-[14px] font-bold text-white transition-opacity hover:opacity-90 active:opacity-80"
        >
          Search
        </button>
        <button
          onClick={handleClear}
          className="h-10 w-[82px] cursor-pointer border border-[#E9E9E9] rounded-[8px] text-[14px] text-[#020328] font-bold transition-opacity hover:opacity-90 active:opacity-80"
        >
          Clear
        </button>
      </div>

      {/* data table */}
      <div className="mt-4 border border-[#E9E9E9]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-[#E9E9E9] bg-[#F9F9F9] hover:bg-[#F9F9F9]"
              >
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className="h-[52px] px-6 text-[14px] font-medium text-[#020328]"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {
              loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <Spinner className="size-6 m-auto" />
                  </TableCell>
                </TableRow>
              ):table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  className="border-b border-[#E9E9E9] hover:bg-[#F9F9F9]/50"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className="px-6 py-4 text-[14px] !text-[#020328]/65"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  no data
                </TableCell>
              </TableRow>
            )
            }
          </TableBody>
        </Table>
      </div>

      {/* pagination */}
      {
        data && (
          <Pagination
            currentPage={data.pageNum}
            total={data.total} // mock total 20 data (10 pages × 10 data per page)
            pageSize={data.pageSize}
            onPageChange={handlePageChangeWithEmail}
          />
        )
      }

      <ApplicationRejectDialog data={selectedData} open={rejectDialogOpen} setOpen={handleRejectDialogOpen} onConfirem={handleRejectConfirm} />
      <ViewDialog data={selectedData} open={viewDialogOpen} setOpen={(open: boolean) => setViewDialogOpen(open)} />
      <DeleteDialog data={delData} setOpen={(open: boolean) => handleDeleteDialog(open)} onConfirm={handleDeleteConfirm} />
    </div>
  )
}
