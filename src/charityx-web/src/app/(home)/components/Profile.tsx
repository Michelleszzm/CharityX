"use client"

import { X, Search, Upload } from "lucide-react"
import { use, useEffect, useState } from "react"
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
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import useModalStore from "@/store/modalStore"
import useUserStore, { refreshUserInfo } from "@/store/userStore"
import { completeUserInfo, getS3UploadUrl, syncUserInfo } from "@/apis/user"
import { Spinner } from "@/components/ui/spinner"

// const profileSchema = z.object({
//   firstName: z.string().min(1, "First name is required."),
//   lastName: z.string().min(1, "Last name is required."),
//   nonprofit: z.string().min(1, "Please search and select your nonprofit."),
//   proofFile: z
//     .custom<File>()
//     .refine(
//       file => file !== undefined,
//       "Please upload proof of nonprofit status."
//     ),
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters.")
//     .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
//     .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
//     .regex(/[0-9]/, "Password must contain at least one number.")
// })

// now not validate, later need to validate, open the commented above
const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required.")
    .or(z.literal(""))
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required.")
    .or(z.literal(""))
    .optional(),
  nonprofit: z
    .string()
    .min(1, "Please search and select your nonprofit.")
    .or(z.literal(""))
    .optional(),
  proofFile: z
    .custom<File>()
    .refine(
      file => file !== undefined,
      "Please upload proof of nonprofit status."
    )
    .optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .or(z.literal(""))
    .optional()
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function Profile() {
  const {
    profileModalOpen,
    setProfileModalOpen,
    setSubmitSuccessfullyModalOpen
  } = useModalStore()
  const [fileName, setFileName] = useState<string>("")

  const router = useRouter()
  const userInfo = useUserStore((state) => state.userInfo)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      nonprofit: "",
      password: ""
    }
  })

  // listen to the close of the modal, reset the form state
  useEffect(() => {
    if (!profileModalOpen) {
      form.reset()
      setFileName("")
    }
  }, [profileModalOpen, form])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploading(true)
      try {
        const contentType = file.type || "application/octet-stream";
        const res = await getS3UploadUrl({
          contentType
        });
        console.log(res);
        
        await fetch(res.url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });
        setFileName(res.fileUrl)
        form.setValue("proofFile", file, { shouldValidate: true })
      } finally {
        setUploading(false)
      }
    }
  }

  const handleSubmit = async (data: ProfileFormValues) => {
    console.log("submit profile", data)
    try {
      setLoading(true)
      const res = await completeUserInfo({
        firstName: data.firstName,
        lastName: data.lastName,
        nonprofitName: data.nonprofit,
        proofImage: fileName,
        password: data.password,
      });
      await refreshUserInfo();
      setProfileModalOpen(false)
      setSubmitSuccessfullyModalOpen(true)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[840px] gap-0 p-0"
      >
        {/* close button */}
        <button
          onClick={() => setProfileModalOpen(false)}
          className="ring-offset-background absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
        >
          <X className="size-6 cursor-pointer text-[#797A8D]" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-10">
          {/* title */}
          <DialogHeader className="mb-6">
            <DialogTitle className="text-left text-[32px] leading-[39px] font-bold text-[#020328]">
              Start Your Fundraising
            </DialogTitle>
            <p className="text-left text-[16px] leading-[19px] text-[#020328]">
              Complete your info to start fundraising.
            </p>
          </DialogHeader>

          {/* form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="mt-8 space-y-3"
            >
              {/* first name & last name */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[14px] text-[#020328]">
                        First name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="First name"
                          className="h-10 rounded-[8px] border-1 border-[#E9E9E9] text-base placeholder:text-[#C8C8C8]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[14px] text-[#020328]">
                        Last name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Last name"
                          className="h-10 rounded-[8px] border-1 border-[#E9E9E9] text-base placeholder:text-[#C8C8C8]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* search for your nonprofit */}
              <FormField
                control={form.control}
                name="nonprofit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] text-[#020328]">
                      Nonprofit name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="Enter your nonprofit name"
                          className="h-10 rounded-[8px] border-1 border-[#E9E9E9] text-base placeholder:text-[#C8C8C8]"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* proof of nonprofit status */}
              <FormField
                control={form.control}
                name="proofFile"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-[14px] text-[#020328]">
                      Proof of nonprofit status (Supported formats: JPG, PNG)
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-col">
                        <input
                          type="file"
                          id="proofFile"
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        {
                          fileName !== "" && (
                            <img className="max-w-[130px] max-h-[130px] object-cover mb-3" src={fileName} />
                          )
                        }
                        <label
                          htmlFor="proofFile"
                          className="flex cursor-pointer items-center justify-center h-10 rounded-[8px] border-1 border-[#E9E9E9]"
                        >
                            <span className="flex items-center gap-2 text-base font-bold text-[#1890FF]">
                              Upload Image
                              {
                                uploading && (
                                  <Spinner className="size-4" />
                                )
                              }
                            </span>
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* password */}
              {
                userInfo?.sysUserVo.provider !== "GOOGLE" && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[14px] text-[#020328]">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Set your login password"
                            className="h-10 rounded-[8px] border-1 border-[#E9E9E9] text-base placeholder:text-[#C8C8C8]"
                          />
                        </FormControl>
                        <p className="mt-2 text-[12px] text-[#020328]/50">
                          Password must be 8+ chars with upper, lower, and number.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              }

              {/* Submit button */}
              <Button
                type="submit"
                disabled={!form.formState.isValid || loading}
                className="mt-6 h-10 w-full cursor-pointer rounded-[8px] bg-[#FE5827] text-[14px] font-bold text-white hover:bg-[#FE5827] hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit
                {
                  loading && (
                    <Spinner className="size-4" />
                  )
                }
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
