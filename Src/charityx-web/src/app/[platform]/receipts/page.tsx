"use client"

import { useRouter, useParams, notFound } from "next/navigation"
import Image from "next/image"
import searchIcon from "@/assets/search-icon.png"
import hopeIcon from "@/assets/hope-icon.png"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { motion, AnimatePresence } from "motion/react"
import DonationFormSuccess from "../donate/components/DonationFormSuccess"
import { usePlatformData } from "../components/PlatformContext"
import { getReceiptNFT, ReceiptData } from "@/apis/donate"
import { Spinner } from "@/components/ui/spinner"
export default function ReceiptsPage() {
  const platformData = usePlatformData();
  if (!platformData) notFound();
  if (platformData.code !== 200) notFound();
  //1 is search, 2 is donation record
  const [loading, setLoading] = useState(false);
  const [currentType, setCurrentType] = useState("1")
  const [walletAddress, setWalletAddress] = useState("")
  const [visibleItems, setVisibleItems] = useState(0)
  const router = useRouter()
  const params = useParams()
  const platform = params.platform as string

  const [listItems, setListItems] = useState<ReceiptData[]>([])

  const handleSearch = async () => {
    if (!walletAddress) {
      toast.error("Please enter your wallet address")
      return
    }
    setLoading(true)
    // TEST-2025-11-20-WWWWWWWW-0
    getReceiptNFT(platformData.data.publishValue.site, {
      donorWallet: walletAddress
    }).then((res) => {
      setCurrentType("2")
      setListItems(res)
    }).finally(() => {
      setLoading(false)
    })
  }
  useEffect(() => {
    if (currentType === "2") {
      setVisibleItems(0)
      const timers: NodeJS.Timeout[] = []

      for (let i = 0; i < 3; i++) {
        const timer = setTimeout(() => {
          setVisibleItems(prev => prev + 1)
        }, i * 300)
        timers.push(timer)
      }

      return () => {
        timers.forEach(timer => clearTimeout(timer))
      }
    }
  }, [currentType])

  // const listItems = [
  //   {
  //     id: 1,
  //     component: 
  //   },
  //   {
  //     id: 2,
  //     component: (
  //       <DonationFormSuccess
  //         showTitle={false}
  //         price={50}
  //         time="2025-07-18 12:32:37"
  //         ownId="NFT#SJF0000069"
  //         owner="4x34aF…27E6"
  //       />
  //     )
  //   },
  //   {
  //     id: 3,
  //     component: (
  //       <div className="flex h-full flex-col">
  //         <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-2xl bg-[#F7F7F7] px-4 py-6">
  //           <Image
  //             src={hopeIcon}
  //             alt="hope-icon"
  //             width={80}
  //             height={80}
  //             className="size-10"
  //           />
  //           <div className="mt-5 text-[16px] leading-[19px] font-bold text-[#020328]">
  //             Keep sowing hope
  //           </div>
  //           <div className="mt-4 w-[300px] text-center text-[14px] leading-[18px] text-[#020328]/80">
  //             Every donation nurtures a forest of hope, letting each seed grow
  //             and shine.
  //           </div>
  //           <Button
  //             className="mt-6 h-[40px] w-[124px] cursor-pointer rounded-[8px] bg-[#2777FF] text-[14px] font-bold text-white hover:bg-[#2777FF]/80"
  //             onClick={() => {
  //               router.push(`/${platform}`)
  //             }}
  //           >
  //             Donate Now
  //           </Button>
  //         </div>
  //       </div>
  //     )
  //   }
  // ]

  return (
    <div className="h-[calc(100%-103px-20px)] mt-[24px] flex items-center justify-center">
      <div className="flex h-full w-[1280px] rounded-2xl border border-[#E9E9E9] bg-white px-6 py-8 shadow-[0px_0px_16px_0px_rgba(84,93,105,0.1)] overflow-hidden">
        {currentType === "1" && (
          <div className="h-full w-full">
            <div className="text-[16px] leading-[19px] font-bold text-[#020328]">
              My Receipts & NFTs
            </div>
            <div className="flex h-full w-full flex-col items-center justify-center pb-30">
              <Image
                src={searchIcon}
                alt="search-icon"
                width={80}
                height={80}
                className="size-10"
              />
              <div className="mt-4 text-[16px] leading-[19px] font-bold text-[#020328]">
                Find Your Donation Receipts
              </div>
              <div className="mt-4 w-[400px] text-center text-[14px] leading-[18px] text-[#020328]/80">
                Enter your wallet address to view and relive every act of
                kindness.
              </div>
              <div className="mt-10 flex h-[56px] w-[600px] items-center rounded-[8px] border-1 border-[#E9E9E9] p-2 pl-4">
                <Input
                  placeholder="Enter your wallet address"
                  type="text"
                  className="h-full flex-1 border-none px-0 shadow-none focus-visible:ring-0"
                  value={walletAddress}
                  onChange={e => setWalletAddress(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      handleSearch()
                    }
                  }}
                />
                <Button
                  style={{ backgroundColor: platformData.data.styleValue.chooseColor}}
                  className="ml-4 h-full w-[160px] cursor-pointer rounded-[8px] px-8 text-[14px] font-bold text-white hover:opacity-80"
                  disabled={loading}
                  onClick={() => handleSearch()}
                >
                  Search Receipts
                  {
                    loading && (<Spinner className="size-4" />)
                  }
                </Button>
              </div>
            </div>
          </div>
        )}
        {currentType === "2" && (
          <div className="scrollbar-hide max-h-full space-y-4 overflow-y-auto">
            <div className="text-[16px] leading-[19px] font-bold text-[#020328]">
              My Receipts & NFTs
            </div>
            <div className="grid grid-cols-3 gap-6 overflow-y-auto">
              {
                listItems.map((item, index) => (
                  <DonationFormSuccess key={item.txHash} showTitle={false} value={item} />
                ))
              }
              <div className="flex h-full flex-col">
                <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-2xl bg-[#F7F7F7] px-4 py-6">
                  <Image
                    src={hopeIcon}
                    alt="hope-icon"
                    width={80}
                    height={80}
                    className="size-10"
                  />
                  <div className="mt-5 text-[16px] leading-[19px] font-bold text-[#020328]">
                    Keep sowing hope
                  </div>
                  <div className="mt-4 w-[300px] text-center text-[14px] leading-[18px] text-[#020328]/80">
                    Every donation nurtures a forest of hope, letting each seed grow
                    and shine.
                  </div>
                  <Button
                    style={{ backgroundColor: platformData.data.styleValue.chooseColor}}
                    className="mt-6 h-[40px] w-[124px] cursor-pointer rounded-[8px] text-[14px] font-bold text-white hover:opacity-80"
                    onClick={() => {
                      router.push(`/${platform}`)
                    }}
                  >
                    Donate Now
                  </Button>
                </div>
              </div>
              {/* <AnimatePresence>
                {listItems.map(
                  (item, index) =>
                    index < visibleItems && (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{
                          duration: 0.5,
                          ease: "easeOut"
                        }}
                      >
                        {item.component}
                      </motion.div>
                    )
                )}
              </AnimatePresence> */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
