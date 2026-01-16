// components/DynamicWeb3Provider.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WagmiConfig, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';
import {
  WagmiWeb3ConfigProvider,
  MetaMask,
  OkxWallet
} from "@ant-design/web3-wagmi"
import { 
  OKXWallet,
  PhantomWallet,
  SolanaWeb3ConfigProvider,
  WalletConnectWallet,
} from '@ant-design/web3-solana';
import { QueryClient } from '@tanstack/react-query';
import { ConnectButton, Connector } from '@ant-design/web3';

export type ChainType = 'BITCOIN' | 'ETHEREUM' | 'SOLANA';

interface Web3ContextType {
  chainType: ChainType;
  setChainType: (type: ChainType) => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

interface Web3ProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient()

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [chainType, setChainType] = useState<ChainType>('SOLANA');

  return (
    <Web3Context.Provider value={{ chainType, setChainType }}>
      <Web3ConfigProvider chainType={chainType}>
        {children}
      </Web3ConfigProvider>
    </Web3Context.Provider>
  );
};

const Web3ConfigProvider: React.FC<{ chainType: ChainType; children: ReactNode }> = ({ 
  chainType, 
  children 
}) => {
  if (chainType === 'ETHEREUM') {
    return (
      <WagmiWeb3ConfigProvider
        config={wagmiConfig}
        queryClient={queryClient}
        wallets={[MetaMask(), OkxWallet()]}
        chains={[mainnet]}
        eip6963={{
          autoAddInjectedWallets: true
        }}
      >
        {children}
      </WagmiWeb3ConfigProvider>
    );
  }

  return (
    <SolanaWeb3ConfigProvider autoAddRegisteredWallets autoConnect
      // wallets={[PhantomWallet(), OKXWallet()]}
    >
      {/* <Connector> */}
        {/* <ConnectButton /> */}
      {/* </Connector> */}
      {children}
    </SolanaWeb3ConfigProvider>
  );
};