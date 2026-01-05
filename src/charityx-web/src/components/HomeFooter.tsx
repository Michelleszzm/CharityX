"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import useModalStore from "@/store/modalStore"
import useUserStore from "@/store/userStore"
import Image from "next/image"

import logoImage from "@/assets/home/logo.png"
import facebookImage from "@/assets/home/facebook.png"
import xImage from "@/assets/home/X.png"
import instagramImage from "@/assets/home/instagram.png"

export default function HomeFooter() {
  const pathname = usePathname()
  const isLogined = useUserStore((state) => state.isLogined)
  const { setRegisterModalOpen } = useModalStore()

  const menuList = [
    {
      name: "Home",
      href: "/"
    },
    {
      name: "Fundraising",
      href: "/fundraising"
    },
    {
      name: "Donors",
      href: "/management"
    },
    {
      name: "Reports",
      href: "/reports"
    },
    {
      name: "About",
      href: "/about"
    }
  ]

  const contentList = [
    {
      title: "Facebook",
      icon: facebookImage
    },
    {
      title: "X",
      icon: xImage
    },
    {
      title: "Instagram",
      icon: instagramImage
    }
  ]
  return (
    <footer className="flex h-[240px] flex-col items-center justify-between">
      <div className="flex flex-1 items-center justify-center gap-[211px]">
        <div>
          <Image
            src={logoImage}
            alt="CharityX"
            width={356}
            height={80}
            className="h-auto w-[178px]"
          />
          <div className="mt-4 text-[16px] leading-[19px] text-[#020328]/50">
            © 2025 CharityX.pro, All rights reserved.
          </div>
        </div>

        <div className="flex flex-col">
          {menuList.map(item => {
            const commonClassName = cn(
              "text-[16px] leading-[32px] text-[#020328] hover:text-[#FE5827] cursor-pointer min-w-[166px] text-start",
              pathname === item.href ? "hidden" : ""
            )
            if (isLogined) {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={commonClassName}
                >
                  {item.name}
                </Link>
              )
            }
            if (item.href === "/" || item.href === "/about") {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={commonClassName}
                >
                  {item.name}
                </Link>
              )
            } else {
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setRegisterModalOpen(true)
                  }}
                  className={commonClassName}
                >
                  {item.name}
                </button>
              )
            }
          })}
        </div>
        <div className="flex flex-col">
          {contentList.map(item => (
            <div
              key={item.title}
              className={cn(
                "flex cursor-pointer items-center text-[16px] leading-[48px] text-[#020328] hover:opacity-50"
              )}
            >
              <Image
                src={item.icon}
                alt={item.title}
                width={28}
                height={28}
                className="mr-2 size-[14px]"
              />
              {item.title}
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
