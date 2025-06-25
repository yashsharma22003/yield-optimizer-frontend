import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

const aggregatorV3InterfaceABI = [
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "latestRoundData",
    "outputs": [
      { "internalType": "uint80", "name": "roundId", "type": "uint80" },
      { "internalType": "int256", "name": "answer", "type": "int256" },
      { "internalType": "uint256", "name": "startedAt", "type": "uint256" },
      { "internalType": "uint256", "name": "updatedAt", "type": "uint256" },
      { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const ETH_USD_FEED = '0x694AA1769357215DE4FAC081bf1f309aDC325306';
const BTC_USD_FEED = '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43';

export async function GET() {
  try {
    const provider = new ethers.JsonRpcProvider('https://sparkling-young-lake.ethereum-sepolia.quiknode.pro/79268b5625b0e0ea7ace5cbeba8f2b31d3f19b48/');
    const ethFeed = new ethers.Contract(ETH_USD_FEED, aggregatorV3InterfaceABI, provider);
    const btcFeed = new ethers.Contract(BTC_USD_FEED, aggregatorV3InterfaceABI, provider);

    const [ethData, ethDecimals] = await Promise.all([
      ethFeed.latestRoundData(),
      ethFeed.decimals()
    ]);
    const [btcData, btcDecimals] = await Promise.all([
      btcFeed.latestRoundData(),
      btcFeed.decimals()
    ]);

    const ethPrice = Number(ethers.formatUnits(ethData.answer, ethDecimals));
    const btcPrice = Number(ethers.formatUnits(btcData.answer, btcDecimals));

    const results = [
      {
        name: 'ETH',
        price: ethPrice,
        change24h: 0,
        volume24h: 'N/A',
        marketCap: 'N/A',
      },
      {
        name: 'BTC',
        price: btcPrice,
        change24h: 0,
        volume24h: 'N/A',
        marketCap: 'N/A',
      },
    ];
    return NextResponse.json({ tokens: results });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch Chainlink prices', details: error.message }, { status: 500 });
  }
} 