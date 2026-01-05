"use client"
import Image from "next/image"
import { useEffect } from "react"
import { X } from "lucide-react"
import { cn, formatDate, formatAddress, formatAmount, formatTxHash, formatGender } from "@/lib/utils"
import { Donor, DonorInfo } from "@/apis/fundraise"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import editImage from "@/assets/home/ic_edit.png";
import DonorInfoRecords from "./DonorInfoRecords"
import { SysUserVo } from "@/apis/user"

export interface DonorInfoData {
  donor: Donor;
  donorInfo: DonorInfo;
}

interface Props {
  data: DonorInfoData | undefined;
  setOpen: (open: boolean) => void
  onEdit: (user: SysUserVo | null, donor: Donor) => void
  onAddNote: (data: Donor) => void
}

export default function DonorInfoDialog({data, setOpen, onEdit, onAddNote}: Props) {
  const handleEdit = () => {
    if (data) {
      onEdit(data.donorInfo.user, data.donor)
    }
  }

  const handleAddNote = () => {
    if (data) {
      onAddNote(data.donor)
    }
  }

  useEffect(() => {
  }, [])

  if (!data) return null;

  console.log("DonorInfoDialog", open, data)
  return (<Dialog open={Boolean(data)} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="!max-w-[980px] gap-0 p-0"
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
              {formatAddress(data.donor.donorWallet)}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-row text-sm items-end text-[#020328a6]">
            {
              data.donorInfo.user && (<div className="flex flex-col">
                <div className="flex flex-row">
                  <span>Name: {data.donorInfo.user.firstName} {data.donorInfo.user.lastName}</span>
                  <span className="ml-8">Age: {data.donorInfo.user.age}</span>
                  <span className="ml-8">Gender: {formatGender(data.donorInfo.user.gender)}</span>
                  <span className="ml-8">Occupation: {data.donorInfo.user.occupation}</span>
                </div>
                
                <div className="flex flex-row">
                  <span>Email: {data.donorInfo.user.email}</span>
                  <span className="ml-8">Phone: {data.donorInfo.user.phone}</span>
                  <span className="ml-8">Country: {data.donorInfo.user.country}</span>
                  <span className="ml-8">City: {data.donorInfo.user.city}</span>
                </div>
              </div>)
            }
            {
              !data.donorInfo.user && (<div>No profile avallable</div>)
            }
            <Image
              src={editImage}
              alt="edit"
              width={24}
              height={24}
              className="size-6 ml-8"
              onClick={() => handleEdit()}
            />
          </div>

          <div className="mt-10 flex flex-row text-sm text-[#020328a6] gap-15">
            <div className="flex flex-col gap-0.5">
              <div>
                Total Donations
              </div>
              <div className="text-[#020328] text-lg font-bold">
                {formatAmount(data.donor.totalDonations === 0 ? data.donorInfo.summary.totalDonations : data.donor.totalDonations)}
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <div>
                Donation Count
              </div>
              <div className="text-[#020328] text-lg font-bold">
                {data.donor.donationCount === 0 ? data.donorInfo.summary.donationCount : data.donor.donationCount}
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <div>
                Last Donation
              </div>
              <div className="text-[#020328] text-lg font-bold">
                {formatDate(data.donor.lastDonation === 0 ? data.donorInfo.summary.lastDonation : data.donor.lastDonation)}
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <div>
                Last Amount
              </div>
              <div className="text-[#020328] text-lg font-bold">
                {formatAmount(data.donor.lastAmount === 0 ? data.donorInfo.summary.lastAmount : data.donor.lastAmount)}
              </div>
            </div>
          </div>

          <div className="mt-8 border border-[#E9E9E9]">
            <DonorInfoRecords value={data.donorInfo.recordList}/>
          </div>
          <div className="mt-8 text-sm text-[#020328] font-bold">Notes</div>
          <div className="mt-1 text-sm text-[#020328a6] flex flex-col gap-y-0.5">
            {
              data.donorInfo.noteList.map((item) => (
                <div><span>{formatDate(item.createTime)}</span><span className="ml-2">{item.note}</span></div>
              ))
            }
          </div>
          <div className="mt-2 cursor-pointer text-[#1890FFFF] text-sm font-bold" onClick={() => handleAddNote()}>+ Add Notes</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
