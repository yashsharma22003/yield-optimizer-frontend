'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import {
  Wallet,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  ArrowUpRight,
  ArrowLeft,
  DollarSign,
  Activity,
  Bot,
  PieChart,
  Clock,
  CheckCircle
} from 'lucide-react';
import { VaultInterface } from '@/components/VaultInterface';
import { PortfolioDashboard } from '@/components/PortfolioDashboard';
import { StrategyOverview } from '@/components/StrategyOverview';

/// web 3 imports
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function Home() {

  const [activeTab, setActiveTab] = useState('overview');
  const [dashActiveTab, setDashActiveTab] = useState(false);
  const { address, isConnected } = useAccount();

  function dashboard(param: boolean) {
    setDashActiveTab(param);
  }


  if (!dashActiveTab) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AI Yield Vaults</span>
            </div>
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus || authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' },
                    })}
                  >
                    {!connected ? (
                      <Button
                        onClick={openConnectModal}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Wallet className="w-4 h-4 mr-2" />
                        Connect Wallet
                      </Button>
                    ) : chain.unsupported ? (
                      <Button
                        onClick={openChainModal}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Wrong network
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={openChainModal} variant="outline">
                          {chain.hasIcon && chain.iconUrl && (
                            <img
                              src={chain.iconUrl}
                              alt={chain.name ?? 'Chain icon'}
                              className="w-4 h-4 rounded-full mr-2"
                            />
                          )}
                          {chain.name}
                        </Button>
                        <Button onClick={openAccountModal} variant="outline">
                          {account.displayName}
                          {account.displayBalance ? ` (${account.displayBalance})` : ''}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              AI-Powered
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
                Yield Optimization
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Maximize your DeFi yields with intelligent strategy allocation powered by AI agents and Chainlink automation
            </p>
            <Button
              onClick={() => { dashboard(true) }}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4"
            >
              Get Started
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <Bot className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">AI Strategy Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Advanced AI agents analyze market conditions to select optimal yield strategies automatically
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <Shield className="w-12 h-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">Risk Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Choose your risk preference and let our protocol optimize returns within your comfort zone
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <Zap className="w-12 h-12 text-green-400 mb-4" />
                <CardTitle className="text-white">Automated Execution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Chainlink automation ensures seamless strategy execution and fund allocation
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">$2.5M+</div>
              <div className="text-slate-300">Total Value Locked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">15.2%</div>
              <div className="text-slate-300">Average APY</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">1,200+</div>
              <div className="text-slate-300">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-slate-300">Uptime</div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AI Yield Vaults</span>
          </div>
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus || authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' },
                  })}
                >
                  {!connected ? (
                    <Button
                      onClick={openConnectModal}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </Button>
                  ) : chain.unsupported ? (
                    <Button
                      onClick={openChainModal}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Wrong network
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={openChainModal} variant="outline">
                        {chain.hasIcon && chain.iconUrl && (
                          <img
                            src={chain.iconUrl}
                            alt={chain.name ?? 'Chain icon'}
                            className="w-4 h-4 rounded-full mr-2"
                          />
                        )}
                        {chain.name}
                      </Button>
                      <Button onClick={openAccountModal} variant="outline">
                        {account.displayName}
                        {account.displayBalance ? ` (${account.displayBalance})` : ''}
                      </Button>
                    </div>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </header>
      <Button
        onClick={() => { dashboard(false) }}
        size="lg"
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-4 py-2 ml-4 mt-4"
      >
        Close
        <ArrowLeft className="w-5 h-5 ml-2" />
      </Button>
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 backdrop-blur-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="vaults" className="data-[state=active]:bg-purple-600">
              <Wallet className="w-4 h-4 mr-2" />
              Vaults
            </TabsTrigger>
            <TabsTrigger value="strategies" className="data-[state=active]:bg-purple-600">
              <Bot className="w-4 h-4 mr-2" />
              Strategies
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-purple-600">
              <PieChart className="w-4 h-4 mr-2" />
              Portfolio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Quick Stats */}
              <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                      Total Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white mb-2">$12,567.89</div>
                    <div className="text-green-400 text-sm flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +5.2% this week
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-blue-400" />
                      Current APY
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white mb-2">14.8%</div>
                    <div className="text-blue-400 text-sm flex items-center">
                      <Bot className="w-4 h-4 mr-1" />
                      AI Optimized
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                      Total Earned
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white mb-2">$1,456.23</div>
                    <div className="text-purple-400 text-sm">All time</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-yellow-400" />
                      Risk Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white mb-2">Moderate</div>
                    <div className="text-yellow-400 text-sm">Balanced allocation</div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Recommendations */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Bot className="w-5 h-5 mr-2 text-purple-400" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-green-300 font-medium">Optimal Strategy</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      Current allocation is performing well. Consider increasing position.
                    </p>
                  </div>

                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 text-blue-400 mr-2" />
                      <span className="text-blue-300 font-medium">Market Update</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      Aave yields trending upward. Strategy rebalancing in 6 hours.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vaults" className="mt-8">
            <VaultInterface />
          </TabsContent>

          <TabsContent value="strategies" className="mt-8">
            <StrategyOverview />
          </TabsContent>

          <TabsContent value="portfolio" className="mt-8">
            <PortfolioDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}