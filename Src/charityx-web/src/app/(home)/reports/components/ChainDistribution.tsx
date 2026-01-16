"use client"

import { ReportDistributionChain } from "@/apis/fundraise"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const colorMap = {
  "SOLANA": "#8752F3",
  "BITCOIN": "#F7931A",
  "ETHEREUM": "#627EEA"
}

// custom label line rendering function
const renderCustomLabelLine = (entry: any) => {
  const { cx, cy, midAngle, outerRadius } = entry
  const RADIAN = Math.PI / 180

  // first line: from the edge of the pie chart
  const startRadius = outerRadius + 2
  const startX = cx + startRadius * Math.cos(-midAngle * RADIAN)
  const startY = cy + startRadius * Math.sin(-midAngle * RADIAN)

  // the turning point of the second line
  const midRadius = outerRadius + 5
  const midX = cx + midRadius * Math.cos(-midAngle * RADIAN)
  const midY = cy + midRadius * Math.sin(-midAngle * RADIAN)

  // third line: horizontal extension
  const endX = midX > cx ? midX + 3 : midX - 3
  const endY = midY

  const pathData = `M${startX},${startY}L${midX},${midY}L${endX},${endY}`

  return <path d={pathData} stroke="#D3D3D3" strokeWidth={1} fill="none" />
}

// custom label rendering function
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  name,
  percent
}: any) => {
  const RADIAN = Math.PI / 180
  // calculate the label position (at the end of the label line)
  // label line length: outerRadius(60) + first line(2~15) + second line(10) = 87
  const radius = outerRadius + 10
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

// custom Tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ReportDistributionChain

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
  value: ReportDistributionChain[]
}

export default function ChainDistribution({ value }: Props) {

  return (
    <div className="h-full w-full rounded-[8px] border border-[#E9E9E9] bg-white p-6">
      <div className="text-[16px] leading-[19px] font-bold text-[#020328]">
        Chain Distribution
      </div>
      <div className="mt-6 h-[calc(100%-43px)] w-full flex items-center justify-center">
        {
          value.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 60, bottom: 20, left: 60 }}>
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
                    <Cell key={`cell-${entry.name}`} fill={colorMap[entry.name as keyof typeof colorMap]} />
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
