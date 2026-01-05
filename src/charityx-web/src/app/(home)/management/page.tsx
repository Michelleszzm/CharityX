"use client"

import Image from "next/image"
import bgImage from "@/assets/home/bg3.png"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import DonorList from "./components/DonorList"
import DonationRecords from "./components/DonationRecords"
import { DonorSummaryResponse, donorSummaryResponseDefault, FundraisingAllocationSelectItem, FundraisingResponse, getDonorSummary, getFundraise, toSelectAmount } from "@/apis/fundraise"

export default function Management() {
  const tabList = [
    {
      name: "Donor List",
      value: 1
    },

    {
      name: "Donation Records",
      value: 2
    }
  ]
  const [activeTab, setActiveTab] = useState(tabList[0].value)
  const [donorSummary, setDonorSummary] = useState<DonorSummaryResponse>(donorSummaryResponseDefault)
  const [fundraise, setFundraise] = useState<FundraisingAllocationSelectItem[]>([])

  useEffect(() => {
    getDonorSummary().then((res) => {
      setDonorSummary(res);
    });
    getFundraise().then((res) => {
      const list = toSelectAmount(res.formValue.amountList)
      setFundraise(list);
    });
  }, [])

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 h-[250px] w-full bg-[#FFF1C5]">
        <Image
          src={bgImage}
          alt="bg"
          width={3072}
          height={500}
          className="h-full w-auto"
        />
      </div>
      <div className="relative z-2">
        <div className="flex justify-center pt-12">
          <div className="w-[1280px]">
            <div className="text-[32px] leading-[39px] font-bold text-[#000]">
              Donor management
            </div>
            <div className="mt-2 text-[16px] leading-[19px] text-[#000]">
              Track and manage your donors with ease.
            </div>
          </div>
        </div>
        {/* cards */}
        <div className="flex justify-center">
          <div
            className="mt-12 w-[1280px] rounded-2xl bg-white px-6 py-12"
            style={{
              border: "1px solid #E9E9E9",
              boxShadow: "0px 0px 16px 0px rgba(84,93,105,0.1)"
            }}
          >
            {/* tab switch */}
            <div className="flex gap-12">
              {tabList.map(item => {
                const isActive = activeTab === item.value
                return (
                  <div
                    key={item.value}
                    className={cn(
                      "relative cursor-pointer text-[18px] leading-[22px] text-[#020328]",
                      isActive ? "font-bold text-[#FE5827]" : ""
                    )}
                    onClick={() => setActiveTab(item.value)}
                  >
                    {item.name}
                    {isActive && (
                      <div className="absolute bottom-[-8px] left-0 h-[2px] w-full bg-[#FE5827]"></div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-[42px]">
              {activeTab === 1 ? <DonorList summary={donorSummary} selectAmountRanges={fundraise}/> : <DonationRecords summary={donorSummary} selectAmountRanges={fundraise}/>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
