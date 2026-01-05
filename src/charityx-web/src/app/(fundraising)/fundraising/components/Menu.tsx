"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import fundraisingTemplateIcon from "@/assets/home/fundraising_template.png"
import fundraisingTemplateCheckedIcon from "@/assets/home/fundraising_template_checked.png"
import fundraisingStyleIcon from "@/assets/home/fundraising_style.png"
import fundraisingStyleCheckedIcon from "@/assets/home/fundraising_style_checked.png"
import fundraisingPaymentIcon from "@/assets/home/fundraising_payment.png"
import fundraisingPaymentCheckedIcon from "@/assets/home/fundraising_payment_checked.png"
import fundraisingFormIcon from "@/assets/home/fundraising_form.png"
import fundraisingFormCheckedIcon from "@/assets/home/fundraising_form_checked.png"
import fundraisingAllocationIcon from "@/assets/home/fundraising_allocation.png"
import fundraisingAllocationCheckedIcon from "@/assets/home/fundraising_allocation_checked.png"
import fundraisingPublishIcon from "@/assets/home/fundraising_publish.png"
import fundraisingPublishCheckedIcon from "@/assets/home/fundraising_publish_checked.png"
import MenuItem from "./MenuItem"

export default function Menu() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const current = searchParams.get("c") || "template";
    
    const menuList = [
    {
      key: "template",
      name: "Template",
      img: fundraisingTemplateIcon,
      imgChoosed: fundraisingTemplateCheckedIcon,
    },
    {
      key: "style",
      name: "Style",
      img: fundraisingStyleIcon,
      imgChoosed: fundraisingStyleCheckedIcon,
    },
    {
      key: "payment",
      name: "Payment",
      img: fundraisingPaymentIcon,
      imgChoosed: fundraisingPaymentCheckedIcon,
    },
    {
      key: "form",
      name: "Form",
      img: fundraisingFormIcon,
      imgChoosed: fundraisingFormCheckedIcon,
    },
    {
      key: "allocation",
      name: "Allocation",
      img: fundraisingAllocationIcon,
      imgChoosed: fundraisingAllocationCheckedIcon,
    },
    {
      key: "publish",
      name: "Publish",
      img: fundraisingPublishIcon,
      imgChoosed: fundraisingPublishCheckedIcon,
    }
  ]

  const handleMenuClick = (item: any) => {
    router.push(`/fundraising?c=${item.key}`);
  }

  useEffect(() => {
    const matched = menuList.find(item => item.key === current);
    if (!matched) {
      const params = new URLSearchParams(searchParams);
      params.set("c", "template");
      router.replace(`/fundraising`);
    }
  }, [current, router, searchParams]);

  return (
    <div className="flex flex-col w-20">
      {
        menuList.map((item) => (
          <div key={item.key} className="cursor-pointer" onClick={() => handleMenuClick(item)}><MenuItem key={item.key} title={item.name} icon={ item.key === current ? item.imgChoosed : item.img } choosed={item.key === current} /></div>
        ))
      }
    </div>
  )
}
