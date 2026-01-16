"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import { loginWithToken } from "@/store/userStore"
import { toast } from "sonner";
import useModalStore from "@/store/modalStore";

export default function InitUser() {

  const router = useRouter()
  const searchParams = useSearchParams()
  const { setProfileModalOpen } = useModalStore()

  useEffect(() => {
    const isSuccess = searchParams.get('isSuccess')
    const token = searchParams.get('token')
    if (isSuccess === "false") {
      toast.error("Login failed");
    }
    login(token);
  }, [searchParams]);

  const login = async (token: string | null) => {
    const googleLogin = Boolean(token && token !== "")
    console.log("isSuccess", googleLogin)
    let toastId = undefined;
    try {
      if (googleLogin) {
        toastId = toast.loading("Google Login...");
        let user = await loginWithToken(token);
        if (user && !user.charityNonprofitMergeVo) {
          setProfileModalOpen(true)
        }
      } else {
        await loginWithToken(token);
      }
      
    } catch (e) {
      toast.error("Login failed");
    } finally {
      console.log("finally isSuccess", googleLogin)
      if (googleLogin) {
        toast.dismiss(toastId);
        router.replace('/')
      }
    }
  };

  return null;
}
