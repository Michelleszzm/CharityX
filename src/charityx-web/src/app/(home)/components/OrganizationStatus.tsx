"use client"


import Image from "next/image"
import pendingImage from "@/assets/home/ic_pending.png"
import approvedImage from "@/assets/home/ic_approved.png"
import rejectedImage from "@/assets/home/ic_rejected.png"

type OrganizationStatusType = 'prepare' | 'pending' | 'approved' | 'revoked' | 'rejected';

interface OrganizationStatusProps {
  status: OrganizationStatusType;
  shownDesc: boolean
}

export default function OrganizationStatus({ status, shownDesc }: OrganizationStatusProps) {

  const statusConfig = {
    prepare: {
      image: pendingImage,
      alt: 'pending submission',
      text: 'Pending Submission',
      description: 'Complete your info to start fundraising.',
      textColor: 'text-[#1890FF]'
    },
    pending: {
      image: pendingImage,
      alt: 'pending',
      text: 'Pending',
      description: 'Updating organization information requires re-verification.',
      textColor: 'text-[#1890FF]'
    },
    rejected: {
      image: rejectedImage,
      alt: 'rejected',
      text: 'Rejected',
      description: 'Updating organization information requires re-verification.',
      textColor: 'text-[#FE5827]'
    },
    revoked: {
      image: rejectedImage,
      alt: 'revoked',
      text: 'Revoked',
      description: 'Updating organization information requires re-verification.',
      textColor: 'text-[#FE5827]'
    },
    approved: {
      image: approvedImage,
      alt: 'approved',
      text: 'Approved',
      description: 'Updating organization information requires re-verification.',
      textColor: 'text-[#32BB62]'
    }
  };

  const currentStatus = statusConfig[status];

  return (
    <>
      <div className="flex flex-row items-center">
        <Image
          src={currentStatus.image}
          alt={currentStatus.alt}
          width={24}
          height={24}
          className="size-6"
        />
        <div className={`ml-2.5 font-bold ${currentStatus.textColor}`}>{currentStatus.text}</div>
      </div>
      {
        shownDesc && (
          <div className="mt-2 text-sm text-[#FE5827] leading-[18px]">
            {currentStatus.description}
          </div>
        )
      }
    </>
  )
}
