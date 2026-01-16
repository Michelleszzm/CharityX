"use client"

import Image, { StaticImageData } from "next/image"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Circle, CircleCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FundraisingForm } from "@/apis/fundraise"

interface FormAmountData {
  value: string
  choosed: boolean
}

interface Props {
  value: FundraisingForm;
  onChange: (newValue: FundraisingForm) => void;
}


export function AppSidebarForm({ value, onChange }: Props) {

  const handleCheck = (amount: string) => {
    onChange({
      ...value,
      defaultAmount: amount,
    });
  }

  const handleAmountChange = (index: number, oldAmount: string, amount: string) => {
    const newAmountList = [...value.amountList];
    newAmountList[index] = amount;
    if (oldAmount === value.defaultAmount) {
      onChange({
        ...value,
        amountList: newAmountList,
        defaultAmount: amount,
      });
    } else {
      onChange({
        ...value,
        amountList: newAmountList,
      });
    }
  }

  return (
    <div className="w-full flex flex-col pb-40">
      <div className="text-[#020328] font-bold text-lg self-start px-4 pt-6">
        Form Settings
      </div>
      <div className="text-[#02032880] text-xs mt-2 px-4">
        Preset donation amounts for users, making it easy to donate quickly.
      </div>

      <div className="text-[#020328] font-bold text-sm self-start mt-8 px-4">
        Donation Amount Settings(USD)<span className="text-[#FE5827]">*</span>
      </div>

      <div className="flex flex-row flex-wrap justify-between mt-4 px-4 gap-y-2">
        {
          value.amountList.map((amount, index) => (
            <div key={amount} className="flex flex-col items-center">
              <div className={`w-22 h-10 ${amount === value.defaultAmount ? "border-2 border-[#FE5827] text-[#FE5827] font-bold" : "border border-[#E9E9E9] text-[#020328] font-normal"} flex items-center justify-center rounded-[8px] text-sm`}>
                <Input type="text" placeholder="" className="w-full h-full text-center border-0" value={amount} onChange={(e) => handleAmountChange(index, amount, e.target.value)}/>
              </div>
              {
                amount === value.defaultAmount ? (
                  <CircleCheck className="size-4 mt-2 text-[#FE5827]" onClick={() => handleCheck(amount)} />
                ) : (
                  <Circle className="size-4 mt-2" onClick={() => handleCheck(amount)} />
                )
              }
            </div>
          ))
        }
        <div className={`w-22 h-10 bg-[#F2F2F2] border border-[#E9E9E9] text-[#020328] font-normal flex items-center justify-center rounded-[8px] text-sm`}>
              <Input type="text" placeholder="" className="w-full h-full text-center border-0" value="other" disabled />
            </div>
      </div>
      
      <div className="text-[#FE5827] text-sm self-start mt-8 px-4">
        Note: The selected option will be the default.
      </div>
      
    </div>
  )
}