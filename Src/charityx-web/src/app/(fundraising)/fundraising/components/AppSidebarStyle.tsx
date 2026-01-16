"use client"

import Image from "next/image"
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react"
import { useRef, useState } from "react"
import { AppSidebarColor } from "./AppSidebarColor";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import { FundraisingStyle } from "@/apis/fundraise";
import { getS3UploadUrl } from "@/apis/user";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";


interface Props {
  value: FundraisingStyle;
  onChange: (newValue: FundraisingStyle) => void;
}

export function AppSidebarStyle({ value, onChange }: Props) {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const handleOrganizationName = (organizationName: string) => {
    onChange({
      ...value,
      organizationName
    });
  }

  const handleColor = (chooseColor: string) => {
    onChange({
      ...value,
      chooseColor
    });
  }
  const handleMainTitle = (mainTitle: string) => {
    onChange({
      ...value,
      mainTitle
    });
  }
  const handleSubtitle = (subtitle: string) => {
    onChange({
      ...value,
      subtitle
    });
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      
      const file = event.target.files?.[0];
      if (file) {
        setUploading(true);
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

        const organizationLogo = res.fileUrl;
        onChange({
          ...value,
          organizationLogo
        });
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
    <div className="text-[#020328] font-bold text-lg self-start px-3 py-6">
      Style Settings
    </div>
    <div className="text-[#020328] font-bold text-sm self-start px-3">
      Organization Name <span className="text-[#FE5827]">*</span>
    </div>
    <div className="w-full px-3">
      <Input type="text" placeholder="Organization Name" value={value.organizationName} onChange={(e) => handleOrganizationName(e.target.value)} />
    </div>
    <div className="text-[#020328] font-bold text-sm self-start px-3 mt-8">
      Organization Logo
    </div>
    <div className="w-full flex flex-col px-3 gap-4">
      <Input id="picture" ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      {
        value.organizationLogo !== "" && (
          <img
              src={value.organizationLogo}
              alt="logo"
              width={200}
              height={40}
              className="h-10 w-auto my-2"
            />
        )
      }
      <Button disabled={uploading} variant="default" className="w-full text-[#1890FF] border border-[#E9E9E9] bg-white hover:bg-white/80 cursor-pointer" onClick={handleButtonClick}>
        Upload Logo
        {
          uploading && (
            <Spinner className="size-4" />
          )
        }
      </Button>
    </div>
    <div className="text-[#020328] font-bold text-sm self-start px-3 mt-8">
      Choose Color <span className="text-[#FE5827]">*</span>
    </div>
    <div className="px-3 mt-3">
      <AppSidebarColor color={value.chooseColor} onChange={(color) => handleColor(color)} />
    </div>
    <div className="text-[#020328] font-bold text-sm self-start px-3 mt-8">
      Main Title <span className="text-[#FE5827]">*</span>
    </div>
    <div className="w-full px-3">
      <InputGroup>
        <InputGroupTextarea placeholder="Main Title" value={value.mainTitle} onChange={(e) => handleMainTitle(e.target.value)} />
      </InputGroup>
    </div>
    <div className="text-[#020328] font-bold text-sm self-start px-3 mt-8">
      Subtitle <span className="text-[#FE5827]">*</span>
    </div>
    <div className="w-full px-3">
      <InputGroup>
        <InputGroupTextarea placeholder="Subtitle" value={value.subtitle} onChange={(e) => handleSubtitle(e.target.value)} />
      </InputGroup>
    </div>
    </>
  )
}