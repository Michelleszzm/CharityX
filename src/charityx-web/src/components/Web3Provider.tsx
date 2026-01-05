"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createConfig, http } from "wagmi"
import { mainnet, polygon, arbitrum, optimism, base } from "wagmi/chains"
import {
  WagmiWeb3ConfigProvider,
  MetaMask,
  OkxWallet
} from "@ant-design/web3-wagmi"
import {
  SolanaWeb3ConfigProvider,
  PhantomWallet,
  SolflareWallet,
  OKXWallet as SolanaOKXWallet,
  solana
} from "@ant-design/web3-solana"
import {
  BitcoinWeb3ConfigProvider,
  XverseWallet,
  UnisatWallet,
  OkxWallet as BitcoinOkxWallet
} from "@ant-design/web3-bitcoin"

// Configure Wagmi (Ethereum)
const wagmiConfig = createConfig({
  chains: [mainnet, polygon, arbitrum, optimism, base],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http()
  }
})

const queryClient = new QueryClient()

interface BaseProviderProps {
  children: React.ReactNode
}

// Ethereum Provider component
export function EthereumProvider({ children }: BaseProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiWeb3ConfigProvider
        config={wagmiConfig}
        queryClient={queryClient}
        wallets={[MetaMask(), OkxWallet()]}
        chains={[mainnet, polygon, arbitrum, optimism, base, solana]}
        eip6963={{
          autoAddInjectedWallets: true
        }}
      >
        {children}
      </WagmiWeb3ConfigProvider>
    </QueryClientProvider>
  )
}

// Solana Provider component
export function SolanaProvider({ children }: BaseProviderProps) {
  return (
    <SolanaWeb3ConfigProvider
      autoAddRegisteredWallets={true}
      wallets={[PhantomWallet(), SolflareWallet(), SolanaOKXWallet()]}
    >
      {children}
    </SolanaWeb3ConfigProvider>
  )
}

// Bitcoin Provider component
export function BitcoinProvider({ children }: BaseProviderProps) {
  return (
    <BitcoinWeb3ConfigProvider
      wallets={[XverseWallet(), UnisatWallet(), BitcoinOkxWallet()]}
    >
      {children}
    </BitcoinWeb3ConfigProvider>
  )
}

// General QueryClient Provider (for root layout)
export function QueryProvider({ children }: BaseProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

// Keep the existing Web3Provider interface compatible (for transition period)
export default function Web3Provider({ children }: BaseProviderProps) {
  return <QueryProvider>{children}</QueryProvider>
}
