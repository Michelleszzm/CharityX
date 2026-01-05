"use client"

import React from "react";

interface Props {
  value: number;
}

export function TemplateHeaderProgress({ value }: Props) {
  
  return (
      <div className="flex flex-row items-center text-sm text-[#020328]">
        <div className="">Progress</div>
        <div className="w-37.5 h-3 rounded-[12px] bg-[#E9E9E9] ml-2">
          <div className="h-3 rounded-[12px] bg-[#FE5827]" style={{ width: value*150/100 }}></div>
        </div>
        <div className="ml-2 font-bold">{value}%</div>
      </div>
  );
}