
'use client';
import { Web3Provider } from "@/components/web3/Web3Provider"
import DonationForm from "./donate/components/DonationForm"
import DonationTitle from "./donate/components/DonationTitle"
import { notFound } from "next/navigation";
import { usePlatformData } from "./components/PlatformContext";
import { pl } from "zod/v4/locales";
import DonationFormSuccess from "./donate/components/DonationFormSuccess";
import { useEffect, useState } from "react";
import { ReceiptData, receiptDataDefault } from "@/apis/donate";
import { loadTokenPrice } from "@/store/userToken";

export default function DashboardPage() {
  const platformData = usePlatformData();
  console.log(platformData)
  if (!platformData) notFound();
  if (platformData.code !== 200) notFound();


  // if (!platformData) notFound();
  const [paySuccess, setPaySuccess] = useState(false)
  const [receiptData, setReceiptData] = useState<ReceiptData>(receiptDataDefault)
  const changePaySuccess = (receiptData: ReceiptData) => {
    setReceiptData(receiptData)
    setPaySuccess(true)
  }

  useEffect(()=>{
    loadTokenPrice(platformData.data.publishValue.site)
  }, [])

  // notFound()
  return (
    <Web3Provider>
      <div className="mt-[54px]">
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <DonationTitle title={platformData.data.styleValue.mainTitle} subtitle={platformData.data.styleValue.subtitle} />
          </div>
          <div className="ml-[130px] w-[500px] rounded-2xl border border-[#E9E9E9] bg-white px-6 py-8 shadow-[0px_0px_16px_0px_rgba(84,93,105,0.1)]">
            {paySuccess && <DonationFormSuccess showTitle={true} value={receiptData}/>}
            {!paySuccess && (
              <div>
                <div className="flex items-center">
                  <div className="text-[14px] leading-[18px] font-[500] text-[#000000]/60">
                    Donate to
                  </div>
                  <div className="ml-1 text-[16px] leading-[19px] font-bold text-[#000000]">
                    { platformData.data.styleValue.organizationName }
                  </div>
                </div>
                <div className="mt-6">
                  <DonationForm changePaySuccess={changePaySuccess} value={platformData.data}/>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Web3Provider>
  )
}
