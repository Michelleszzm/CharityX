"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

// account security level data type
interface SecurityData {
  name: string // security level name
  donors: number // donation count
  percentage: number // percentage
  color: string // pie chart color
  status?: string // status description
  tokenDistribution: {
    // token distribution
    token: string
    percentage: number
  }[]
  [key: string]: string | number | any // index signature, compatible with recharts type
}

// mock data
const mockData: SecurityData[] = [
  {
    name: "Low",
    donors: 789,
    percentage: 92,
    color: "#26A17B",
    tokenDistribution: [
      { token: "DAI", percentage: 62 },
      { token: "USDT", percentage: 17 },
      { token: "SOL", percentage: 11 }
    ]
  },
  {
    name: "High",
    donors: 17,
    percentage: 2,
    color: "#F56363",
    tokenDistribution: [
      { token: "DAI", percentage: 62 },
      { token: "USDT", percentage: 17 },
      { token: "SOL", percentage: 11 }
    ]
  },
  {
    name: "Medium",
    donors: 51,
    percentage: 6,
    color: "#FFA900",
    tokenDistribution: [
      { token: "ETH", percentage: 45 },
      { token: "USDC", percentage: 35 },
      { token: "BTC", percentage: 20 }
    ]
  }
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
  percentage
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
      <tspan className="text-[#020328] opacity-65"> ({percentage}%)</tspan>
    </text>
  )
}

// custom Tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as SecurityData

    // filter out tokens with percentage greater than 10% and format display
    const majorTokens = data.tokenDistribution
      .filter(item => item.percentage >= 10)
      .map(item => `${item.token}: ${item.percentage}%`)
      .join(", ")

    return (
      <div className="rounded-[8px] border border-[#E9E9E9] bg-white p-3 shadow-lg">
        <p className="text-[14px] leading-[18px] font-semibold text-[#020328]">
          {`${data.name} - Blocked`}
        </p>
        <p className="mt-1 text-[12px] leading-[16px] text-[#020328]/65">
          Donors: {data.donors}
        </p>
        {majorTokens && (
          <p className="mt-2 text-[12px] leading-[16px] text-[#020328]/65">
            {majorTokens}
          </p>
        )}
      </div>
    )
  }
  return null
}

export default function AccountSecurityDistribution() {
  return (
    <div className="h-full w-full rounded-[8px] border border-[#E9E9E9] bg-white p-6">
      <div className="text-[16px] leading-[19px] font-bold text-[#020328]">
        Account Security Distribution
      </div>
      <div className="mt-6 h-[calc(100%-43px)] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 60, bottom: 20, left: 60 }}>
            <Pie
              data={mockData}
              cx="50%"
              cy="50%"
              labelLine={renderCustomLabelLine}
              label={renderCustomLabel}
              outerRadius={60}
              innerRadius={30}
              fill="#8884d8"
              dataKey="percentage"
              cursor="pointer"
            >
              {mockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
