"use client"

import Image, { StaticImageData } from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar"

import fundraisingTemplate0Icon from "@/assets/home/ic_fundraising_template_0.png"
import templateCheckedIcon from "@/assets/home/ic_fundraising_template_checked.png"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { AppSidebarColor } from "./AppSidebarColor"
import { AppSidebarPurpose } from "./AppSidebarPurpose"
import { AppSidebarPublish } from "./AppSidebarPublish"
import { AppSidebarForm } from "./AppSidebarForm"
import { AppSidebarPayment } from "./AppSidebarPayment"
import { AppSidebarStyle } from "./AppSidebarStyle"
import { FundraisingAllocation, fundraisingAllocationDefault, FundraisingForm, fundraisingFormDefault, FundraisingPayment, fundraisingPaymentDefault, FundraisingPublish, fundraisingPublishDefault, FundraisingStyle, fundraisingStyleDefault, getFundraise, publishFundraise, saveFundraise } from "@/apis/fundraise"
import { Spinner } from "@/components/ui/spinner"
import { form } from "viem/chains"
import { toast } from "sonner"
import useFundraisingStore, { loadFundraising } from "@/store/fundraisingStore"

export function AppSidebar() {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [currentC, setCurrentC] = useState("template");
  const fundraising = useFundraisingStore((state) => state.fundraising)
  const searchParams = useSearchParams();
  const allowedCategories = ["template", "style", "payment", "form", "allocation", "publish"];
  const [fundraisingStyle, setFundraisingStyle] = useState<FundraisingStyle>(fundraisingStyleDefault);
  const [fundraisingForm, setFundraisingForm] = useState<FundraisingForm>(fundraisingFormDefault);
  const [fundraisingPayment, setFundraisingPayment] = useState<FundraisingPayment>(fundraisingPaymentDefault);
  const [fundraisingAllocation, setFundraisingAllocation] = useState<FundraisingAllocation>(fundraisingAllocationDefault);
  const [fundraisingPublish, setFundraisingPublish] = useState<FundraisingPublish>(fundraisingPublishDefault);
  
  const newViews = useMemo(() => {
    if (fundraising) { 
      if (fundraising.styleValue) {
        setFundraisingStyle(fundraising.styleValue);
      }
      if (fundraising.paymentValue) {
        setFundraisingPayment(fundraising.paymentValue);
      }
      if (fundraising.formValue) {
        setFundraisingForm(fundraising.formValue);
      }

      if (fundraising.allocationValue) {
        setFundraisingAllocation(fundraising.allocationValue);
      }
      if (fundraising.publishValue) {
        setFundraisingPublish(fundraising.publishValue);
      }
    }
  }, [fundraising])

  const checkFundraisingCompleted = useMemo(() => { 
    return Boolean(fundraising && fundraising.styleValue && fundraising.paymentValue && fundraising.formValue && fundraising.allocationValue && fundraising.publishValue)
  }, [fundraising])

  useEffect(() => {
    loadFundraising();
    const current = searchParams.get("c") || "template";
    setCurrentC(allowedCategories.includes(current) ? current : "template");
  }, [searchParams]);

  const onChangeFundraisingStyle = (style: FundraisingStyle) => {
    setFundraisingStyle(style);
  }

  const onChangeFundraisingAllocation = (allocation: FundraisingAllocation) => {
    setFundraisingAllocation(allocation);
  }

  const onChangeFundraisingPublish = (publish: FundraisingPublish) => {
    setFundraisingPublish(publish);
  }

  const onChangeFundraisingForm = (form: FundraisingForm) => {
    setFundraisingForm(form);
  }

  const onChangeFundraisingPayment = (payment: FundraisingPayment) => {
    setFundraisingPayment(payment);
  }
  const handleSave = async () => {
    // const allowedCategories = ["template", "style", "payment", "form", "allocation", "publish"];
    if (currentC === "publish") {
      if (fundraisingPublish.site === "") {
        toast.error("Please complete all required fields.")
        return;
      }
      setLoading(true);
      try {
        const data = await saveFundraise({
          fundraisingTemplateCode: "AAAAAA",
          publishValue: fundraisingPublish
        });
        await loadFundraising()
        toast.success("Save successfully");
      } finally {
        setLoading(false);
      }
    } else if (currentC === "template") {
      router.push(`/fundraising?c=style`);
    } else if (currentC === "style") {
      router.push(`/fundraising?c=payment`);
    } else if (currentC === "payment") {
      router.push(`/fundraising?c=form`);
    } else if (currentC === "form") {
      router.push(`/fundraising?c=allocation`);
    } else if (currentC === "allocation") {
      router.push(`/fundraising?c=publish`);
    }
  };

  const handleSaveAndPublish = async () => {
    if (currentC === "publish") {
      setPublishLoading(true);
      try {
        const data = await publishFundraise({
          publishStatus: 1,
        });
        await loadFundraising()
        toast.success("Publish Success");
      } catch (error) {
        console.log(error)
      }finally {
        setPublishLoading(false);
      }
      return
    } else {
      setPublishLoading(true);
      try {
        if (currentC === "template") {
          await saveFundraise({
            fundraisingTemplateCode: "AAAAAA",
            formValue: fundraisingFormDefault
          });
        } else if (currentC === "form") {
          await saveFundraise({
            fundraisingTemplateCode: "AAAAAA",
            formValue: fundraisingForm
          });
        } else if (currentC === "style") {
          let error = ""
          if (fundraisingStyle.organizationName === "" ||
            fundraisingStyle.chooseColor === "" ||
            fundraisingStyle.mainTitle === ""||
            fundraisingStyle.subtitle === "") {
            error = "Please complete all required fields."
          }
          if (error !== "") {
            toast.error(error)
            return
          }
          const data = await saveFundraise({
            fundraisingTemplateCode: "AAAAAA",
            styleValue: fundraisingStyle
          });
        } else if (currentC === "allocation") {
          console.log(fundraisingAllocation.purposeList)
          let error = ""
          let sumPercent = 0
          fundraisingAllocation.purposeList.forEach((item) => {
            if (item.name === "" || item.percent === "") {
              error = "Please complete all required fields."
            } else {
              sumPercent += parseInt(item.percent)
            }
          })
          if (error !== "") {
            toast.error(error)
            return
          }
          if (sumPercent !== 100) {
            toast.error("The sum of percentages must be 100")
            return
          }
          const data = await saveFundraise({
            fundraisingTemplateCode: "AAAAAA",
            allocationValue: fundraisingAllocation
          });
        } else if (currentC === "payment") {
          let error = ""
          if (fundraisingPayment.chainList.length <= 0 ||
            fundraisingPayment.tokenList.length <= 0 ||
            fundraisingPayment.chainWalletList.length <= 0) {
            error = "Please complete all required fields."
          }
          if (fundraisingPayment.chainWalletList.filter((item) => item.wallet === "").length > 0) {
            error = "Please complete all required fields."
          }

          if (error !== "") {
            toast.error(error)
            return
          }
          const data = await saveFundraise({
            fundraisingTemplateCode: "AAAAAA",
            paymentValue: fundraisingPayment
          });
        }
        await loadFundraising()
        toast.success("Save successfully");
      } finally {
        setPublishLoading(false);
      }
    }
  };

  return (
    <Sidebar className="absolute left-0 top-0 h-full">
      <SidebarContent className="bg-white items-center">
        {
          currentC === "template" && (
            <>
            <div className="text-[#020328] font-bold text-lg self-start px-3 py-6">
              Choose Template <span className="text-[#FE5827]">*</span>
            </div>
            <div className="relative border border-[#E9E9E9] rounded-xl overflow-hidden">
              <Image
                  src={fundraisingTemplate0Icon}
                  alt="Template0"
                  width={280}
                  height={164}
                  className="w-70 h-41 object-cover"
                />
              <div className="absolute top-2 right-2">
                <Image
                    src={templateCheckedIcon}
                    alt="Template0"
                    width={18}
                    height={18}
                    className="size-4.5"
                  />
              </div>
            </div>
            <div className="text-[#020328] text-sm mt-6"> More templates coming soon</div>
            </>
          )
        }
        {
          currentC === "style" && <AppSidebarStyle value={fundraisingStyle} onChange={onChangeFundraisingStyle}/>
        }
        {
          currentC === "allocation" && ( 
            <>
            <div className="text-[#020328] font-bold text-lg self-start px-3 mt-6">
              Fund Allocation Settings
            </div>
            <div className="text-[#02032880] text-xs self-start px-3 mt-2">
              Configure fund allocation. Transparent and open, it builds donor confidence.
            </div>
            <div className="w-full px-3 mt-8">
              <AppSidebarPurpose value={fundraisingAllocation} onChange={onChangeFundraisingAllocation}/>
            </div>
            </>
          )
        }
        {
          currentC === "payment" &&  <AppSidebarPayment value={fundraisingPayment} onChange={onChangeFundraisingPayment}/>
        }
        {
          currentC === "form" &&  <AppSidebarForm value={fundraisingForm} onChange={onChangeFundraisingForm}/>
        }
        {
          currentC === "publish" &&  <AppSidebarPublish value={fundraisingPublish} onChange={onChangeFundraisingPublish}/>
        }
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-row gap-3">
          <Button variant="default" className="h-10 flex-1 cursor-pointer bg-white text-[#020328] font-bold border border-[#E9E9E9] hover:bg-[#ffffff40]" disabled={loading} onClick={handleSave}>
            {`${currentC === "publish" ? "Save" : "Next"}`}
            {
              loading && (
                <Spinner className="size-4" />
              )
            }
          </Button>

          <Button variant="default" className="h-10 flex-2 cursor-pointer font-bold bg-[#FE5827] hover:bg-[#FE582780]" disabled={publishLoading || (currentC === "publish" && !checkFundraisingCompleted)} onClick={handleSaveAndPublish}>
            {`${currentC === "publish" ? "Publish Website" : currentC === "allocation" ? "Save": "Save and Preview"}`}
            {
              publishLoading && (
                <Spinner className="size-4" />
              )
            }
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}