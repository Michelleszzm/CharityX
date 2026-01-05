"use client"

import Image from "next/image"
import bgImage from "@/assets/home/bg3.png"
import { cn } from "@/lib/utils"
import { use, useEffect, useState } from "react"
import PendingReview from "./components/PendingReview"
import ApprovedList from "./components/ApprovedList"
import { ApplicationRegisteredResponse, getApplicationApproved, getApplicationPending, getApplicationRegistered, getApplicationRejected } from "@/apis/admin"
import Registered from "./components/Registered"
import Rejected from "./components/Rejected"
import DeleteDialog from "./components/DeleteDialog"
import useUserStore from "@/store/userStore"

export default function Applications() {
  const tabList = [
    {
      name: "Pending",
      value: 1
    },
    {
      name: "Approved",
      value: 2
    },
    {
      name: "Rejected",
      value: 3
    },
    {
      name: "Registered",
      value: 4
    }
  ]

  const userInfo = useUserStore(s => s.userInfo)
  const [activeTab, setActiveTab] = useState(tabList[0].value)
  const [registered, setRegistered] = useState<ApplicationRegisteredResponse>({total: 0, pageNum: 1, pageSize: 10} as ApplicationRegisteredResponse)
  const [pending, setPending] = useState<ApplicationRegisteredResponse>({total: 0, pageNum: 1, pageSize: 10} as ApplicationRegisteredResponse)
  const [approved, setApproved] = useState<ApplicationRegisteredResponse>({total: 0, pageNum: 1, pageSize: 10} as ApplicationRegisteredResponse)
  const [rejected, setRejected] = useState<ApplicationRegisteredResponse>({total: 0, pageNum: 1, pageSize: 10} as ApplicationRegisteredResponse)
  const [pendingLoading, setPendingLoading] = useState(true)
  const [approvedLoading, setApprovedLoading] = useState(true)
  const [rejectedLoading, setRejectedLoading] = useState(true)
  const [registeredLoading, setRegisteredLoading] = useState(true)

  useEffect(() => {
    if (userInfo) {
      setRegisteredLoading(true)
      getApplicationRegistered(1, "").then((res) =>{
        setRegisteredLoading(false)
        setRegistered(res)
      })

      setPendingLoading(true)
      getApplicationPending(1, "", "").then((res) =>{
        setPendingLoading(false)
        setPending(res)
      })
      setApprovedLoading(true)
      getApplicationApproved(1, "", "").then((res) =>{
        setApprovedLoading(false)
        setApproved(res)
      })
      setRejectedLoading(true)
      getApplicationRejected(1, "", "").then((res) =>{
        setRejectedLoading(false)
        setRejected(res)
      })
    }
  }, [userInfo]);

  const renderTabContent = () => {
  switch (activeTab) {
    case 1:
      return <PendingReview key="pending" data={pending} loading={pendingLoading} handlePageChange={(page, email, nonprofitName) => handlePageChange(1, page, email, nonprofitName)} />;
    case 2:
      return <ApprovedList key="approved" data={approved} loading={approvedLoading} handlePageChange={(page, email, nonprofitName) => handlePageChange(2, page, email, nonprofitName)} />;
    case 3:
      return <Rejected key="rejected" data={rejected} loading={rejectedLoading} handlePageChange={(page, email, nonprofitName) => handlePageChange(3, page, email, nonprofitName)} />;
    case 4:
      return <Registered key="registered" data={registered} loading={registeredLoading} handlePageChange={(page, email) => handlePageChange(4, page, email, "")} />;
  }
};

const handlePageChange = (status: number, page: number, email: string, nonprofitName: string) => {
  if (status === 1) {
    setPendingLoading(true)
    getApplicationPending(page, email, nonprofitName).then((res) =>{
      setPendingLoading(false)
      setPending(res)
    })
  } else if (status === 2) {
    setApprovedLoading(true)
    getApplicationApproved(page, email, nonprofitName).then((res) =>{
      setApprovedLoading(false)
      setApproved(res)
    })
  } else if (status === 3) {
    setRejectedLoading(true)
    getApplicationRejected(page, email, nonprofitName).then((res) =>{
      setRejectedLoading(false)
      setRejected(res)
    })
  } else if (status === 4) {
    setRegisteredLoading(true)
    getApplicationRegistered(page, email).then((res) =>{
      setRegisteredLoading(false)
      setRegistered(res)
    })
  }
}

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 h-[250px] w-full bg-[#FFF1C5]">
        <Image
          src={bgImage}
          alt="bg"
          width={3072}
          height={500}
          className="h-full w-auto"
        />
      </div>
      <div className="relative z-2">
        <div className="flex justify-center pt-12">
          <div className="w-[1280px]">
            <div className="text-[32px] leading-[39px] font-bold text-[#000]">
              Applications
            </div>
            <div className="mt-2 text-[16px] leading-[19px] text-[#000]">
              View and review nonprofit applications.
            </div>
          </div>
        </div>
        {/* cards */}
        <div className="flex justify-center">
          <div
            className="mt-12 w-[1280px] rounded-2xl bg-white px-6 py-12"
            style={{
              border: "1px solid #E9E9E9",
              boxShadow: "0px 0px 16px 0px rgba(84,93,105,0.1)"
            }}
          >
            {/* tab switch */}
            <div className="flex gap-12">
              {tabList.map(item => {
                const isActive = activeTab === item.value
                return (
                  <div
                    key={item.value}
                    className={cn(
                      "relative cursor-pointer text-[18px] leading-[22px] text-[#020328]",
                      isActive ? "font-bold text-[#FE5827]" : ""
                    )}
                    onClick={() => setActiveTab(item.value)}
                  >
                    {item.name}
                    {isActive && (
                      <div className="absolute bottom-[-8px] left-0 h-[2px] w-full bg-[#FE5827]"></div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-[42px]">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
