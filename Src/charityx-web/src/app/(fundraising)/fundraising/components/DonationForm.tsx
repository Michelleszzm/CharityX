"use client"

import Image from "next/image"
import { Check, MoveLeft, MoveRight } from "lucide-react"

import { useState } from "react"
import { Input } from "@/components/ui/input"

import solanaIcon from "@/assets/wallet/SOL.png"
import bitcoinIcon from "@/assets/wallet/BTC.png"
import ethereumIcon from "@/assets/wallet/ETH.png"
import usdcIcon from "@/assets/wallet/USDC.png"
import usdtIcon from "@/assets/wallet/USDT.png"
import daiIcon from "@/assets/wallet/DAI.png"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function DonationForm({
  setCurrentStep
}: {
  setCurrentStep: (step: number) => void
}) {
  const [blockchainList, setBlockchainList] = useState([
    { icon: ethereumIcon, name: "Ethereum", checked: true },
    { icon: bitcoinIcon, name: "Bitcoin", checked: true },
    { icon: solanaIcon, name: "Solana", checked: true }
  ])
  const handleBlockchainChange = (name: string) => {
    // multi-select, if it is already selected, cancel the selection, if it is not selected, select it
    setBlockchainList(prev =>
      prev.map(item => ({
        ...item,
        checked: item.name === name ? !item.checked : item.checked
      }))
    )
  }
  const [tokenList, setTokenList] = useState([
    { icon: usdtIcon, name: "USDT", checked: true },
    { icon: usdcIcon, name: "USDC", checked: true },
    { icon: ethereumIcon, name: "ETH", checked: true },
    { icon: solanaIcon, name: "SOL", checked: true },
    { icon: bitcoinIcon, name: "BTC", checked: true },
    { icon: daiIcon, name: "DAI", checked: true }
  ])
  const handleTokenChange = (name: string) => {
    setTokenList(prev =>
      prev.map(item => ({
        ...item,
        checked: item.name === name ? !item.checked : item.checked
      }))
    )
  }

  const [amountList, setAmountList] = useState([
    { value: 300, checked: false },
    { value: 150, checked: false },
    { value: 60, checked: false },
    { value: 30, checked: true },
    { value: 15, checked: false }
  ])

  const checkAmount = (index: number) => {
    setAmountList(prev =>
      prev.map((item, i) => ({ ...item, checked: i === index ? true : false }))
    )
  }

  const handleAmountChange = (index: number, newValue: string) => {
    const numValue = parseInt(newValue) || 1
    setAmountList(prev =>
      prev.map((item, i) => (i === index ? { ...item, value: numValue } : item))
    )
  }

  const [walletAddress, setWalletAddress] = useState("0x1234...abcd")

  return (
    <div className="mt-12 px-6">
      <div className="flex flex-col items-center">
        <div className="text-[18px] leading-[22px] font-bold text-[#020328]">
          Donation Form
        </div>

        <div className="mt-12 text-[14px] leading-[18px] font-bold text-[#020328]">
          Select the chain for payment
        </div>
        <div className="mt-4 flex items-center gap-8">
          {blockchainList.map(item => (
            <div
              className="relative flex cursor-pointer flex-col items-center transition-all duration-300 hover:scale-105"
              key={item.name}
              onClick={() => handleBlockchainChange(item.name)}
            >
              <div className="flex size-[72px] items-center justify-center rounded-[8px] border border-[#E9E9E9]">
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={160}
                  height={160}
                  className="size-10"
                />
              </div>
              <div className="mt-2 text-[12px] leading-[15px] text-[#020328]/65">
                {item.name}
              </div>
              {item.checked && (
                <div className="absolute top-[-9px] right-[-9px] flex size-[18px] items-center justify-center rounded-full bg-[#FE5827]">
                  <Check className="size-3 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-[14px] leading-[18px] font-bold text-[#020328]">
          Select the token for payment
        </div>
        <div className="mt-4 flex items-center gap-8">
          {tokenList.map(item => (
            <div
              className="relative flex cursor-pointer flex-col items-center transition-all duration-300 hover:scale-105"
              key={item.name}
              onClick={() => handleTokenChange(item.name)}
            >
              <div className="flex size-[72px] items-center justify-center rounded-[8px] border border-[#E9E9E9]">
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={160}
                  height={160}
                  className="size-10"
                />
              </div>
              <div className="mt-2 text-[12px] leading-[15px] text-[#020328]/65">
                {item.name}
              </div>
              {item.checked && (
                <div className="absolute top-[-9px] right-[-9px] flex size-[18px] items-center justify-center rounded-full bg-[#FE5827]">
                  <Check className="size-3 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-[14px] leading-[18px] font-bold text-[#020328]">
          Donation Amount Settings(USD)
        </div>
        <div className="mt-4 grid w-[451px] grid-cols-3 gap-2">
          {amountList.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex h-[40px] items-center justify-center rounded-[8px] bg-white",
                item.checked
                  ? "border-2 border-[#FE5827]"
                  : "border border-[#E9E9E9]"
              )}
              onClick={() => checkAmount(index)}
            >
              <Input
                type="number"
                min="1"
                value={item.value}
                onChange={e => handleAmountChange(index, e.target.value)}
                className={cn(
                  "h-full border-none text-center text-[14px] shadow-none focus-visible:ring-0",
                  item.checked ? "font-bold text-[#FE5827]" : "text-[#020328]"
                )}
              />
            </div>
          ))}
          <div className="flex h-[40px] items-center justify-center rounded-[8px] border border-[#E9E9E9] bg-[#F2F2F2] text-[14px] text-[#020328]">
            Other
          </div>
        </div>
        <div className="mt-4 w-[451px] text-[14px] leading-[18px] text-[#FE5827]">
          Note: The selected option will be the default.
        </div>

        <div className="mt-12 text-[14px] leading-[18px] font-bold text-[#020328]">
          Wallet Address for Receiving Donations
        </div>
        <div className="mt-4 flex h-[40px] w-[451px] items-center justify-center rounded-[8px] border border-[#E9E9E9] bg-white">
          <Input
            className="h-full border-none text-[14px] text-[#020328]"
            placeholder="Enter the wallet address of the institution"
            value={walletAddress}
            onChange={e => setWalletAddress(e.target.value)}
          />
        </div>
        <div className="mt-4 w-[451px] cursor-pointer text-[14px] leading-[18px] text-[#1890FF]">
          No Wallet Address Yet？
        </div>

        <div className="mt-12 flex items-center justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="h-[40px] w-[141px] cursor-pointer rounded-[8px] border-[#E9E9E9]"
            onClick={() => setCurrentStep(2)}
          >
            <MoveLeft className="size-5 font-bold text-[#020328]" />
            <div className="text-[16px] font-bold text-[#020328]">Previous</div>
          </Button>
          <Button
            type="button"
            variant="default"
            className="h-[40px] w-[372px] cursor-pointer rounded-[8px] bg-[#FE5827] hover:bg-[#FE5827]/80 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setCurrentStep(4)}
          >
            <div className="text-[16px] font-bold text-white">
              Save and Continue
            </div>
            <MoveRight className="size-5 font-bold text-white" />
          </Button>
        </div>
      </div>
    </div>
  )
}
