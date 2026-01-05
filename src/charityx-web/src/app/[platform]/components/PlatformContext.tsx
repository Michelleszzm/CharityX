"use client";

import { FundraisingResponse } from "@/apis/fundraise";
import { createContext, useContext } from "react";

interface Props {
  children: React.ReactNode
  platformData: PlatformContextValue
}


interface PlatformContextValue {
  code: number;
  success: boolean;
  data: FundraisingResponse;
}

const PlatformContext = createContext<PlatformContextValue | undefined>(undefined);

export const PlatformProvider: React.FC<Props> = ({ children, platformData }) => {
  return (
    <PlatformContext.Provider value={platformData}>
      {children}
    </PlatformContext.Provider>
  );
}


export const usePlatformData = (): PlatformContextValue => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};