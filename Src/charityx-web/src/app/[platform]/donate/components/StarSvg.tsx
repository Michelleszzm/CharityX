import React from "react"
import Image from "next/image"
import star1 from "@/assets/antin/star1.png"
import usdc from "@/assets/antin/USDC.png"
import btc from "@/assets/antin/BTC.png"
import usdt from "@/assets/antin/USDT.png"
import dai from "@/assets/antin/DAI.png"
import sol from "@/assets/antin/SOL.png"

export default function StarSvg() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative h-[500px] w-[600px]">
        {/* stars */}
        <Image
          src={star1}
          width={80}
          height={80}
          alt="star1"
          className="absolute top-[192px] left-10 w-10"
          style={{
            animation: "twinkle 1.5s infinite ease-in-out",
            animationDelay: "0s"
          }}
        />
        <Image
          src={star1}
          alt="star1"
          className="absolute top-[300px] right-20 w-8"
          style={{
            animation: "twinkle 1.5s infinite ease-in-out",
            animationDelay: "0.7s"
          }}
        />

        {/* coins around */}
        <Image
          src={usdc}
          alt="USDC"
          width={244}
          height={260}
          className="absolute top-[100px] left-[100px] w-[122px]"
          style={{
            animation: "float 3s ease-in-out infinite",
            animationDelay: "0s"
          }}
        />
        <Image
          src={btc}
          alt="BTC"
          width={198}
          height={210}
          className="absolute top-[70px] right-[104px] w-[99px]"
          style={{
            animation: "float 3s ease-in-out infinite",
            animationDelay: "0.5s"
          }}
        />
        <Image
          src={usdt}
          alt="USDT"
          width={140}
          height={122}
          className="absolute top-5 left-[250px] w-[70px]"
          style={{
            animation: "float 3s ease-in-out infinite",
            animationDelay: "1s"
          }}
        />
        <Image
          src={dai}
          alt="DAI"
          width={140}
          height={122}
          className="absolute bottom-[70px] left-[100px] w-[70px]"
          style={{
            animation: "float 3s ease-in-out infinite",
            animationDelay: "1.5s"
          }}
        />

        {/* center SOL coin */}
        <Image
          src={sol}
          alt="SOL"
          width={1200}
          height={1000}
          className="absolute top-1/2 left-1/2 w-[600px] -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(0.6);
            opacity: 0.4;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </div>
  )
}
