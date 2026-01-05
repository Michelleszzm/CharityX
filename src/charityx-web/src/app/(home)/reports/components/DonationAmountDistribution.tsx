"use client"

import { ReportAmountDistribution } from "@/apis/fundraise"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const colorMap = [
  "#F8A234",
  "#F1AC4C",
  "#FDC46D",
  "#FED385",
  "#FFE09A",
  "#F7931A",
]

// custom label line rendering function
const renderCustomLabelLine = (entry: any) => {
  const { cx, cy, midAngle, outerRadius } = entry
  const RADIAN = Math.PI / 180

  // first line: from the edge of the pie chart
  const startRadius = outerRadius + 2
  const startX = cx + startRadius * Math.cos(-midAngle * RADIAN)
  const startY = cy + startRadius * Math.sin(-midAngle * RADIAN)

  // the turning point of the second line
  const midRadius = outerRadius + 15
  const midX = cx + midRadius * Math.cos(-midAngle * RADIAN)
  const midY = cy + midRadius * Math.sin(-midAngle * RADIAN)

  // third line: horizontal extension
  const endX = midX > cx ? midX + 10 : midX - 10
  const endY = midY

  const pathData = `M${startX},${startY}L${midX},${midY}L${endX},${endY}`

  return <path d={pathData} stroke="#D3D3D3" strokeWidth={1} fill="none" />
}

// custom label rendering function
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  percent
}: any) => {
  const RADIAN = Math.PI / 180
  // calculate the label position (at the end of the label line)
  const radius = outerRadius + 30
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  // determine the text alignment based on the angle
  const textAnchor = x > cx ? "start" : "end"

  return (
    <text
      x={x}
      y={y}
      fill="#020328"
      textAnchor={textAnchor}
      dominantBaseline="central"
      className="text-[12px] leading-[16px]"
    >
      <tspan className="text-[#020328] opacity-65">{name}</tspan>
      <tspan className="text-[#020328] opacity-65"> ({percent * 100}%)</tspan>
    </text>
  )
}

// center label component
const CenterLabel = ({
  viewBox,
  totalDonors,
  totalAmount
}: {
  viewBox?: any
  totalDonors: number
  totalAmount: number
}) => {
  const { cx, cy } = viewBox || { cx: 0, cy: 0 }

  return (
    <text x={cx} y={cy} textAnchor="middle">
      <tspan
        x={cx}
        dy="-0.6em"
        className="text-[12px] leading-[16px]"
        fill="#020328"
        opacity="0.65"
      >
        Donors: {totalDonors}
      </tspan>
      <tspan
        x={cx}
        dy="1.5em"
        className="text-[12px] leading-[16px]"
        fill="#020328"
        opacity="0.65"
      >
        Donation Amount: ${" "}
        {totalAmount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </tspan>
    </text>
  )
}

// custom Tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ReportAmountDistribution

    return (
      <div className="rounded-[8px] border border-[#E9E9E9] bg-white p-3 shadow-lg">
        <p className="text-[14px] leading-[18px] font-semibold text-[#020328]">
          {data.name}
        </p>
        <p className="mt-1 text-[12px] leading-[16px] text-[#020328]/65">
          Donors: {data.donors}
        </p>
        <p className="text-[12px] leading-[16px] text-[#020328]/65">
          Donation Amount: ${" "}
          {data.donationAmount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
      </div>
    )
  }
  return null
}


interface Props {
  value: ReportAmountDistribution[]
}

export default function DonationAmountDistribution({ value }: Props) {
  return (
    <div className="h-full w-full rounded-[8px] border border-[#E9E9E9] bg-white p-6">
      <div className="text-[16px] leading-[19px] font-bold text-[#020328]">
        Donation Amount Distribution
      </div>
      <div className="mt-6 h-[calc(100%-43px)] w-full flex items-center justify-center">
        {
          value.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 60, bottom: 20, left: 80 }}>
                <Pie
                  data={value}
                  cx="50%"
                  cy="50%"
                  labelLine={renderCustomLabelLine}
                  label={renderCustomLabel}
                  outerRadius={60}
                  innerRadius={30}
                  fill="#8884d8"
                  dataKey="percent"
                  cursor="pointer"
                >
                  {value.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={index >= colorMap.length ? "#F8A234" : colorMap[index]} />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "transparent" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )
        }

        {
          value.length <= 0 && (
            <span className="text-center text-sm text-muted-foreground">
              No data
            </span>
          )
        }
      </div>
    </div>
  )
}
