"use client"

import Image, { StaticImageData } from "next/image"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { AppSidebarPaymentCheckbox, PaymentCheckboxData } from "./AppSidebarPaymentCheckbox"
import { set } from "zod"
import ethIcon from "@/assets/home/ic_eth.png"
import btcIcon from "@/assets/home/ic_btc.png"
import solIcon from "@/assets/home/ic_sol.png"
import usdcIcon from "@/assets/home/ic_usdc.png"
import usdtIcon from "@/assets/home/ic_usdt.png"
import daiIcon from "@/assets/home/ic_dai.png"
import { FundraisingPayment, FundraisingPaymentWallet } from "@/apis/fundraise"
import RecommendedWallets from "./RecommendedWallets"

interface Props {
  value: FundraisingPayment;
  onChange: (newValue: FundraisingPayment) => void;
}

interface PaymentData {
  chains: Array<PaymentCheckboxData>;
  tokens: Array<PaymentCheckboxData>;
  wallets: Array<FundraisingPaymentWallet>;
}

const Chains = [{
  key: "SOLANA",
  name: "Solana",
  icon: solIcon,
  tokens: [
    {
      key: "USDT",
      name: "USDT",
      icon: usdtIcon,
    }, {
      key: "USDC",
      name: "USDC",
      icon: usdcIcon,
    }, {
      key: "SOL",
      name: "Solana",
      icon: solIcon,
    },
  ]
}];

export function AppSidebarPayment({ value, onChange }: Props) {

  const [recommendedWalletsOpen, setRecommendedWalletsOpen] = useState(false);

  const [chains, setChains] = useState<PaymentData>(() => {
    return {
      chains: [],
      tokens: [],
      wallets: [],
    }
  });

  const handleChainChange = (data: PaymentCheckboxData[]) => {
    const newChainList = data.filter((item) => item.choosed).map((item) => item.key)
    onChange({
      ...value,
      chainList: newChainList,
    })
  }

  const handleTokenChange = (data: PaymentCheckboxData[]) => {
    const newTokenList = data.filter((item) => item.choosed).map((item) => item.key)
    onChange({
      ...value,
      tokenList: newTokenList,
    }); 
  }

  const handleInputChange =  (data: string, chain: string) => {
    const newChainWalletList = chains.wallets.map((item) => {
      if (item.chain === chain) {
        return {
          ...item,
          wallet: data,
        }
      }
      return item;
    })
    onChange({
      ...value,
      chainWalletList: newChainWalletList,
    }); 
  }

  useEffect(() => {
    const newChains = [];
    const newTokens = [];
    const newWallets = [];
    for (let i = 0; i < Chains.length; i++) {
      const chain = Chains[i];
      const chainChoosed = value.chainList.includes(chain.key);
      newChains.push({
        ...chain,
        choosed: chainChoosed
      })

      if (chainChoosed) {
        const wallet = value.chainWalletList.find(wallet => wallet.chain === chain.key) || {
          chain: chain.key,
          wallet: ""
        };
        newWallets.push({
          ...wallet
        })
      }
      if (value.chainList.includes(chain.key)) {
        for (let j = 0; j < chain.tokens.length; j++) {
          let token = chain.tokens[j];
          newTokens.push({
            ...token,
            choosed: value.tokenList.includes(token.key)
          })
        }
      }
    }
    setChains({
      chains: newChains,
      tokens: newTokens,
      wallets: newWallets,
    })
  }, [value])
  return (
    <div className="w-full flex flex-col pb-40">
      <div className="text-[#020328] font-bold text-lg self-start px-4 mt-6">
        Payment Settings
      </div>
      <div className="text-[#02032880] text-xs mt-2 px-4">
        A payment needs both a chain and a token to reach the right network.
      </div>
      <div className="text-[#020328] font-bold text-sm self-start px-4 mt-8">
        Select the chain for payment <span className="text-[#FE5827]">*</span>
      </div>

      <div className="px-4 mt-4">
        <AppSidebarPaymentCheckbox value={chains.chains} onChange={handleChainChange} />
      </div>

      {
        chains.tokens.length > 0 && ( 
        <>
          <div className="text-[#020328] font-bold text-sm self-start px-4 mt-8">
            Select the token for payment <span className="text-[#FE5827]">*</span>
          </div>

          <div className="px-4 mt-4">
            <AppSidebarPaymentCheckbox value={chains.tokens} onChange={handleTokenChange} />
          </div>
        </>
        )
      }

      {
        chains.chains.filter((item) => item.choosed).length > 0 && (
          <div className="text-[#020328] font-bold text-sm self-start px-4 mt-8">
            Wallet Address for Receiving Donations <span className="text-[#FE5827]">*</span>
          </div>
        )
      }

      {
        chains.wallets.map((item) => (
          <div key={item.chain}>
            <div className="text-[#020328] text-sm self-start px-4 mt-6">
              {item.chain} wallet address <span className="text-[#FE5827]">*</span>
            </div>

            <div className="w-full px-4 mt-3">
              <Input type="text" placeholder="Enter your wallet address" value={item.wallet} onChange={(e) => handleInputChange(e.target.value, item.chain)} />
            </div>
          </div>
        ))
      }

      <div className="text-[#1890FF] text-sm self-start px-4 mt-6 cursor-pointer" onClick={() => setRecommendedWalletsOpen(true)}>
        No Wallet Address Yet
      </div>

      <RecommendedWallets open={recommendedWalletsOpen} setOpen={setRecommendedWalletsOpen} />
    </div>
  )
}