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
import passwordIcon from "@/assets/home/password.png"
import { resetPasswordConfirm } from "@/apis/user"
import { toast } from "sonner"

const registerSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be 8+ chars with upper, lower, and number.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),
  confirmPassword: z.string().min(1, "Please confirm your password."),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match.",
});

type RegisterFormValues = z.infer<typeof registerSchema>

export default function ChangePassword() {
  const { changePasswordModalOpen, setChangePasswordModalOpen, setLoginModalOpen } =
    useModalStore()
  const param = useModalStore((state) => state.resetPasswordParam)
  const router = useRouter()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange", // real-time validation
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  // listen to the close of the modal, reset the form state
  // listen to the close of the modal, reset the form state and countdown
  useEffect(() => {
    if (!changePasswordModalOpen) {
      form.reset()
    }
  }, [changePasswordModalOpen, form])

  const handleChangePassword = (data: RegisterFormValues) => {
    console.log("email signup", data, param)
    // const email = form.getValues("email")
    const password = form.getValues("password")
    const confirmPassword = password;
    let email = param.email;
    let token = param.token;
    resetPasswordConfirm({ token, email, password, confirmPassword }).then((res) => {
      console.log("send code result:", res)
      setChangePasswordModalOpen(false)
      toast.success("Your password has been reset successfully!")
    }).catch((err: any) => {
      console.log("send code error:", err)
    })
  }

  return (
    <Dialog open={changePasswordModalOpen} onOpenChange={setChangePasswordModalOpen}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[840px] gap-0 p-0"
      >
        {/* close button */}
        <button
          onClick={() => setChangePasswordModalOpen(false)}
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
              Please enter your new password
            </p>
          </DialogHeader>

          {/* email verification code input form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleChangePassword)}
              className="space-y-3"
            >
              {/* email input */}
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
                          placeholder="New Password"
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
                name="confirmPassword"
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
                          placeholder="Confirm Password"
                          className="h-10 rounded-[8px] border-1 pl-10 text-base"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Next button */}
              <Button
                type="submit"
                disabled={!form.formState.isValid}
                className="mt-3 h-10 w-full cursor-pointer rounded-[8px] bg-[#FE5827] text-[14px] font-bold text-white hover:bg-[#FE5827] hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </Button>
            </form>
          </Form>
          
        </div>
      </DialogContent>
    </Dialog>
  )
}
