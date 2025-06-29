'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'NeuraFi',
  projectId: '615a70a8fc52e9696e5b6c426df0eaeb',
  chains: [
    sepolia
  ],
  ssr: true,
});
