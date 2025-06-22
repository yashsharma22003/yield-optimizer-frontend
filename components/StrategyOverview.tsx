'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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

export function StrategyOverview() {
  const strategies = [
    {
      name: 'Aave Conservative Strategy',
      protocol: 'Aave',
      risk: 'Low',
      apy: '8.2%',
      tvl: '$1.2M',
      allocation: 45,
      performance: '+5.2%',
      status: 'Active',
      description: 'Deposits USDC into Aave lending pools with low risk exposure',
      riskColor: 'green',
      statusColor: 'green'
    },
    {
      name: 'Morpho Aggressive Strategy',
      protocol: 'Morpho',
      risk: 'High',
      apy: '18.7%',
      tvl: '$850K',
      allocation: 55,
      performance: '+12.8%',
      status: 'Active',
      description: 'Leveraged lending strategy on Morpho with higher yield potential',
      riskColor: 'red',
      statusColor: 'green'
    },
    {
      name: 'Compound Moderate Strategy',
      protocol: 'Compound',
      risk: 'Medium',
      apy: '12.4%',
      tvl: '$650K',
      allocation: 0,
      performance: '+8.1%',
      status: 'Standby',
      description: 'Balanced approach using Compound V3 lending markets',
      riskColor: 'yellow',
      statusColor: 'yellow'
    }
  ];

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
                <Progress value={metric.value} className="h-2" />
                <p className="text-sm text-slate-400">{metric.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategy Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {strategies.map((strategy, index) => (
          <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-white flex items-center">
                  {strategy.risk === 'Low' && <Shield className="w-5 h-5 mr-2 text-green-400" />}
                  {strategy.risk === 'High' && <TrendingUp className="w-5 h-5 mr-2 text-red-400" />}
                  {strategy.risk === 'Medium' && <BarChart3 className="w-5 h-5 mr-2 text-yellow-400" />}
                  {strategy.name}
                </CardTitle>
                <Badge 
                  className={`${
                    strategy.statusColor === 'green' 
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
                    className={`${
                      strategy.riskColor === 'green' 
                        ? 'bg-green-500/20 text-green-300' 
                        : strategy.riskColor === 'red'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-yellow-500/20 text-yellow-300'
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
                  <span className="text-white font-medium">{strategy.allocation}%</span>
                </div>
                <Progress value={strategy.allocation} className="h-2" />
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
                AI analyzing Compound V3 integration for moderate risk exposure.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}