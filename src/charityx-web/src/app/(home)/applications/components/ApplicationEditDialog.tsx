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
import { Application, ApplicationEditRequest, ApplicationStatus, CheckRecordResponse, defaultEditData, getApplicationApprovedManager } from "@/apis/admin";
import OrganizationStatus from "../../components/OrganizationStatus";
import { formatDate } from "@/lib/utils";
import Image from "next/image"
import { use, useEffect, useState } from "react";
import editImage from "@/assets/home/ic_edit.png";
import { Input } from "@/components/ui/input";
import { SysUserVo } from "@/apis/user";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export interface UserEditData {
  userType: string; // donor or organization
  id: string;
  chain: string;
  wallet: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: number;
  age: string;
  phone: string;
  country: string;
  city: string;
  occupation: string;
}

export const userEditDataDefault: UserEditData = {
  userType: "",
  id: "",
  chain: "",
  wallet: "",
  firstName: "",
  lastName: "",
  email: "",
  gender: 0,
  age: "",
  phone: "",
  country: "",
  city: "",
  occupation: "",
};

interface Props {
  data: UserEditData | undefined;
  open: boolean;
  setOpen: (open: boolean) => void

  onConfirm: (item: UserEditData) => Promise<void>
}

export default function ApplicationEditDialog({ data, open, setOpen, onConfirm }: Props) {
  const [appEditData, setAppEditData] = useState<UserEditData>(userEditDataDefault)
  const [loading, setLoading] = useState(false)

  const handleFirstNameChange = (newVal: string) => {
    setAppEditData({
      ...appEditData,
      firstName: newVal,
    })
  }
  const handleAgeChange = (newVal: string) => {
    if (newVal === "") {
      setAppEditData({
        ...appEditData,
        age: newVal,
      });
      return;
    }
    if (/^\d*$/.test(newVal)) {
      setAppEditData({
        ...appEditData,
        age: newVal,
      });
    }
  }

  const onGenderChange = (value: string) => {
    console.log("hahah", value);
    setAppEditData({
      ...appEditData,
      gender: Number(value),
    });
  }
  const handleSubmit = async () => {
    console.log(appEditData);
    setLoading(true)
    try {
      await onConfirm(appEditData)
      setOpen(false)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (data) {
      setAppEditData({
        ...appEditData,
        userType: data.userType,
        id: data.id,
        chain: data.chain,
        wallet: data.wallet,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        gender: data.gender,
        age: data.age,
        phone: data.phone,
        country: data.country,
        city: data.city,
        occupation: data.occupation,
      })
    }

  }, [data])

  if (!open || !data) return null;
  console.log("appEditData", open, data)

  return (<Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[680px]! gap-0 p-0"
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
              Edit Profile
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-row gap-10">
            <div className="flex flex-col flex-1">
              <div className="mt-4 text-sm leading-[18px] text-[#020328]">
                First name
              </div>
              <Input
                  type="text"
                  placeholder="Your First name"
                  value={appEditData.firstName}
                  onChange={e => handleFirstNameChange(e.target.value)}
                  className="h-10 mt-2 rounded-[8px] border-1 pr-3 pl-3 text-base"
                />
            </div>
            <div className="flex flex-col flex-1">
              <div className="mt-4 text-sm leading-[18px] text-[#020328]">
                Last name
              </div>
              <Input
                  type="text"
                  placeholder="Your Last name"
                  value={appEditData.lastName}
                  onChange={e => {
                    setAppEditData({
                      ...appEditData,
                      lastName: e.target.value,
                    })
                  }}
                  className="h-10 mt-2 rounded-[8px] border-1 pr-3 pl-3 text-base"
                />
            </div>
          </div>

          <div className="flex flex-row gap-10 mt-4">
            <div className="flex flex-col flex-1">
              <div className="mt-4 text-sm leading-[18px] text-[#020328]">
                Gender
              </div>
              <Select onValueChange={onGenderChange} value={`${appEditData.gender === 0 ? "" : appEditData.gender}`}>
                <SelectTrigger className="h-10 mt-2 w-full">
                  <SelectValue placeholder="Select" className="h-10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">Male</SelectItem>
                    <SelectItem value="2">Female</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col flex-1">
              <div className="mt-4 text-sm leading-[18px] text-[#020328]">
                Age
              </div>
              <Input
                  type="text"
                  placeholder="Your Age"
                  value={appEditData.age}
                  onChange={e => handleAgeChange(e.target.value)}
                  className="h-10 mt-2 rounded-[8px] border-1 pr-3 pl-3 text-base"
                />
            </div>
          </div>

          <div className="flex flex-row gap-10 mt-4">
            <div className="flex flex-col flex-1">
              <div className="mt-4 text-sm leading-[18px] text-[#020328]">
                Email
              </div>
              <Input
                  type="text"
                  placeholder="Your Email"
                  disabled={appEditData.userType === "organization"}
                  value={appEditData.email}
                  onChange={e => {
                    setAppEditData({
                      ...appEditData,
                      email: e.target.value,
                    })
                  }}
                  // onChange={e => handleFirstNameChange(e.target.value)}
                  className="h-10 mt-2 rounded-[8px] border-1 pr-3 pl-3 text-base disabled:bg-[#E9E9E9]"
                />
            </div>
            <div className="flex flex-col flex-1">
              <div className="mt-4 text-sm leading-[18px] text-[#020328]">
                Phone
              </div>
              <Input
                  type="text"
                  placeholder="Your Phone"
                  value={appEditData.phone}
                  onChange={e => {
                    setAppEditData({
                      ...appEditData,
                      phone: e.target.value,
                    })
                  }}
                  className="h-10 mt-2 rounded-[8px] border-1 pr-3 pl-3 text-base"
                />
            </div>
          </div>


          <div className="flex flex-row gap-10 mt-4">
            <div className="flex flex-col flex-1">
              <div className="mt-4 text-sm leading-[18px] text-[#020328]">
                Country
              </div>
              <Input
                  type="text"
                  placeholder="Your Country"
                  value={appEditData.country}
                  onChange={e => {
                    setAppEditData({
                      ...appEditData,
                      country: e.target.value,
                    })
                  }}
                  className="h-10 mt-2 rounded-[8px] border-1 pr-3 pl-3 text-base"
                />
            </div>
            <div className="flex flex-col flex-1">
              <div className="mt-4 text-sm leading-[18px] text-[#020328]">
                City
              </div>
              <Input
                  type="text"
                  placeholder="Your City"
                  value={appEditData.city}
                  onChange={e => {
                    setAppEditData({
                      ...appEditData,
                      city: e.target.value,
                    })
                  }}
                  className="h-10 mt-2 rounded-[8px] border-1 pr-3 pl-3 text-base"
                />
            </div>
          </div>

          <div className="flex flex-row gap-10 mt-4">
            <div className="flex flex-col flex-1">
              <div className="mt-4 text-sm leading-[18px] text-[#020328]">
                Occupation
              </div>
              <Input
                  type="text"
                  placeholder="Your Occupation"
                  value={appEditData.occupation}
                  onChange={e => {
                    setAppEditData({
                      ...appEditData,
                      occupation: e.target.value,
                    })
                  }}
                  className="h-10 mt-2 rounded-[8px] border-1 pr-3 pl-3 text-base"
                />
            </div>
            <div className="flex flex-col flex-1">
            </div>
          </div>
          <DialogFooter className="w-32 justify-center gap-4 mt-8">
            <Button
              disabled={loading}
              className="h-10 w-full cursor-pointer rounded-[8px] bg-[#FE5827] text-[14px] font-bold text-white hover:bg-[#FE5827] hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => handleSubmit()}
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
