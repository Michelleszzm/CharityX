"use client"

import React, { useState } from "react"
import { toast } from "sonner"

// transaction status enumeration
export enum TransactionStatus {
  IDLE = "idle",
  PENDING = "pending",
  SUCCESS = "success",
  ERROR = "error"
}

// transaction parameters interface
interface TransactionParams {
  blockchain: string
  token: string
  amount: number
  toAddress: string
}

// component Props interface
interface DonationTransactionProps {
  blockchain: string
  onTransactionStateChange: (
    status: TransactionStatus,
    txHash?: string,
    error?: string
  ) => void
  renderTrigger: (
    signTransaction: (params: TransactionParams) => void,
    isLoading: boolean,
    isDisabled: boolean
  ) => React.ReactNode
}

const DonationTransactionProxy: React.FC<DonationTransactionProps> = ({
  onTransactionStateChange,
  renderTrigger
}) => {

  return <div></div>
}

export default DonationTransactionProxy
