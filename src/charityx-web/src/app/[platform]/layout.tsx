import PlatformHeader from "@/components/PlatformHeader"
import { headers } from "next/headers";
import React from "react";
import { PlatformProvider } from "./components/PlatformContext";
import { notFound } from "next/navigation";

interface LayoutProps {
  children: any;
  params: Promise<{ platform: string }>;
}

export default async function PlatformLayout({ children, params }: LayoutProps) {
  const { platform } = await params; 
  console.log(process.env.BUILD_ENV, process.env.NEXT_PUBLIC_BASE_API, platform)

  const res = await fetch(`${process.env.ROUTE_API_URL}/api/proxy/${platform}`, { cache: "no-store" });
  const platformData = await res.json();
  console.log(platformData)
  if (!platformData) notFound();
  if (platformData.code !== 200) notFound();
  
  return (
    <PlatformProvider platformData={platformData}>
      <div className="h-screen bg-[#FBFBFB] dark:bg-gray-900">
        <PlatformHeader />

        {/* Platform Content */}
        {children}
      </div>
    </PlatformProvider>

  )
}
