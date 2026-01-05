"use client"
import Image from "next/image"
import { useState, useMemo, useEffect, use } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import { cn, formatDate, formatAddress, formatAmount, formatTxHash } from "@/lib/utils"
import { DonorRecord  } from "@/apis/fundraise"
import ethereumIcon from "@/assets/wallet/ETH.png"
import solanaIcon from "@/assets/wallet/SOL.png"
import bitcoinIcon from "@/assets/wallet/BTC.png"
import usdtIcon from "@/assets/wallet/USDT.png"
import usdcIcon from "@/assets/wallet/USDC.png"
import daiIcon from "@/assets/wallet/DAI.png"

interface Props {
  value: DonorRecord[]
}

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

// risk level text mapping
const riskLevelText = {
  low: "Low - Safe Donation",
  medium: "Medium - Review Required",
  high: "High - Suspicious Activity"
}

export default function DonorInfoRecords({value}: Props) {

  // table column definition
  const columns = useMemo<ColumnDef<DonorRecord>[]>(
    () => [
      {
        accessorKey: "donation",
        header: "Donation",
        cell: ({ row }) => (
          <div className="font-normal">{formatAmount(row.original.amount)}</div>
        ),
        enableSorting: false
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
          <div
            rel="noopener noreferrer"
            className="font-normal text-[#1890FF] hover:underline"
            onClick={() => {
              if (row.original.chain === "SOLANA") {
                window.open("https://solscan.io/tx/"+row.original.txHash, "_blank")
              } else if (row.original.chain === "ETHEREUM") {
                window.open("https://etherscan.io/tx/"+row.original.txHash, "_blank")
              }
            }}
          >
            {formatTxHash(row.original.txHash)}
          </div>
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
                row.original.aiAmlRisk === "low" && "bg-[#00B140]",
                row.original.aiAmlRisk === "medium" && "bg-[#FAAD14]",
                row.original.aiAmlRisk === "high" && "bg-[#F5222D]"
              )}
            />
            <span className="font-normal">
              {riskLevelText[row.original.aiAmlRisk as keyof typeof riskLevelText]}
            </span>
          </div>
        ),
        enableSorting: false
      },
      {
        id: "actions",
        header: "NFT",
        cell: ({ row }) => (
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="font-normal text-[#1890FF] hover:underline"
          >
            {row.original.nftId}
          </a>
        ),
        enableSorting: false
      }
    ],
    []
  )

  // TanStack React Table instance
  const table = useReactTable({
    data: value,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10 // 10 data per page
      }
    }
  })

  console.log("DonorInfoRecords")
  return (<Table>
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
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map(row => (
            <TableRow
              key={row.id}
              className="border-b border-[#E9E9E9] hover:bg-[#F9F9F9]/50"
            >
              {row.getVisibleCells().map(cell => (
                <TableCell
                  key={cell.id}
                  className="px-3 py-4 text-[14px] !text-[#020328]/65"
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
  )
}
