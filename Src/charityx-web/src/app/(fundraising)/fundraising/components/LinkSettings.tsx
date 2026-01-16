"use client"

import Image from "next/image"
import modelImage from "@/assets/home/model.png"
import copyIcon from "@/assets/copy-icon.png"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { MoveLeft } from "lucide-react"

export default function LinkSettings({
  setCurrentStep
}: {
  setCurrentStep: (step: number) => void
}) {
  const [directory, setDirectory] = useState("superjoeyfoundation")
  const [url, setUrl] = useState(
    "https://prc.charityx.pro/superjoeyfoundation"
  )
  const setFullUrl = (directory: string) => {
    setUrl(`https://prc.charityx.pro/${directory}`)
  }
  const goPreviewPage = () => {
    window.open(`${url}/donate`, "_blank")
  }

  return (
    <div className="mt-12 px-6">
      <div className="flex">
        <div className="flex h-[370px] w-[616px] items-center justify-center">
          <Image
            src={modelImage}
            alt="model"
            width={1232}
            height={740}
            className="h-full w-full"
          />
        </div>
        <div className="flex flex-1 flex-col items-center">
          <div className="text-[18px] leading-[22px] font-bold text-[#020328]">
            Link Settings
          </div>

          <div className="mt-6 flex h-[56px] w-[520px] items-center justify-center rounded-[8px] border border-[#E9E9E9] bg-white">
            <Input
              value={directory}
              onChange={e => setDirectory(e.target.value)}
              placeholder="Please Enter"
              className="h-full border-none text-[14px] text-[#020328] shadow-none focus-visible:ring-0"
            />
            <div
              className={cn(
                "mr-2 flex h-[40px] w-[84px] flex-none items-center justify-center rounded-[20px] bg-[#020328] text-[16px] text-white",
                directory.length > 0
                  ? "cursor-pointer hover:bg-[#020328]/80"
                  : "opacity-10"
              )}
              onClick={() => {
                setFullUrl(directory)
              }}
            >
              Submit
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <div className="text-[16px] leading-[19px] font-bold text-[#1890FF]">
              {url}
            </div>
            <Image
              src={copyIcon}
              alt="copy-icon"
              width={48}
              height={48}
              className="ml-2 size-5 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(`${url}/donate`)
                toast.success("Copied to clipboard")
              }}
            />
          </div>

          <div className="mt-12 text-[24px] leading-[29px] font-bold text-[#020328]">
            Donation Page Created
          </div>
          <div className="mt-4 w-[400px] text-center text-[18px] leading-[22px] text-[#020328]/80">
            Your donation page is live — share the link and start fundraising
            today.
          </div>

          <div className="mt-12 flex items-center justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-[40px] w-[141px] cursor-pointer rounded-[8px] border-[#E9E9E9]"
              onClick={() => setCurrentStep(3)}
            >
              <MoveLeft className="size-5 font-bold text-[#020328]" />
              <div className="text-[16px] font-bold text-[#020328]">
                Previous
              </div>
            </Button>
            <Button
              type="button"
              variant="default"
              className="h-[40px] w-[130px] cursor-pointer rounded-[8px] bg-[#FE5827] hover:bg-[#FE5827]/80 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={goPreviewPage}
            >
              <div className="text-[16px] font-bold text-white">Preview</div>
            </Button>
            <Button
              type="button"
              variant="default"
              className="h-[40px] w-[130px] cursor-pointer rounded-[8px] bg-[#FE5827] hover:bg-[#FE5827]/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="text-[16px] font-bold text-white">Share</div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
