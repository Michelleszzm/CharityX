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
import { Application, ApplicationRegisteredResponse } from "@/apis/admin"
import { Spinner } from "@/components/ui/spinner"

interface RegisteredProps {
  data: ApplicationRegisteredResponse;
  loading: boolean;
  handlePageChange: (page: number, email: string) => void;
}

export default function Registered({ data, loading, handlePageChange }: RegisteredProps) {
  const [email, setEmail] = useState("")
  const [nonprofit, setNonprofit] = useState("")

  // format date display
  const formatDate = (time: number) => {
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
        accessorKey: "registrationDate",
        header: "Registration Date",
        cell: ({ row }) => (
          <div className="font-normal">
            {formatDate(row.original.mergeDate)}
          </div>
        ),
        enableSorting: false
      }
    ],
    []
  )

  // TanStack React Table instance
  const table = useReactTable({
    data: data.list,
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
    handlePageChange(page, email)
  }

  // search processing function
  const handleSearch = () => {
      handlePageChange(1, email)
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

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="h-10 w-[82px] cursor-pointer rounded-[8px] bg-[#FE5827] text-[14px] font-bold text-white transition-opacity hover:opacity-90 active:opacity-80"
        >
          Search
        </button>
      </div>

      {/* data table */}
      <div className="mt-4 border border-[#E9E9E9]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow
                key={headerGroup.id}
                className="w-1/2 border-b border-[#E9E9E9] bg-[#F9F9F9] hover:bg-[#F9F9F9]"
              >
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className="w-1/2 h-[52px] px-6 text-[14px] font-medium text-[#020328]"
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
    </div>
  )
}
