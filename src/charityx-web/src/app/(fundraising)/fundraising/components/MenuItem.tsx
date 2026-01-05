"use client"

import Image, { StaticImageData } from "next/image"
import { X } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import useModalStore from "@/store/modalStore"
import useUserStore from "@/store/userStore"
import emailIcon from "@/assets/home/email.png"
import passwordIcon from "@/assets/home/password.png"
import xIcon from "@/assets/home/X1.png"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters.")
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function MenuItem({
  title,
  icon, 
  choosed,
}: {
  title: string
  icon: StaticImageData
  choosed: boolean
}) {
  return (
    <div className={`w-20 h-20 flex flex-col justify-center items-center text-[11px] gap-1.5 ${choosed ? "bg-white border-y border-y-[#E9E9E9]" : ""} text-[#020328]`}>
      <Image
        src={icon}
        alt="Template"
        width={24}
        height={24}
        className="size-6"
      />
      <div>{title}</div>
    </div>
  )
}
