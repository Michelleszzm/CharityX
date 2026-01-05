"use client"
import Image from "next/image"
import arrowRightIcon from "@/assets/arrows-icon.png"
import { PaginationResp } from "@/apis/core"
import { ReceiptData } from "@/apis/donate"
import { formatAmount, formatDate, formatTxHash, tokenIcons } from "@/lib/utils"
import { riskLevelColor, riskLevelText } from "@/apis/fundraise"
import { format } from "path"
import { useEffect, useRef } from "react"

interface Props {
  value: ReceiptData[]
  organizationName: string
  loadMore: () => Promise<void>
  hasMore: boolean
}

export default function DonationStream({ value, organizationName, hasMore, loadMore}: Props) {
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore(); 
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <div className="scrollbar-hide max-h-full space-y-4 overflow-y-auto pb-20">
      {
        !hasMore && value.length === 0 && (
          <div className="text-center text-12 text-[#999999]">
            No data
          </div>
        )
      }
      {value.map((donation, index) => (
        <div
          className="cursor-pointer rounded-[8px] border border-[#E9E9E9] p-4 transition-colors hover:border-gray-300"
        >
          {/* token icon and amount */}
          <div className="flex items-center">
            <Image
              src={tokenIcons[donation.token as keyof typeof tokenIcons]}
              alt="icon"
              width={24}
              height={24}
            />
            <div className="ml-2 text-[16px] leading-[19px] font-bold text-[#020328]">
              {`${formatAmount(donation.amount)} (${donation.token})`}
            </div>
            <div className="ml-4 text-[12px] leading-[15px] text-[#020328]/50">
              {formatDate(donation.payTime)}
            </div>
          </div>

          <div className="mt-[15px] flex items-center">
            <div className="w-[40%] flex-none text-[12px] leading-[15px] text-[#020328]/50">
              <div>Charity：{organizationName}</div>
              <div>Chain：{donation.chain}</div>
            </div>
            <div className="flex-1 text-[12px] leading-[15px] text-[#020328]/50">
              <div
                className="flex items-center"
                onClick={() => {
                  if (donation.chain === "SOLANA") {
                    window.open("https://solscan.io/tx/"+donation.txHash, "_blank")
                  } else if (donation.chain === "ETHEREUM") {
                    window.open("https://etherscan.io/tx/"+donation.txHash, "_blank")
                  }
                }}
              >
                Tx Hash：
                <div className="text-[#1890FF]">{formatTxHash(donation.txHash)}</div>
                <Image
                  src={arrowRightIcon}
                  alt="arrow-right"
                  width={12}
                  height={20}
                  className="ml-[6px] h-auto w-1"
                />
              </div>
              <div className="flex items-center">
                Risk：
                <div
                  className={`mr-1 size-2 rounded-full ${riskLevelColor[donation.aiAmlRisk]}`}
                ></div>
                <div>{riskLevelText[donation.aiAmlRisk]}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {hasMore && (
        <div ref={loadMoreRef} className="py-4 text-center text-sm text-gray-500">
          Loading...
        </div>
      )}
    </div>
  )
}