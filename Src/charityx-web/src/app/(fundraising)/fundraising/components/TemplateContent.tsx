"use client"

import Image, { StaticImageData } from "next/image"
import { Button } from "@/components/ui/button";
import { cn, formatAddress, tokenIcons } from "@/lib/utils";
import { convertUsdToToken } from "@/store/userToken"
import { formatTokenAmount } from "@/lib/tokenConversion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TemplateIcon from "@/assets/home/ic_template_icon.png"
import solanaIcon from "@/assets/wallet/SOL.png"
import bitcoinIcon from "@/assets/wallet/BTC.png"
import ethereumIcon from "@/assets/wallet/ETH.png"
import usdcIcon from "@/assets/wallet/USDC.png"
import usdtIcon from "@/assets/wallet/USDT.png"
import daiIcon from "@/assets/wallet/DAI.png"
import copyIcon from "@/assets/copy-icon.png"
import { use, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"
import useFundraisingStore from "@/store/fundraisingStore";
import walletIcon from "@/assets/wallet-icon.png"
import fundraisingTemplateIcon from "@/assets/home/fundraising_template.png"
import { fundraisingFormDefault, fundraisingPaymentDefault, fundraisingStyleDefault } from "@/apis/fundraise";
import { scale } from "motion/react";

interface Token {
  name: string;
  icon: StaticImageData;
}
// blockchain configuration
const BLOCKCHAIN_CONFIG = {
  SOLANA: {
    label: "Solana",
    icon: solanaIcon, // temporarily use existing icons, replace with actual Solana icons in actual application
    tokens: [
      { name: "USDT", icon: usdtIcon },
      { name: "USDC", icon: usdcIcon },
      { name: "SOL", icon: solanaIcon }
    ]
  }
} as const


const AMOUNT_OPTIONS = [300, 150, 60, 30, 15];

export function TemplateContent() {

  const fundraising = useFundraisingStore((state) => state.fundraising)
  const tokens = useFundraisingStore((s) => s.fundraising?.paymentValue?.tokenList ?? fundraisingPaymentDefault.tokenList);
  const foundationAddress = useFundraisingStore((s) => s.fundraising?.paymentValue?.chainWalletList ?? fundraisingPaymentDefault.chainWalletList);
  const formValue = useFundraisingStore((s) => s.fundraising?.formValue ?? fundraisingFormDefault);
  
  const [blockChain, setBlockChain] = useState<"SOLANA">("SOLANA");
  const [token, setToken] = useState<string>("");
  const [watchedAmount , setWatchedAmount] = useState<number>(0);
  const [amountStr , setAmountStr] = useState<string>("");
  const menuList = [
    {
      name: "Donate",
      actived: true,
    },
    {
      name: "Donation Overview",
      actived: false,
    },
    {
      name: "Receipts & NFTs",
      actived: false,
    }
  ]
  const [scaleValue, setScale] = useState(0.8);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const w = 1536 * scaleValue;
  const h = 900 * scaleValue;
  const iconW = 600 * scaleValue;
  const iconH = 500 * scaleValue;


  const isOtherSelected = (amountList: string[]) => !amountList.includes(String(watchedAmount))

  const isAmountSelected = (amount: number) => watchedAmount === amount

  // handle amount selection
  const handleAmountSelect = (amount: number) => {
    setWatchedAmount(amount)
  }
  const handleInputAmount = (newValue: string) => {
    setWatchedAmount(Number(newValue))
  }

  const handleAmountChange = (amount: number) => {
    setAmountStr(amount.toString());
  }

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      setWatchedAmount(Number(formValue.defaultAmount))
      setToken(tokens[0])
    }
  }, [tokens])


  const resize = () => {
    console.log("resize");
    const container = containerRef.current;
    const content = contentRef.current;
    console.log("resize", container, content);
    if (!container || !content) return;

    const vw = container.clientWidth;
    const vh = container.clientHeight;
    const cw = content.scrollWidth;
    const ch = content.scrollHeight;
    const nextScale = Math.min(vw / cw, vh / ch);

    const containerRect = container.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const left = (containerRect.width - contentRect.width) / 2;

    // container.style.visibility = "hidden";
    setPosition({ left, top: 0 });
    console.log("nextScale", vw, vh, cw, ch, nextScale, left, 0, containerRect.width, contentRect.width);
    setScale(nextScale);
    // container.style.visibility = "visible";
    // debug
    // console.log("resize", vw, vh, cw, ch, nextScale, left);
  };

  useLayoutEffect(() => {
    try {
      // run immediately (synchronous)
      resize();
    } catch (e) {
      // ignore
    }
    if (containerRef.current && contentRef.current) {
      observerRef.current = new ResizeObserver(() => {
        // use rAF to batch
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => resize());
      });
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // keep empty to run on mount

  useEffect(() => {
      const handlePageShow = (e: PageTransitionEvent) => {
        console.log("handlePageShow", e);
        // Force a rAF to ensure DOM layout ready
        requestAnimationFrame(() => {
          resize();
        });
      };

      window.addEventListener("pageshow", handlePageShow);

      if (!observerRef.current && containerRef.current) {
        observerRef.current = new ResizeObserver(() => {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => resize());
        });
        observerRef.current.observe(containerRef.current);
      }

      // initial call in effect as fallback (will run after paint; may cause a frame of flicker)
      // but helps when useLayoutEffect didn't run
      requestAnimationFrame(() => resize());

      return () => {
        window.removeEventListener("pageshow", handlePageShow);
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerRef.current, contentRef.current]);

  const value = useMemo(() => { 
    return {
      choseColor: (fundraising?.styleValue?.chooseColor ?? "#2777FF"),
    }
  }, [fundraising])

  const templateContentHeader = () => {
    return (
    <header className="w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex h-18 items-center justify-between pr-16 pl-8">
        <div className="flex items-center">
          {
            fundraising && fundraising.styleValue && fundraising.styleValue.organizationLogo !== "" && (
              <img
                src={fundraising.styleValue.organizationLogo}
                alt="logo"
                width={564}
                height={80}
                className="h-10 w-auto"
              />
            )
          }
          {
            !(fundraising && fundraising.styleValue && fundraising.styleValue.organizationLogo !== "") && (
              <div className="h-10 w-auto font-bold flex justify-center items-center text-xl">{fundraising?.styleValue?.organizationName !== "" ? fundraising?.styleValue?.organizationName : "Your logo"}</div>
            )
          }
        </div>
        <div className="flex items-center">
          <nav className="hidden md:flex">
            {menuList.map(item => {
              return (
                <div
                  key={item.name}
                  style={{ color: item.actived ? value.choseColor : "" }}
                  onMouseEnter={(e) => {
                    if (!item.actived) e.currentTarget.style.color = value.choseColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = item.actived ? value.choseColor : "";
                  }}
                  className={cn(
                    "relative ml-16 flex cursor-pointer text-sm text-[#000000]/80",
                    item.actived ? "font-bold" : ""
                  )}
                >
                  <div className="flex flex-col items-center">
                    <div>{item.name}</div>
                    {item.actived && (
                      <div style={{ backgroundColor: value.choseColor }} className="absolute bottom-[-6px] h-[2px] w-10 rounded-[8px]"></div>
                    )}
                  </div>
                </div>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
    )
  }

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden relative">
      {
        fundraising && (
          <div ref={contentRef} style={{ 
            transform: `scale(${scaleValue})`,
            transformOrigin: "top left",
            left: `${position.left}px`,
            }} className="absolute w-[1300px] h-[750px] mx-auto shadow-xl flex flex-col items-center justify-start bg-red overflow-y-auto scrollbar-hide">
            {
              templateContentHeader()
            }
            <div className="flex flex-row mt-10">
              <div className="flex flex-col items-center justify-center flex-1 ">
                <div
                  className="w-[381px] text-center text-[32px] leading-[39ppx] font-bold text-[#000000]"
                >
                  {
                    fundraising?.styleValue?.mainTitle ?? fundraisingStyleDefault.mainTitle
                  }
                </div>
                <div
                  className="mt-4 w-[580px] text-center text-[12px] leading-[20ppx] text-[#000000]/80"
                >
                  {
                    fundraising?.styleValue?.subtitle ?? fundraisingStyleDefault.subtitle
                  }
                </div>
                <div className="mt-10 flex items-center justify-center">
                  <Image src={TemplateIcon} alt="Rejected" width={500} height={420} />
                </div>
              </div>
              
              <div className="ml-[130px] w-[500px] rounded-2xl border border-[#E9E9E9] bg-white px-6 py-8 shadow-[0px_0px_16px_0px_rgba(84,93,105,0.1)]">
                  <div>
                    <div className="flex items-center">
                      <div className="text-[14px] leading-[18px] font-[500] text-[#000000]/60">
                        Donate to
                      </div>
                      <div className="ml-1 text-[16px] leading-[19px] font-bold text-[#000000]">
                        {fundraising?.styleValue?.organizationName ?? "Your Organization"}
                      </div>
                    </div>
                    <div className="flex flex-col mt-6 gap-3">
                      <div className="text-[13px] leading-[16px] !font-[400] text-[#020328]">
                        Select Blockchain
                      </div>
                      <Select value={blockChain} >
                        <SelectTrigger className="!h-[40px] w-full cursor-pointer rounded-[8px] border border-[#E9E9E9] bg-white">
                          <div className="flex items-center">
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(BLOCKCHAIN_CONFIG).map(([key, config]) => (
                            <SelectItem
                              key={key}
                              value={key}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <Image
                                  src={config.icon}
                                  alt={config.label}
                                  width={24}
                                  height={24}
                                />
                                <span>{config.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="text-[13px] leading-[16px] !font-[400] text-[#020328]">
                        Select Token
                      </div>

                      <Select value={token} onValueChange={(value) => setToken(value)}>
                        <SelectTrigger className="!h-[40px] w-full cursor-pointer rounded-[8px] border border-[#E9E9E9] bg-white">
                          <div className="flex items-center">
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {tokens && tokens.map(token => (
                            <SelectItem
                              key={token}
                              value={token}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <Image
                                  src={tokenIcons[token as keyof typeof tokenIcons]}
                                  alt={token}
                                  width={24}
                                  height={24}
                                />
                                <span>{token}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="text-[13px] leading-[16px] text-[#020328]">
                        Donation Amount (USD)
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {formValue.amountList.map(amount => (
                          <Button
                            key={amount}
                            type="button"
                            style={{ color: isAmountSelected(Number(amount)) ? value.choseColor : "#000000", borderColor: isAmountSelected(Number(amount)) ? value.choseColor : "#E9E9E9" }}
                            variant={isAmountSelected(Number(amount)) ? "default" : "outline"}
                            className={`h-[40px] cursor-pointer rounded-[8px] text-[14px] ${
                              isAmountSelected(Number(amount))
                                ? "border-2 bg-white font-bold hover:bg-white"
                                : "border border-[#E9E9E9] bg-white text-[#000000] hover:bg-gray-50"
                            }`}
                            onClick={() => handleAmountSelect(Number(amount))}
                          >
                            ${amount}
                          </Button>
                        ))}
          
                        <Button
                          type="button"
                          variant={isOtherSelected(formValue.amountList) ? "default" : "outline"}
                          style={{ color: isOtherSelected(formValue.amountList) ? value.choseColor : "#000000", borderColor: isOtherSelected(formValue.amountList) ? value.choseColor : "#E9E9E9" }}
                          className={`h-[40px] cursor-pointer rounded-[8px] text-[14px] ${
                            isOtherSelected(formValue.amountList)
                              ? "border-2 bg-white font-bold hover:bg-white"
                              : "border border-[#E9E9E9] bg-white text-[#000000] hover:bg-gray-50"
                          }`}
                          onClick={() => handleAmountSelect(0)}
                        >
                          Other
                        </Button>
                      </div>

                      <div className="relative">
                        <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[16px] text-[#020328]">
                          $
                        </div>
                        <Input
                          type="text"
                          placeholder="0"

                          onChange={e => handleInputAmount(e.target.value)}
                          value={watchedAmount}
                          className="h-[52px] rounded-[8px] border border-[#E9E9E9] bg-white pr-16 pl-8 text-[16px] font-bold text-[#020328]"
                        />
                        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-[14px] text-[#020328]">
                          USD
                        </div>
                      </div>

                      <Button 
                        style={{ backgroundColor: value.choseColor }}
                        className="h-[40px] w-full cursor-pointer rounded-[8px] text-[16px] font-semibold text-white transition-all duration-200 hover:bg-[#2777FF]/80 hover:shadow-md active:scale-[0.98]">
                        <div className="flex items-center justify-center">
                          <Image
                            src={walletIcon}
                            alt="wallet-icon"
                            width={32}
                            height={32}
                            className="mr-2 size-4 transition-transform duration-200"
                          />
                          <div>Connect Wallet</div>
                        </div>
                      </Button>
                      
                      <div className="mt-4 flex h-[79px] flex-col justify-center rounded-[8px] border border-[#E9E9E9] bg-[#F7F7F7] px-4">
                        <div className="flex items-center">
                          <div className="text-[14px] leading-[18px] font-[400] text-[#020328]">
                            Estimated Tokens：
                          </div>
                          <div className="text-[14px] leading-[18px] font-bold text-[#020328]">
                            {formatTokenAmount(
                              convertUsdToToken(token, watchedAmount),
                              token
                            )}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center">
                          <div className="text-[14px] leading-[18px] font-[400] text-[#020328]">
                            Foundation Address：
                          </div>
                          <div className="text-[14px] leading-[18px] font-bold text-[#020328]">
                            {formatAddress(new Map(foundationAddress?.map((item) => [item.chain, item.wallet]) ?? []).get(blockChain) ?? "")}
                          </div>
                          <Image
                            src={copyIcon}
                            alt="copy-icon"
                            width={48}
                            height={48}
                            className="ml-2 size-4 cursor-pointer"
                            onClick={() => {
                              // navigator.clipboard.writeText(FOUNDATION_ADDRESS)
                              toast.success("Copied to clipboard")
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
            
          </div>

        )
      }

      {
        !fundraising && (
          <div className="w-full h-full flex flex-col mb-21 bg-white items-center justify-center">
          <Image
            src={fundraisingTemplateIcon}
            alt="Template"
            width={24}
            height={24}
            className="size-6"
          />
          <div className="mt-6 text-base font-bold">First, select the template you’d like from the left.</div>
          <div className="mt-2 text-sm">Set up your personalized donation page with your preferred design.</div>
          </div>
        )
      }
    </div>
  );
}