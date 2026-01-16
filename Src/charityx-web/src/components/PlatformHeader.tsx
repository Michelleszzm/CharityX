"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import logoImage from "@/assets/logo.png"
import { useState, useEffect, useMemo } from "react"
import { usePathname, useParams, notFound } from "next/navigation"
import { usePlatformData } from "@/app/[platform]/components/PlatformContext"

interface Props {
}
export default function PlatformHeader({ }: Props) {
  const platformData = usePlatformData();
  console.log(platformData)
  if (!platformData) notFound();
  if (platformData.code !== 200) notFound();
  const pathname = usePathname()
  const params = useParams()
  const platform = params.platform as string

  const menuList = useMemo(
    () => [
      {
        name: "Donate",
        href: `/${platform}`
      },
      {
        name: "Donation Overview",
        href: `/${platform}/dashboard`
      },
      {
        name: "Receipts & NFTs",
        href: `/${platform}/receipts`
      }
    ],
    [platform]
  )

  const [activeMenu, setActiveMenu] = useState("")

  useEffect(() => {
    const currentMenu = menuList.find(item => item.href === pathname)
    if (currentMenu) {
      setActiveMenu(currentMenu.name)
    }
  }, [pathname, menuList])

  const handleMenuClick = (name: string) => {
    setActiveMenu(name)
  }
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex h-18 items-center justify-between pr-16 pl-8">
        <div className="flex items-center">
          {
            platformData.data.styleValue.organizationLogo !== "" && (
              <img
                src={platformData.data.styleValue.organizationLogo}
                alt="logo"
                width={564}
                height={80}
                className="h-10 w-auto"
              />
            )
          }
          {
            platformData.data.styleValue.organizationLogo === "" && (
              <div className="h-10 w-auto font-bold flex justify-center items-center text-xl">{platformData.data.styleValue.organizationName !== "" ? platformData.data.styleValue.organizationName : "Your logo"}</div>
            )
          }
        </div>
        <div className="flex items-center">
          <nav className="hidden md:flex">
            {menuList.map(item => {
              const isActive = activeMenu === item.name
              return (
                <Link
                  key={item.name}
                  onClick={() => handleMenuClick(item.name)}
                  href={item.href}
                  style={{ color: isActive ? platformData.data.styleValue.chooseColor : "" }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = platformData.data.styleValue.chooseColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isActive ? platformData.data.styleValue.chooseColor : "";
                  }}
                  className={cn(
                    "relative ml-16 flex cursor-pointer text-sm text-[#000000]/80",
                    isActive ? "font-bold" : ""
                  )}
                >
                  <div className="flex flex-col items-center">
                    <div>{item.name}</div>
                    {isActive && (
                      <div style={{ backgroundColor: platformData.data.styleValue.chooseColor }} className="absolute bottom-[-6px] h-[2px] w-10 rounded-[8px]"></div>
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
