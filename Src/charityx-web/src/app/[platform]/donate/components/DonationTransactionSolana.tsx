"use client"

import React, { useState } from "react"
import { useAccount } from "@ant-design/web3"
import { parseAbi, parseUnits } from "viem"
import {
  getTokenConfig,
  isNativeToken,
  getTxScanUrl
} from "@/constants/tokenConfig"
import { toast } from "sonner"
import { useConnection, useWallet } from "@ant-design/web3-solana"
import { ComputeBudgetInstruction, ComputeBudgetProgram, PublicKey, SystemProgram, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { createAssociatedTokenAccountIdempotentInstruction, createTransferCheckedInstruction, createTransferInstruction, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { sendCode } from "@/apis/user"
import { getLatestBlockHash, getTransaction, sendTransaction, TransactionResult } from "@/apis/donate"
import { symbol } from "zod"
import { sleep } from "@/lib/utils"
import { tr } from "zod/v4/locales"

const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
const USDT_MINT = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB');

// transaction status enumeration
export enum TransactionStatus {
  IDLE = "idle",
  PENDING = "pending",
  SUCCESS = "success",
  ERROR = "error"
}

// transaction parameters interface
interface TransactionParams {
  site: string
  blockchain: string
  token: string
  amount: number 
  value: number
  fromAddress: string
  toAddress: string
}

// component Props interface
interface DonationTransactionProps {
  blockchain: string
  onTransactionStateChange: (
    result: TransactionResult,
  ) => void
  renderTrigger: (
    signTransaction: (params: TransactionParams) => void,
    isLoading: boolean,
    isDisabled: boolean
  ) => React.ReactNode
}

const DonationTransactionSolana: React.FC<DonationTransactionProps> = ({
  onTransactionStateChange,
  renderTrigger
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { account } = useAccount()
  const { connection } = useConnection();
  const { signTransaction, publicKey } = useWallet();


  // check and switch network
  const ensureCorrectNetwork = async (
    targetChainId: number
  ): Promise<boolean> => {
    return true
  }

  const transactionToken = async (
    fromPubkey: PublicKey,
    toPubkey: PublicKey,
    amount: number,
    mint: PublicKey
  ) => { 
    const fromTokenAccount = await getAssociatedTokenAddressSync(mint, fromPubkey);
    const toTokenAccount = await getAssociatedTokenAddressSync(mint, toPubkey);
    const createATAIx = createAssociatedTokenAccountIdempotentInstruction(
      fromPubkey,      // payer
      toTokenAccount,  // ATA to create
      toPubkey,        // owner
      mint
    );
    const transferIx = createTransferCheckedInstruction(
      fromTokenAccount, 
      mint,
      toTokenAccount,  
      fromPubkey,      
      amount,
      6,
      [],
      TOKEN_PROGRAM_ID
    );
    return [createATAIx, transferIx]
  }

  // main function to execute transaction
  const executeTransaction = async (params: TransactionParams) => {
    console.log("executeTransaction", params)
    if (!signTransaction) {
      return;
    }
    const blockhash = await getLatestBlockHash(params.site, {
      chain: params.blockchain
    });
    const fromPubkey = new PublicKey(params.fromAddress);
    const toPubkey = new PublicKey(params.toAddress);
    const instructions: Array<TransactionInstruction> = [];
    instructions.push(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 100_00,
      })
    )
    // sol
    if (params.token === "SOL") {
      const transferIx = SystemProgram.transfer({
        fromPubkey: fromPubkey,
        toPubkey: toPubkey,
        lamports: params.amount * 1000000000
      });
      instructions.push(transferIx);
    } else if (params.token === "USDC") {
      const res = await transactionToken(fromPubkey, toPubkey, params.amount * 1000000, USDC_MINT)
      instructions.push(...res);
    } else if (params.token === "USDT") {
      const res = await transactionToken(fromPubkey, toPubkey, params.amount * 1000000, USDT_MINT)
      instructions.push(...res);
    }

    const messageV0 = new TransactionMessage({
      payerKey: fromPubkey,
      instructions: instructions,
      recentBlockhash: blockhash
    }).compileToV0Message();
    const fullTX = new VersionedTransaction(messageV0);
    const transaction = await signTransaction(fullTX);
    if (!transaction.signatures[0]) throw new Error('Transaction not signed!');

    const serializedTransaction = transaction.serialize();
    const binaryString = String.fromCharCode(...serializedTransaction);
    const rawTransaction = btoa(binaryString);

    // send raw transaction
    const res = await sendTransaction(params.site, {
      chain: params.blockchain,
      token: params.token,
      donorWallet: params.fromAddress,
      foundationWallet: params.toAddress,
      value: params.amount, //
      amount: params.value,
      encodeSerializedTransaction: rawTransaction
    });

    let payStatus = 0;
    while (payStatus === 0) {
      await sleep(1000);
      const receipt = await getTransaction(params.site, {
        txHash: res,
        chain: params.blockchain
      });
      if (receipt) {
        onTransactionStateChange(receipt)
        payStatus = receipt.payStatus;
      }
    }
  }

  // calculate if the button is disabled
  
  const isDisabled = !account?.address || isLoading
  console.log("account", account, isLoading, isDisabled);
  return <div>{renderTrigger(executeTransaction, isLoading, isDisabled)}</div>
}

export default DonationTransactionSolana
