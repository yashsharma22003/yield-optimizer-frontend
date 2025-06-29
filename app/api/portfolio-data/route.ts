// import { NextResponse } from 'next/server';
// import { ethers } from 'ethers';

// // Force dynamic rendering
// export const dynamic = 'force-dynamic';

// // Contract addresses from the project
// const HIGH_RISK_VAULT = '0xb6FF46c3c86fAfd1827Fb6b027591cCBdb54d6ec';
// const LOW_RISK_VAULT = '0xD30164B46786C6c878Aa97fF43264fF6D597FBAc';
// const USDC_TOKEN = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // Sepolia USDC

// // Vault ABI (simplified for the functions we need)
// const VAULT_ABI = [
//   {
//     "inputs": [],
//     "name": "totalAssets",
//     "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [{"internalType": "address", "name": "", "type": "address"}],
//     "name": "balanceOf",
//     "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "getPricePerShare",
//     "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "v_name",
//     "outputs": [{"internalType": "string", "name": "", "type": "string"}],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "v_symbol",
//     "outputs": [{"internalType": "string", "name": "", "type": "string"}],
//     "stateMutability": "view",
//     "type": "function"
//   }
// ];

// // USDC Token ABI
// const USDC_ABI = [
//   {
//     "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
//     "name": "balanceOf",
//     "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
//     "stateMutability": "view",
//     "type": "function"
//   }
// ];

// // Multiple RPC URLs for fallback
// const RPC_URLS = [
//   'https://sparkling-young-lake.ethereum-sepolia.quiknode.pro/79268b5625b0e0ea7ace5cbeba8f2b31d3f19b48/',
//   'https://eth-sepolia.g.alchemy.com/v2/demo',
//   'https://rpc.sepolia.org'
// ];

// // Helper function to get a working provider
// async function getWorkingProvider() {
//   for (const rpcUrl of RPC_URLS) {
//     try {
//       const provider = new ethers.JsonRpcProvider(rpcUrl);
//       // Test the connection
//       await provider.getBlockNumber();
//       console.log(`Using RPC: ${rpcUrl}`);
//       return provider;
//     } catch (error: any) {
//       console.log(`RPC failed: ${rpcUrl}`, error.message);
//       continue;
//     }
//   }
//   throw new Error('No working RPC provider found');
// }

// // Helper function to safely call contract methods
// async function safeContractCall(contract: any, method: string, ...args: any[]) {
//   try {
//     const result = await contract[method](...args);
//     return result;
//   } catch (error: any) {
//     console.log(`Contract call failed for ${method}:`, error.message);
//     return null;
//   }
// }

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const userAddress = searchParams.get('address');

//     if (!userAddress) {
//       return NextResponse.json(
//         { error: 'User address is required' },
//         { status: 400 }
//       );
//     }

//     console.log('Fetching portfolio data for address:', userAddress);

//     // Get a working provider
//     const provider = await getWorkingProvider();

//     // Initialize contracts
//     const highRiskContract = new ethers.Contract(HIGH_RISK_VAULT, VAULT_ABI, provider);
//     const lowRiskContract = new ethers.Contract(LOW_RISK_VAULT, VAULT_ABI, provider);
//     const usdcContract = new ethers.Contract(USDC_TOKEN, USDC_ABI, provider);

//     // Fetch data with error handling
//     const [
//       highRiskTotalAssets,
//       highRiskUserBalance,
//       highRiskPricePerShare,
//       highRiskName,
//       highRiskSymbol,
//       lowRiskTotalAssets,
//       lowRiskUserBalance,
//       lowRiskPricePerShare,
//       lowRiskName,
//       lowRiskSymbol,
//       userUsdcBalance
//     ] = await Promise.all([
//       safeContractCall(highRiskContract, 'totalAssets'),
//       safeContractCall(highRiskContract, 'balanceOf', userAddress),
//       safeContractCall(highRiskContract, 'getPricePerShare'),
//       safeContractCall(highRiskContract, 'v_name'),
//       safeContractCall(highRiskContract, 'v_symbol'),
//       safeContractCall(lowRiskContract, 'totalAssets'),
//       safeContractCall(lowRiskContract, 'balanceOf', userAddress),
//       safeContractCall(lowRiskContract, 'getPricePerShare'),
//       safeContractCall(lowRiskContract, 'v_name'),
//       safeContractCall(lowRiskContract, 'v_symbol'),
//       safeContractCall(usdcContract, 'balanceOf', userAddress)
//     ]);

//     // Calculate user's vault positions with fallbacks
//     const highRiskShares = highRiskUserBalance ? Number(ethers.formatEther(highRiskUserBalance)) : 0;
//     const highRiskPricePerShareNum = highRiskPricePerShare ? Number(ethers.formatEther(highRiskPricePerShare)) : 1;
//     const highRiskBalance = highRiskShares * highRiskPricePerShareNum;
//     const highRiskTotalAssetsNum = highRiskTotalAssets ? Number(ethers.formatEther(highRiskTotalAssets)) : 0;

//     const lowRiskShares = lowRiskUserBalance ? Number(ethers.formatEther(lowRiskUserBalance)) : 0;
//     const lowRiskPricePerShareNum = lowRiskPricePerShare ? Number(ethers.formatEther(lowRiskPricePerShare)) : 1;
//     const lowRiskBalance = lowRiskShares * lowRiskPricePerShareNum;
//     const lowRiskTotalAssetsNum = lowRiskTotalAssets ? Number(ethers.formatEther(lowRiskTotalAssets)) : 0;

//     const userUsdcBalanceNum = userUsdcBalance ? Number(ethers.formatUnits(userUsdcBalance, 6)) : 0;

//     // Calculate total portfolio value
//     const totalPortfolioValue = highRiskBalance + lowRiskBalance + userUsdcBalanceNum;

//     // Calculate allocations
//     const highRiskAllocation = totalPortfolioValue > 0 ? (highRiskBalance / totalPortfolioValue) * 100 : 0;
//     const lowRiskAllocation = totalPortfolioValue > 0 ? (lowRiskBalance / totalPortfolioValue) * 100 : 0;
//     const usdcAllocation = totalPortfolioValue > 0 ? (userUsdcBalanceNum / totalPortfolioValue) * 100 : 0;

//     // Mock APY rates (in a real implementation, these would come from the strategy contracts)
//     const highRiskAPY = 18.7; // Mock value - should come from strategy
//     const lowRiskAPY = 8.2;   // Mock value - should come from strategy

//     // Calculate earned amounts (simplified calculation)
//     const highRiskEarned = highRiskBalance * (highRiskAPY / 100) * 0.1; // Assuming 10% of annual rate for demo
//     const lowRiskEarned = lowRiskBalance * (lowRiskAPY / 100) * 0.1;

//     // Calculate portfolio metrics
//     const totalEarned = highRiskEarned + lowRiskEarned;
//     const weightedAPY = totalPortfolioValue > 0 
//       ? ((highRiskBalance * highRiskAPY) + (lowRiskBalance * lowRiskAPY)) / totalPortfolioValue 
//       : 0;

//     // Risk score calculation (simplified)
//     const riskScore = Math.min(10, Math.max(1, 
//       (highRiskAllocation * 0.8) + (lowRiskAllocation * 0.3) + (usdcAllocation * 0.1)
//     ));

//     // Performance calculations (mock data for now)
//     const dailyChange = 2.34;
//     const weeklyChange = 5.67;
//     const monthlyChange = 12.89;

//     // Advanced metrics (mock data - would need historical data for real calculations)
//     const sharpeRatio = 1.85;
//     const maxDrawdown = -8.4;
//     const volatility = 12.3;
//     const beta = 0.92;
//     const correlation = 0.78;

//     // --- Simulate performance history for graph ---
//     // We'll create a 30-day history as an example, using current value and monthlyChange
//     const days = 30;
//     const now = new Date();
//     let baseValue = totalPortfolioValue / (1 + monthlyChange / 100); // crude estimate
//     const performanceHistory = Array.from({ length: days }, (_, i) => {
//       const date = new Date(now);
//       date.setDate(now.getDate() - (days - 1 - i));
//       // Simulate a smooth growth curve
//       const value = baseValue * (1 + (monthlyChange / 100) * (i / (days - 1)));
//       return {
//         date: date.toISOString().slice(0, 10),
//         value: Number(value.toFixed(2)),
//       };
//     });

//     const portfolioData = {
//       totalValue: totalPortfolioValue,
//       totalEarned: totalEarned,
//       dailyChange: dailyChange,
//       weeklyChange: weeklyChange,
//       monthlyChange: monthlyChange,
//       currentAPY: weightedAPY,
//       riskScore: riskScore,
//       sharpeRatio: sharpeRatio,
//       maxDrawdown: maxDrawdown,
//       volatility: volatility,
//       beta: beta,
//       correlation: correlation,
//       performanceHistory,
//       vaults: [
//         {
//           id: 'high-risk',
//           name: highRiskName || 'High Risk Vault',
//           symbol: highRiskSymbol || 'HRV',
//           balance: highRiskBalance,
//           shares: highRiskShares,
//           pricePerShare: highRiskPricePerShareNum,
//           earned: highRiskEarned,
//           apy: highRiskAPY,
//           allocation: highRiskAllocation,
//           riskLevel: 'high',
//           strategy: 'Leveraged Yield + Options',
//           lastRebalance: '6 hours ago',
//           totalAssets: highRiskTotalAssetsNum,
//           performance: {
//             '1d': 0.78,
//             '7d': 4.56,
//             '30d': 18.9,
//             '90d': 52.3,
//             '1y': 156.7
//           }
//         },
//         {
//           id: 'low-risk',
//           name: lowRiskName || 'Low Risk Vault',
//           symbol: lowRiskSymbol || 'LRV',
//           balance: lowRiskBalance,
//           shares: lowRiskShares,
//           pricePerShare: lowRiskPricePerShareNum,
//           earned: lowRiskEarned,
//           apy: lowRiskAPY,
//           allocation: lowRiskAllocation,
//           riskLevel: 'low',
//           strategy: 'Stablecoin Farming + Lending',
//           lastRebalance: '2 days ago',
//           totalAssets: lowRiskTotalAssetsNum,
//           performance: {
//             '1d': 0.12,
//             '7d': 0.89,
//             '30d': 3.45,
//             '90d': 10.2,
//             '1y': 42.1
//           }
//         }
//       ],
//       usdcBalance: {
//         balance: userUsdcBalanceNum,
//         allocation: usdcAllocation
//       },
//       userAddress: userAddress,
//       lastUpdated: new Date().toISOString()
//     };

//     console.log('Portfolio data fetched successfully:', {
//       totalValue: portfolioData.totalValue,
//       vaults: portfolioData.vaults.length,
//       userAddress: portfolioData.userAddress
//     });

//     return NextResponse.json(portfolioData);

//   } catch (error: any) {
//     console.error("Portfolio API Error:", error, error?.message, error?.stack);
    
//     // Return a more detailed error response
//     return NextResponse.json(
//       { 
//         error: 'Failed to fetch portfolio data', 
//         details: error?.message || String(error),
//         stack: error?.stack || null,
//         timestamp: new Date().toISOString()
//       },
//       { status: 500 }
//     );
//   }
// } 