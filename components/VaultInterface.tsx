'use client';

import { useEffect, useState } from 'react';
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

/// web3 imports
import { depositHigh, withdrawHigh, getBalanceHigh  } from '../contractContext/highRiskContext';
import { depositLow, withdrawLow, getBalanceLow } from '../contractContext/lowRiskContext';
import { approveUSDC } from '../contractContext/usdcContext';
import { useAccount } from 'wagmi';

export function VaultInterface() {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [riskLevel, setRiskLevel] = useState('low'); // Default to low
  const [activeAction, setActiveAction] = useState('deposit');
  const [balanceHigh, setBalanceHigh] = useState('');
  const [balanceLow, setBalanceLow] = useState('');
  const [vaultData, setVaultData] = useState({
    lowRisk: {
      name: 'Loading...',
      apy: '...',
      strategy: 'Loading...',
      risk: 'Low',
      address: '0xb32a6FF65dcC2099513970EA5c1eaA87fe564253' // Default/fallback address
    },
    highRisk: {
      name: 'Loading...',
      apy: '...',
      strategy: 'Loading...',
      risk: 'High',
      address: '0x721bF349E453cbFB68536d3a5757A70B74D84279' // Default/fallback address
    }
  });
  const { address, isConnected } = useAccount();

  const mockVaults = {
    high: "0x721bF349E453cbFB68536d3a5757A70B74D84279",
    low: "0xb32a6FF65dcC2099513970EA5c1eaA87fe564253"
  }

  // This useEffect now fetches data for BOTH low and high risk vaults
  useEffect(() => {
    async function fetchVaultData() {
      try {
        // Fetch both endpoints concurrently for better performance
        const [lowResponse, highResponse] = await Promise.all([
          fetch('https://eliza-agent.onrender.com/latest/low'), // Using the proxy
          fetch('https://eliza-agent.onrender.com/latest/high') // Using the proxy
        ]);

        if (!lowResponse.ok || !highResponse.ok) {
            throw new Error('Failed to fetch vault data from one or more endpoints');
        }

        const lowData = await lowResponse.json();
        const highData = await highResponse.json();
        
        console.log("Fetched low-risk data:", lowData);
        console.log("Fetched high-risk data:", highData);

        // Update the state with data for both vaults
        setVaultData({
          lowRisk: {
            name: `${lowData.selectedPool.platform} ${lowData.trend === 'uptrend' ? 'Growth' : 'Conservative'}`,
            apy: `${lowData.selectedPool.apy.toFixed(2)}%`,
            strategy: `${lowData.selectedPool.platform} Lending`,
            risk: lowData.risk,
            address: lowData.selectedPool.address
          },
          highRisk: {
            name: `${highData.selectedPool.platform} ${highData.trend === 'uptrend' ? 'Aggressive' : 'Conservative'}`,
            apy: `${highData.selectedPool.apy.toFixed(2)}%`,
            strategy: `${highData.selectedPool.platform} Lending`,
            risk: highData.risk,
            address: highData.selectedPool.address
          }
        });

      } catch (error) {
        console.error("Failed to fetch vault data:", error);
        // Fallback to default data in case of an error
      }
    }

    fetchVaultData();
    handleRead();
  }, [address]); // Added 'address' as a dependency to refetch balances if the account changes

  async function handleDeposit() {
    try {
      if (activeAction === 'deposit' && depositAmount) {
        if (riskLevel === 'low') {
          await approveUSDC(mockVaults.low, depositAmount);
          await depositLow(depositAmount);
        } else {
          await approveUSDC(mockVaults.high, depositAmount);
          await depositHigh(depositAmount);
        }
      }
    } catch (error) {
      console.error("Deposit error:", error);
      alert("An error occurred while processing your deposit. Please try again.");
    }
  }

  function handleWithdraw() {
    try {
      if (activeAction === 'withdraw' && withdrawAmount) {
        if (riskLevel === 'low') {
          withdrawLow(withdrawAmount);
        } else {
          withdrawHigh(withdrawAmount);
        }
      }
    } catch (error) {
      console.error("Withdraw error:", error);
      alert("An error occurred while processing your withdrawal. Please try again.");
    }
  }

  async function handleRead(){
    if (!address) return; // Don't try to read if wallet is not connected
    try{
      const [balanceHighFetched, balanceLowFetched] = await Promise.all([
        getBalanceHigh(address),
        getBalanceLow(address)
      ]);

      setBalanceHigh(balanceHighFetched || '0.00');
      setBalanceLow(balanceLowFetched || '0.00');
    } catch (error) {
      console.error("Read error:", error);
      // Don't alert here as it can be annoying on page load
    }
  }

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
              </div>

              <div>
                <Label className="text-white mb-4 block">Risk Preference</Label>
                <RadioGroup value={riskLevel} onValueChange={setRiskLevel}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-white/10 hover:border-green-500/30 transition-colors">
                      <RadioGroupItem value="low" id="low" />
                      <div className="flex-1">
                        <Label htmlFor="low" className="text-white font-medium">{vaultData.lowRisk.risk} Risk</Label>
                        <p className="text-sm text-slate-400">{vaultData.lowRisk.strategy}</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300">{vaultData.lowRisk.apy} APY</Badge>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-white/10 hover:border-red-500/30 transition-colors">
                      <RadioGroupItem value="high" id="high" />
                      <div className="flex-1">
                        <Label htmlFor="high" className="text-white font-medium">{vaultData.highRisk.risk} Risk</Label>
                        <p className="text-sm text-slate-400">{vaultData.highRisk.strategy}</p>
                      </div>
                      <Badge className="bg-red-500/20 text-red-300">{vaultData.highRisk.apy} APY</Badge>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800" onClick={handleDeposit}>
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
                    <span>Available: {riskLevel === 'low' ? balanceLow : balanceHigh} USDC</span>
                    <button className="text-purple-400 hover:text-purple-300">Max</button>
                  </div>
              </div>

              {/* ... (Withdraw RadioGroup is similar and can also be updated if needed) ... */}
              
              <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                onClick={handleWithdraw}>
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
                <span className="text-white">{vaultData.lowRisk.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Current APY</span>
                <span className="text-green-400 font-bold">{vaultData.lowRisk.apy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Your Balance</span>
                <span className="text-white">{balanceLow} USDC</span>
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
                <span className="text-white">{vaultData.highRisk.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Current APY</span>
                <span className="text-red-400 font-bold">{vaultData.highRisk.apy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Your Balance</span>
                <span className="text-white">{balanceHigh} USDC</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ... (AI Insights Card remains the same) ... */}
      </div>
    </div>
  );
}