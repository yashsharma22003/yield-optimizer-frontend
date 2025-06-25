'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Activity, LineChart } from 'lucide-react';

// --- Types ---
interface MarketToken {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}
interface PriceHistoryPoint {
  date: string;
  price: number;
}
interface FullMarketData {
  market_data: MarketToken[];
  price_history: { eth: PriceHistoryPoint[]; btc: PriceHistoryPoint[] };
  gas_fees: { ethereum: number; polygon: number; arbitrum: number };
  protocol_rates: { protocol: string; apy: number; tvl: string }[];
}

// --- Helper Components & Functions ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 backdrop-blur-sm border border-border p-2 rounded-lg">
        <p className="text-white">{`$${payload[0].value.toLocaleString()}`}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    );
  }
  return null;
};

const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatCompact = (value: number) => {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
};

// --- Main Component ---

export default function Analytics() {
  const [data, setData] = useState<FullMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/market-data');
      if (!res.ok) throw new Error('Failed to fetch from backend API');
      const apiData = await res.json();
      setData(apiData);
      setLastUpdated(new Date());
    } catch (e) {
      console.error("Failed to fetch market data:", e);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);
  
  const { topTokens, topGainers, topLosers, defiSentiment, ethBtcCorrelation, protocolHealth } = useMemo(() => {
    if (!data || !data.market_data) {
      return { topTokens: [], topGainers: [], topLosers: [], defiSentiment: { label: 'Neutral', color: 'text-yellow-300' }, ethBtcCorrelation: 'N/A', protocolHealth: [] };
    }
    const sortedTokens = [...data.market_data].sort((a, b) => b.marketCap - a.marketCap);
    const top4 = sortedTokens.slice(0, 4);
    const gainers = sortedTokens.sort((a, b) => b.change24h - a.change24h).slice(0, 3);
    const losers = sortedTokens.sort((a, b) => a.change24h - b.change24h).slice(0, 3);
    
    const avgChange = data.market_data.reduce((acc, t) => acc + (t.change24h || 0), 0) / data.market_data.length;
    let sentiment = { label: 'Neutral', color: 'text-yellow-300' };
    if (avgChange > 1) sentiment = { label: 'Bullish', color: 'text-green-400' };
    if (avgChange < -1) sentiment = { label: 'Bearish', color: 'text-red-400' };

    const health = data.protocol_rates.map(p => ({
        ...p,
        status: p.apy > 7 ? {label: 'Healthy', color: 'text-green-400'} : {label: 'Warning', color: 'text-yellow-300'}
    }))

    // Simplified Correlation Logic
    const ethPrices = data.price_history.eth.map(p => p.price);
    const btcPrices = data.price_history.btc.map(p => p.price);
    const correlation = (ethPrices[ethPrices.length-1] / ethPrices[0]) > (btcPrices[btcPrices.length-1] / btcPrices[0]) ? 'Low' : 'High';


    return { topTokens: top4, topGainers: gainers, topLosers: losers, defiSentiment: sentiment, ethBtcCorrelation: correlation, protocolHealth: health };
  }, [data]);

  if (loading) {
      return <div className="text-white text-center p-10">Loading Market Data...</div>
  }
  if (!data) {
      return <div className="text-red-500 text-center p-10">Failed to load market data. Please try refreshing.</div>
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Market Insights</h1>
        <button
          onClick={fetchMarketData}
          className="px-4 py-2 rounded bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* --- Top Row Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader><CardTitle className="text-white">DeFi Sentiment</CardTitle></CardHeader>
            <CardContent><p className={defiSentiment.color}>{defiSentiment.label}</p><p className="text-xs text-slate-400 mt-1">Based on 24h price changes</p></CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader><CardTitle className="text-white">Stablecoin Peg</CardTitle></CardHeader>
            <CardContent>
                <div className="flex justify-between"><span className="text-slate-300">USDC</span> <span className="text-white">{formatCurrency(data.market_data.find(t=>t.symbol==='USDC')?.price || 1)}</span></div>
                <div className="flex justify-between"><span className="text-slate-300">USDT</span> <span className="text-white">{formatCurrency(data.market_data.find(t=>t.symbol==='USDT')?.price || 1)}</span></div>
            </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader><CardTitle className="text-white">ETH/BTC Correlation</CardTitle></CardHeader>
            <CardContent><p className="text-blue-400">{ethBtcCorrelation}</p><p className="text-xs text-slate-400 mt-1">Last 7 days</p></CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader><CardTitle className="text-white">Protocol Health</CardTitle></CardHeader>
            <CardContent>
                 {protocolHealth.map(p => (
                    <div key={p.protocol} className="flex justify-between text-sm">
                      <span>{p.protocol}</span>
                      <span className={p.status.color}>{p.status.label}</span>
                    </div>
                  ))}
            </CardContent>
        </Card>
      </div>

      {/* --- Price Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topTokens.map(token => (
               <Card key={token.id} className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg text-white">{token.name}</CardTitle>
                        <img src={token.image} alt={token.name} className="w-6 h-6"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">{formatCurrency(token.price)}</div>
                        <Badge className={token.change24h >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}>
                            {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                        </Badge>
                        <div className="text-xs text-slate-400 mt-2">
                            <span>Vol: {formatCompact(token.volume24h)}</span> | <span>MCap: {formatCompact(token.marketCap)}</span>
                        </div>
                    </CardContent>
               </Card>
          ))}
      </div>

      <div className="text-xs text-slate-400 text-right">Last updated: {lastUpdated.toLocaleTimeString()}</div>
      
      {/* --- Gainers & Losers --- */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader><CardTitle className="text-white flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-green-400"/>Top Gainers (24h)</CardTitle></CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {topGainers.map(g => (
                            <li key={g.id} className="flex justify-between items-center text-slate-300">
                                <div className="flex items-center gap-2"><img src={g.image} alt={g.name} className="w-5 h-5"/>{g.name}</div>
                                <span className="text-green-400">+{g.change24h.toFixed(2)}%</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader><CardTitle className="text-white flex items-center"><TrendingDown className="w-5 h-5 mr-2 text-red-400"/>Top Losers (24h)</CardTitle></CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                         {topLosers.map(l => (
                            <li key={l.id} className="flex justify-between items-center text-slate-300">
                                <div className="flex items-center gap-2"><img src={l.image} alt={l.name} className="w-5 h-5"/>{l.name}</div>
                                <span className="text-red-400">{l.change24h.toFixed(2)}%</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
       </div>

        {/* --- Gas & DeFi Rates --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader><CardTitle className="text-white flex items-center"><Activity className="w-5 h-5 mr-2"/>Network Gas Fees (Gwei)</CardTitle></CardHeader>
            <CardContent>
                <ul className="space-y-2 text-slate-300">
                    <li>Ethereum: <span className="font-bold text-white">{data.gas_fees.ethereum}</span></li>
                    <li>Polygon: <span className="font-bold text-white">{data.gas_fees.polygon}</span></li>
                    <li>Arbitrum: <span className="font-bold text-white">{data.gas_fees.arbitrum}</span></li>
                </ul>
            </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader><CardTitle className="text-white flex items-center"><LineChart className="w-5 h-5 mr-2"/>DeFi Protocol Rates</CardTitle></CardHeader>
            <CardContent>
                 <ul className="space-y-2 text-slate-300">
                    {data.protocol_rates.map(p => (
                        <li key={p.protocol} className="flex justify-between items-center">
                            <span>{p.protocol}</span>
                            <span className="font-bold text-white">{p.apy}% APY</span>
                            <span className="text-slate-400">TVL: {p.tvl}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
      </div>

       {/* --- Price Charts --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader><CardTitle className="text-white">ETH Price (7d)</CardTitle></CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.price_history.eth} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <defs><linearGradient id="ethGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/></linearGradient></defs>
                            <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${Math.round(value/100)*100}`} />
                            <XAxis dataKey="date" stroke="#9ca3af" tickFormatter={str => new Date(str).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="price" stroke="#8B5CF6" fill="url(#ethGradient)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader><CardTitle className="text-white">BTC Price (7d)</CardTitle></CardHeader>
                <CardContent className="h-[300px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.price_history.btc} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                           <defs><linearGradient id="btcGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                           <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${Math.round(value/1000)*1000}`} />
                           <XAxis dataKey="date" stroke="#9ca3af" tickFormatter={str => new Date(str).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} />
                           <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="price" stroke="#3b82f6" fill="url(#btcGradient)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
      </div>
    </div>
  );
} 