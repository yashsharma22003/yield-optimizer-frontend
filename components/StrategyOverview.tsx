'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';
import {
  Shield,
  TrendingUp,
  Activity,
  BarChart3,
  Bot,
  Clock,
  DollarSign,
  Zap
} from 'lucide-react';

import { getBalanceHigh } from '../contractContext/highRiskContext';
import { getBalanceLow } from '../contractContext/lowRiskContext';

import { useAccount } from 'wagmi';

type Strategy = {
  name: string;
  protocol: string;
  risk: 'Low' | 'High';
  apy: string;
  tvl: string;
  allocation: number;
  performance: string;
  status: 'Active' | 'Standby' | 'Loading...';
  description: string;
  riskColor: 'green' | 'red';
  statusColor: 'green' | 'yellow';
};

type ApiResponse = {
  timestamp: number;
  trend: string;
  risk: 'high' | 'low';
  selectedPool: {
    address: string;
    apy: number;
    platform: string;
    asset: string;
  };
};

export function StrategyOverview() {
  const [balanceHigh, setBalanceHigh] = useState<string | null>(null);
  const [balanceLow, setBalanceLow] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const [percentage, setPercentage] = useState<{ high: string; low: string }>({ high: '0.00', low: '0.00' });

  async function handleRead() {
    if (!address) return;
    try {
      const [balanceHighFetched, balanceLowFetched] = await Promise.all([
        getBalanceHigh(address),
        getBalanceLow(address)
      ]);

      setBalanceHigh(balanceHighFetched || '0.00');
      setBalanceLow(balanceLowFetched || '0.00');
    } catch (error) {
      console.error("Read error:", error);
    }
  }

  async function calculatePercentage() {
    const balanceHigh = await getBalanceHigh(address);
    const balanceLow = await getBalanceLow(address);
    if (balanceHigh && balanceLow) {
      const total = parseFloat(balanceHigh) + parseFloat(balanceLow);
      const highPercentage = ((parseFloat(balanceHigh) / total) * 100).toFixed(2);
      const lowPercentage = ((parseFloat(balanceLow) / total) * 100).toFixed(2);
      setPercentage({ high: highPercentage, low: lowPercentage });
      return { high: highPercentage, low: lowPercentage };
    }
    return { high: '0.00', low: '0.00' };
  }
  
  useEffect(() => {
    handleRead();
    calculatePercentage();
  }, []);

  // Only two strategies now: Low and High Risk
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      name: 'Conservative Strategy',
      protocol: 'Loading...',
      risk: 'Low',
      apy: 'Loading...',
      tvl: 'Loading...',
      allocation: 0,
      performance: 'Loading...',
      status: 'Loading...',
      description: 'Deposits into low-risk lending pools.',
      riskColor: 'green',
      statusColor: 'yellow'
    },
    {
      name: 'Aggressive Strategy',
      protocol: 'Loading...',
      risk: 'High',
      apy: 'Loading...',
      tvl: 'Loading...',
      allocation: 0,
      performance: 'Loading...',
      status: 'Loading...',
      description: 'Leveraged lending strategy for higher yield.',
      riskColor: 'red',
      statusColor: 'yellow'
    }
  ]);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const [lowRes, highRes] = await Promise.all([
          fetch('https://eliza-agent.onrender.com/latest/low'),
          fetch('https://eliza-agent.onrender.com/latest/high')
        ]);

        if (!lowRes.ok || !highRes.ok) {
          throw new Error('Network response was not ok');
        }

        const lowData: ApiResponse = await lowRes.json();
        const highData: ApiResponse = await highRes.json();
        
        const fetchedLowStrategy: Strategy = {
          name: `${lowData.selectedPool.platform} Conservative`,
          protocol: lowData.selectedPool.platform,
          risk: 'Low',
          apy: `${lowData.selectedPool.apy.toFixed(2)}%`,
          tvl: '$1.2M',
          allocation: 45,
          performance: '+5.2%',
          status: 'Active',
          description: `Deposits ${lowData.selectedPool.asset} into ${lowData.selectedPool.platform} with low risk exposure.`,
          riskColor: 'green',
          statusColor: 'green'
        };

        const fetchedHighStrategy: Strategy = {
          name: `${highData.selectedPool.platform} Aggressive`,
          protocol: highData.selectedPool.platform,
          risk: 'High',
          apy: `${highData.selectedPool.apy.toFixed(2)}%`,
          tvl: '$850K',
          allocation: 55,
          performance: '+12.8%',
          status: 'Active',
          description: `Leveraged lending of ${highData.selectedPool.asset} on ${highData.selectedPool.platform}.`,
          riskColor: 'red',
          statusColor: 'green'
        };

        // Set only the two strategies
        setStrategies([
          fetchedLowStrategy,
          fetchedHighStrategy
        ]);

      } catch (error) {
        console.error("Failed to fetch strategy data:", error);
      }
    };

    fetchStrategies();
  }, []);

  const aiMetrics = [
    {
      label: 'Strategy Optimization Score',
      value: 94,
      description: 'AI confidence in current allocation'
    },
    {
      label: 'Risk-Adjusted Return',
      value: 87,
      description: 'Performance relative to risk taken'
    },
    {
      label: 'Market Efficiency',
      value: 91,
      description: 'How well strategies capture market opportunities'
    }
  ];

  return (
    <div className="space-y-8">
      {/* AI Performance Metrics */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Bot className="w-5 h-5 mr-2 text-purple-400" />
            AI Strategy Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {aiMetrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{metric.label}</span>
                  <span className="text-purple-400 font-bold">{metric.value}%</span>
                </div>
                {/* <Progress value={metric.value} className="h-2" /> */}
                <p className="text-sm text-slate-400">{metric.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategy Cards - Now only 2 columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {strategies.map((strategy, index) => (
          <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-white flex items-center">
                  {strategy.risk === 'Low' && <Shield className="w-5 h-5 mr-2 text-green-400" />}
                  {strategy.risk === 'High' && <TrendingUp className="w-5 h-5 mr-2 text-red-400" />}
                  {strategy.name}
                </CardTitle>
                <Badge
                  className={`${strategy.statusColor === 'green'
                      ? 'bg-green-500/20 text-green-300 border-green-500/30'
                      : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    }`}
                >
                  {strategy.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 text-sm">{strategy.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-400 text-sm">Protocol</div>
                  <div className="text-white font-medium">{strategy.protocol}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Risk Level</div>
                  <Badge
                    className={`${strategy.riskColor === 'green'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-red-500/20 text-red-300'
                      }`}
                  >
                    {strategy.risk}
                  </Badge>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Current APY</div>
                  <div className="text-white font-bold text-lg">{strategy.apy}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">7d Performance</div>
                  <div className="text-green-400 font-medium">{strategy.performance}</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400 text-sm">Portfolio Allocation</span>
                  <span className="text-white font-medium">
                    {strategy.risk === "High" ? percentage.high : percentage.low}%
                  </span>
                </div>
                {/* <Progress value={Number(strategy.risk === "High" ? percentage.high : percentage.low)} className="h-2" /> */}
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">TVL</span>
                  <span className="text-white">{strategy.tvl}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-400" />
              Market Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center mb-2">
                <DollarSign className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-blue-300 font-medium">USDC Rates</span>
              </div>
              <p className="text-sm text-slate-300">
                Lending rates have increased 2.3% over the past week, favoring yield strategies.
              </p>
            </div>

            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-green-300 font-medium">Volatility</span>
              </div>
              <p className="text-sm text-slate-300">
                Low market volatility detected. Conservative strategies performing well.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="w-5 h-5 mr-2 text-purple-400" />
              Upcoming Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center mb-2">
                <Zap className="w-4 h-4 text-purple-400 mr-2" />
                <span className="text-purple-300 font-medium">Rebalancing</span>
              </div>
              <p className="text-sm text-slate-300">
                Scheduled rebalancing in 3 hours 42 minutes based on yield analysis.
              </p>
            </div>

            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center mb-2">
                <Bot className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-yellow-300 font-medium">Strategy Review</span>
              </div>
              <p className="text-sm text-slate-300">
                AI analyzing new protocols for enhanced risk-adjusted returns.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}