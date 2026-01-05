import { create } from "zustand"

interface WalletInfo {
  address: string
  chain: "ethereum" | "bitcoin" | "solana"
  chainName: string
  balance?: string
  isConnected: boolean
}

interface WalletStore {
  ethereum: WalletInfo | null
  bitcoin: WalletInfo | null
  solana: WalletInfo | null
  currentWallet: WalletInfo | null

  // Actions
  setEthereumWallet: (wallet: WalletInfo | null) => void
  setBitcoinWallet: (wallet: WalletInfo | null) => void
  setSolanaWallet: (wallet: WalletInfo | null) => void
  setCurrentWallet: (wallet: WalletInfo | null) => void
  setChainWallet: (
    chain: "ethereum" | "bitcoin" | "solana",
    wallet: WalletInfo | null
  ) => void
  clearAllWallets: () => void

  // Getters
  getConnectedWallets: () => WalletInfo[]
  hasAnyConnection: () => boolean
}

const useWalletStore = create<WalletStore>((set, get) => ({
  ethereum: null,
  bitcoin: null,
  solana: null,
  currentWallet: null,

  setEthereumWallet: wallet => {
    set({ ethereum: wallet })
    if (wallet && wallet.isConnected) {
      set({ currentWallet: wallet })
    }
  },

  setBitcoinWallet: wallet => {
    set({ bitcoin: wallet })
    if (wallet && wallet.isConnected) {
      set({ currentWallet: wallet })
    }
  },

  setSolanaWallet: wallet => {
    set({ solana: wallet })
    if (wallet && wallet.isConnected) {
      set({ currentWallet: wallet })
    }
  },

  setCurrentWallet: wallet => set({ currentWallet: wallet }),

  setChainWallet: (chain, wallet) => {
    const update: Partial<
      Pick<WalletStore, "ethereum" | "bitcoin" | "solana" | "currentWallet">
    > = {
      [chain]: wallet
    }

    // If the wallet is connected, set it as the current wallet
    if (wallet && wallet.isConnected) {
      update.currentWallet = wallet
    }

    set(update)
  },

  clearAllWallets: () =>
    set({
      ethereum: null,
      bitcoin: null,
      solana: null,
      currentWallet: null
    }),

  getConnectedWallets: () => {
    const { ethereum, bitcoin, solana } = get()
    return [ethereum, bitcoin, solana].filter(
      (wallet): wallet is WalletInfo => wallet !== null && wallet.isConnected
    )
  },

  hasAnyConnection: () => {
    const connectedWallets = get().getConnectedWallets()
    return connectedWallets.length > 0
  }
}))

export default useWalletStore
export type { WalletInfo }
