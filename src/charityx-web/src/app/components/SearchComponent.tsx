"use client"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function SearchComponent() {
  const show = () => {
    toast("Event has been created.")
  }
  return (
    <>
      <Button className="cursor-pointer" onClick={show}>
        Button
      </Button>
    </>
  )
}
