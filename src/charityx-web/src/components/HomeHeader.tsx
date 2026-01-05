"use client"

import Link from "next/link"
import Image from "next/image"
import { useMemo } from "react"
import { cn } from "@/lib/utils"
import logoImage from "@/assets/home/logo.png"
import photoImage from "@/assets/home/photo.png"
import signOutImage from "@/assets/home/signOut.png"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import useModalStore from "@/store/modalStore"
import useUserStore, { logout } from "@/store/userStore"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { TooltipArrow } from "@radix-ui/react-tooltip"

export default function HomeHeader() {
  const pathname = usePathname()
  const { setLoginModalOpen, setRegisterModalOpen, setProfileModalOpen, setSubmitSuccessfullyModalOpen } = useModalStore()
  const userInfo = useUserStore((state) => state.userInfo);
  const isLogined = useUserStore((state) => state.isLogined);
  const router = useRouter()
  const menuList = useMemo<any[]>(() => {
    const baseMenu = [
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
    if (userInfo && isLogined && userInfo.sysUserVo.roles.includes("ROLE_ADMIN")) {
      baseMenu.push({
        name: "Applications",
        href: "/applications"
      })
    }
    return baseMenu
  }, [isLogined, userInfo]);

  const handleLogin = () => {
    setLoginModalOpen(true)
  }

  const handleProfile = () => {
    setActiveMenu("/profile")
    router.push("/profile")

  }
  const handleLogout = () => {
    // setIsLogin(false)
    // setAccount("")
    logout()
    router.push("/")
  }
  const handleRegister = () => {
    setRegisterModalOpen(true)
  }

  const [activeMenu, setActiveMenu] = useState("")

  useEffect(() => {
    const currentMenu = menuList.find(item => item.href === pathname)
    if (currentMenu) {
      setActiveMenu(currentMenu.name)
    }
  }, [pathname, menuList])

  const handleMenuClick = (name: string) => {
    // console.log("userInfo.charityNonprofitVo", userInfo?.charityNonprofitVo)
    // if (name === "/fundraising" || name === "/management" || name === "/reports") {
    //   if (userInfo && !userInfo.charityNonprofitVo) {
    //     setProfileModalOpen(true)
    //     return;
    //   }
    // }
    setActiveMenu(name)
  }

  const handleMenuClickWithoutLogin = (name: string) => {
    if (!isLogined) {
      setRegisterModalOpen(true);
      return;
    }
    console.log(name)
    if (name === "Fundraising" || name === "Donors" || name === "Reports") {
      if (userInfo && !userInfo.charityNonprofitMergeVo) {
        setProfileModalOpen(true)
        return;
      }
      if (userInfo && userInfo.charityNonprofitMergeVo && !userInfo.charityNonprofitMergeVo.isActive) {
        setSubmitSuccessfullyModalOpen(true)
        return;
      }
    }
    // setProfileModalOpen(true);
  }
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex h-22 items-center justify-between px-8">
        <div className="flex items-center">
          <div className="mr-10 flex items-center xl:mr-15 2xl:mr-20">
            <Image
              src={logoImage}
              alt="CharityX"
              width={356}
              height={80}
              className="h-10 w-auto cursor-pointer"
              onClick={() => router.push("/")}
            />
          </div>
          <div className="flex items-center">
            <nav className="hidden space-x-8 md:flex xl:space-x-12 2xl:space-x-16">
              {menuList.map(item => {
                const isActive = activeMenu === item.name
                const commonClassName = cn(
                  "relative flex cursor-pointer text-[18px] text-[#020328]/80 hover:text-[#FE5827]",
                  isActive ? "font-bold text-[#FE5827]" : ""
                )

                // logged in: all menus render Link
                if (isLogined && userInfo && userInfo.charityNonprofitMergeVo && userInfo.charityNonprofitMergeVo.isActive) {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => handleMenuClick(item.name)}
                      className={commonClassName}
                    >
                      <div className="flex flex-col items-center">
                        <div>{item.name}</div>
                      </div>
                    </Link>
                  )
                }

                // not logged in + home + about: render Link (allow access)
                if (item.href === "/" || item.href === "/about" || item.href === "/applications") {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => handleMenuClick(item.name)}
                      className={commonClassName}
                    >
                      <div className="flex flex-col items-center">
                        <div>{item.name}</div>
                      </div>
                    </Link>
                  )
                }

                // not logged in + other pages: render button + modal
                return (
                  <button
                    key={item.name}
                    onClick={() => handleMenuClickWithoutLogin(item.name)}
                    className={commonClassName}
                  >
                    <div className="flex flex-col items-center">
                      <div>{item.name}</div>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
        {!isLogined && (
          <div className="flex items-center">
            {/* login button */}
            <Button
              onClick={handleLogin}
              className="mr-4 h-10 w-[90px] cursor-pointer rounded-[6px] border-[1px] border-solid border-[#FE5827] bg-white text-[16px] font-bold text-[#FE5827] hover:bg-white hover:opacity-70"
            >
              Sign in
            </Button>
            {/* register button */}
            <Button
              onClick={handleRegister}
              className="h-10 w-[163px] cursor-pointer rounded-[6px] bg-[#FE5827] text-[16px] font-bold text-white hover:bg-[#FE5827] hover:opacity-70"
            >
              Sign up for free
            </Button>
          </div>
        )}
        {isLogined && (
          <div className="flex cursor-pointer items-center gap-6">
            <Image
              src={photoImage}
              alt="photo"
              width={64}
              height={64}
              className="size-8"
              onClick={() => handleProfile()}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Image
                  src={signOutImage}
                  alt="signOut"
                  width={64}
                  height={64}
                  className="size-8 cursor-pointer"
                  onClick={handleLogout}
                />
              </TooltipTrigger>
              <TooltipContent
                sideOffset={4}
                className="bg-white text-foreground border-border cursor-pointer border py-2"
                onClick={handleLogout}
              >
                Sign out
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </header>
  )
}
