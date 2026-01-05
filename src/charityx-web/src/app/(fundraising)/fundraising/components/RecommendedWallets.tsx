"use client"

import Image, { StaticImageData } from "next/image"
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
import { X } from "lucide-react"
import { Donor, DonorInfo } from "@/apis/fundraise"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import phantomImage from "@/assets/home/ic_phantom.png"
import okxImage from "@/assets/home/ic_okx.png"
import metamaskImage from "@/assets/home/ic_metamask.png"
import { useMemo } from "react"

export interface RecommendedWalletData {
  icon: StaticImageData;
  walletName: string;
  bestfor: string;
  description: string;
  supportedChains: string;
  url: string;
}

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void
}

const data: RecommendedWalletData[]  = [{
  icon: phantomImage,
  walletName: "Phantom",
  bestfor: "SOL / ETH / BTC",
  description: "Native multi-chain wallet with a smooth UX",
  supportedChains: "SOL, ETH, BTC",
  url: "https://phantom.app/",
},{
  icon: okxImage,
  walletName: "OKX Wallet",
  bestfor: "All-in-one portfolio",
  description: "Broad chain support, powerful all-round choice",
  supportedChains: "BTC, ETH, SOL",
  url: "https://okx.com/",
},{
  icon: metamaskImage,
  walletName: "MetaMask",
  bestfor: "Ethereum ecosystem + Solana",
  description: "A widely used Web3 wallet",
  supportedChains: "ETH, SOL",
  url: "https://www.metamask.io/",
},
]

export default function RecommendedWallets({open, setOpen}: Props) {

  // table column definition
  const columns = useMemo<ColumnDef<RecommendedWalletData>[]>(
    () => [
      {
        accessorKey: "wallet",
        header: "Wallet",
        cell: ({ row }) => (
          <div className="flex flex-row justify-start items-center font-normal">
            <Image src={row.original.icon} alt="icon" width={32} height={32} />
            {row.original.walletName}
            </div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "bestfor",
        header: "Bestfor",
        cell: ({ row }) => (
          <div className="font-normal">{row.original.bestfor}</div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="font-normal">{row.original.description}</div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "supportedChains",
        header: "Supported Chains",
        cell: ({ row }) => (
          <div className="font-normal">{row.original.supportedChains}</div>
        ),
        enableSorting: false
      },
      {
        id: "register",
        header: "Register",
        cell: ({ row }) => (
          <div className="flex w-full items-center justify-center gap-4">
            <button className="text-[14px] font-normal text-[#1890FF] hover:underline" onClick={() => {window.open(row.original.url, "_blank")}}>
              Register
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
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10 // 10 data per page
      }
    }
  })
    
  return (<Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="!max-w-[980px] gap-0 p-0"
      >
        {/* close button */}
        <button
          onClick={() => setOpen(false)}
          className="ring-offset-background absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
        >
          <X className="size-6 cursor-pointer text-[#797A8D]" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-10">
          {/* title */}
          <DialogHeader className="mb-1">
            <DialogTitle className="text-left text-[24px] leading-[29px] font-bold text-[#020328]">
              Recommended Wallets
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-row text-sm items-end text-[#020328a6]">
            You can register a wallet via the link below to obtain your receiving address.
          </div>

          <div className="mt-6 flex flex-row text-sm text-[#020328a6] gap-15 border border-[#E9E9E9FF] rounded-[8px]">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow
                    key={headerGroup.id}
                    className=""
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
                }
                  
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
