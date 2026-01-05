import HomeHeader from "@/components/HomeHeader"
import HomeFooter from "@/components/HomeFooter"
import Login from "./components/Login"
import Register from "./components/Register"
import Profile from "./components/Profile"
import SubmitSuccessfully from "./components/submitSuccessfully"
import InitUser from "./components/InitUser"
import ResetPassword from "./components/ResetPassword"
import ChangePassword from "./components/ChangePassword"
import { Suspense } from "react"

export default function HomeLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FBFBFB] dark:bg-gray-900">
      <Suspense fallback={<div></div>}>
        <InitUser />
      </Suspense>
      
      <HomeHeader />
      {/* Main Content */}
      <main className="min-h-[calc(100vh-88px-240px)]">{children}</main>
      <HomeFooter />
      {/* global login modal */}
      <Login />
      {/* global register modal */}
      <Register />
      {/* global profile modal */}
      <Profile />
      {/* global submit successfully modal */}
      <SubmitSuccessfully />
      
      <ResetPassword />
      <ChangePassword />
    </div>
  )
}
