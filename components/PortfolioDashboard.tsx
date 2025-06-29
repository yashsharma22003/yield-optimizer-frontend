'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  PieChart, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Activity,
  Shield,
  Target,
  Zap,
  BarChart3,
  LineChart,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Settings,
  Download,
  Share2,
  Filter,
  Search,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface PortfolioMetrics {
  totalValue: number;
  totalEarned: number;
  dailyChange: number;
  weeklyChange: number;
  monthlyChange: number;
  currentAPY: number;
  riskScore: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
  correlation: number;
}

interface VaultPosition {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  shares: number;
  pricePerShare: number;
  earned: number;
  apy: number;
  allocation: number;
  riskLevel: 'low' | 'medium' | 'high';
  strategy: string;
  lastRebalance: string;
  totalAssets: number;
  performance: {
    '1d': number;
    '7d': number;
    '30d': number;
    '90d': number;
    '1y': number;
  };
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'rebalance' | 'harvest' | 'compound';
  amount: number;
  vault?: string;
  from?: string;
  to?: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  txHash?: string;
  gasUsed?: number;
}

interface PortfolioData {
  totalValue: number;
  totalEarned: number;
  dailyChange: number;
  weeklyChange: number;
  monthlyChange: number;
  currentAPY: number;
  riskScore: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
  correlation: number;
  vaults: VaultPosition[];
  usdcBalance: {
    balance: number;
    allocation: number;
  };
  userAddress: string;
  lastUpdated: string;
  performanceHistory: { date: string; value: number }[];
}

// Helper for animated numbers
function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 2,
  className = '',
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    let frame: number;
    let start = display;
    let end = value;
    let startTime: number | null = null;
    const duration = 0.7; // seconds
    function animate(ts: number) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / (duration * 1000), 1);
      setDisplay(start + (end - start) * progress);
      if (progress < 1) frame = requestAnimationFrame(animate);
      else setDisplay(end);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return (
    <span className={className}>
      {prefix}{display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
}

export function PortfolioDashboard() {
  const { address, isConnected } = useAccount();
  const [timeframe, setTimeframe] = useState('7d');
  const [showValues, setShowValues] = useState(true);
  const [selectedVault, setSelectedVault] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch portfolio data from blockchain
  const fetchPortfolioData = async () => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching portfolio data for address:', address);
      
      const response = await fetch(`/api/portfolio-data?address=${address}`);
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error response:', errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.error || errorData.details || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log('Portfolio data received:', data);
      setPortfolioData(data);
    } catch (err: any) {
      console.error('Error fetching portfolio data:', err);
      setError(err.message || 'Failed to load portfolio data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount and when address changes
  useEffect(() => {
    if (isConnected && address) {
      fetchPortfolioData();
    }
  }, [isConnected, address]);

  // Mock transactions (in a real app, these would come from blockchain events)
  const transactions: Transaction[] = [
    {
      id: 'tx1',
      type: 'deposit',
      amount: 5000,
      vault: 'High Risk Vault',
      timestamp: '2 hours ago',
      status: 'completed',
      txHash: '0x1234...5678',
      gasUsed: 0.0023
    },
    {
      id: 'tx2',
      type: 'harvest',
      amount: 234.56,
      vault: 'High Risk Vault',
      timestamp: '4 hours ago',
      status: 'completed',
      txHash: '0x8765...4321',
      gasUsed: 0.0018
    },
    {
      id: 'tx3',
      type: 'rebalance',
      from: 'Conservative',
      to: 'Balanced',
      amount: 2000,
      timestamp: '1 day ago',
      status: 'completed',
      txHash: '0xabcd...efgh',
      gasUsed: 0.0034
    },
    {
      id: 'tx4',
      type: 'compound',
      amount: 1567.89,
      vault: 'Low Risk Vault',
      timestamp: '2 days ago',
      status: 'completed',
      txHash: '0x9876...5432',
      gasUsed: 0.0021
    },
    {
      id: 'tx5',
      type: 'withdraw',
      amount: 1500,
      vault: 'Low Risk Vault',
      timestamp: '3 days ago',
      status: 'completed',
      txHash: '0xfedc...ba98',
      gasUsed: 0.0019
    }
  ];

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'high': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getPerformanceColor = (value: number) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending': return <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowUpRight className="w-4 h-4" />;
      case 'withdraw': return <ArrowDownRight className="w-4 h-4" />;
      case 'rebalance': return <RefreshCw className="w-4 h-4" />;
      case 'harvest': return <Zap className="w-4 h-4" />;
      case 'compound': return <TrendingUp className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'bg-green-500/20 text-green-400';
      case 'withdraw': return 'bg-red-500/20 text-red-400';
      case 'rebalance': return 'bg-blue-500/20 text-blue-400';
      case 'harvest': return 'bg-purple-500/20 text-purple-400';
      case 'compound': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
            <div className="text-white text-lg">Loading Portfolio Data...</div>
            <div className="text-slate-400 text-sm">Fetching data from blockchain</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-4" />
            <div className="text-white text-lg">Error Loading Portfolio</div>
            <div className="text-red-400 text-sm mb-4">{error}</div>
            <Button onClick={fetchPortfolioData} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show connect wallet state
  if (!isConnected) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Wallet className="w-8 h-8 text-slate-400 mx-auto mb-4" />
            <div className="text-white text-lg">Connect Your Wallet</div>
            <div className="text-slate-400 text-sm">Connect your wallet to view your portfolio</div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty portfolio state (if no real data)
  if (!portfolioData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-[#2a1747] via-[#432c7a] to-[#2e1a47] rounded-2xl shadow-2xl border border-[#4b267a]/40">
        <div className="text-center p-10">
          <PieChart className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <div className="text-2xl font-bold text-white mb-2">No Portfolio Data</div>
          <div className="text-purple-200 text-base mb-4">
            Unable to load portfolio data.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] w-full bg-gradient-to-br from-[#2a1747] via-[#432c7a] to-[#2e1a47] py-8 px-2 md:px-8 rounded-2xl shadow-2xl border border-[#4b267a]/40">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Enhanced Portfolio Overview */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Portfolio Value Card with animated border */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl rounded-2xl overflow-hidden group">
            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="text-primary flex items-center justify-between text-base">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-primary" />
                  Total Portfolio
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowValues(!showValues)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                >
                  {showValues ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-extrabold text-primary mb-2 tracking-tight drop-shadow-lg">
                {showValues ? `$${portfolioData.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-green-400 text-sm flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{portfolioData.dailyChange}% today
                </div>
                <div className="text-muted-foreground text-xs">
                  +{portfolioData.weeklyChange}% week
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other metric cards */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-lg rounded-2xl hover:border-accent transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-accent flex items-center text-base">
                <TrendingUp className="w-4 h-4 mr-2 text-accent" />
                Total Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent mb-2">
                {showValues ? `$${portfolioData.totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
              </div>
              <div className="text-accent-foreground text-sm">All time earnings</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-lg rounded-2xl hover:border-primary transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-primary flex items-center text-base">
                <Activity className="w-4 h-4 mr-2 text-primary" />
                Current APY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">
                {portfolioData.currentAPY.toFixed(1)}%
              </div>
              <div className="text-muted-foreground text-sm">Weighted average</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-lg rounded-2xl hover:border-yellow-500/60 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-yellow-400 flex items-center text-base">
                <Shield className="w-4 h-4 mr-2 text-yellow-400" />
                Risk Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {portfolioData.riskScore.toFixed(1)}/10
              </div>
              <div className="text-yellow-300 text-sm">
                {portfolioData.riskScore <= 3 ? 'Low risk' : 
                 portfolioData.riskScore <= 7 ? 'Moderate risk' : 'High risk'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Metrics Grid */}
        <div className="grid lg:grid-cols-6 gap-4">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow rounded-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{portfolioData.sharpeRatio}</div>
                <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow rounded-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-lg font-bold text-red-400">{portfolioData.maxDrawdown}%</div>
                <div className="text-xs text-muted-foreground">Max Drawdown</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow rounded-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{portfolioData.volatility}%</div>
                <div className="text-xs text-muted-foreground">Volatility</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow rounded-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{portfolioData.beta}</div>
                <div className="text-xs text-muted-foreground">Beta</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow rounded-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{portfolioData.correlation}</div>
                <div className="text-xs text-muted-foreground">Correlation</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow rounded-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">+{portfolioData.monthlyChange}%</div>
                <div className="text-xs text-muted-foreground">30D Return</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Analytics & Vault Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <Card className="h-full flex flex-col bg-white/5 backdrop-blur-sm border-white/10 shadow-xl rounded-2xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-primary flex items-center">
                  <LineChart className="w-5 h-5 mr-2 text-primary" />
                  Performance Analytics
                </CardTitle>
                <div className="flex gap-2">
                  {['1d', '7d', '30d', '90d', '1y'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimeframe(period)}
                      className={`px-3 py-1 rounded text-sm font-semibold transition-all duration-200 ${
                        timeframe === period
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'text-muted-foreground hover:text-primary hover:bg-accent/30'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-border/30 relative overflow-hidden">
                {portfolioData.performanceHistory && portfolioData.performanceHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={portfolioData.performanceHistory} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#a78bfa" tickFormatter={str => new Date(str).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#a78bfa" tickFormatter={(v: number) => `$${Math.round(v)}`} fontSize={12} tickLine={false} axisLine={false} width={60} />
                      <Tooltip content={({ active, payload, label }) => active && payload && payload.length ? (
                        <div className="bg-background/80 backdrop-blur-sm border border-border p-2 rounded-lg">
                          <p className="text-white font-bold">${payload?.[0]?.value?.toLocaleString?.() ?? ''}</p>
                          <p className="text-xs text-muted-foreground">{label}</p>
                        </div>
                      ) : null} />
                      <Area type="monotone" dataKey="value" stroke="#a78bfa" fill="url(#portfolioGradient)" strokeWidth={3} dot={false} isAnimationActive={true} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center w-full">
                    <div className="text-4xl font-bold text-primary mb-4">
                      +{portfolioData.weeklyChange}%
                    </div>
                    <div className="text-muted-foreground mb-2">
                      Portfolio performance over {timeframe}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      No performance data available
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="h-full flex flex-col bg-white/5 backdrop-blur-sm border-white/10 shadow-xl rounded-2xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-primary">Vault Allocation</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-primary"
                  onClick={fetchPortfolioData}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {portfolioData.vaults.map((position) => (
                <div 
                  key={position.id}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    selectedVault === position.id 
                      ? 'bg-primary/10 border-primary/60' 
                      : 'bg-gradient-to-br from-purple-900/70 via-slate-900/70 to-blue-900/70 border-border/30 hover:bg-accent/10'
                  }`}
                  onClick={() => setSelectedVault(selectedVault === position.id ? null : position.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-primary font-medium text-sm">{position.name}</div>
                      <div className="text-muted-foreground text-xs">{position.strategy}</div>
                    </div>
                    <Badge className={getRiskColor(position.riskLevel)}>
                      {position.riskLevel}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Balance</span>
                      <span className="text-primary">${position.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shares</span>
                      <span className="text-primary">{position.shares.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price/Share</span>
                      <span className="text-primary">${position.pricePerShare.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Earned</span>
                      <span className="text-green-400">+${position.earned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">APY</span>
                      <span className="text-blue-400">{position.apy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Allocation</span>
                      <span className="text-primary">{position.allocation.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Progress value={position.allocation} className="h-2" />
                  </div>

                  {selectedVault === position.id && (
                    <div className="mt-3 pt-3 border-t border-border/20">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center">
                          <div className={getPerformanceColor(position.performance['7d'])}>
                            +{position.performance['7d']}%
                          </div>
                          <div className="text-muted-foreground">7D</div>
                        </div>
                        <div className="text-center">
                          <div className={getPerformanceColor(position.performance['30d'])}>
                            +{position.performance['30d']}%
                          </div>
                          <div className="text-muted-foreground">30D</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Last rebalance: {position.lastRebalance}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total vault assets: ${position.totalAssets.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* USDC Balance */}
              {portfolioData.usdcBalance.balance > 0 && (
                <div className="p-4 bg-gradient-to-br from-purple-900/70 via-slate-900/70 to-blue-900/70 rounded-xl border border-border/30">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-primary font-medium text-sm">USDC Balance</div>
                      <div className="text-muted-foreground text-xs">Available for deposit</div>
                    </div>
                    <Badge className="text-blue-400 bg-blue-500/20">
                      Stable
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Balance</span>
                      <span className="text-primary">${portfolioData.usdcBalance.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Allocation</span>
                      <span className="text-primary">{portfolioData.usdcBalance.allocation.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Progress value={portfolioData.usdcBalance.allocation} className="h-2" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Transaction History */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl rounded-2xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-primary flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                Transaction History
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group border-b border-white/10 last:border-b-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTransactionColor(tx.type)} shadow-md`}>
                    {getTransactionIcon(tx.type)}
                  </div>
                  
                  <div>
                    <div className="text-primary font-medium capitalize">
                      {tx.type === 'rebalance' ? 'Strategy Rebalance' : tx.type}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {tx.type === 'rebalance' 
                        ? `${tx.from} → ${tx.to}`
                        : tx.vault
                      }
                    </div>
                    {tx.txHash && (
                      <div className="text-xs text-muted-foreground font-mono">
                        {tx.txHash}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-primary font-medium">
                      {tx.type === 'withdraw' ? '-' : ''}${tx.amount?.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground text-sm">{tx.timestamp}</div>
                    {tx.gasUsed && (
                      <div className="text-xs text-muted-foreground">
                        Gas: {tx.gasUsed} ETH
                      </div>
                    )}
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {getStatusIcon(tx.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Last Updated Info */}
        <div className="text-center text-xs text-muted-foreground mt-6">
          Last updated: {new Date(portfolioData.lastUpdated).toLocaleString()}
        </div>
      </div>
    </div>
  );
}