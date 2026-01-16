"use client"

import { Check } from "lucide-react"
import { useState } from "react"

interface Props {
  color: string;
  onChange: (color: string) => void;
}

const colorList = [
  "#2777FF",
  "#0BBA77",
  "#FFBF47",
  "#FE5827",
  "#826BF4",
  "#965C23",
  "#4D4D4D",
]

export function AppSidebarColor({ color, onChange }: Props) {

  const [current, setCurrent] = useState(color || colorList[0]);

  const handleClick = (index: number) => {
    onChange(colorList[index]);
    setCurrent(colorList[index])
  }

  return (
    <div className="w-[280px] flex flex-row flex-wrap gap-x-5 gap-y-2.5">
      {
        colorList.map((item, index) => (
          <div
            key={index}
            className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-[8px]`}
            style={{ backgroundColor: item }}
            onClick={() => handleClick(index)}
          >
            {
              current === item && <Check color="white" />
            }
          </div>
        ))
      }
    </div>
  )
}