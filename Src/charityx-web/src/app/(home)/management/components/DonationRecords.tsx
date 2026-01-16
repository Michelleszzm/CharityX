"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
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
import { cn, formatAddress, formatAmount, formatDate, formatTxHash, generateCurrentMonth, generateLast30Days, generateLast7Days } from "@/lib/utils"

// import token icons
import ethereumIcon from "@/assets/wallet/ETH.png"
import solanaIcon from "@/assets/wallet/SOL.png"
import bitcoinIcon from "@/assets/wallet/BTC.png"
import usdtIcon from "@/assets/wallet/USDT.png"
import usdcIcon from "@/assets/wallet/USDC.png"
import daiIcon from "@/assets/wallet/DAI.png"
import { addDonorNote, Donor, donorInfoDefault, DonorRecord, DonorSummaryResponse, FundraisingAllocationSelectItem, getDonorRecordList, getDonorRecordWithAddress, riskLevelColor, riskLevelText, updateDonorUser } from "@/apis/fundraise"
import { Spinner } from "@/components/ui/spinner"
import { PaginationResp, paginationRespDefault } from "@/apis/core"
import DonorInfoDialog, { DonorInfoData } from "./DonorInfoDialog"
import ApplicationEditDialog, { UserEditData, userEditDataDefault } from "../../applications/components/ApplicationEditDialog"
import DonorNoteAddDialog from "./DonorNoteAddDialog"
import { SysUserVo } from "@/apis/user"
import { toast } from "sonner"

// chain and token icon mapping
const chainIcons = {
  // Ethereum: ethereumIcon,
  SOLANA: solanaIcon,
  // Bitcoin: bitcoinIcon
}

const tokenIcons = {
  USDT: usdtIcon,
  USDC: usdcIcon,
  BTC: bitcoinIcon,
  ETH: ethereumIcon,
  DAI: daiIcon,
  SOL: solanaIcon
}

interface Props {
  summary: DonorSummaryResponse;
  selectAmountRanges: FundraisingAllocationSelectItem[];
}

export default function DonationRecords({ summary, selectAmountRanges }: Props) {
  const [walletAddress, setWalletAddress] = useState("")
  const [chain, setChain] = useState("all")
  const [token, setToken] = useState("all")
  const [amountRange, setAmountRange] = useState("all")
  const [dateRange, setDateRange] = useState("all")
  const [sorting, setSorting] = useState<SortingState>([])
  const [data, setData] = useState<PaginationResp<DonorRecord>>(paginationRespDefault)
  const [loading, setLoading] = useState(false)
  const [donorInfoData, setDonorInfoData] = useState<DonorInfoData | undefined>(undefined)

  const [donorAddNoteDialogData, setDonorAddNoteDialogData] = useState<Donor | undefined>(undefined)
  const [donorAddNoteDialogOpen, setDonorAddNoteDialogOpen] = useState(false)

  const [appEditDialogOpen, setAppEditDialogOpen] = useState(false)
  const [userEditData, setUserEditData] = useState<UserEditData | undefined>(undefined)
  

  // table column definition
  const columns = useMemo<ColumnDef<DonorRecord>[]>(
    () => [
      {
        accessorKey: "walletAddress",
        header: "Wallet Address",
        cell: ({ row }) => (
          <div className="font-normal">{formatAddress(row.original.foundationWallet)}</div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "amount",
        header: ({ column }) => {
          return (
            <button
              className="flex cursor-pointer items-center gap-1 hover:text-[#020328]/80"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Amount (USD)
              <ArrowUpDown className="size-4" />
            </button>
          )
        },
        cell: ({ row }) => (
          <div className="font-normal">{formatAmount(row.original.amount)}</div>
        )
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <div className="font-normal">{formatDate(row.original.payTime)}</div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "chain",
        header: "Chain",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Image
              src={chainIcons[row.original.chain as keyof typeof chainIcons]}
              alt={row.original.chain}
              width={20}
              height={20}
              className="size-5"
            />
            <span className="font-normal">{row.original.chain}</span>
          </div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "token",
        header: "Token",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Image
              src={tokenIcons[row.original.token as keyof typeof tokenIcons]}
              alt={row.original.token}
              width={20}
              height={20}
              className="size-5"
            />
            <span className="font-normal">{row.original.token}</span>
          </div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "txHash",
        header: "Tx Hash",
        cell: ({ row }) => (
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="font-normal cursor-pointer text-[#1890FF] hover:underline"
            onClick={() => {
              if (row.original.chain === "SOLANA") {
                window.open("https://solscan.io/tx/"+row.original.txHash, "_blank")
              } else if (row.original.chain === "ETHEREUM") {
                window.open("https://etherscan.io/tx/"+row.original.txHash, "_blank")
              }
            }}
          >
            {formatTxHash(row.original.txHash)}
          </a>
        ),
        enableSorting: false
      },
      {
        accessorKey: "riskLevel",
        header: "AI AML Risk",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "size-2 rounded-full",
                riskLevelColor[row.original.aiAmlRisk],
              )}
            />
            <span className="font-normal">
              {riskLevelText[row.original.aiAmlRisk]}
            </span>
          </div>
        ),
        enableSorting: false
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button className="w-full cursor-pointer text-center text-[14px] font-normal text-[#1890FF] hover:underline" onClick={() => handleDonorView(row.original)}>
            View
          </button>
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
    handleDonorRecordList(1)
  }

  // pagination processing function
  const handlePageChange = (page: number) => {
    table.setPageIndex(page - 1) // TanStack table page index starts from 0
    handleDonorRecordList(page)
  }

  const handleDonorRecordList = async (pageNum: number) => {
    setLoading(true)
    try {
      const result = selectAmountRanges.filter(item => item.value === amountRange)
      let selectedAmountMin = ""
      let selectedAmountMax = ""
      if (result.length > 0) {
        selectedAmountMin = result[0].min
        selectedAmountMax = result[0].max
      }
      const tokenReq = token === "all" ? "" : token
      const dayReq = dateRange === "30days" ? generateLast30Days() : (dateRange === "7days" ? generateLast7Days() : ["", ""])
       
      const res = await getDonorRecordList(pageNum, walletAddress, tokenReq, selectedAmountMin, selectedAmountMax, dayReq[1], dayReq[0])
      setData(res)
    } finally {
      setLoading(false)
    }
  }

  const handleDonorView = (data: DonorRecord) => {
    setDonorInfoData({
      donor: {
        donorWallet: data.donorWallet,
        chain: data.chain,
        totalDonations: 0,
        donationCount: 0,
        lastDonation: 0,
        lastAmount: 0,
      },
      donorInfo: donorInfoDefault,
    })
    handelGetDonorRecordWithAddress(data.donorWallet, data.chain)
  }

  const handleDonorInfoDialogOpen = (open: boolean) => {
    console.log('handleDonorInfoDialogOpen', open)
    setDonorInfoData(undefined)
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
      handelGetDonorRecordWithAddress(item.donorWallet, item.chain)
    } catch (error) {
      console.error(error)
    }
  }
  
  const handelGetDonorRecordWithAddress = async (donorWallet: string, chain: string) => {
    const res = await getDonorRecordWithAddress({
      chain: "SOLANA",
      donorWallet: donorWallet,
    })
    setDonorInfoData({
      donor: {
        donorWallet: donorWallet,
        chain: chain,
        totalDonations: 0,
        donationCount: 0,
        lastDonation: 0,
        lastAmount: 0,
      },
      donorInfo: res,
    })
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
      await handelGetDonorRecordWithAddress(donorInfoData.donor.donorWallet, donorInfoData.donor.chain)
    }
  }
  
  const handleAppEditDialogOpen = (open: boolean) => {
    setAppEditDialogOpen(open)
  }

  useEffect(() => {
    if (data) {
      handleDonorRecordList(1)
    }
  }, [])
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

        {/* Chain selector */}
        <Select value={chain} onValueChange={setChain}>
          <SelectTrigger className="!h-10 w-[200px] cursor-pointer rounded-[8px] border-[#E9E9E9] text-[14px] text-[#020328]/60">
            <SelectValue placeholder="Chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              Chain
            </SelectItem>
            <SelectItem value="solana" className="cursor-pointer">
              <Image
                src={solanaIcon}
                alt="Solana"
                width={160}
                height={160}
                className="size-5"
              />
              Solana
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Token selector */}
        <Select value={token} onValueChange={setToken}>
          <SelectTrigger className="!h-10 w-[200px] cursor-pointer rounded-[8px] border-[#E9E9E9] text-[14px] text-[#020328]/60">
            <SelectValue placeholder="Token" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              Token
            </SelectItem>
            <SelectItem value="USDT" className="cursor-pointer">
              <Image
                src={usdtIcon}
                alt="USDT"
                width={160}
                height={160}
                className="size-5"
              />
              USDT
            </SelectItem>
            <SelectItem value="USDC" className="cursor-pointer">
              <Image
                src={usdcIcon}
                alt="USDC"
                width={160}
                height={160}
                className="size-5"
              />
              USDC
            </SelectItem>
            <SelectItem value="SOL" className="cursor-pointer">
              <Image
                src={solanaIcon}
                alt="SOL"
                width={160}
                height={160}
                className="size-5"
              />
              SOL
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Amount Range selector */}
        <Select value={amountRange} onValueChange={setAmountRange}>
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

        {/* Date selector */}
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="!h-10 w-[200px] cursor-pointer rounded-[8px] border-[#E9E9E9] text-[14px] text-[#020328]/60">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              Date
            </SelectItem>
            <SelectItem value="7days" className="cursor-pointer">
              Last 7 Days
            </SelectItem>
            <SelectItem value="30days" className="cursor-pointer">
              Last 30 Days
            </SelectItem>
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

      {/* statistics information */}
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
                    className="h-[52px] px-3 text-[14px] font-medium text-[#020328]"
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
              {loading ? (
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
        total={data.total} // mock total 1323 data
        pageSize={data.pageSize}
        onPageChange={handlePageChange}
      />
      
      <DonorInfoDialog data={donorInfoData} setOpen={handleDonorInfoDialogOpen} onEdit={handleDonorUserEdit} onAddNote={handleDonorAddNote}/>
      <ApplicationEditDialog data={userEditData} open={appEditDialogOpen} setOpen={handleAppEditDialogOpen} onConfirm={handleAppEditDialogConfirm} />
      <DonorNoteAddDialog data={donorAddNoteDialogData} open={donorAddNoteDialogOpen} setOpen={setDonorAddNoteDialogOpen} onConfirem={handleDonorAddNoteDialogConfirm} />
    </div>
  )
}
