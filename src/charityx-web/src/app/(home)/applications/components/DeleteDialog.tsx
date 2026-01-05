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
import { useState } from "react";
interface Props {
  data: Application | undefined;
  setOpen: (open: boolean) => void
  onConfirm: (item: Application) => Promise<void>
}

export default function DeleteDialog({ data, setOpen, onConfirm }: Props) {
  const handleDelete = () => {
    setOpen(false)
    if (data) {
      onConfirm(data)
    }
  }

  return (
    <Dialog open={Boolean(data)} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[840px] gap-0 p-0"
      >
        {/* close button */}
        <button
          onClick={() => setOpen(false)}
          className="ring-offset-background absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
        >
          <X className="size-6 cursor-pointer text-[#797A8D]" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-10">
          {/* title */}
          <DialogHeader className="mb-6">
            <DialogTitle className="text-left text-[24px] leading-[29px] font-bold text-[#020328]">
              Are you sure you want to delete this?
            </DialogTitle>
          </DialogHeader>

          <DialogFooter className="justify-center gap-4">
            <div className="h-10 flex-1 flex items-center justify-center rounded-[8px] cursor-pointer hover:bg-[#ffffff80] border border-[#E9E9E9]" onClick={() => setOpen(false)}>Cancel</div>
            <div className="h-10 flex-1 flex items-center justify-center rounded-[8px] cursor-pointer bg-[#FE5827] hover:bg-[#FE582780] text-white" onClick={() => handleDelete()}>Confirm</div>
          </DialogFooter>
        </div>
      </DialogContent>

    </Dialog>
  )
}
