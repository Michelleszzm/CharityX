"use client"

import React, { useState } from "react"
import { useAccount } from "@ant-design/web3"
import { parseAbi, parseUnits } from "viem"
import {
  useChainId,
  useSwitchChain,
  useWriteContract,
  useSendTransaction
} from "wagmi"
import {
  getTokenConfig,
  isNativeToken,
  getTxScanUrl
} from "@/constants/tokenConfig"
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

const DonationTransaction: React.FC<DonationTransactionProps> = ({
  onTransactionStateChange,
  renderTrigger
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { writeContractAsync } = useWriteContract()
  const { sendTransactionAsync } = useSendTransaction()

  const { switchChain } = useSwitchChain()
  const chainId = useChainId()
  const { account } = useAccount()

  // ERC20 token transfer ABI
  const ERC20_ABI = parseAbi([
    "function transfer(address to, uint256 amount) returns (bool)"
  ])

  // check and switch network
  const ensureCorrectNetwork = async (
    targetChainId: number
  ): Promise<boolean> => {
    if (chainId === targetChainId) return true

    try {
      switchChain({ chainId: targetChainId })
      return true
    } catch (error: any) {
      // console.error("network switch failed:", error)
      if (error.message?.includes("User rejected")) {
        toast.error("You rejected the network switch request")
      } else {
        toast.error(
          "Network switch failed, please switch to the Ethereum mainnet manually"
        )
      }
      return false
    }
  }

  // main function to execute transaction
  const executeTransaction = async (params: TransactionParams) => {
    const { blockchain, token, amount, toAddress } = params

    // get token configuration
    const tokenConfig = getTokenConfig(blockchain, token)
    if (!tokenConfig) {
      const error = "Unsupported token types"
      onTransactionStateChange(TransactionStatus.ERROR, undefined, error)
      toast.error(error)
      return
    }

    // check wallet connection
    if (!account?.address) {
      const error = "Please connect your wallet first"
      onTransactionStateChange(TransactionStatus.ERROR, undefined, error)
      toast.error(error)
      return
    }

    // check receiving address
    if (!toAddress || toAddress.length !== 42) {
      const error = "The receiving address format is incorrect"
      onTransactionStateChange(TransactionStatus.ERROR, undefined, error)
      toast.error(error)
      return
    }

    // check amount
    if (amount <= 0) {
      const error = "The donation amount must be greater than 0"
      onTransactionStateChange(TransactionStatus.ERROR, undefined, error)
      toast.error(error)
      return
    }

    setIsLoading(true)
    onTransactionStateChange(TransactionStatus.PENDING)
    const toastId = toast.loading("Please confirm it in your wallet...")

    try {
      // ensure on the correct network
      const chainConfig = blockchain === "Ethereum" ? 1 : 1 // currently only supports Ethereum mainnet
      const networkSwitched = await ensureCorrectNetwork(chainConfig)
      if (!networkSwitched) {
        setIsLoading(false)
        toast.dismiss(toastId) // close loading toast
        onTransactionStateChange(
          TransactionStatus.ERROR,
          undefined,
          "network switch failed"
        )
        return
      }

      let txHash: string

      // determine if it is native ETH or ERC20 token
      if (isNativeToken(tokenConfig.address)) {
        // ETH transfer
        const amountInWei = parseUnits(amount.toString(), tokenConfig.decimals)

        txHash = await sendTransactionAsync({
          to: toAddress as `0x${string}`,
          value: amountInWei
        })
      } else {
        // ERC20 token transfer
        const amountInTokenUnits = parseUnits(
          amount.toString(),
          tokenConfig.decimals
        )

        txHash = await writeContractAsync({
          abi: ERC20_ABI,
          address: tokenConfig.address as `0x${string}`,
          functionName: "transfer",
          args: [toAddress as `0x${string}`, amountInTokenUnits]
        })
      }

      // transaction successful
      setIsLoading(false)
      toast.dismiss(toastId) // close loading toast
      onTransactionStateChange(TransactionStatus.SUCCESS, txHash)

      const scanUrl = getTxScanUrl(blockchain, txHash)
      toast.success(
        <div>
          <div>The donation transaction has been sent successfully!</div>
          {scanUrl && (
            <a
              href={scanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View transaction details
            </a>
          )}
        </div>
      )
    } catch (error: any) {
      // console.log("transaction execution failed:", error)
      setIsLoading(false)
      toast.dismiss(toastId) // close loading toast

      let errorMessage = "Transaction failed"

      // parse specific error type
      if (error.message?.includes("User rejected")) {
        errorMessage = "You rejected the transaction request"
      } else if (error.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds"
      } else if (error.message?.includes("gas")) {
        errorMessage = "Gas fee insufficient"
      } else if (error.shortMessage) {
        errorMessage = error.shortMessage
      } else if (error.message) {
        errorMessage = error.message
      }

      onTransactionStateChange(TransactionStatus.ERROR, undefined, errorMessage)

      // if the user rejects the transaction request, do not display error information
      if (errorMessage === "You rejected the transaction request") {
        return
      }

      toast.error(errorMessage)
    }
  }

  // calculate if the button is disabled
  const isDisabled = !account?.address || isLoading

  return <div>{renderTrigger(executeTransaction, isLoading, isDisabled)}</div>
}

export default DonationTransaction
