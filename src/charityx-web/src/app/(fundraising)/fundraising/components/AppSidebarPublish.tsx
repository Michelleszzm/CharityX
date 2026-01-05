"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FundraisingPublish, submitFundraiseSite } from "@/apis/fundraise"
import { useRef, useState } from "react";
import { getS3UploadUrl } from "@/apis/user";
import { Spinner } from "@/components/ui/spinner";
import { Copy } from "lucide-react"
import { loadFundraising } from "@/store/fundraisingStore";
import { useCopy } from "@/hooks/use-copy";
import CopyButton from "@/app/components/CopyButton";
import { toast } from "sonner";

interface Props {
  value: FundraisingPublish;
  onChange: (newValue: FundraisingPublish) => void;
}

export function AppSidebarPublish({ value, onChange }: Props) {
  const { copied, copy } = useCopy();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  
  const handleSite = (site: string) => {
    onChange({
      ...value,
      site
    });
  }

  const handleEIN = (ein: string) => {
    onChange({
      ...value,
      ein
    });
  }

  const handleMetaTitle = (metaTitle: string) => {
    onChange({
      ...value,
      metaTitle
    });
  }

  const handleMetaDescription = (metaDescription: string) => {
    onChange({
      ...value,
      metaDescription
    });
  }

  const handleMetaKeywords = (metaKeywords: string) => {
    onChange({
      ...value,
      metaKeywords
    });
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const contentType = file.type || "application/octet-stream";
      const res = await getS3UploadUrl({
        contentType
      });
      console.log(res);
      
      await fetch(res.url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
      onChange({
        ...value,
        nftImage: res.fileUrl
      })
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => { 
    try {
      setLoading(true)
      const suc = await submitFundraiseSite({
        site: value.site
      })
      if (!suc) {
        await loadFundraising();
        toast.error("The site name you entered is already taken. Please try another one.");
      }
    } catch (error) {
      console.log(error);
      await loadFundraising();
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="w-full flex flex-col pb-40">
      <div className="text-[#020328] font-bold text-lg self-start px-4 pt-6">
        Publish Settings
      </div>
      <div className="w-[204px] text-[#020328] font-bold text-sm self-start px-4 mt-8">
        Site Address (URL) <span className="text-[#FE5827]">*</span>
      </div>
      <div className="text-[#02032880] text-xs mt-2 px-4">
        Only customize the part after the domain, e.g., https://www.charityx.pro/yourwebsitename
      </div>
      <div className="w-full px-4 mt-4">
        <Input type="text" placeholder="Please enter your site name" value={value.site} onChange={(e) => handleSite(e.target.value)} />
      </div>
      <div className="w-full px-4 mt-4">
        <Button variant="default" className="w-full cursor-pointer bg-[#FE5827] hover:bg-[#FE5827]" disabled={value.site === '' || loading} onClick={handleSubmit}>
          Submit
          {
            loading && (
              <Spinner className="size-4" />
            )
          }
        </Button>
      </div>

      <div className="w-full flex flex-row justify-between items-center mt-2 px-4 text-sm">
        <div className="text-[#1890FF] font-bold line-clamp-2 text-wrap break-words">{process.env.NEXT_PUBLIC_APP_URL}/{value.site}</div>
        
        <div className="flex justify-end mt-1 ml-2">
          <CopyButton text={`${process.env.NEXT_PUBLIC_APP_URL}/${value.site}`} />
        </div>
      </div>

      <div className="w-[204px] text-[#020328] font-bold text-sm self-start px-4 mt-8">
        EIN
      </div>
      <div className="text-[#02032880] text-xs mt-2 px-4">
        Receipt provided to donors as proof of their contribution
      </div>
      <div className="w-full px-4 mt-4">
        <Input type="text" placeholder="Please enter your EIN" value={value.ein} onChange={(e) => handleEIN(e.target.value)} />
      </div>

      <div className="text-[#020328] font-bold text-lg self-start px-4 mt-8">
        Commemorative NFT (Optional)
      </div>
      <div className="text-[#02032880] text-xs mt-2 px-4">
        Upload your NFT image. It will be automatically minted and airdropped to users after a successful donation.
      </div>
      <div className="w-full px-4 mt-4">
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {
          value.nftImage !== "" && (
            <img className="max-w-20 max-h-20 object-cover mb-3" src={value.nftImage} />
          )
        }
        <Button variant="default" className="w-full text-[#1890FF] border border-[#E9E9E9] bg-white hover:bg-white/80 cursor-pointer" onClick={handleButtonClick}>
          Upload NFT
        </Button>
      </div>

      <div className="text-[#020328] font-bold text-lg self-start px-4 mt-8">
        SEO Settings (Optional)
      </div>
      <div className="text-[#02032880] text-xs mt-2 px-4">
        Helps Google and other search engines index your site.
      </div>

      <div className="w-[204px] text-[#020328] font-bold text-sm self-start px-4 mt-8">
        Meta Title
      </div>
      <div className="w-full px-4 mt-2">
        <Input type="text" placeholder="Enter the website title" value={value.metaTitle} onChange={(e) => handleMetaTitle(e.target.value)} />
      </div>

      <div className="w-[204px] text-[#020328] font-bold text-sm self-start px-4 mt-8">
        Meta Description
      </div>
      <div className="w-full px-4 mt-2">
        <Input type="text" placeholder="Enter the website description" value={value.metaDescription} onChange={(e) => handleMetaDescription(e.target.value)} />
      </div>

      <div className="w-[204px] text-[#020328] font-bold text-sm self-start px-4 mt-8">
        Keywords
      </div>
      <div className="w-full px-4 mt-2">
        <Input type="text" placeholder="Enter keywords, separated by “,”" value={value.metaKeywords} onChange={(e) => handleMetaKeywords(e.target.value)} />
      </div>
    </div>
  )
}