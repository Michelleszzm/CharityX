"use client"

import { useState } from "react"
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { ReportTrendItem } from "@/apis/fundraise"

interface MonthlyDate {
  title: string
  label: string
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// generate mock date
const generateDate = (): MonthlyDate[] => {
  const list: MonthlyDate[] = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(year, month - i, 1);
    const y = d.getFullYear();
    const m1 = String(d.getMonth() + 1).padStart(2, "0");

    const m = monthNames[d.getMonth()];

    list.push({
      title: `${m} ${y}`,
      label: `${y}-${m1}`,
    })
  }
  return list;
}

// custom Tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const donors = payload.find((p: any) => p.dataKey === "donors")?.value || 0
    const amount = payload.find((p: any) => p.dataKey === "amount")?.value || 0

    return (
      <div className="rounded-[8px] bg-white p-2 shadow-lg">
        <p className="text-[12px] leading-[16px] text-[#020328]/65">
          2025-10-{label}
        </p>
        <p className="mt-[7px] text-[12px] leading-[16px] text-[#020328]/65">
          Number of Donors: {donors}
        </p>
        <p className="text-[12px] leading-[16px] text-[#020328]/65">
          Donation Amount: ${amount}
        </p>
      </div>
    )
  }
  return null
}

interface Props {
  value: ReportTrendItem[]

  onChange: (valym?: string) => void
}

export default function DonationTrend({ value, onChange }: Props) {
  const [selectedMonth, setSelectedMonth] = useState("2025-11")
  const date = generateDate();

  const handleSelectMonth = (ym: string) => {
    setSelectedMonth(ym)
    onChange(ym)
  }
  return (
    <div className="h-full w-full rounded-[8px] border border-[#E9E9E9] bg-white px-6 pt-4 pb-6">
      {/* header area */}
      <div className="mb-4 flex items-center justify-between">
        {/* left: title + legend */}
        <div className="flex items-center gap-6">
          <h2 className="text-[16px] leading-[19px] font-bold text-[#020328]">
            Donation Trend
          </h2>
          <div className="ml-[317px] flex items-center gap-8">
            {/* orange legend */}
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-[2px] bg-[#FFC273]" />
              <span className="text-[12px] leading-[16px] text-[#020328]/65">
                Donation Amount
              </span>
            </div>
            {/* blue legend */}
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-[2px] bg-[#58A0E2]" />
              <span className="text-[12px] leading-[16px] text-[#020328]/65">
                Number of Donors
              </span>
            </div>
          </div>
        </div>

        {/* right: month selector */}
        <Select value={selectedMonth} onValueChange={handleSelectMonth}>
          <SelectTrigger className="h-[32px] w-[120px] cursor-pointer rounded-[8px] border border-[#E9E9E9] text-[14px] text-[#020328]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {
              date.map((item) => (<SelectItem key={item.label} value={item.label}>{item.title}</SelectItem>))
            }
          </SelectContent>
        </Select>
      </div>

      {/* chart area */}
      <ResponsiveContainer width="100%" height={214}>
        <ComposedChart
          data={value}
          margin={{ top: 0, right: -30, left: -30, bottom: -10 }}
          barCategoryGap="0%"
          barGap={4}
        >
          {/* grid lines */}
          <CartesianGrid
            stroke="#E9E9E9"
            vertical={false}
            horizontal={true}
            syncWithTicks={true}
            strokeDasharray="0"
          />

          {/* X axis */}
          <XAxis
            dataKey="day"
            axisLine={{ stroke: "#E9E9E9" }}
            tick={{ fill: "rgba(2,3,40,0.5)", fontSize: 11 }}
            padding={{ left: 0, right: 0 }}
          />

          {/* left Y axis (donation amount) */}
          <YAxis
            yAxisId="left"
            axisLine={{ stroke: "#E9E9E9" }}
            tickLine={{ stroke: "#E9E9E9" }}
            tick={{ fill: "rgba(2,3,40,0.5)", fontSize: 11 }}
            domain={[0, 600]}
            ticks={[0, 100, 200, 300, 400, 500, 600]}
          />

          {/* right Y axis (donation count) */}
          <YAxis
            yAxisId="right"
            orientation="right"
            axisLine={{ stroke: "#E9E9E9" }}
            tickLine={{ stroke: "#E9E9E9" }}
            tick={{ fill: "rgba(2,3,40,0.5)", fontSize: 11 }}
            domain={[0, 30]}
            ticks={[0, 5, 10, 15, 20, 25, 30]}
          />

          {/* custom Tooltip */}
          <Tooltip content={<CustomTooltip />} cursor={false} />

          {/* orange bar chart (donation amount) */}
          <Bar
            yAxisId="left"
            dataKey="amount"
            fill="#FFC273"
            radius={[2, 2, 0, 0]}
            barSize={12}
          />

          {/* blue line chart (donation count) */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="donors"
            stroke="#58A0E2"
            strokeWidth={2}
            dot={{ fill: "#58A0E2", r: 2 }}
            activeDot={{
              fill: "#fff",
              r: 2,
              stroke: "#58A0E2",
              strokeWidth: 1
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
