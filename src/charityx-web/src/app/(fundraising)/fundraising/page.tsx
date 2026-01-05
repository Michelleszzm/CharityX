"use client"

import Image from "next/image"
import bgImage from "@/assets/home/bg3.png"
import { Check } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import ChooseTemplate from "./components/ChooseTemplate"
import StyleSettings from "./components/StyleSettings"
import DonationForm from "./components/DonationForm"
import LinkSettings from "./components/LinkSettings"
import { TemplateHeader } from "./components/TemplateHeader"
import fundraisingTemplateIcon from "@/assets/home/fundraising_template.png"
import { TemplateContent } from "./components/TemplateContent"
import { getTemplate } from "@/apis/fundraise"

export default function FundraisingPage() {
  
  useEffect(() => {
    getTemplate()
  }, [])

  return (
    <div className="w-full h-[calc(100vh-106px)] flex flex-col px-8">
      <TemplateHeader />

      <div className="w-full h-[calc(100vh-190px)] mt-6">
        <TemplateContent />
      </div>
    </div>
  )
}
