'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Activity
} from 'lucide-react';

export function PortfolioDashboard() {
  const [timeframe, setTimeframe] = useState('7d');

  const portfolioStats = {
    totalValue: 12567.89,
    totalEarned: 1456.23,
    weeklyChange: 5.2,
    currentAPY: 14.8,
    positions: [
      {
        vault: 'Low Risk Vault',
        balance: 5200,
        earned: 234.56,
        apy: 8.2,
        allocation: 41.4
      },
      {
        vault: 'High Risk Vault',
        balance: 7367.89,
        earned: 1221.67,
        apy: 18.7,
        allocation: 58.6
      }
    ]
  };

  const transactions = [
    {
      type: 'deposit',
      amount: 2500,
      vault: 'High Risk Vault',
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      type: 'withdraw',
      amount: 1000,
      vault: 'Low Risk Vault',
      timestamp: '1 day ago',
      status: 'completed'
    },
    {
      type: 'rebalance',
      from: 'Low Risk',
      to: 'High Risk',
      amount: 500,
      timestamp: '2 days ago',
      status: 'completed'
    },
    {
      type: 'deposit',
      amount: 3000,
      vault: 'Low Risk Vault',
      timestamp: '3 days ago',
      status: 'completed'
    }
  ];

  const performanceData = {
    '7d': { change: 5.2, earned: 45.67 },
    '30d': { change: 12.8, earned: 234.56 },
    '90d': { change: 28.4, earned: 789.12 },
    '1y': { change: 45.6, earned: 1456.23 }
  };

  return (
    <div className="space-y-8">
      {/* Portfolio Overview */}
      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center text-base">
              <DollarSign className="w-4 h-4 mr-2 text-green-400" />
              Total Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">
              ${portfolioStats.totalValue.toLocaleString()}
            </div>
            <div className="text-green-400 text-sm flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{portfolioStats.weeklyChange}% this week
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center text-base">
              <TrendingUp className="w-4 h-4 mr-2 text-purple-400" />
              Total Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">
              ${portfolioStats.totalEarned.toLocaleString()}
            </div>
            <div className="text-purple-400 text-sm">All time</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center text-base">
              <Activity className="w-4 h-4 mr-2 text-blue-400" />
              Current APY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">
              {portfolioStats.currentAPY}%
            </div>
            <div className="text-blue-400 text-sm">Weighted average</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center text-base">
              <PieChart className="w-4 h-4 mr-2 text-yellow-400" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">Balanced</div>
            <div className="text-yellow-400 text-sm">58% High / 42% Low</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart & Allocation */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Performance</CardTitle>
                <div className="flex gap-2">
                  {Object.keys(performanceData).map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimeframe(period)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        timeframe === period
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg border border-white/10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    +{performanceData[timeframe as keyof typeof performanceData].change}%
                  </div>
                  <div className="text-slate-300">
                    ${performanceData[timeframe as keyof typeof performanceData].earned.toLocaleString()} earned in {timeframe}
                  </div>
                  <div className="text-sm text-slate-400 mt-2">
                    Interactive chart coming soon
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Portfolio Allocation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {portfolioStats.positions.map((position, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-medium">{position.vault}</span>
                  <Badge className={
                    position.vault.includes('Low') 
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                  }>
                    {position.apy}% APY
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Balance</span>
                    <span className="text-white">${position.balance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Earned</span>
                    <span className="text-green-400">+${position.earned.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Allocation</span>
                    <span className="text-white">{position.allocation}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.type === 'deposit' 
                      ? 'bg-green-500/20 text-green-400'
                      : tx.type === 'withdraw'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {tx.type === 'deposit' && <ArrowUpRight className="w-4 h-4" />}
                    {tx.type === 'withdraw' && <ArrowDownRight className="w-4 h-4" />}
                    {tx.type === 'rebalance' && <Activity className="w-4 h-4" />}
                  </div>
                  
                  <div>
                    <div className="text-white font-medium capitalize">
                      {tx.type === 'rebalance' ? 'Strategy Rebalance' : tx.type}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {tx.type === 'rebalance' 
                        ? `${tx.from} → ${tx.to}`
                        : tx.vault
                      }
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-medium">
                    {tx.type === 'withdraw' ? '-' : ''}${tx.amount?.toLocaleString()}
                  </div>
                  <div className="text-slate-400 text-sm">{tx.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}