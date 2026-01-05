"use client"

import Image from "next/image"
import { Check, MoveLeft, MoveRight } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

// preset colors
const PRESET_COLORS = [
  { name: "Blue", value: "#2777FF" },
  { name: "Green", value: "#0BBA77" },
  { name: "Yellow", value: "#FFBF47" },
  { name: "Orange", value: "#FE5827" },
  { name: "Purple", value: "#826BF4" },
  { name: "Brown", value: "#965C23" },
  { name: "Gray", value: "#4D4D4D" }
]

// form validation rules
const styleSettingsSchema = z.object({
  organizationName: z.string().min(1, "Organization name is required."),
  logoFile: z.custom<File>().optional(),
  color: z.string().min(1, "Please choose a color."),
  mainTitle: z.string().min(1, "Main title is required."),
  subtitle: z.string().min(1, "Subtitle is required.")
})

type StyleSettingsFormValues = z.infer<typeof styleSettingsSchema>

export default function StyleSettings({
  currentTemplate,
  setCurrentStep
}: {
  currentTemplate: any
  setCurrentStep: (step: number) => void
}) {
  const [fileName, setFileName] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>(
    PRESET_COLORS[0].value
  )

  const form = useForm<StyleSettingsFormValues>({
    resolver: zodResolver(styleSettingsSchema),
    mode: "onChange",
    defaultValues: {
      organizationName: "Super Joey Foundation",
      color: PRESET_COLORS[0].value,
      mainTitle: "Donate in Crypto, Empower Every Cause",
      subtitle:
        "With just a tap, your kindness reaches instantly. Let every crypto coin become a force for change."
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      form.setValue("logoFile", file, { shouldValidate: true })
    }
  }

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    form.setValue("color", color, { shouldValidate: true })
  }

  const handleSubmit = (data: StyleSettingsFormValues) => {
    console.log("submit style settings", data)
    // TODO: implement submit logic
    setCurrentStep(3)
  }

  return (
    <div className="mt-12 px-6">
      <div className="flex gap-12">
        <div className="w-[812px]">
          <div className="text-[18px] leading-[22px] font-bold text-[#020328]">
            Style Preview
          </div>
          <div
            className="mt-6 h-[476px] w-full overflow-hidden rounded-[8px] bg-[#FBFBFB]"
            style={{
              border: "1px solid #E9E9E9"
            }}
          >
            <Image
              src={currentTemplate}
              alt="currentTemplate"
              width={1576}
              height={924}
              className="h-full w-full"
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[18px] leading-[22px] font-bold text-[#020328]">
            Style Settings
          </div>

          {/* form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="mt-6 space-y-4"
            >
              {/* organization name */}
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-bold text-[#020328]">
                      Organization Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Organization Name"
                        className="h-10 rounded-[8px] border-1 border-[#E9E9E9] text-base placeholder:text-[#C8C8C8]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* organization logo */}
              <FormField
                control={form.control}
                name="logoFile"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-bold text-[#020328]">
                      Organization Logo
                    </FormLabel>
                    <FormControl>
                      <div className="relative h-10 rounded-[8px] border-1 border-[#E9E9E9]">
                        <input
                          type="file"
                          id="logoFile"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*"
                        />
                        <label
                          htmlFor="logoFile"
                          className="flex h-full cursor-pointer items-center justify-center"
                        >
                          {fileName ? (
                            <span className="text-[14px] font-bold text-[#020328]">
                              {fileName}
                            </span>
                          ) : (
                            <span className="text-[14px] font-bold text-[#1890FF]">
                              Upload Logo
                            </span>
                          )}
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* choose color */}
              <FormField
                control={form.control}
                name="color"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-bold text-[#020328]">
                      Choose Color
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-3">
                        {PRESET_COLORS.map(color => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => handleColorSelect(color.value)}
                            className="relative size-10 cursor-pointer rounded-[8px] transition-all hover:scale-110"
                            style={{ backgroundColor: color.value }}
                            aria-label={color.name}
                          >
                            {selectedColor === color.value && (
                              <Check className="absolute top-1/2 left-1/2 size-6 -translate-x-1/2 -translate-y-1/2 text-white" />
                            )}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* main title */}
              <FormField
                control={form.control}
                name="mainTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-bold text-[#020328]">
                      Main Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Main Title"
                        className="h-10 rounded-[8px] border-1 border-[#E9E9E9] text-base placeholder:text-[#C8C8C8]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* subtitle */}
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-bold text-[#020328]">
                      Subtitle
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Subtitle"
                        className="h-[94px] rounded-[8px] border-1 border-[#E9E9E9] text-base placeholder:text-[#C8C8C8]"
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
      <div className="mt-12 flex items-center justify-center gap-18">
        <Button
          type="button"
          variant="outline"
          className="h-[40px] w-[141px] cursor-pointer rounded-[8px] border-[#E9E9E9]"
          onClick={() => setCurrentStep(1)}
        >
          <MoveLeft className="size-5 font-bold text-[#020328]" />
          <div className="text-[16px] font-bold text-[#020328]">Previous</div>
        </Button>
        <Button
          type="button"
          variant="default"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
          onClick={() => form.handleSubmit(handleSubmit)()}
          className="h-[40px] w-[372px] cursor-pointer rounded-[8px] bg-[#FE5827] hover:bg-[#FE5827]/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="text-[16px] font-bold text-white">
            {form.formState.isSubmitting
              ? "Submitting..."
              : "Save and Continue"}
          </div>
          <MoveRight className="size-5 font-bold text-white" />
        </Button>
      </div>
    </div>
  )
}
