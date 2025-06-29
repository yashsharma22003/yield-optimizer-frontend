'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Analytics from "../components/Analytics";

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
  CheckCircle,
  LineChart
} from 'lucide-react';
import { PortfolioDashboard } from '@/components/PortfolioDashboard';
import { StrategyOverview } from '@/components/StrategyOverview';
import { VaultInterface } from '@/components/VaultInterface';

/// web 3 imports
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function Home() {

  const [activeTab, setActiveTab] = useState('overview');
  const [dashActiveTab, setDashActiveTab] = useState(false);
  const { address, isConnected } = useAccount();
  const [liveStats, setLiveStats] = useState({
    tvl: 0,
    apy: 0,
    users: 0,
    uptime: 0
  });
  const [marketData, setMarketData] = useState({
    eth: 2000,
    btc: 40000,
    usdc: 1
  });

  function dashboard(param: boolean) {
    setDashActiveTab(param);
  }

  // Animate stats counter
  useEffect(() => {
    const targetStats = {
      tvl: 2500000,
      apy: 15.2,
      users: 1200,
      uptime: 99.9
    };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setLiveStats({
        tvl: Math.floor(targetStats.tvl * progress),
        apy: Number((targetStats.apy * progress).toFixed(1)),
        users: Math.floor(targetStats.users * progress),
        uptime: Number((targetStats.uptime * progress).toFixed(1))
      });
      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);
    return () => clearInterval(interval);
  }, []);

  // Simulate live market data
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => ({
        eth: prev.eth + (Math.random() - 0.5) * 10,
        btc: prev.btc + (Math.random() - 0.5) * 50,
        usdc: 1
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!dashActiveTab) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Live Market Ticker */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-4 py-2">
            <div className="flex justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-slate-300">ETH:</span>
                <span className="text-white font-mono">${marketData.eth.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-300">BTC:</span>
                <span className="text-white font-mono">${marketData.btc.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-300">USDC:</span>
                <span className="text-white font-mono">${marketData.usdc.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
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
        <section className="container mx-auto max-w-5xl px-4 py-24 text-center animate-fadein">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-wide text-white mb-8 leading-tight drop-shadow-lg">
              Unlock Smarter DeFi Yields
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
                with AI-Powered Optimization
              </span>
            </h1>
            <p className="text-2xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Harness the power of advanced AI agents and automated strategies to maximize your DeFi returns. Our protocol dynamically allocates your assets across top yield sources, balancing risk and reward for optimal growth.
            </p>
            <Button
              onClick={() => { dashboard(true) }}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-10 py-5 shadow-2xl rounded-2xl transition-all duration-300"
            >
              Launch App
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>

        {/* Combined Features Section */}
        <section className="container mx-auto max-w-6xl px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-wide">Protocol Features</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              AI-powered yield optimization with automated risk management and transparent reporting.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Risk Management */}
            <div className="bg-green-500/10 border border-green-400/20 rounded-2xl p-8 flex flex-col items-center shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fadein">
              <Shield className="w-12 h-12 text-green-400 mb-4" />
              <h4 className="text-xl font-semibold text-white mb-3">Risk Management</h4>
              <p className="text-slate-300 text-center">Choose your risk level: Low, Moderate, or High. AI optimizes within your comfort zone.</p>
            </div>

            {/* Technology & Security */}
            <div className="bg-blue-500/10 border border-blue-400/20 rounded-2xl p-8 flex flex-col items-center shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fadein">
              <Zap className="w-12 h-12 text-blue-400 mb-4" />
              <h4 className="text-xl font-semibold text-white mb-3">Chainlink Automation</h4>
              <p className="text-slate-300 text-center">Automated execution and monitoring powered by Chainlink for reliability and security.</p>
            </div>

            {/* Strategy Details */}
            <div className="bg-purple-500/10 border border-purple-400/20 rounded-2xl p-8 flex flex-col items-center shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fadein">
              <TrendingUp className="w-12 h-12 text-purple-400 mb-4" />
              <h4 className="text-xl font-semibold text-white mb-3">Yield Strategies</h4>
              <p className="text-slate-300 text-center">Stablecoin, Growth, and Experimental strategies for diverse yield opportunities.</p>
            </div>
          </div>
        </section>

        {/* Get Started Section */}
        <section className="w-full bg-gradient-to-r from-purple-800 via-blue-900 to-slate-900 py-16">
          <div className="max-w-2xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Optimize Your Yield?</h2>
            <p className="text-lg text-slate-300 mb-8">Connect your wallet and let our AI-powered protocol work for you. Start earning smarter, safer, and faster in DeFi today.</p>
            <Button
              onClick={() => { dashboard(true) }}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4 shadow-xl"
            >
              Launch App
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 py-20 animate-fadein">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">{liveStats.tvl ? `$${liveStats.tvl.toLocaleString()}` : '$0'}</div>
              <div className="text-slate-300">Total Value Locked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">{liveStats.apy ? `${liveStats.apy}%` : '0%'}</div>
              <div className="text-slate-300">Average APY</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">{liveStats.users ? `${liveStats.users.toLocaleString()}` : '0'}</div>
              <div className="text-slate-300">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">{liveStats.uptime ? `${liveStats.uptime}%` : '0%'}</div>
              <div className="text-slate-300">Uptime</div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full bg-slate-950 border-t border-white/10 py-6 mt-16 animate-fadein">
          <div className="container mx-auto max-w-5xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6 text-purple-400" />
              <span className="text-lg font-semibold text-white">AI Yield Vaults</span>
            </div>
            <div className="flex space-x-6">
              <a href="https://docs.yieldvaults.ai" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition">Documentation</a>
              <a href="https://twitter.com/yourprotocol" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition">Twitter</a>
              <a href="https://discord.gg/yourprotocol" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition">Discord</a>
            </div>
            <div className="text-slate-400 text-sm">© {new Date().getFullYear()} AI Yield Vaults. All rights reserved.</div>
          </div>
        </footer>
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
          <TabsList className="grid w-full grid-cols-5 bg-white/5 backdrop-blur-sm">
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
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              <LineChart className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Quick Stats */}
              <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-lg hover:shadow-2xl rounded-2xl transition-all duration-300 animate-fadein">
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

                <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-lg hover:shadow-2xl rounded-2xl transition-all duration-300 animate-fadein">
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

                <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-lg hover:shadow-2xl rounded-2xl transition-all duration-300 animate-fadein">
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

                <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-lg hover:shadow-2xl rounded-2xl transition-all duration-300 animate-fadein">
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
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-lg hover:shadow-2xl rounded-2xl transition-all duration-300 animate-fadein">
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

          <TabsContent value="analytics" className="mt-8">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}