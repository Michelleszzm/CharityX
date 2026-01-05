"use client"
import { motion } from "motion/react"
import StarSvg from "./StarSvg"
import Image from "next/image"
import pdfIcon from "@/assets/pdf.png"
import commemorativeIcon from "@/assets/commemorative-icon.png"
import divisionIcon from "@/assets/division-icon.png"

interface Props {
  title: string
  subtitle: string
}
export default function DonationFormSuccess({title, subtitle}: Props) {
  return (
    <>
      <motion.div
        className="w-[381px] text-center text-[32px] leading-[39ppx] font-bold text-[#000000]"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {title}
      </motion.div>
      <motion.div
        className="mt-4 w-[580px] text-center text-[12px] leading-[20ppx] text-[#000000]/80"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
      >
        {subtitle}
      </motion.div>
      <div className="mt-10 h-[500px] w-[600px]">
        <StarSvg />
      </div>
    </>
  )
}
