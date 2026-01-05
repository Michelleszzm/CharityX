"use client"

import Image from "next/image"
import template1Image from "@/assets/home/template1.png"
import template2Image from "@/assets/home/template2.png"
import template3Image from "@/assets/home/template3.png"

export default function ChooseTemplate({
  setCurrentTemplate,
  setCurrentStep
}: {
  setCurrentTemplate: (image: any) => void
  setCurrentStep: (step: number) => void
}) {
  const templateList = [
    {
      image: template1Image
    },
    {
      image: template2Image
    },
    {
      image: template3Image
    }
  ]
  return (
    <div className="mt-12 px-6">
      <div className="text-[18px] leading-[22px] font-bold text-[#020328]">
        Choose Template
      </div>
      <div className="mt-6 grid grid-cols-3 gap-6">
        {templateList.map((item, index) => (
          <div
            key={index}
            className="h-[230px] cursor-pointer overflow-hidden rounded-[8px] bg-[#FBFBFB] transition-all duration-300 hover:scale-105"
            style={{
              border: "1px solid #E9E9E9"
            }}
            onClick={() => {
              setCurrentTemplate(item.image)
              setCurrentStep(2)
            }}
          >
            <Image
              src={item.image}
              alt="template"
              width={1576}
              height={924}
              className="h-full w-full"
            />
          </div>
        ))}
        <div
          className="flex h-[230px] cursor-pointer items-center justify-center overflow-hidden rounded-[8px] bg-[#FBFBFB]"
          style={{
            border: "1px solid #E9E9E9"
          }}
        >
          <div className="w-[128px] text-center text-[16px] leading-[19px] text-[#020328]/40">
            More templates coming soon
          </div>
        </div>
      </div>
    </div>
  )
}
