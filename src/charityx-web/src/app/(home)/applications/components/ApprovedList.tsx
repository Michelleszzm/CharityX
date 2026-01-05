"use client"

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
import { Application, ApplicationEditRequest, ApplicationRegisteredResponse, ApplicationStatus, updateApplicationAction, updateApplicationUser } from "@/apis/admin"
import ApplicationManagerDialog from "./ApplicationManagerDialog"
import { formatDate } from "@/lib/utils"
import App from "next/app"
import ApplicationEditDialog, { UserEditData, userEditDataDefault } from "./ApplicationEditDialog"
import { SysUserVo } from "@/apis/user"
import ViewDialog from "./ViewDialog"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { set } from "zod"

interface RegisteredProps {
  data: ApplicationRegisteredResponse;
  loading: boolean
  handlePageChange: (page: number, email: string, nonprofitName: string) => void;
}

export default function ApprovedList({ data, loading, handlePageChange }: RegisteredProps) {
  const [email, setEmail] = useState("")
  const [nonprofit, setNonprofit] = useState("")
  const [selectedData, setSelectedData] = useState<Application | undefined>(undefined)
  const [managerDialogOpen, setManagerDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [appEditDialogOpen, setAppEditDialogOpen] = useState(false)
  const [userEditData, setUserEditData] = useState<UserEditData | undefined>(undefined)

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
          <button className="text-[14px] font-normal cursor-pointer text-[#1890FF] hover:underline" onClick={() => {
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
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div className="font-normal flex flex-row items-center">
            <div className={`size-2 ${row.original.status === 2 ? "bg-[#32BB62]" : "bg-[#FE5827]"} rounded-2xl mr-2`}></div>
            {row.original.status === 2 ? "Active" : "Revoked"}
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
            <button className="text-[14px] font-normal cursor-pointer text-[#1890FF] hover:underline" onClick={() => handleManager(props.row.original)}>
              Manage
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

  const handleManager = (item: Application) => {
    setSelectedData(item)
    setManagerDialogOpen(true)
  }

  const handleManageDialogOpen = (open: boolean) => {
    setManagerDialogOpen(open)
  }

  const handleEditApplication = (user: SysUserVo) => {
    if (user) {
      setUserEditData({
        userType: "organization",
        id: user.id,
        chain: user.provider,
        wallet: user.providerId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        age: user.age.toString(),
        phone: user.phone,
        country: user.country,
        city: user.city,
        occupation: user.occupation
      })
    } else {
      setUserEditData({
        ...userEditDataDefault,
        userType: "organization",
      })
    }
    setAppEditDialogOpen(true)
  }
  const handleAppEditDialogOpen = (open: boolean) => {
    setAppEditDialogOpen(open)
  }

  const handleManagerDialogConfirm = async (item: Application) => {
    console.log("manager dialog confirm")
    try {
      let targetStatus = ApplicationStatus.REVOKED;
      if (item.status === ApplicationStatus.REVOKED) {
        targetStatus = ApplicationStatus.ACTIVE;
      }
      await updateApplicationAction({
        userId: item.userId,
        sourceStatus: item.status,
        targetStatus,
      })
      handlePageChange(data.pageNum, email, nonprofit)
    } catch (error) {
      console.log("handleManagerDialogConfirm error:", error)
    }
  }

  const handleAppEditDialogConfirm = async (item: UserEditData) => {
    console.log("app edit dialog confirm")
    try {
      await updateApplicationUser({
        ...item,
        userType: undefined,
      })
      handlePageChange(data.pageNum, email, nonprofit)
      toast.success("Saved successfully.")
    } catch (error) {
      console.log("handleManagerDialogConfirm error:", error)
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

      <ApplicationManagerDialog data={selectedData} open={managerDialogOpen} setOpen={handleManageDialogOpen} onConfirm={handleManagerDialogConfirm} onEdit={handleEditApplication} />
      <ApplicationEditDialog data={userEditData} open={appEditDialogOpen} setOpen={handleAppEditDialogOpen} onConfirm={handleAppEditDialogConfirm} />
      <ViewDialog data={selectedData} open={viewDialogOpen} setOpen={(open: boolean) => setViewDialogOpen(open)} />
    </div>
  )
}
