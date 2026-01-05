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
import { Donor } from "@/apis/fundraise";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";


interface Props {
  data: Donor | undefined;
  open: boolean;
  setOpen: (open: boolean) => void
  onConfirem: (item: Donor, reason: string) => Promise<void>
}

export default function DonorNoteAddDialog({ data, open, setOpen, onConfirem }: Props) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      console.log("dialog show")
    }
  }, [open])

  const handleConfirm = async () => {
    if (!data || reason === "") {
      toast.error("Please enter the note content")
      return;
    }
    try {
      setLoading(true)
      await onConfirem(data, reason);
      setLoading(false)
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
  }

  if(!open || !data) return null;
  return (<Dialog open={open} onOpenChange={setOpen}>
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
              Add Notes
            </DialogTitle>
          </DialogHeader>

          <div>
            <Textarea
              className="mt-2 h-38 resize-none border-[#E9E9E9] text-sm rounded-[8px]"
              value={reason}
              onChange={handleReasonChange}
              placeholder="Please enter the reason for rejection"
            />
          </div>

          <DialogFooter className="justify-center gap-4 mt-8">
            <Button
              disabled={loading}
              className="mt-3 h-10 w-full cursor-pointer rounded-[8px] bg-[#FE5827] text-[14px] font-bold text-white hover:bg-[#FE5827] hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => handleConfirm()}
            >
              Submit
              {
                loading && (
                  <Spinner className="size-4" />
                )
              }
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>

    </Dialog>
  )
}
