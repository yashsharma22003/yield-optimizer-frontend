import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

// --- Static & Mocked Data ---

const MOCKED_DATA = {
  gas_fees: {
    ethereum: 32,
    polygon: 0.2,
    arbitrum: 0.5,
  },
  protocol_rates: [
    { protocol: 'Aave', apy: 7.8, tvl: '1.2B' },
    { protocol: 'Compound', apy: 6.5, tvl: '950M' },
    { protocol: 'Morpho', apy: 9.2, tvl: '800M' },
  ],
};

const CHAINLINK_FEEDS = {
  'ETH': { address: '0x694AA1769357215DE4FAC081bf1f309aDC325306', name: 'ethereum' },
  'BTC': { address: '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43', name: 'bitcoin' },
  'USDC': { address: '0x9999f7FeaC93922161E5B24213f5dd469931817e', name: 'usd-coin' }, // Note: USDC/ETH feed, needs conversion
  'USDT': { address: '0x02Ea060b43B2a537f3404533010a3Ca972A3F337', name: 'tether' },   // Note: USDT/ETH feed, needs conversion
};

const AGGREGATOR_V3_ABI = [{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"}];
const SEPOLIA_RPC_URL = 'https://sparkling-young-lake.ethereum-sepolia.quiknode.pro/79268b5625b0e0ea7ace5cbeba8f2b31d3f19b48/';

// --- Helper Functions ---

async function fetchChainlinkPrice(feedAddress: string, provider: ethers.Provider) {
  const feedContract = new ethers.Contract(feedAddress, AGGREGATOR_V3_ABI, provider);
  const [roundData, decimals] = await Promise.all([feedContract.latestRoundData(), feedContract.decimals()]);
  return Number(ethers.formatUnits(roundData.answer, decimals));
}

async function fetchCoinGeckoData() {
  const ids = 'ethereum,bitcoin,usd-coin,tether,solana,chainlink,arbitrum,dogecoin,pepe,shiba-inu';
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch from CoinGecko');
  return response.json();
}

async function fetchPriceHistory(id: string) {
    const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch history for ${id}`);
    const data = await response.json();
    return data.prices.map((p: [number, number]) => ({ date: new Date(p[0]).toISOString().split('T')[0], price: p[1] }));
}


// --- API Route Handler ---

export async function GET() {
  try {
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    
    // Fetch all data in parallel
    const [
      chainlinkEthPrice, 
      chainlinkBtcPrice, 
      coingeckoData,
      ethHistory,
      btcHistory
    ] = await Promise.all([
        fetchChainlinkPrice(CHAINLINK_FEEDS['ETH'].address, provider),
        fetchChainlinkPrice(CHAINLINK_FEEDS['BTC'].address, provider),
        fetchCoinGeckoData(),
        fetchPriceHistory('ethereum'),
        fetchPriceHistory('bitcoin')
    ]);

    // Combine data: Prioritize Chainlink prices, supplement with CoinGecko
    const combinedData = coingeckoData.map((cgToken: any) => {
        let finalPrice = cgToken.current_price;
        if (cgToken.symbol.toLowerCase() === 'eth') finalPrice = chainlinkEthPrice;
        if (cgToken.symbol.toLowerCase() === 'btc') finalPrice = chainlinkBtcPrice;
        // USDC and USDT feeds on Sepolia are vs ETH, so using CoinGecko price is simpler and more accurate here.
        
        return {
            id: cgToken.id,
            symbol: cgToken.symbol.toUpperCase(),
            name: cgToken.name,
            image: cgToken.image,
            price: finalPrice,
            change24h: cgToken.price_change_percentage_24h,
            volume24h: cgToken.total_volume,
            marketCap: cgToken.market_cap,
        };
    });

    return NextResponse.json({
      market_data: combinedData,
      price_history: {
        eth: ethHistory,
        btc: btcHistory,
      },
      ...MOCKED_DATA,
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: 'Failed to fetch market data', details: error.message },
      { status: 500 }
    );
  }
} 