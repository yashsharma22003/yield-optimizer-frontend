'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import toast from 'react-hot-toast';
import {
  Shield,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Clock,
  AlertCircle,
  Lock
} from 'lucide-react';

/// web3 imports
import { depositHigh, getBalanceHigh  } from '../contractContext/highRiskContext';
import { depositLow, getBalanceLow } from '../contractContext/lowRiskContext';
import { approveUSDC } from '../contractContext/usdcContext';
import { useAccount } from 'wagmi';

export function VaultInterface() {
  const [depositAmount, setDepositAmount] = useState('');
  const [riskLevel, setRiskLevel] = useState('low');
  const [activeAction, setActiveAction] = useState('deposit');
  const [balanceHigh, setBalanceHigh] = useState('');
  const [balanceLow, setBalanceLow] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [vaultData, setVaultData] = useState({
    lowRisk: {
      name: 'Loading...',
      apy: '...',
      strategy: 'Loading...',
      risk: 'Low',
      address: '0xb32a6FF65dcC2099513970EA5c1eaA87fe564253'
    },
    highRisk: {
      name: 'Loading...',
      apy: '...',
      strategy: 'Loading...',
      risk: 'High',
      address: '0x721bF349E453cbFB68536d3a5757A70B74D84279'
    }
  });
  
  const { address, isConnected } = useAccount();

  const mockVaults = {
    high: "0x721bF349E453cbFB68536d3a5757A70B74D84279",
    low: "0xb32a6FF65dcC2099513970EA5c1eaA87fe564253"
  }

  useEffect(() => {
    async function fetchVaultData() {
      try {
        const [lowResponse, highResponse] = await Promise.all([
          fetch('https://eliza-agent.onrender.com/latest/low'),
          fetch('https://eliza-agent.onrender.com/latest/high')
        ]);

        if (!lowResponse.ok || !highResponse.ok) {
            throw new Error('Failed to fetch vault data');
        }

        const lowData = await lowResponse.json();
        const highData = await highResponse.json();
        
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
        toast.error("Couldn't fetch vault strategy data");
      }
    }

    fetchVaultData();
    handleRead();
  }, [address]);

  async function handleDeposit() {
    if (!depositAmount) {
      toast.error("Please enter a deposit amount");
      return;
    }
    
    setIsProcessing(true);
    const toastId = toast.loading("Confirming transaction in your wallet...");
    
    try {
      if (riskLevel === 'low') {
        await approveUSDC(mockVaults.low, depositAmount);
        await depositLow(depositAmount);
      } else {
        await approveUSDC(mockVaults.high, depositAmount);
        await depositHigh(depositAmount);
      }
      
      toast.success(`Your USDC has been deposited to the ${riskLevel} risk vault`, {
        id: toastId
      });
      
      // Clear input and refresh balances
      setDepositAmount('');
      setTimeout(handleRead, 3000);
      
    } catch (error: any) {
      console.error("Deposit error:", error);
      
      let errorMessage = "An error occurred during deposit";
      if (error.message.includes("rejected")) {
        errorMessage = "Transaction rejected by user";
      } else if (error.message.includes("insufficient")) {
        errorMessage = "Insufficient USDC balance";
      }
      
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleRead(){
    if (!address) return;
    try{
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
              <TabsTrigger value="withdraw" className="data-[state=active]:bg-red-600 opacity-50 cursor-not-allowed">
                <ArrowDownRight className="w-4 h-4 mr-2" />
                Withdraw (Locked)
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
                  disabled={isProcessing}
                />
              </div>

              <div>
                <Label className="text-white mb-4 block">Risk Preference</Label>
                <RadioGroup value={riskLevel} onValueChange={setRiskLevel}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-white/10 hover:border-green-500/30 transition-colors">
                      <RadioGroupItem value="low" id="low" disabled={isProcessing} />
                      <div className="flex-1">
                        <Label htmlFor="low" className="text-white font-medium">{vaultData.lowRisk.risk} Risk</Label>
                        <p className="text-sm text-slate-400">{vaultData.lowRisk.strategy}</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300">{vaultData.lowRisk.apy} APY</Badge>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-white/10 hover:border-red-500/30 transition-colors">
                      <RadioGroupItem value="high" id="high" disabled={isProcessing} />
                      <div className="flex-1">
                        <Label htmlFor="high" className="text-white font-medium">{vaultData.highRisk.risk} Risk</Label>
                        <p className="text-sm text-slate-400">{vaultData.highRisk.strategy}</p>
                      </div>
                      <Badge className="bg-red-500/20 text-red-300">{vaultData.highRisk.apy} APY</Badge>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                onClick={handleDeposit}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Deposit USDC"}
              </Button>
            </TabsContent>

            <TabsContent value="withdraw" className="space-y-6">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-300 mb-1">Funds Currently Allocated</h4>
                    <p className="text-sm text-yellow-200">
                      Your funds are actively deployed in yield-generating strategies and cannot be withdrawn at this time.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-red-400 mr-2" />
                  <div>
                    <h4 className="font-medium text-red-300 mb-1">Withdrawals Temporarily Disabled</h4>
                    <p className="text-sm text-red-200">
                      To maximize yield generation, funds are locked during active allocation periods. 
                      Withdrawal functionality will be enabled during the next rebalancing cycle.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="opacity-50 cursor-not-allowed">
                <Label htmlFor="withdraw-amount" className="text-white mb-2 block">
                  Amount (USDC)
                </Label>
                <Input
                  id="withdraw-amount"
                  placeholder="0.00"
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                  disabled={true}
                />
                 <div className="flex justify-between text-sm text-slate-400 mt-2">
                    <span>Available: {riskLevel === 'low' ? balanceLow : balanceHigh} USDC</span>
                    <button 
                      className="text-purple-400 hover:text-purple-300 opacity-50 cursor-not-allowed"
                      disabled={true}
                    >
                      Max
                    </button>
                  </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-red-600/50 to-red-700/50 text-white/50 cursor-not-allowed"
                disabled={true}
              >
                Withdrawals Disabled
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
              <div className="pt-2 border-t border-white/10 mt-2">
                <div className="flex items-center text-sm text-yellow-300">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Funds are actively generating yield</span>
                </div>
                <div className="flex items-center text-sm text-red-300 mt-1">
                  <Lock className="w-4 h-4 mr-2" />
                  <span>Withdrawals disabled during allocation period</span>
                </div>
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
              <div className="pt-2 border-t border-white/10 mt-2">
                <div className="flex items-center text-sm text-yellow-300">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Funds are actively generating yield</span>
                </div>
                <div className="flex items-center text-sm text-red-300 mt-1">
                  <Lock className="w-4 h-4 mr-2" />
                  <span>Withdrawals disabled during allocation period</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}