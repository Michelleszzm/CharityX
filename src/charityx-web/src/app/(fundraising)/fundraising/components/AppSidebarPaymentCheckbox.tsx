"use client"

import Image, { StaticImageData } from "next/image"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import templateCheckedIcon from "@/assets/home/ic_fundraising_template_checked.png"

// donation amount distribution data type
export interface PaymentCheckboxData {
  key: string
  name: string
  icon: StaticImageData
  choosed: boolean
}

export function AppSidebarPaymentCheckbox({
  value,
  onChange,
}: {
  value: PaymentCheckboxData[],
  onChange: (value: PaymentCheckboxData[]) => void,
}) {

  const handleChange = (index: number) => {
    const newValue = [...value]
    newValue[index].choosed = !newValue[index].choosed
    onChange(newValue)
  }

  return (
    <div className="flex flex-row flex-wrap items-center justify-between gap-y-5">
      {
        value.map((item, index) => (
          <div key={item.key} className="w-20 h-26 relative cursor-pointer" onClick={() => handleChange(index)}>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 border border-[#E9E9E9] rounded-[8px] flex items-center justify-center">
                <Image
                  src={item.icon}
                  alt="eth"
                  width={40}
                  height={40}
                  className="size-10"
                />
              </div>
              <div className="text-[#020328a6] text-xs mt-2">{item.name}</div>
            </div>
            {
              item.choosed && (<div className="size-4.5 absolute top-0 right-0 translate-x-[50%] -translate-y-[50%]">
                <Image
                    src={templateCheckedIcon}
                    alt="Template0"
                    width={18}
                    height={18}
                    className="size-4.5"
                  />
              </div>)
            }
            
          </div>
        ))
      }
    </div>
  )
}