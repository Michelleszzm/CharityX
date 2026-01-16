"use client"

import Image from "next/image"
import { X, Lock } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import emailIcon from "@/assets/home/email.png"
import xIcon from "@/assets/home/X1.png"
import googleIcon from "@/assets/home/google.png"
import { Sen } from "next/font/google"
import { loginWithCode, sendCode } from "@/apis/user"
import useUserStore, { loginToService } from "@/store/userStore"
import { Spinner } from "@/components/ui/spinner"

const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address."),
  code: z
    .string()
    .min(6, "Verification code must be 6 characters.")
    .max(6, "Verification code must be 6 characters.")
    .regex(/^[A-Za-z0-9]{6}$/, "Verification code must be 6 characters (letters or numbers).")
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function Register() {
  const {
    registerModalOpen,
    setRegisterModalOpen,
    setLoginModalOpen,
    setProfileModalOpen
  } = useModalStore()
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange", // real-time validation
    defaultValues: {
      email: "",
      code: ""
    }
  })

  // listen to the close of the modal, reset the form state and countdown
  useEffect(() => {
    if (!registerModalOpen) {
      form.reset()
      setCountdown(0)
    }
  }, [registerModalOpen, form])

  // countdown logic
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleGoogleSignup = () => {
    console.log("Google signup")
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_API}unAuth/oauth2/authorize/google`;
  }

  const handleXSignup = () => {
    console.log("X signup")
    // TODO: implement X signup logic
  }

  const handleGetCode = async () => {
    // validate email field
    const emailValid = await form.trigger("email")
    if (!emailValid) return

    const email = form.getValues("email")
    const scene = 1;
    console.log("send code to:", email)
    // TODO: implement send code logic
    sendCode({ email, scene }).then((res) => {
      console.log("send code result:", res)
    }).catch((err: any) => {
      console.log("send code error:", err)
    })

    // start 60 seconds countdown
    setCountdown(60)
  }

  const handleEmailRegister = (data: RegisterFormValues) => {
    setLoading(true)
    loginToService(data.email, data.code).then((user) => {
      console.log("login with code result:", user)
      setRegisterModalOpen(false)
      if (user && !user.charityNonprofitMergeVo) {
        setProfileModalOpen(true)
      }
    }).catch((err: any) => {
      console.log("login with code error:", err)
    }).finally(() => {
      setLoading(false)
    })
  }

  const handleSwitchToLogin = () => {
    setRegisterModalOpen(false)
    setLoginModalOpen(true)
  }

  // check if email is valid(used to control Get Code button)
  const isEmailValid = form.watch("email") && !form.formState.errors.email

  return (
    <Dialog open={registerModalOpen} onOpenChange={setRegisterModalOpen}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[840px] gap-0 p-0"
      >
        {/* close button */}
        <button
          onClick={() => setRegisterModalOpen(false)}
          className="ring-offset-background absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
        >
          <X className="size-6 cursor-pointer text-[#797A8D]" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-10">
          {/* title */}
          <DialogHeader className="mb-6">
            <DialogTitle className="text-left text-[32px] leading-[39px] font-bold text-[#020328]">
              Sign up
            </DialogTitle>
            <p className="text-left text-[16px] leading-[19px] text-[#020328]">
              Free fundraising platform for nonprofits.
            </p>
          </DialogHeader>

          {/* third-party signup buttons */}
          <div className="mt-8 space-y-3">
            <Button
              variant="outline"
              className="h-10 w-full cursor-pointer justify-start gap-4 rounded-xl border-1 border-[#E9E9E9] pl-[116px] text-[16px] font-medium text-[#020328]"
              onClick={handleGoogleSignup}
            >
              <Image
                src={googleIcon}
                alt="Google"
                width={48}
                height={48}
                className="size-6"
              />
              Sign up with Google
            </Button>

            <Button
              variant="outline"
              className="hidden h-10 w-full cursor-pointer justify-start gap-4 rounded-xl border-1 border-[#E9E9E9] pl-[116px] text-[16px] font-medium text-[#020328]"
              onClick={handleXSignup}
            >
              <Image
                src={xIcon}
                alt="x"
                width={48}
                height={48}
                className="size-6"
              />
              Sign up with X
            </Button>
          </div>

          {/* separator line */}
          <div className="my-6 flex items-center">
            <div className="h-px flex-1 bg-[#E9E9E9]"></div>
            <span className="px-6 text-sm text-[#020328]/50">
              Or continue with Email
            </span>
            <div className="h-px flex-1 bg-[#E9E9E9]"></div>
          </div>

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

          {/* login link */}
          <div className="mt-6 text-center text-[14px] leading-[18px]">
            <span className="text-[#020328]">
              Already have an account yet?{" "}
            </span>
            <button
              onClick={handleSwitchToLogin}
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
