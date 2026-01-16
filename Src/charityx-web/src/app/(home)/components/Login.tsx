"use client"

import Image from "next/image"
import { X } from "lucide-react"
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
import useUserStore, { loginToServiceWithPassword } from "@/store/userStore"
import emailIcon from "@/assets/home/email.png"
import passwordIcon from "@/assets/home/password.png"
import xIcon from "@/assets/home/X1.png"
import googleIcon from "@/assets/home/google.png"
import { Spinner } from "@/components/ui/spinner"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be 8+ chars with upper, lower, and number.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const { loginModalOpen, setLoginModalOpen, setRegisterModalOpen, setResetPasswordModalOpen, setProfileModalOpen } =
    useModalStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // real-time validation
    defaultValues: {
      email: "",
      password: ""
    }
  })

  // listen to the close of the modal, reset the form state
  useEffect(() => {
    if (!loginModalOpen) {
      form.reset()
    }
  }, [loginModalOpen, form])

  const handleGoogleLogin = () => {
    console.log("Google login")
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_API}unAuth/oauth2/authorize/google`;
  }

  const handleXLogin = () => {
    console.log("X login")
  }

  const handleEmailLogin = (data: LoginFormValues) => {
    console.log("email login", data)
    setLoading(true)
    // TODO: implement email login logic
    loginToServiceWithPassword(data.email, data.password).then((user) => {
      console.log("login with code result:", user)
      setLoginModalOpen(false)
      if (user && !user.charityNonprofitMergeVo) {
        setProfileModalOpen(true)
      }
    }).catch((err: any) => {
      console.log("login with code error:", err)
    }).finally(() => {
      setLoading(false)
    })
  }
  const handleForgotPassword = () => {
    setLoginModalOpen(false)
    setResetPasswordModalOpen(true)
  }


  return (
    <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[840px] gap-0 p-0"
      >
        {/* close button */}
        <button
          onClick={() => setLoginModalOpen(false)}
          className="ring-offset-background absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
        >
          <X className="size-6 cursor-pointer text-[#797A8D]" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-10">
          {/* title */}
          <DialogHeader className="mb-6">
            <DialogTitle className="text-left text-[32px] leading-[39px] font-bold text-[#020328]">
              Sign in
            </DialogTitle>
            <p className="text-left text-[16px] leading-[19px] text-[#020328]">
              Free fundraising platform for nonprofits.
            </p>
          </DialogHeader>

          {/* third-party login buttons */}
          <div className="mt-8 space-y-3">
            <Button
              variant="outline"
              className="h-10 w-full cursor-pointer justify-start gap-4 rounded-xl border-1 border-[#E9E9E9] pl-[116px] text-[16px] font-medium text-[#020328]"
              onClick={handleGoogleLogin}
            >
              <Image
                src={googleIcon}
                alt="Google"
                width={48}
                height={48}
                className="size-6"
              />
              Sign in with Google
            </Button>

            <Button
              variant="outline"
              className="hidden h-10 w-full cursor-pointer justify-start gap-4 rounded-xl border-1 border-[#E9E9E9] pl-[116px] text-[16px] font-medium text-[#020328]"
              onClick={handleXLogin}
            >
              <Image
                src={xIcon}
                alt="x"
                width={48}
                height={48}
                className="size-6"
              />
              Sign in with X
            </Button>
          </div>

          {/* separator line */}
          <div className="my-6 flex items-center">
            <div className="h-px flex-1 bg-[#E9E9E9]"></div>
            <span className="px-6 text-sm text-[#020328]/50">
              or continue with Email
            </span>
            <div className="h-px flex-1 bg-[#E9E9E9]"></div>
          </div>

          {/* email password input form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleEmailLogin)}
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

              {/* password input */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Image
                          src={passwordIcon}
                          alt="Password"
                          width={32}
                          height={32}
                          className="absolute top-1/2 left-4 size-4 -translate-y-1/2"
                        />
                        <Input
                          {...field}
                          type="password"
                          placeholder="Password"
                          className="h-10 rounded-[8px] border-1 pl-10 text-base"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* forgot password */}
              <div className="text-left">
                <button
                  type="button"
                  className="text-[14px] leading-[18px] text-[#1890FF] hover:underline" onClick={() => handleForgotPassword()}
                >
                  Forgot password?
                </button>
              </div>

              {/* login button */}
              <Button
                type="submit"
                disabled={!form.formState.isValid || loading}
                className="mt-3 h-10 w-full cursor-pointer rounded-[8px] bg-[#FE5827] text-[14px] font-bold text-white hover:bg-[#FE5827] hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sign in
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
            <span className="text-[#020328]">Don't have an account? </span>
            <button
              onClick={() => {
                setLoginModalOpen(false)
                setRegisterModalOpen(true)
              }}
              className="font-bold text-[#1890FF] hover:underline"
            >
              Sign up
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
