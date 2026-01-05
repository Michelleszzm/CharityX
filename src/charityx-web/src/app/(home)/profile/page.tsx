"use client"

import Image from "next/image"
import { Plus, LoaderCircle } from "lucide-react"
import bgImage from "@/assets/home/bg3.png"
import logoImage from "@/assets/home/logo3.png"
import JoshuaImage from "@/assets/home/people/Joshua.png"
import MichelleImage from "@/assets/home/people/Michelle.png"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import useUserStore, { refreshUserInfo } from "@/store/userStore"
import pendingImage from "@/assets/home/ic_pending.png"
import OrganizationStatus from "../components/OrganizationStatus"
import { completeUserInfo, getS3UploadUrl, UserCharityNonprofit } from "@/apis/user"
import useModalStore from "@/store/modalStore"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { saveImage } from "@/lib/utils"

export default function ProfilePage() {
  const { setResetPasswordModalOpen } = useModalStore()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userInfo = useUserStore((state) => state.userInfo);
  const userName = useUserStore((state) => {
    const userInfo = state.userInfo;
    if (userInfo?.sysUserVo.firstName === "" && userInfo?.sysUserVo.lastName === "") {
      return userInfo?.sysUserVo.email;
    }
    return `${userInfo?.sysUserVo.firstName} ${userInfo?.sysUserVo.lastName}`;
  });

  const [nonprofitImage, setNonprofitImage] = useState(() => userInfo?.charityNonprofitMergeVo?.proofImage ?? "");
  const [nonprofitName, setNonprofitName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const teamList = [
    {
      name: "Michelle",
      title: "Co Founder",
      description:
        "Michelle Zhou is a student at Oaks Christian School. As the founder of the Robot Learners League, she empowers underprivileged students, especially girls, to explore coding and robotics. As a VEX V5 competitor, she combines precision and creativity to solve real-world challenges. Through Stanford’s REAP and GYEL programs, she gains insights into rural education and global policy. She aims to merge technology with sociology to create meaningful social impact and develop innovative solutions which improve lives.",
      image: MichelleImage
    },
    {
      name: "Joshua",
      title: "Co Founder",
      description:
        "Joshua Bie is a student at Harvard-Westlake School.He is the founder and President of Go Gold Club at his school, and the founding member of Super Joey Foundation. As an active youth volunteer and leader, Joshua is dedicated to make meaningful differences in his communities through service, advocacy, and technical initiatives that make our world a better place for everyone.",
      image: JoshuaImage
    }
  ]

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const contentType = file.type || "application/octet-stream";
      const res = await getS3UploadUrl({
        contentType
      });
      console.log(res);
      
      await fetch(res.url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
      setNonprofitImage(res.fileUrl)
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
    // saveImage(nonprofitImage, "a.png");
    // saveImage("https://picsum.photos/300", "test.png");
  };

  const handleOrganizationStatus = (charityNonprofitMergeVo: UserCharityNonprofit | undefined) => {
    // type OrganizationStatusType = 'prepare' | 'pending' | 'approved' | 'rejected';
    if (charityNonprofitMergeVo) { 
      if (charityNonprofitMergeVo.status === 1) {
        return "pending"
      } else if (charityNonprofitMergeVo.status === 2) {
        return "approved"
      } else if (charityNonprofitMergeVo.status === 4) {
        return "rejected"
      }
    }
    return "prepare"
  }

  const handleFirstNameChange = (newValue: string) => {
    setFirstName(newValue)
  }
  const handleLastNameChange = (newValue: string) => {
    setLastName(newValue)
  }

  const handleSubmit = async () => { 
    if (nonprofitName === "" && nonprofitImage === "") {
      toast.error("Please update the information before submitting.")
      return;
    }
    if (nonprofitName === "" || nonprofitImage === "") {
      toast.error("Please complete all required organization information.")
      return;
    }

    setLoading(true)
    try {
      await completeUserInfo({
        firstName: firstName,
        lastName: lastName,
        nonprofitName: nonprofitName,
        proofImage: nonprofitImage,
        password: password,
      });
      await refreshUserInfo();
      toast.success("Saved successfully.")
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.sysUserVo.firstName)
      setLastName(userInfo.sysUserVo.lastName)
      setNonprofitName(userInfo.charityNonprofitMergeVo?.nonprofitName ?? "")
      setNonprofitImage(userInfo.charityNonprofitMergeVo?.proofImage ?? "")
    }
  }, [userInfo])

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
              Profile
            </div>
            <div className="mt-2 text-[16px] leading-[19px] text-[#000]">
              Manage your personal details
            </div>
          </div>
        </div>
        {/* cards */}
        <div className="flex justify-center">
          <div
            className="mt-12 flex w-[1280px] flex-col items-center rounded-2xl bg-white px-32.5 pb-20"
            style={{
              border: "1px solid #E9E9E9",
              boxShadow: "0px 0px 16px 0px rgba(84,93,105,0.1)"
            }}
          >
            <div className="mt-12 w-[970px] text-center text-[24px] leading-[29px] font-bold text-[#020328]">
              Hi, {userName} 👋
            </div>
            <div className="w-full mt-12 flex flex-row items-start justify-start gap-x-30">
              <div className="flex-1 flex flex-col">
                <div className="text-[18px] leading-[22px] font-bold text-[#020328]">
                  Organization Information
                </div>

                <div className="mt-8">
                  <OrganizationStatus status={handleOrganizationStatus(userInfo?.charityNonprofitMergeVo)} shownDesc={true} />
                </div>

                <div className="mt-6 text-sm leading-[18px] text-[#020328]">
                  Nonprofit name
                </div>
                <Input
                    type="text"
                    placeholder="Enter your nonprofit name"
                    value={nonprofitName}
                    onChange={e => setNonprofitName(e.target.value)}
                    className="h-10 mt-2 rounded-[8px] border-1 pr-24 pl-3 text-base"
                  />

                <div className="mt-6 text-sm leading-[18px] text-[#020328]">
                  Proof of nonprofit status
                </div>

                <div className="mt-2 flex flex-row items-center">
                  <div className="w-25 h-25 flex items-center justify-center border-1 rounded-[8px] border-[#E9E9E9]" onClick={handleButtonClick}>
                    <Input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {
                        nonprofitImage === "" && (
                          <div><Plus className="size-8 cursor-pointer text-[#1890FF]" /></div>
                        )
                      }
                      {
                        nonprofitImage !== "" && (
                          <img className="max-w-20 max-h-20 object-cover" src={nonprofitImage} />
                        )
                      }
                  </div>
                  {
                    nonprofitImage !== "" && (
                      <div className="ml-6 text-[#1890FF] font-bold text-sm cursor-pointer" onClick={handleButtonClick}>Edit</div>
                    )
                  }
                </div>
                
              </div>
              <div className="flex-1 flex flex-col">
                <div className="text-[18px] leading-[22px] font-bold text-[#020328]">
                  Personal Information
                </div>
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col">
                    <div className="mt-6 text-sm leading-[18px] text-[#020328]">
                      First name
                    </div>
                    <Input
                        type="text"
                        placeholder="Your First name"
                        value={firstName}
                        onChange={e => handleFirstNameChange(e.target.value)}
                        className="h-10 mt-2 rounded-[8px] border-1 pr-3 pl-3 text-base"
                      />
                  </div>
                  <div className="flex flex-col">
                    <div className="mt-6 text-sm leading-[18px] text-[#020328]">
                      Last name
                    </div>
                    <Input
                        type="text"
                        placeholder="Your Last name"
                        value={lastName}
                        onChange={e => handleLastNameChange(e.target.value)}
                        className="h-10 mt-2 rounded-[8px] border-1 pr-3 pl-3 text-base"
                      />
                  </div>
                </div>


                <div className="mt-6 text-sm leading-[18px] text-[#020328]">
                  Email
                </div>
                <Input
                    type="text"
                    placeholder="Enter Your Code"
                    maxLength={6}
                    disabled
                    value={userInfo?.sysUserVo.email}
                    className="h-10 mt-2 rounded-[8px] border-1 pr-24 pl-3 text-sm disabled:bg-[#E9E9E9]"
                  />

                {
                  userInfo?.charityNonprofitMergeVo && (
                    <div className="mt-8 text-[#1890FF] text-sm font-bold cursor-pointer" onClick={() => setResetPasswordModalOpen(true)}>Change Password</div>
                  )
                }
                {
                  !userInfo?.charityNonprofitMergeVo && userInfo?.sysUserVo.provider !== "GOOGLE" && (
                    <>
                      <div className="mt-6 text-sm leading-[18px] text-[#020328]">
                        Password
                      </div>
                      <Input
                          type="password"
                          placeholder="Your Password"
                          value={password}
                          className="h-10 mt-2 rounded-[8px] border-1 pr-24 pl-3 text-base"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      <div className="mt-3 text-xs leading-[15px] text-[#02032880]">
                        Password must be 8+ chars with upper, lower, and number.
                      </div>
                    </>
                  )
                }
              </div>
            </div>

            <Button
            disabled={loading}
              className="mt-15 w-50 h-10 cursor-pointer rounded-[6px] bg-[#FE5827] text-sm font-bold text-white hover:bg-[#FE5827] hover:opacity-70" onClick={handleSubmit}
            >
              Submit
              {
                loading && (
                  <Spinner className="size-4" />
                )
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
