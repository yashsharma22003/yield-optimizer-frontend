import type { NextApiRequest, NextApiResponse } from 'next';

const endpoints = [
  {
    name: 'ETH',
    url: 'https://data.chain.link/ethereum/mainnet/crypto-usd/eth-usd',
  },
  {
    name: 'BTC',
    url: 'https://data.chain.link/ethereum/mainnet/crypto-usd/btc-usd',
  },
  {
    name: 'USDC',
    url: 'https://data.chain.link/ethereum/mainnet/crypto-usd/usdc-usd',
  },
  {
    name: 'USDT',
    url: 'https://data.chain.link/ethereum/mainnet/crypto-usd/usdt-usd',
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const results = await Promise.all(
      endpoints.map(async (ep) => {
        const response = await fetch(ep.url);
        if (!response.ok) throw new Error('Failed to fetch ' + ep.name);
        const data = await response.json();
        const price = parseFloat(data.price);
        return {
          name: ep.name,
          price,
          change24h: 0, // Not available from Chainlink HTTP API
          volume24h: 'N/A',
          marketCap: 'N/A',
        };
      })
    );
    res.status(200).json({ tokens: results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Chainlink prices' });
  }
} 