"use client"

import { X } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Application } from "@/apis/admin";


interface Props {
  data: Application | undefined;
  open: boolean;
  setOpen: (open: boolean) => void
}

export default function ViewDialog({ data, open, setOpen }: Props) {

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[640px]! gap-0 p-0"
      >
        {/* close button */}
        <button
          onClick={() => setOpen(false)}
          className="ring-offset-background absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
        >
          <X className="size-6 cursor-pointer text-[#797A8D]" />
          <span className="sr-only">Close</span>
        </button>

        <div className="px-10 mt-10 pd-4">
          {/* title */}
          <DialogHeader className="mb-6">
            <DialogTitle className="text-left text-[24px] leading-[29px] font-bold text-[#020328]">
              Proof
            </DialogTitle>
          </DialogHeader>

          <div className="w-140 h-140">
            <img className="max-w-140 max-h-140 object-cover" src={data?.proofImage} />
          </div>
        </div>
      </DialogContent>

    </Dialog>
  )
}
