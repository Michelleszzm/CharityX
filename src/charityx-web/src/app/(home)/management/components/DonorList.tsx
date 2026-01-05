"use client"

import { useState, useMemo, useEffect, use } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
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
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { cn, formatDate, formatAddress, formatAmount } from "@/lib/utils"
import { addDonorNote, Donor, donorInfoDefault, DonorSummaryResponse, FundraisingAllocationSelectItem, getDonorList, getDonorRecordWithAddress, getDonorSummary, updateDonorUser } from "@/apis/fundraise"
import DonorInfoDialog, { DonorInfoData } from "./DonorInfoDialog"
import ApplicationEditDialog, { UserEditData, userEditDataDefault } from "../../applications/components/ApplicationEditDialog"
import { SysUserVo, sysUserVoDefault } from "@/apis/user"
import { ApplicationEditRequest, updateApplicationUser } from "@/apis/admin"
import DonorNoteAddDialog from "./DonorNoteAddDialog"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { PaginationResp, paginationRespDefault } from "@/apis/core"

interface Props {
  summary: DonorSummaryResponse;
  selectAmountRanges: FundraisingAllocationSelectItem[];
}

export default function DonorList({ summary, selectAmountRanges }: Props) {
  const [walletAddress, setWalletAddress] = useState("")
  const [amountRange, setAmountRange] = useState("all")
  const [sorting, setSorting] = useState<SortingState>([])
  const [data, setData] = useState<PaginationResp<Donor>>(paginationRespDefault)

  const [loading, setLoading] = useState(false)
  const [donorInfoData, setDonorInfoData] = useState<DonorInfoData | undefined>(undefined)

  const [donorAddNoteDialogData, setDonorAddNoteDialogData] = useState<Donor | undefined>(undefined)
  const [donorAddNoteDialogOpen, setDonorAddNoteDialogOpen] = useState(false)

  const [appEditDialogOpen, setAppEditDialogOpen] = useState(false)
  const [userEditData, setUserEditData] = useState<UserEditData | undefined>(undefined)
  
  // table column definition
  const columns = useMemo<ColumnDef<Donor>[]>(
    () => [
      {
        accessorKey: "walletAddress",
        header: "Wallet Address",
        cell: ({ row }) => (
          <div className="font-normal">{formatAddress(row.original.donorWallet)}</div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "totalDonations",
        header: ({ column }) => {
          return (
            <button
              className="flex cursor-pointer items-center gap-1 hover:text-[#020328]/80"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Total Donations (USD)
              <ArrowUpDown className="size-4" />
            </button>
          )
        },
        cell: ({ row }) => (
          <div className="font-normal">
            {formatAmount(row.original.totalDonations)}
          </div>
        )
      },
      {
        accessorKey: "donationCount",
        header: ({ column }) => {
          return (
            <button
              className="flex cursor-pointer items-center gap-1 hover:text-[#020328]/80"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Donation Count
              <ArrowUpDown className="size-4" />
            </button>
          )
        },
        cell: ({ row }) => (
          <div className="mr-4 text-center font-normal">
            {row.original.donationCount}
          </div>
        )
      },
      {
        accessorKey: "lastDonation",
        header: "Last Donation",
        cell: ({ row }) => (
          <div className="font-normal">
            {formatDate(row.original.lastDonation)}
          </div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "lastAmount",
        header: "Last Amount (USD)",
        cell: ({ row }) => (
          <div className="font-normal">
            {formatAmount(row.original.lastAmount)}
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
        cell: ({ row }) => (
          <div className="flex w-full items-center justify-center gap-4">
            <button className="text-[14px] font-normal cursor-pointer text-[#1890FF] hover:underline" onClick={() => handleDonorView(row.original)}>
              View
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
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10 // 10 data per page
      }
    }
  })

  // search processing function
  const handleSearch = () => {
    console.log("search parameters:", { walletAddress, amountRange })
    handleDonorList(1)
  }

  const handleSelectAmountRange = (range: string) => {
    setAmountRange(range)
  }

  // pagination processing function
  const handlePageChange = (page: number) => {
    table.setPageIndex(page - 1) // TanStack table page index starts from 0
    handleDonorList(page)
  }

  const handleDonorView = (data: Donor) => {
    setDonorInfoData({
      donor: data,
      donorInfo: donorInfoDefault,
    })
    handelGetDonorRecordWithAddress(data)
  }

  const handleDonorInfoDialogOpen = (open: boolean) => {
    console.log('handleDonorInfoDialogOpen', open)
    setDonorInfoData(undefined)
  }

  const handleAppEditDialogConfirm = async (item: UserEditData) => {
    console.log("app edit dialog confirm")
    await updateDonorUser({
      ...item,
      id: undefined,
      userType: undefined,
    })
    toast.success("Saved successfully.")
    if (donorInfoData) {
      await handelGetDonorRecordWithAddress(donorInfoData.donor)
    }
  }
  
  const handleAppEditDialogOpen = (open: boolean) => {
    setAppEditDialogOpen(open)
  }

  const handleDonorUserEdit = (user: SysUserVo | null, donor: Donor) => {
    if (user) {
      setUserEditData({
        userType: "donor",
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
        chain: donor.chain,
        wallet: donor.donorWallet,
        userType: "donor",
      })
    }
    setAppEditDialogOpen(true)
  }

  const handleDonorAddNote = (data: Donor) =>  {
    setDonorAddNoteDialogData(data)
    setDonorAddNoteDialogOpen(true)
  }
  const handleDonorAddNoteDialogConfirm = async (item: Donor, reason: string) => {
    try {
      await addDonorNote({
        chain: item.chain,
        wallet: item.donorWallet,
        note: reason,
      })
      toast.success("Submitted successfully.")
      handelGetDonorRecordWithAddress(item)
    } catch (error) {
      console.error(error)
    }
  }

  const handelGetDonorRecordWithAddress = async (donor: Donor) => {
    const res = await getDonorRecordWithAddress({
      chain: "SOLANA",
      donorWallet: donor.donorWallet,
    })
    setDonorInfoData({
      donor,
      donorInfo: res,
    })
  }

  const handleDonorList = async (pageNum: number) => {
    setLoading(true)
    try {
      const result = selectAmountRanges.filter(item => item.value === amountRange)
      let selectedAmountMin = ""
      let selectedAmountMax = ""
      if (result.length > 0) {
        selectedAmountMin = result[0].min
        selectedAmountMax = result[0].max
      }
      const res = await getDonorList(pageNum, walletAddress, selectedAmountMin, selectedAmountMax)
      setData(res)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (data) {
      handleDonorList(1)
    }
  }, [])
  if (!data) return null;
  return (
    <div>
      {/* search filter bar */}
      <div className="flex items-center gap-4">
        {/* Wallet Address input box */}
        <Input
          placeholder="Wallet Address"
          value={walletAddress}
          onChange={e => setWalletAddress(e.target.value)}
          className="h-10 w-[200px] rounded-[8px] border-[#E9E9E9] text-[14px] placeholder:text-[#020328]/30"
        />

        {/* Amount Range selector */}
        <Select value={amountRange} onValueChange={handleSelectAmountRange}>
          <SelectTrigger className="!h-10 w-[200px] cursor-pointer rounded-[8px] border-[#E9E9E9] text-[14px] text-[#020328]/60">
            <SelectValue placeholder="Amount Range" />
          </SelectTrigger>
          <SelectContent>
            {
              selectAmountRanges.map((item) => (
                <SelectItem key={item.value} value={item.value} className="cursor-pointer">
                  {item.label}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="h-10 w-[82px] cursor-pointer rounded-[8px] bg-[#FE5827] text-[14px] font-bold text-white transition-opacity hover:opacity-90 active:opacity-80"
        >
          Search
        </button>
      </div>
      <div className="mt-8 flex items-center gap-12">
        <div className="text-[14px] leading-[18px] text-[#020328]/65">
          Donors:
          <span className="font-bold text-[#FE5827] ml-1">{summary.donors}</span>
        </div>
        <div className="text-[14px] leading-[18px] text-[#020328]/65">
          Total Donations:
          <span className="font-bold text-[#FE5827] ml-1">{formatAmount(summary.totalDonations)}</span>
        </div>
        <div className="text-[14px] leading-[18px] text-[#020328]/65">
          Donation Count:
          <span className="font-bold text-[#FE5827] ml-1">{summary.donationCount}</span>
        </div>
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
            )}
          </TableBody>
        </Table>
      </div>

      {/* pagination */}
      <Pagination
        currentPage={data.pageNum}
        total={data.total} // mock total 890 data (89 pages × 10 data per page)
        pageSize={data.pageSize}
        onPageChange={handlePageChange}
      />

      <DonorInfoDialog data={donorInfoData} setOpen={handleDonorInfoDialogOpen} onEdit={handleDonorUserEdit} onAddNote={handleDonorAddNote}/>
      <ApplicationEditDialog data={userEditData} open={appEditDialogOpen} setOpen={handleAppEditDialogOpen} onConfirm={handleAppEditDialogConfirm} />
      <DonorNoteAddDialog data={donorAddNoteDialogData} open={donorAddNoteDialogOpen} setOpen={setDonorAddNoteDialogOpen} onConfirem={handleDonorAddNoteDialogConfirm} />
    </div>
  )
}
