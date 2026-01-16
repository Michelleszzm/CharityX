// Ethereum token configuration
interface TokenInfo {
  name: string
  symbol: string
  decimals: number
  address: string
  icon: string
  usdRate: number // USD exchange rate: 1 USD = usdRate tokens
}

interface ChainInfo {
  id: number
  name: string
  rpcUrl: string
  blockExplorer: string
  tokens: TokenInfo[]
}

interface BlockchainConfig {
  [key: string]: ChainInfo
}

// Ethereum mainnet token configuration
export const ETHEREUM_TOKEN_CONFIG: BlockchainConfig = {
  Ethereum: {
    id: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://ethereum.publicnode.com",
    blockExplorer: "https://etherscan.io",
    tokens: [
      {
        name: "USDC",
        symbol: "USDC",
        decimals: 6,
        address: "0xA0b86a33E6441466F793c9983eE5F54fcF7Ad2Ec", // Circle USD Coin
        icon: "/assets/wallet/USDC.png",
        usdRate: 1 // 1 USD = 1 USDC
      },
      {
        name: "USDT",
        symbol: "USDT",
        decimals: 6,
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Tether USD
        icon: "/assets/wallet/USDT.png",
        usdRate: 1 // 1 USD = 1 USDT
      },
      {
        name: "DAI",
        symbol: "DAI",
        decimals: 18,
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // Dai Stablecoin
        icon: "/assets/wallet/DAI.png",
        usdRate: 1 // 1 USD = 1 DAI
      },
      {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
        address: "0x0000000000000000000000000000000000000000", // Native ETH (represented by zero address)
        icon: "/assets/wallet/ETH.png",
        usdRate: 0.000242 // 1 USD ≈ 0.000242 ETH
      }
    ]
  }
}

// Get token configuration tool function
export function getTokenConfig(
  blockchain: string,
  tokenSymbol: string
): TokenInfo | undefined {
  const chain = ETHEREUM_TOKEN_CONFIG[blockchain]
  if (!chain) return undefined

  return chain.tokens.find(token => token.symbol === tokenSymbol)
}

// Get transaction scan link
export function getTxScanUrl(blockchain: string, txHash: string): string {
  const chain = ETHEREUM_TOKEN_CONFIG[blockchain]
  if (!chain) return ""

  return `${chain.blockExplorer}/tx/${txHash}`
}

// Check if it is a native token (ETH)
export function isNativeToken(address: string): boolean {
  return address === "0x0000000000000000000000000000000000000000"
}
