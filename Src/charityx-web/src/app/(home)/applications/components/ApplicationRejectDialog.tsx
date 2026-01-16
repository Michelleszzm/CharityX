"use client"

import { X } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Application, ApplicationStatus, getApplicationApprovedManager } from "@/apis/admin";
import OrganizationStatus from "../../components/OrganizationStatus";
import { formatDate } from "@/lib/utils";
import { use, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"


interface Props {
  data: Application | undefined;
  open: boolean;
  setOpen: (open: boolean) => void
  onConfirem: (item: Application, reason: string) => void
}

export default function ApplicationRejectDialog({ data, open, setOpen, onConfirem }: Props) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      console.log("dialog show")
    }
  }, [open])

  const handleConfirm = async () => {
    if (!data || reason === "") {
      toast.error("Please enter the reason for rejection")
      return;
    }
    setOpen(false);
    onConfirem(data, reason);
  }

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
  }

  return (
    (data && <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[540px]! gap-0 p-0"
        aria-describedby="dialog-desc"
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
              Are you sure you want to reject it?
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 flex flex-row text-lg font-bold text-[#020328]">
            Reason for rejection?
          </div>

          <div>
            <Textarea
              className="mt-2 h-38 resize-none border-[#E9E9E9] text-sm rounded-[8px]"
              value={reason}
              onChange={handleReasonChange}
              placeholder="Please enter the reason for rejection"
            />
          </div>

          <DialogFooter className="justify-center gap-4 mt-8">
            <div className="h-10 flex-1 flex items-center justify-center rounded-[8px] cursor-pointer bg-[#FE5827] hover:bg-[#FE582780] text-white text-sm font-bold"  onClick={() => handleConfirm()}>Reject</div>
          </DialogFooter>
        </div>
      </DialogContent>

    </Dialog>
    )
  )
}
