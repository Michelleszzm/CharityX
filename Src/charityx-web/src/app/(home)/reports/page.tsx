"use client"

import Image from "next/image"
import bgImage from "@/assets/home/bg3.png"
import DonationTrend from "./components/DonationTrend"
import ChainDistribution from "./components/ChainDistribution"
import TokenDistribution from "./components/TokenDistribution"
import DonationAmountDistribution from "./components/DonationAmountDistribution"
import DonationFrequencyDistribution from "./components/DonationFrequencyDistribution"
import AccountSecurityDistribution from "./components/AccountSecurityDistribution"
import { useEffect, useState } from "react"
import { getReportDistribution, getReportSummary, getReportTrend, reportSummaryDefault, ReportSummary, reportDistributionDefault, ReportDistribution, ReportTrend, reportTrendDefault, ReportTrendItem, getReportAmountDistribution } from "@/apis/fundraise"
import { formatAmount, generateCurrentMonth } from "@/lib/utils"

export default function ReportsPage() {
  const [reportSummary, setReportSummary] = useState<ReportSummary>(reportSummaryDefault)
  const [reportTrend, setReportTrend] = useState<ReportTrendItem[]>([])
  const [reportDistribution, setReportDistribution] = useState<ReportDistribution>(reportDistributionDefault)
  const [reportAmountDistribution, setReportAmountDistribution] = useState<ReportDistribution>(reportDistributionDefault)

  const handleGetReportTrend = async (ym?: string) => {
    if (!ym) {
      ym = generateCurrentMonth();
    }

    const [year, month] = ym.split("-").map(Number);
    const start = `${ym}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const end = `${ym}-${String(lastDay).padStart(2, "0")}`;

    const res = await getReportTrend({
      startDay: start,
      endDay: end
    })

    const map = new Map(res.trendList.map(d => [d.day, d]));
    const result: ReportTrendItem[] = [];
    for (let day = 1; day <= lastDay; day++) {
      const dateStr = `${ym}-${String(day).padStart(2, "0")}`;
      result.push({
        day: dateStr,
        amount: map.get(dateStr)?.amount ?? 0,
        donors: map.get(dateStr)?.donors ?? 0
      });
    }
    setReportTrend(result)
  }
  useEffect(() => {
    getReportSummary({}).then((res) => {
      setReportSummary(res)
    })
    
    handleGetReportTrend()

    getReportDistribution({}).then((res) => {
      setReportDistribution(res)
    })

    getReportAmountDistribution().then((res) => {
      setReportAmountDistribution(res)
    })
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
              Reports
            </div>
            <div className="mt-2 text-[16px] leading-[19px] text-[#000]">
              Visualize donation trends, token distribution, and donor behavior.
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
            <div className="grid grid-cols-4 gap-6">
              <div className="flex h-[68px] flex-col items-center justify-center rounded-[8px] border border-[#E9E9E9] bg-white">
                <div className="text-[14px] leading-[18px] text-[#020328]">
                  Total Donors
                </div>
                <div className="mt-1 text-[18px] leading-[22px] font-bold text-[#58A0E2]">
                  {reportSummary.donors}
                </div>
              </div>
              <div className="flex h-[68px] flex-col items-center justify-center rounded-[8px] border border-[#E9E9E9] bg-white">
                <div className="text-[14px] leading-[18px] text-[#020328]">
                  Total Donations
                </div>
                <div className="mt-1 text-[18px] leading-[22px] font-bold text-[#FE9727]">
                  {formatAmount(reportSummary.totalDonations)}
                </div>
              </div>
              <div className="flex h-[68px] flex-col items-center justify-center rounded-[8px] border border-[#E9E9E9] bg-white">
                <div className="text-[14px] leading-[18px] text-[#020328]">
                  Total Donation Count
                </div>
                <div className="mt-1 text-[18px] leading-[22px] font-bold text-[#32BBB0]">
                  {reportSummary.donationCount}
                </div>
              </div>
              <div className="flex h-[68px] flex-col items-center justify-center rounded-[8px] border border-[#E9E9E9] bg-white">
                <div className="text-[14px] leading-[18px] text-[#020328]">
                  Donation per Capita
                </div>
                <div className="mt-1 text-[18px] leading-[22px] font-bold text-[#9910FA]">
                  {formatAmount(reportSummary.donationPerCapita)}
                </div>
              </div>
            </div>
            <div className="mt-8 h-[302px]">
              <DonationTrend value={reportTrend} onChange={handleGetReportTrend} />
            </div>
            <div className="mt-8 grid grid-cols-3 gap-8">
              <div className="h-[305px]">
                <ChainDistribution value={reportDistribution.chain}/>
              </div>
              <div className="h-[305px]">
                <TokenDistribution value={reportDistribution.token}/>
              </div>
              <div className="h-[305px]">
                <DonationAmountDistribution value={reportAmountDistribution.donationAmount} />
              </div>
              <div className="h-[305px]">
                <DonationFrequencyDistribution value={reportDistribution.donationFrequency}/>
              </div>
              <div className="h-[305px] hidden">
                <AccountSecurityDistribution />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}