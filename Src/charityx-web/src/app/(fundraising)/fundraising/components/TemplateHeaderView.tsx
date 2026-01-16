"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import React from "react";

import templatePublishSuccessIcon from "@/assets/home/ic_template_publish_success.png"
import templatePublishErrorIcon from "@/assets/home/ic_template_publish_error.png"

interface TemplateHeaderViewData {
  id: number
  title: string
  choosed: boolean 
}
interface Props {
  value: TemplateHeaderViewData[];
}

export function TemplateHeaderView({ value }: Props) {
  
  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="text-[#1890FF] cursor-pointer text-sm">View</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-4 text-[#1890FF] text-sm font-bold" align="end">
          <div className="flex flex-col gap-4">
            {
              value.map((item) =>(
                <div key={item.id} className="flex flex-row items-center justify-between">
                  {item.title}
                  <Image
                    src={item.choosed ? templatePublishSuccessIcon : templatePublishErrorIcon}
                    alt="TemplatePublishSuccess"
                    width={18}
                    height={18}
                    className="size-4.5"
                  />
                </div>
              ))
            }
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
  );
}