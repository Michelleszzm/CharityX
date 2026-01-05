import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import ethereumIcon from "@/assets/wallet/ETH.png"
import solanaIcon from "@/assets/wallet/SOL.png"
import bitcoinIcon from "@/assets/wallet/BTC.png"
import usdtIcon from "@/assets/wallet/USDT.png"
import usdcIcon from "@/assets/wallet/USDC.png"
import daiIcon from "@/assets/wallet/DAI.png"
import { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const isDebugEnvironment = () => {
    return process.env.BUILD_ENV !== "production";
};

export const log = (message?: any, ...optionalParams: any[]): void => {
    if (!isDebugEnvironment()) {
        return;
    }
    console.log(message, ...optionalParams);
};

  // format date display
export const formatDate = (time: number | string) => {
    const date = new Date(time)
    return date
        .toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
        })
        .replace(/\//g, "-")
}


export const formatAddress = (address: string) => {
  if (address.length <= 8) {
    return address
  }
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export const formatTxHash = (hash: string) => {
  if (hash.length <= 10) {
    return hash
  }
  return `${hash.slice(0, 6)}...${hash.slice(-4)}}`
}
export const formatAmount = (amount: number) => {
  if (amount) {
    return `$${amount.toFixed(2)}`  
  }
  return `$ 0`
}
export const formatGender = (gender: number) => {
  if (gender === 1) {
    return "Male" 
  } else if (gender === 2) {
    return "Female" 
  }
  return ''
}

export const generateCurrentMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${m}`;
}

export const generateLast7Days = (): string[] => {
  const now = new Date();
  const format = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  const today = format(now);

  const last7 = new Date();
  last7.setDate(now.getDate() - 7);
  const last7day = format(last7);
  return [ today, last7day ];
}


export const generateLast30Days = (): string[] => {
  const now = new Date();
  const format = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  const today = format(now);

  const last30 = new Date();
  last30.setDate(now.getDate() - 30);
  const last30day = format(last30);
  return [ today, last30day ];
}

export const tokenIcons = {
  USDT: usdtIcon,
  USDC: usdcIcon,
  BTC: bitcoinIcon,
  ETH: ethereumIcon,
  DAI: daiIcon,
  SOL: solanaIcon
}

export const saveImage = async (imageUrl: string, fileName = "image.png") => {
  try {
    const response = await fetch(imageUrl, { mode: 'cors' });
    const blob = await response.blob();

    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

    // showToast("success", "Copy Success!", 2000);
  } catch (err) {
    console.error("Failed to download image: ", err);
  }
}

export const saveImageWithSite = async (site: string, imageUrl: string, fileName = "image.png") => {
  try {
    const response = await fetch(imageUrl, 
      { mode: 'cors',
        headers: {
          "site": site,
        }
       });
    if (response.status === 404) {
      toast.error("Transaction Hash not found");
      return;
    } else if (response.status !== 200) {
      toast.error("Failed to download receipt");
      return;
    }
    const blob = await response.blob();

    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

    // showToast("success", "Copy Success!", 2000);
  } catch (err) {
    console.error("Failed to download image: ", err);
  }
}