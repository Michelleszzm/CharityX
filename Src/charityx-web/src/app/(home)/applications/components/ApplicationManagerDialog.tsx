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
import { Application, ApplicationStatus, CheckRecordResponse, getApplicationApprovedManager } from "@/apis/admin";
import OrganizationStatus from "../../components/OrganizationStatus";
import { formatDate } from "@/lib/utils";
import Image from "next/image"
import { use, useEffect, useState } from "react";
import editImage from "@/assets/home/ic_edit.png";
import { SysUserVo } from "@/apis/user";


interface Props {
  data: Application | undefined;
  open: boolean;
  setOpen: (open: boolean) => void

  onConfirm: (item: Application) => void
  onEdit: (item: SysUserVo) => void
}

export default function ApplicationManagerDialog({ data, open, setOpen, onConfirm, onEdit }: Props) {

  const [histories, setHistories] = useState<string[]>([])
  const [rejectedReason, setRejectedReason] = useState<string>("")
  const [userVo, setUserVo] = useState<SysUserVo | undefined>(undefined)
  const handleOrganizationStatus = (charityNonprofitMergeVo: Application | undefined) => {
    // type OrganizationStatusType = 'prepare' | 'pending' | 'approved' | 'rejected';
    if (charityNonprofitMergeVo) { 
      if (charityNonprofitMergeVo.status === 1) {
        return "pending"
      } else if (charityNonprofitMergeVo.status === ApplicationStatus.ACTIVE) {
        return "approved"
      } else if (charityNonprofitMergeVo.status === ApplicationStatus.REVOKED) {
        return "revoked"
      } else if (charityNonprofitMergeVo.status === ApplicationStatus.REJECTED) {
        return "rejected"
      }
    }
    return "prepare"
  }
  const getStatus = (item: CheckRecordResponse) => {
    const status = item.targetStatus;
    if (status === ApplicationStatus.ACTIVE) {
      return "Approved"
    } else if (status === ApplicationStatus.REVOKED) {
      return "Revoked"
    } else if (status === ApplicationStatus.REJECTED) {
      return `Rejected (${item.reason})`
    }
    return ""
  }

  const handleConfirm = () => {
    setOpen(false)
    if (data) {
      onConfirm(data)
    }
  }

  const handleEdit = () => {
    setOpen(false)
    if (userVo) {
      onEdit(userVo)
    }
  }
  useEffect(() => {
    if (open) {
      console.log("dialog show")
      if (data) {
        getApplicationApprovedManager({
          userId: data.userId,
        }).then((res) => { 
          console.log(res);
          const data: Array<string> = [];
          res.checkRecordVoList.forEach((item) => {
            data.push(`${formatDate(item.checkTime)} ${getStatus(item)}`);
            if (item.targetStatus === ApplicationStatus.REJECTED) {
              setRejectedReason(item.reason)
            }
          })
          setHistories(data)
          setUserVo(res.sysUserVo)
        })
      }
    } else {
      setHistories([])
    }
  }, [open])

  return (
    (data && <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[980px]! gap-0 p-0"
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
              {data.nonprofitName}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-row text-sm text-[#020328a6]">
            <div>
              Name: {data.firstName} {data.lastName}
            </div>
            <div className="ml-3">
              Email: {data.email}
            </div>
            <Image
              src={editImage}
              alt="edit"
              width={24}
              height={24}
              className="size-6 ml-4"
              onClick={() => handleEdit()}
            />
          </div>

          <div className="flex flex-row items-start mt-8">
            <div className="w-70 h-70 flex items-center justify-center border-1 rounded-[8px] border-[#E9E9E9]">
              <img className="max-w-60 max-h-60 object-cover" src={data.proofImage} />
            </div>

            <div className="w-full ml-10">
              <OrganizationStatus status={handleOrganizationStatus(data)} shownDesc={false}/>
              <div className="mt-2 text-sm text-[#020328a6]">Application Date: {formatDate(data.mergeDate)}</div>

              {
                data.status === ApplicationStatus.ACTIVE && (
                  <div className="mt-8 w-40 h-10 flex items-center justify-center rounded-[8px] cursor-pointer bg-[#FE5827] hover:bg-[#FE582780] text-white" onClick={() => handleConfirm()}>Revoke Approval</div>
                )
              }

              {
                data.status === ApplicationStatus.REVOKED && (
                  <div className="mt-8 w-40 h-10 flex items-center justify-center rounded-[8px] cursor-pointer bg-[#32BB62] hover:bg-[#32BB6280] text-white" onClick={() => handleConfirm()}>Restore Approval</div>
                )
              }
              {
                data.status === ApplicationStatus.REJECTED && (
                  <>
                  <div className="mt-2 text-sm text-[#020328a6]">Rejected Reson: {rejectedReason}</div>
                  <div className="mt-8 w-24 h-10 flex items-center justify-center rounded-[8px] cursor-pointer bg-[#32BB62] hover:bg-[#32BB6280] text-white" onClick={() => handleConfirm()}>Approve</div>
                  </>
                )
              }

              {
                histories.length > 0 && (
                  <>
                  <div className="mt-11 font-bold text-sm text-[#020328]">History</div>
                  <div className="w-full max-h-[160px] overflow-y-scroll">
                    {
                      histories.map((item, index) => (
                        <div key={index} className="mt-2 text-sm text-[#020328a6]">{item}</div>
                      ))
                    }
                  </div>
                  </>
                )
              }
            </div>
            
          </div>
        </div>
      </DialogContent>

    </Dialog>
    )
  )
}
