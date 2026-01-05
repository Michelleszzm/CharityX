"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSidebar } from "@/components/ui/sidebar"
import templatePublishIcon from "@/assets/home/ic_template_publish.png"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TemplateHeaderView } from "./TemplateHeaderView";
import useFundraisingStore, { loadFundraising } from "@/store/fundraisingStore";
import { useMemo, useState } from "react";
import { TemplateHeaderProgress } from "./TemplateHeaderProgress";
import { publishFundraise } from "@/apis/fundraise";
import { Spinner } from "@/components/ui/spinner";

const views = [
  {
    id: 1,
    title: "Choose Template",
    choosed: false,
  },
  {
    id: 2,
    title: "Style Settings",
    choosed: false,
  },
  {
    id: 3,
    title: "Payment Settings",
    choosed: false,
  },
  {
    id: 4,
    title: "Form Settings",
    choosed: false,
  },
  {
    id: 5,
    title: "Fund Allocation",
    choosed: false,
  },
  {
    id: 6,
    title: "Publish Settings",
    choosed: false,
  }
]

export function TemplateHeader() {

  const fundraising = useFundraisingStore((state) => state.fundraising)
  const [loading, setLoading] = useState(false)
  const [deactivateLoading, setDeactivateLoading] = useState(false)

  const newViews = useMemo(() => {
    const result = views.map((view) => ({
      ...view,
      choosed: Boolean(
        (view.id === 1 && fundraising?.fundraisingTemplateCode ) ||
        (view.id === 2 && fundraising?.styleValue ) ||
        (view.id === 3 && fundraising?.paymentValue) ||
        (view.id === 4 && fundraising?.formValue) ||
        (view.id === 5 && fundraising?.allocationValue) ||
        (view.id === 6 && fundraising?.publishValue) ||
        view.choosed,
      ),
    }));
    let sum = 0;
    result.forEach(v => {
      if (v.id === 1 && v.choosed) {
        sum+=20;
      } else if (v.id === 2 && v.choosed) {
        sum+=20;
      } else if (v.id === 3 && v.choosed) {
        sum+=20;
      } else if (v.id === 4 && v.choosed) {
        sum+=10;
      } else if (v.id === 5 && v.choosed) {
        sum+=15;
      } else if (v.id === 6 && v.choosed) {
        sum+=15;
      }
    })
    return {
      sum,
      result
    }
  }, [fundraising])
  
  const checkFundraisingCompleted = useMemo(() => { 
    return Boolean(fundraising && fundraising.styleValue && fundraising.paymentValue && fundraising.formValue && fundraising.allocationValue && fundraising.publishValue)
  }, [fundraising])

  const handleSubmit = async () => {
      setLoading(true);
      try {
        const data = await publishFundraise({
          publishStatus: 1,
        });
        await loadFundraising()
      } catch (error) {
        console.log(error)
      }finally {
        setLoading(false);
      }
  }
  const handleDeactivate = async () => {
      setDeactivateLoading(true);
      try {
        const data = await publishFundraise({
          publishStatus: 0,
        });
        await loadFundraising()
      } catch (error) {
        console.log(error)
      }finally {
        setDeactivateLoading(false);
      }
  }

  return (
    <div className="h-10 w-full flex flex-row items-center">
      <div className="font-bold text-lg flex-1">My Template</div>
      <TemplateHeaderProgress value={newViews.sum} />
      <div className="ml-4"><TemplateHeaderView value={newViews.result} /></div>
      
      <div className="flex flex-row gap-3 ml-3">
      {
        fundraising && (
          <Button variant="default" className="bg-[#FE5827] cursor-pointer hover:bg-[#FE5827]" disabled={fundraising.publishStatusDraft === 1 || loading || !checkFundraisingCompleted} onClick={handleSubmit}>
            <Image
                src={templatePublishIcon}
                alt="TemplatePublish"
                width={16}
                height={16}
                className="size-4"
              />
            {
            fundraising.publishStatusDraft === 1 ? "Published" : "Publish Websit"
            }
            {
              loading && (
                 <Spinner className="size-4" />
              )
            }
          </Button>
        )
      }
      {
        fundraising && fundraising.publishStatus >= 0 && (
          <Button variant="default" className="bg-[#FE5827] cursor-pointer hover:bg-[#FE5827]" disabled={fundraising.publishStatus === 0 || deactivateLoading} onClick={handleDeactivate}>
            {
            fundraising.publishStatus === 0 ? "Deactivated" : "Deactivate"
            }
            {
              deactivateLoading && (
                 <Spinner className="size-4" />
              )
            }
          </Button>
        )
      }
      </div>
    </div>
  );
}