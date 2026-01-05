"use client"

import { X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import useModalStore from "@/store/modalStore"
import loveImage from "@/assets/home/love.png"

export default function SubmitSuccessfully() {
  const { submitSuccessfullyModalOpen, setSubmitSuccessfullyModalOpen } =
    useModalStore()

  const router = useRouter()

  const goTo = () => {
    setSubmitSuccessfullyModalOpen(false)
  }

  return (
    <Dialog
      open={submitSuccessfullyModalOpen}
      onOpenChange={setSubmitSuccessfullyModalOpen}
    >
      <DialogContent
        showCloseButton={false}
        className="max-w-[530px] gap-0 p-0"
      >
        {/* close button */}
        <button
          onClick={() => setSubmitSuccessfullyModalOpen(false)}
          className="ring-offset-background absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
        >
          <X className="size-6 cursor-pointer text-[#797A8D]" />
          <span className="sr-only">Close</span>
        </button>

        <div className="flex flex-col items-center p-10 text-center">
          {/* love icon */}
          <div className="mt-20 mb-14">
            <Image
              src={loveImage}
              alt="Success"
              width={180}
              height={160}
              className="h-auto w-[90px]"
            />
          </div>

          {/* title */}
          <DialogHeader className="mb-4">
            <DialogTitle className="text-center text-[32px] leading-[39px] font-bold text-[#020328]">
              We’ve Received Your Application!
            </DialogTitle>
          </DialogHeader>

          {/* description text */}
          <p className="mb-[98px] text-[16px] leading-[19px] text-[#020328]">
            Thank you for submitting your nonprofit information. We’re reviewing
            your application and will notify you once it’s approved.
          </p>

          {/* Got it button */}
          <Button
            onClick={goTo}
            className="h-10 w-full cursor-pointer rounded-[8px] bg-[#FE5827] text-[16px] font-bold text-white hover:bg-[#FE5827] hover:opacity-80"
          >
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
