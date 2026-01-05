"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { motion, AnimatePresence } from "motion/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import Image from "next/image"
import solanaIcon from "@/assets/wallet/SOL.png"
import bitcoinIcon from "@/assets/wallet/BTC.png"
import ethereumIcon from "@/assets/wallet/ETH.png"
import usdcIcon from "@/assets/wallet/USDC.png"
import usdtIcon from "@/assets/wallet/USDT.png"
import daiIcon from "@/assets/wallet/DAI.png"
import arrowRightIcon from "@/assets/arrows-icon.png"
import classifyImage from "@/assets/classify-icon.png"
import aiImage from "@/assets/ai.png"
import { getDonationOverview, ReceiptData } from "@/apis/donate"
import { usePlatformData } from "../components/PlatformContext"
import FundAllocation from "./components/FundAllocation"
import DonationStream from "./components/DonationStream"
import { PaginationResp, paginationRespDefault } from "@/apis/core"
import { notFound } from "next/navigation"
import { toSelectAmount } from "@/apis/fundraise"

interface DonationItem {
  id: string
  amount: number
  token: string
  time: string
  charity: string
  chain: string
  txHash: string
  risk: "Low" | "Medium" | "High"
  riskLabel: string
  icon: any
  isNew?: boolean
}

export default function DashboardPage() {
  const platformData = usePlatformData();
  if (!platformData) notFound();
  if (platformData.code !== 200) notFound();
  const selectAmountData = toSelectAmount(platformData.data.formValue.amountList)
  const [selectedChain, setSelectedChain] = useState("all")
  const [selectedToken, setSelectedToken] = useState("all")
  const [selectedAmount, setSelectedAmount] = useState("all")
  const selectedTokenRef = useRef("");
  const selectedAmountMinRef = useRef("");
  const selectedAmountMaxRef = useRef("");

  const page = useRef(0);
  
  const [hasMore, setHasMore] = useState(true);

  const [list, setList] = useState<ReceiptData[]>([])

  const loadMore = async () => {
    const newPage = page.current + 1;
    // console.log("loadMore", newPage, selectedToken)

    const res = await getDonationOverview(
      platformData.data.publishValue.site, newPage, selectedTokenRef.current,
      selectedAmountMinRef.current, selectedAmountMaxRef.current
    );
    setList((prev) => [...prev, ...res.list]);
    page.current = newPage
    setHasMore((res.pageNum - 1) * res.pageSize + res.list.length < res.total)
  }

  const handleSelectAmount = (amount: string) => {
    setSelectedAmount(amount)
    const res = selectAmountData.filter(item => item.value === amount)
     if (res.length <= 0) {
      selectedAmountMinRef.current, selectedAmountMaxRef.current = ""
    } else {
      selectedAmountMinRef.current = res[0].min
      selectedAmountMaxRef.current = res[0].max
    }
    page.current = 0
    setList([])
    setHasMore(true)
  }

  const handleSelectToken = (token: string) => {
    setSelectedToken(token)
    if (token === "all") {
      selectedTokenRef.current = ""
    } else {
      selectedTokenRef.current = token
    }
    page.current = 0
    setList([])
    setHasMore(true)
  }

  return (
    <div className="h-[calc(100%-103px-20px)] mt-[24px] flex items-center justify-center">
      <div className="flex h-full w-[1280px] rounded-2xl border border-[#E9E9E9] bg-white px-6 py-8 shadow-[0px_0px_16px_0px_rgba(84,93,105,0.1)] overflow-hidden">
        {/* left Donation Stream */}
        <div className="flex-1 pr-20">
          <div className="mb-4">
            <div className="mb-4 flex items-center">
              <div className="text-[16px] leading-[19px] font-bold text-[#020328]">
                Donation Stream
              </div>

              {/* AI AML Risk legend */}
              <div className="ml-[100px] flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Image
                    src={aiImage}
                    alt="ai"
                    width={36}
                    height={36}
                    className="size-[18px]"
                  />
                  <span className="text-[11px] leading-[14px] text-[#020328]">
                    AI AML Risk:
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <div className="mr-[3px] size-2 rounded-full bg-[#00B140]"></div>
                    <span className="text-[11px] leading-[14px] text-[#020328]/65">
                      Low - Safe Donation
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-[3px] size-2 rounded-full bg-[#FFA900]"></div>
                    <span className="text-[11px] leading-[14px] text-[#020328]/65">
                      Medium - Reviewed
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-[3px] size-2 rounded-full bg-[#FE6767]"></div>
                    <span className="text-[11px] leading-[14px] text-[#020328]/65">
                      High - Blocked
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* filter */}
            <div className="flex items-center gap-4">
              <Select value={selectedChain} onValueChange={setSelectedChain}>
                <SelectTrigger className="flex-1 cursor-pointer">
                  <SelectValue placeholder="Chain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer">
                    All Chains
                  </SelectItem>
                  <SelectItem value="solana" className="cursor-pointer">
                    Solana
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedToken} onValueChange={handleSelectToken}>
                <SelectTrigger className="flex-1 cursor-pointer">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer">
                    All Tokens
                  </SelectItem>
                  <SelectItem value="USDC" className="cursor-pointer">
                    USDC
                  </SelectItem>
                  <SelectItem value="USDT" className="cursor-pointer">
                    USDT
                  </SelectItem>
                  <SelectItem value="SOL" className="cursor-pointer">
                    SOL
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedAmount} onValueChange={handleSelectAmount}>
                <SelectTrigger className="flex-1 cursor-pointer">
                  <SelectValue placeholder="Amount Range" />
                </SelectTrigger>
                <SelectContent>
                  {
                    selectAmountData.map((item) => (
                      <SelectItem key={item.value} value={item.value} className="cursor-pointer">
                        {item.label}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>
          <DonationStream value={list} organizationName={platformData.data.styleValue.organizationName} hasMore={hasMore} loadMore={loadMore} />
        </div>

        {/* right Fund Allocation */}
        <FundAllocation />
      </div>
    </div>
  )
}
