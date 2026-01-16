"use client"

import Image from "next/image"
import { X, Lock } from "lucide-react"
import { useEffect, useState } from "react"
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
import useUserStore, { loginToService, loginToServiceWithPassword } from "@/store/userStore"
import emailIcon from "@/assets/home/email.png"
import passwordIcon from "@/assets/home/password.png"
import xIcon from "@/assets/home/X1.png"
import googleIcon from "@/assets/home/google.png"
import { resetPasswordCode, sendCode } from "@/apis/user"
import { Spinner } from "@/components/ui/spinner"

const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address."),
  code: z
    .string()
    .min(6, "Verification code must be 6 digits.")
    .max(6, "Verification code must be 6 digits.")
    .regex(/^[0-9]{6}$/, "Verification code must be 6 digits.")
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function ResetPassword() {
  const { resetPasswordModalOpen, setResetPasswordModalOpen, setLoginModalOpen, openChangePasswordModalOpen } =
    useModalStore()
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange", // real-time validation
    defaultValues: {
      email: "",
      code: ""
    }
  })

  // listen to the close of the modal, reset the form state
  // listen to the close of the modal, reset the form state and countdown
  useEffect(() => {
    if (!resetPasswordModalOpen) {
      form.reset()
      setCountdown(0)
    }
  }, [resetPasswordModalOpen, form])

  // countdown logic
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleEmailRegister = (data: RegisterFormValues) => {
    console.log("email signup", data)
    setLoading(true)
    const email = form.getValues("email")
    const code = form.getValues("code")
    resetPasswordCode({ email, code }).then((res) => {
      console.log("send code result:", res)
      let token = res;
      setResetPasswordModalOpen(false)
      openChangePasswordModalOpen({
        email,
        token,
      })
    }).catch((err: any) => {
      console.log("send code error:", err)
    }).finally(() => {
      setLoading(false)
    })
  }

  const handleGetCode = async () => {
    // validate email field
    const emailValid = await form.trigger("email")
    if (!emailValid) return

    const email = form.getValues("email")
    const scene = 3;
    sendCode({ email, scene }).then((res) => {
      console.log("send code result:", res)
    }).catch((err: any) => {
      console.log("send code error:", err)
    })

    // start 60 seconds countdown
    setCountdown(60)
  }

  // check if email is valid(used to control Get Code button)
  const isEmailValid = form.watch("email") && !form.formState.errors.email

  return (
    <Dialog open={resetPasswordModalOpen} onOpenChange={setResetPasswordModalOpen}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[840px] gap-0 p-0"
      >
        {/* close button */}
        <button
          onClick={() => setResetPasswordModalOpen(false)}
          className="ring-offset-background absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
        >
          <X className="size-6 cursor-pointer text-[#797A8D]" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-10">
          {/* title */}
          <DialogHeader className="mb-6">
            <DialogTitle className="text-left text-[32px] leading-[39px] font-bold text-[#020328]">
              Reset Password
            </DialogTitle>
            <p className="text-left text-[16px] leading-[19px] text-[#020328]">
              Enter your email to receive a code.
            </p>
          </DialogHeader>

          {/* email verification code input form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleEmailRegister)}
              className="space-y-3"
            >
              {/* email input */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Image
                          src={emailIcon}
                          alt="Email"
                          width={32}
                          height={32}
                          className="absolute top-1/2 left-4 size-4 -translate-y-1/2"
                        />
                        <Input
                          {...field}
                          type="email"
                          placeholder="E-mail"
                          className="h-10 rounded-[8px] border-1 pl-10 text-base"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* verification code input */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#797A8D]" />
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter Your Code"
                          maxLength={6}
                          className="h-10 rounded-[8px] border-1 pr-24 pl-10 text-base"
                        />
                        <button
                          type="button"
                          onClick={handleGetCode}
                          disabled={!isEmailValid || countdown > 0}
                          className="absolute top-1/2 right-4 -translate-y-1/2 text-[14px] font-medium text-[#1890FF] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {countdown > 0 ? `${countdown}s` : "Get Code"}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Next button */}
              <Button
                type="submit"
                disabled={!form.formState.isValid || loading}
                className="mt-3 h-10 w-full cursor-pointer rounded-[8px] bg-[#FE5827] text-[14px] font-bold text-white hover:bg-[#FE5827] hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                {
                  loading && (
                    <Spinner className="size-4" />
                  )
                }
              </Button>
            </form>
          </Form>

          {/* register link */}
          <div className="mt-6 text-center text-[14px] leading-[18px]">
            <span className="text-[#020328] mr-1">Back to </span>
            <button
              onClick={() => {
                setResetPasswordModalOpen(false)
                setLoginModalOpen(true)
              }}
              className="font-bold text-[#1890FF] hover:underline"
            >
              Sign in
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
