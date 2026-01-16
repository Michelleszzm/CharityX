

import Image from "next/image"
import platformNotFoundIcon from "@/assets/home/ic_platform_notfound.png"

export default function PlatformNotFound() {
  return (
    <div className="mt-40 m-auto flex flex-col items-center justify-center">
      <Image
        src={platformNotFoundIcon}
        alt="not found"
        width={300}
        height={120}
        className="w-[300px] h-[120px]"
      />
      <div className="mt-6 text-2xl font-bold text-[#000000FF]">Oops! Page not found.</div>
      <div className="mt-2 text-sm text-[#02032880]">It looks like this page has disappeared or never existed.</div>
    </div>
  )
}
