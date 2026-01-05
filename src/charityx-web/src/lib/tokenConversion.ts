import { getTokenConfig } from "@/constants/tokenConfig"

/**
 * Convert USD amount to corresponding token amount
 * @param usdAmount USD amount
 * @param blockchain Blockchain type
 * @param tokenSymbol Token symbol
 * @returns Converted token amount, 0 if conversion fails
 */
export function convertUsdToToken(
  usdAmount: number,
  blockchain: string,
  tokenSymbol: string
): number {
  if (usdAmount <= 0) {
    return 0
  }

  const tokenConfig = getTokenConfig(blockchain, tokenSymbol)
  if (!tokenConfig) {
    console.log(`Token config not found for ${blockchain}:${tokenSymbol}`)
    return 0
  }

  // Calculate token amount based on exchange rate
  const tokenAmount = usdAmount * tokenConfig.usdRate

  // Keep appropriate decimal places
  return Number(tokenAmount.toFixed(8))
}

/**
 * Get the USD exchange rate for the token
 * @param blockchain Blockchain type
 * @param tokenSymbol Token symbol
 * @returns Exchange rate (1 USD = rate tokens), 0 if failed to get
 */
export function getTokenRate(blockchain: string, tokenSymbol: string): number {
  const tokenConfig = getTokenConfig(blockchain, tokenSymbol)
  return tokenConfig?.usdRate || 0
}

/**
 * Format token amount display
 * @param amount Token amount
 * @param tokenSymbol Token symbol
 * @returns Formatted display string
 */
export function formatTokenAmount(amount: number, tokenSymbol: string): string {
  if (amount === 0) {
    return `0 ${tokenSymbol}`
  }

  // For stablecoins, display 2 decimal places
  if (["USDC", "USDT", "DAI"].includes(tokenSymbol)) {
    return `${amount.toFixed(2)} ${tokenSymbol}`
  }

  // For other tokens, display 6 decimal places (remove trailing 0s)
  return `${Number(amount.toFixed(6))} ${tokenSymbol}`
}
