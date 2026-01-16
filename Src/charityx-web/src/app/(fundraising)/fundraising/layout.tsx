import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/AppSidebar"
import HomeHeader from "@/components/HomeHeader"
import Menu from "./components/Menu"
import { Suspense } from "react"
import InitUser from "@/app/(home)/components/InitUser"

export default function FundraisingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <HomeHeader />
      {/* Main Content */}
      <main className="flex-1 h-[calc(100vh-88px)]">
        <SidebarProvider
          style={{
            "--sidebar-width": "19.5rem",
            "--sidebar-width-mobile": "19.5rem",
          } as React.CSSProperties}
          className="min-h-[calc(100vh-88px)]">
          <div className="w-full flex flex-row h-[calc(100vh-88px)]">
            <div className="relative z-20 h-[calc(100vh-88px)]">
              <div className="h-full flex flex-col w-20 bg-[#FBFBFB] border-r border-r-[#E9E9E9]">
                <Suspense fallback={<div></div>}>
                  <Menu />
                </Suspense>
              </div>
            </div>

            <div className="relative flex-1">
              <div className="flex">
                <Suspense fallback={<div></div>}>
                  <AppSidebar />
                </Suspense>

                <main className="w-full flex-1 h-[calc(100vh-88px)] bg-[#FBFBFB] ">
                  <SidebarTrigger />
                  {children}
                </main>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </main>

      <Suspense fallback={<div></div>}>
        <InitUser />
      </Suspense>
    </div>
  )
}
