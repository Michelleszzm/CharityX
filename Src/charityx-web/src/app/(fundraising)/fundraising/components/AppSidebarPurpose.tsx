"use client"

import Image, { StaticImageData } from "next/image"
import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import allocationDelImage from "@/assets/home/ic_allocation_del.png"
import { FundraisingAllocation, FundraisingAllocationItem } from "@/apis/fundraise"
import { toast } from "sonner"

interface Props {
  value: FundraisingAllocation;
  onChange: (newValue: FundraisingAllocation) => void;
}
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


// mock data (according to the design)
const mockData: FundraisingAllocationDaa[] = [
  {
    name: "Education Programs",
    percentage: 42
  },
  {
    name: "Medical Aid",
    percentage: 28
  },
  {
    name: "Food & Supplies",
    percentage: 20
  },
  {
    name: "Administrative Costs",
    percentage: 10
  }
]

export function AppSidebarPurpose({ value, onChange }: Props) {

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
    range,
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
        <tspan className="text-[#020328] opacity-65">{percentage}%</tspan>
      </text>
    )
  }

  const handleInputPercentChange = (newValue: string, index: number) => {
    const numericValue = newValue.replace(/[^0-9.]/g, "");
    const newPurposeList = [...value.purposeList];
    newPurposeList[index].percent = newValue;
    onChange({
      ...value,
      purposeList: newPurposeList,
    });
  }
  const handleInputNameChange = (newValue: string, index: number) => {
    const newPurposeList = [...value.purposeList];
    newPurposeList[index].name = newValue;
    onChange({
      ...value,
      purposeList: newPurposeList,
    });
  }

  const handleAddPurpose = () => {
    if (value.purposeList.length >= 8) {
      toast.error("Maximum of 8 purposes");
      return;
    }
    onChange({
      ...value,
      purposeList: [...value.purposeList, { name: "", percent: "" }],
    });
  }

  const handleRemovePurpose = (index: number) => {
    onChange({
      ...value,
      purposeList: value.purposeList.filter((_, i) => i !== index),
    });
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

  const realData = useMemo(() => {
    const result: FundraisingAllocationDaa[] = []
    let empty = true
    value.purposeList.forEach((item) => {
      if (item.name === "" || item.percent === "") {

      } else {
        empty = false
        result.push({
          name: item.name,
          percentage: Number(item.percent),
        })
      }
    })
    if (empty) {
      return mockData
    }
    return result
  }, [value])

  return (
    <div className="flex flex-col pb-20">
      <div className="flex flex-row items-center">
        <div className="w-[178px] text-[#020328] font-bold text-sm self-start">
          Purpose
        </div>
        <div className="w-[60px] ml-4 text-[#020328] text-center font-bold text-sm">
          %
        </div>
      </div>
      <div className="flex flex-col mt-2 gap-4">
        {
          value.purposeList.map((item, index) => (
            <div className="flex flex-row" key={index}>
              <div className="w-[178px]">
                <Input className="w-full" type="text" placeholder={`Purpose ${index + 1}`} value={item.name} onChange={(e) => handleInputNameChange(e.target.value, index)} />
              </div>
              <div className="w-[60px]" >
                <Input className="ml-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="text" placeholder="" value={item.percent} onChange={(e) => handleInputPercentChange(e.target.value, index)} />
              </div>
              {
                index > 1 && (
                  <div className="flex items-center justify-center ml-3 cursor-pointer" onClick={() => handleRemovePurpose(index)}>
                    <Image
                      src={allocationDelImage}
                      alt="Template"
                      width={18}
                      height={18}
                      className="size-4.5"
                    />
                  </div>
                )
              }
            </div>
          ))
        }
      </div>
      <div className="text-[#1890FF] text-sm font-bold mt-3 cursor-pointer" onClick={handleAddPurpose}>
        + Add Item
      </div>
      <div className="text-[#02032880] text-xs mt-4">
        Enter at least two items. Click “Add Item” to include more.
      </div>

      <div className="flex flex-col bg-[#FBFBFB] rounded-[16px] border border-[#E9E9E9] mt-15 px-4 pt-4 pb-11">
        <div className="text-[#020328a6] font-bold text-lg self-start">
          Example
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 60, bottom: 20, left: 80 }}>
              <Pie
                data={realData}
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
                {realData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colorArray[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        {
          realData.map((item, index) => (
            <div className="flex flex-row text-[#020328] text-xs mt-3" key={index}>
              <div className="flex-1">{item.name}</div>
              <div className="font-bold">{`${item.percentage}%`}</div>
            </div>
          ))
        }
      </div>

    </div>
  )
}