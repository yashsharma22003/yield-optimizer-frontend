'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Shield, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  Activity,
  AlertTriangle,
  Bot
} from 'lucide-react';

export function VaultInterface() {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [riskLevel, setRiskLevel] = useState('moderate');
  const [activeAction, setActiveAction] = useState('deposit');

  const vaultData = {
    lowRisk: {
      name: 'Aave Conservative',
      apy: '8.2%',
      tvl: '$1.2M',
      strategy: 'Aave Lending',
      risk: 'Low',
      color: 'green'
    },
    highRisk: {
      name: 'Morpho Aggressive',
      apy: '18.7%',
      tvl: '$850K',
      strategy: 'Morpho Lending',
      risk: 'High',
      color: 'red'
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Deposit/Withdraw Interface */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-400" />
            Vault Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeAction} onValueChange={setActiveAction}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="deposit" className="data-[state=active]:bg-green-600">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Deposit
              </TabsTrigger>
              <TabsTrigger value="withdraw" className="data-[state=active]:bg-red-600">
                <ArrowDownRight className="w-4 h-4 mr-2" />
                Withdraw
              </TabsTrigger>
            </TabsList>

            <TabsContent value="deposit" className="space-y-6">
              <div>
                <Label htmlFor="deposit-amount" className="text-white mb-2 block">
                  Amount (USDC)
                </Label>
                <Input
                  id="deposit-amount"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                />
                <div className="flex justify-between text-sm text-slate-400 mt-2">
                  <span>Balance: 5,000 USDC</span>
                  <button className="text-purple-400 hover:text-purple-300">Max</button>
                </div>
              </div>

              <div>
                <Label className="text-white mb-4 block">Risk Preference</Label>
                <RadioGroup value={riskLevel} onValueChange={setRiskLevel}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-white/10 hover:border-green-500/30 transition-colors">
                      <RadioGroupItem value="low" id="low" />
                      <div className="flex-1">
                        <Label htmlFor="low" className="text-white font-medium">Low Risk</Label>
                        <p className="text-sm text-slate-400">Conservative Aave strategy</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300">8.2% APY</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-white/10 hover:border-red-500/30 transition-colors">
                      <RadioGroupItem value="high" id="high" />
                      <div className="flex-1">
                        <Label htmlFor="high" className="text-white font-medium">High Risk</Label>
                        <p className="text-sm text-slate-400">Aggressive Morpho strategy</p>
                      </div>
                      <Badge className="bg-red-500/20 text-red-300">18.7% APY</Badge>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                Deposit USDC
              </Button>
            </TabsContent>

            <TabsContent value="withdraw" className="space-y-6">
              <div>
                <Label htmlFor="withdraw-amount" className="text-white mb-2 block">
                  Amount (USDC)
                </Label>
                <Input
                  id="withdraw-amount"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                />
                <div className="flex justify-between text-sm text-slate-400 mt-2">
                  <span>Available: 2,500 USDC</span>
                  <button className="text-purple-400 hover:text-purple-300">Max</button>
                </div>
              </div>

              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="text-yellow-300 font-medium">Withdrawal Notice</span>
                </div>
                <p className="text-sm text-slate-300">
                  Withdrawals may take up to 24 hours to process depending on strategy liquidity.
                </p>
              </div>

              <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                Withdraw USDC
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Active Vaults */}
      <div className="space-y-6">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-400" />
              Low Risk Vault
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-300">Strategy</span>
                <span className="text-white">Aave Conservative</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Current APY</span>
                <span className="text-green-400 font-bold">8.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Your Balance</span>
                <span className="text-white">1,200 USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Earned</span>
                <span className="text-green-400">+45.67 USDC</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-red-400" />
              High Risk Vault
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-300">Strategy</span>
                <span className="text-white">Morpho Aggressive</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Current APY</span>
                <span className="text-red-400 font-bold">18.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Your Balance</span>
                <span className="text-white">1,300 USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Earned</span>
                <span className="text-red-400">+123.45 USDC</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Bot className="w-5 h-5 mr-2 text-purple-400" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <p className="text-sm text-slate-300">
                  <strong className="text-purple-300">Market Analysis:</strong> Current conditions favor moderate risk exposure with 60/40 allocation.
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-slate-300">
                  <strong className="text-blue-300">Next Rebalance:</strong> Scheduled in 4 hours based on yield optimization algorithms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}