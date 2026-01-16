"use client"
import Image from "next/image"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import classifyImage from "@/assets/classify-icon.png"
import { useCallback, useEffect, useMemo, useState } from "react"
import { usePlatformData } from "../../components/PlatformContext"

interface FundraisingAllocationDaa {
  name: string;
  percentage: number;
  [key: string]: string | number // index signature, compatible with recharts type
}
const colorArray = [
  "#276EDB",
  "#26A17B",
  "#8752F3",
  "#F7931A",
  "#0F93FF",
  "#75C46E",
  "#F4B731",
  "#627EEA",
];


interface Props {
}

export default function FundAllocation({ }: Props) {
  const [realData, setRealData] = useState<FundraisingAllocationDaa[]>([]);
  const platformData = usePlatformData();

  useEffect(() => {
    const result: FundraisingAllocationDaa[] = []
    let empty = true
    platformData.data.allocationValue.purposeList.forEach((item) => {
      if (item.name === "" || item.percent === "") {

      } else {
        empty = false
        result.push({
          name: item.name,
          percentage: Number(item.percent),
        })
      }
    })
    setRealData(result)
  }, [platformData])

  // custom label line rendering function
  const renderCustomizedLabelLine = useCallback((entry: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius } = entry
    const RADIAN = Math.PI / 180

    // first line: from the edge of the pie chart
    const startRadius = outerRadius + 5
    const startX = cx + startRadius * Math.cos(-midAngle * RADIAN)
    const startY = cy + startRadius * Math.sin(-midAngle * RADIAN)

    // the turning point of the second line
    const midRadius = outerRadius + 15
    const midX = cx + midRadius * Math.cos(-midAngle * RADIAN)
    const midY = cy + midRadius * Math.sin(-midAngle * RADIAN)

    // third line: horizontal extension
    const endX = midX > cx ? midX + 15 : midX - 15
    const endY = midY

    const pathData = `M${startX},${startY}L${midX},${midY}L${endX},${endY}`

    return <path d={pathData} stroke="#D3D3D3" strokeWidth={1} fill="none" />
  }, [])

  // custom label rendering function
  const renderCustomizedLabel = useCallback((entry: any) => {
    const { cx, cy, midAngle, outerRadius, percent } = entry
    const RADIAN = Math.PI / 180

    // calculate the label position, align with the end of the line
    const midRadius = outerRadius + 15
    const midX = cx + midRadius * Math.cos(-midAngle * RADIAN)
    const midY = cy + midRadius * Math.sin(-midAngle * RADIAN)

    // the label position after horizontal extension
    const x = midX > cx ? midX + 20 : midX - 20
    const y = midY

    // dynamically set the font size according to the percentage size
    let fontSize = 16

    return (
      <text
        x={x}
        y={y}
        fill="#020328"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight={"medium"}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }, [])
  
  return (
    <div className="w-[452px] h-full flex flex-col overflow-y-auto overflow-hidden">
      <div className="text-[16px] leading-[19px] font-bold text-[#020328]">
        Fund Allocation
      </div>

      <div className="mt-6 flex flex-1 h-full flex-col rounded-[16px] bg-[#F7F7F7] px-10">
        {/* pie chart */}
        <div className="relative">
          <ResponsiveContainer width="100%" height={305}>
            <PieChart>
              <Pie
                data={realData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={95}
                paddingAngle={2}
                dataKey="percentage"
                label={renderCustomizedLabel}
                labelLine={renderCustomizedLabelLine}
                isAnimationActive={false}
              >
                {realData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colorArray[index]} />
                ))}
              </Pie>
              <Tooltip content={() => null} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* classification list */}
        <div>
          {platformData.data.allocationValue.purposeList.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="text-[14px] leading-[32px] text-[#020328]">
                {item.name}
              </div>
              <div className="text-[14px] leading-[32px] font-bold text-[#020328]">
                {item.percent}%
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1"></div>
        <div className="mx-[-24px] mt-[20px]">
          <Image
            src={classifyImage}
            alt="classify"
            width={840}
            height={200}
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  )
}
