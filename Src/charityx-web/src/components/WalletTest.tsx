"use client"

import { useState } from "react"
import {
  useAccount,
  useConnection,
  Connector,
  ConnectButton
} from "@ant-design/web3"
import {
  EthereumProvider,
  SolanaProvider,
  BitcoinProvider
} from "@/components/Web3Provider"
import useWalletStore from "@/store/walletStore"

type ChainType = "ethereum" | "solana" | "bitcoin"

interface ChainConfig {
  id: ChainType
  name: string
  icon: string
  description: string
  wallets: string[]
  color: string
}

const chainConfigs: ChainConfig[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    icon: "⟠",
    description: "Connect to Ethereum and its Layer2 networks",
    wallets: ["MetaMask", "WalletConnect", "OKX"],
    color: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
  },
  {
    id: "solana",
    name: "Solana",
    icon: "◎",
    description: "Connect to Solana high-performance blockchain",
    wallets: ["Phantom", "Solflare", "OKX"],
    color:
      "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800"
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    icon: "₿",
    description: "Connect to Bitcoin network",
    wallets: ["Xverse", "Unisat", "OKX"],
    color:
      "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800"
  }
]

// General connection component interface
interface ChainConnectorProps {
  chain: ChainConfig
  onConnected: (chain: ChainType, address: string) => void
}

// Ethereum connection component
function EthereumConnector({ chain, onConnected }: ChainConnectorProps) {
  return (
    <EthereumProvider>
      <ChainConnectorContent chain={chain} onConnected={onConnected} />
    </EthereumProvider>
  )
}

// Solana connection component
function SolanaConnector({ chain, onConnected }: ChainConnectorProps) {
  return (
    <SolanaProvider>
      <ChainConnectorContent chain={chain} onConnected={onConnected} />
    </SolanaProvider>
  )
}

// Bitcoin connection component
function BitcoinConnector({ chain, onConnected }: ChainConnectorProps) {
  return (
    <BitcoinProvider>
      <ChainConnectorContent chain={chain} onConnected={onConnected} />
    </BitcoinProvider>
  )
}

// Connection component content (using each provider context)
function ChainConnectorContent({ chain, onConnected }: ChainConnectorProps) {
  const { account } = useAccount()
  const { connect, disconnect } = useConnection()
  const [connecting, setConnecting] = useState(false)

  const handleConnect = async () => {
    try {
      setConnecting(true)
      await connect?.()
      if (account?.address) {
        onConnected(chain.id, account.address)
      }
    } catch (error) {
      console.error(`Failed to connect to ${chain.name}:`, error)
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect?.()
      console.log(`🔌 ${chain.name} wallet disconnected`)
    } catch (error) {
      console.error("Failed to disconnect:", error)
    }
  }

  const isConnected = !!account?.address

  return (
    <div
      className={`rounded-lg border p-6 transition-all hover:shadow-lg ${chain.color}`}
    >
      <div className="mb-4 text-center">
        <div className="mb-2 text-4xl">{chain.icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {chain.name}
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          {chain.description}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Supported wallets:
          </h4>
          <div className="flex flex-wrap gap-2">
            {chain.wallets.map(wallet => (
              <span
                key={wallet}
                className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                {wallet}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          {isConnected ? (
            <div className="space-y-3">
              <div className="text-center">
                <div className="mb-2 font-medium text-green-600 dark:text-green-400">
                  ✅ Connected to {chain.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Address: {account.address?.slice(0, 8)}...
                  {account.address?.slice(-6)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Network: {chain.name}
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="w-full rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <Connector>
              <ConnectButton
                className="w-full"
                loading={connecting}
                onClick={handleConnect}
              >
                {connecting ? "Connecting..." : `Connect to ${chain.name}`}
              </ConnectButton>
            </Connector>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DonatePage() {
  const { setChainWallet } = useWalletStore()
  const [selectedChain, setSelectedChain] = useState<ChainType>("ethereum")

  const handleChainConnected = (chain: ChainType, address: string) => {
    const chainConfig = chainConfigs.find(c => c.id === chain)
    if (chainConfig) {
      setChainWallet(chain, {
        address,
        chain,
        chainName: chainConfig.name,
        balance: undefined,
        isConnected: true
      })

      console.log(`🔗 ${chainConfig.name} wallet connected successfully:`, {
        address,
        chain,
        chainName: chainConfig.name
      })
    }
  }

  const renderChainConnector = (chain: ChainConfig) => {
    switch (chain.id) {
      case "ethereum":
        return (
          <EthereumConnector chain={chain} onConnected={handleChainConnected} />
        )
      case "solana":
        return (
          <SolanaConnector chain={chain} onConnected={handleChainConnected} />
        )
      case "bitcoin":
        return (
          <BitcoinConnector chain={chain} onConnected={handleChainConnected} />
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          Multi-chain wallet connection center
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
          Select the blockchain network you want to connect to, each network is
          independently managed
        </p>
      </div>

      {/* Chain selection tab */}
      <div className="mb-8">
        <div className="flex justify-center space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          {chainConfigs.map(chain => (
            <button
              key={chain.id}
              onClick={() => setSelectedChain(chain.id)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                selectedChain === chain.id
                  ? "bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              {chain.icon} {chain.name}
            </button>
          ))}
        </div>
      </div>

      {/* Current selected chain connection area */}
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          {(() => {
            const selectedChainConfig = chainConfigs.find(
              c => c.id === selectedChain
            )
            return selectedChainConfig
              ? renderChainConnector(selectedChainConfig)
              : null
          })()}
        </div>
      </div>

      {/* Developer information */}
      <div className="mt-12 rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Usage instructions
        </h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <p>
            • Each blockchain network is independently connected and managed
          </p>
          <p>
            • After the wallet is connected successfully, the information will
            be saved to the state management
          </p>
          <p>
            • Support connecting multiple wallets to multiple networks at the
            same time
          </p>
          <p>
            • Press F12 to open the developer tool to view the connection log
          </p>
        </div>
      </div>
    </div>
  )
}
