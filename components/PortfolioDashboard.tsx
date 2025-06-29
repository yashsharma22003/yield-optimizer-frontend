'use client';

import { useEffect, useState } from 'react';
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
    Activity,
    BookCopy,
    ExternalLink
} from 'lucide-react';

import { getBalanceHigh, getPastEvents as getPastEventsHigh } from '@/contractContext/highRiskContext';
import { getBalanceLow, getPastEventsLow as getPastEventsLow } from '@/contractContext/lowRiskContext';
import { useAccount } from 'wagmi';

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

type EventLog = {
    type: 'Deposit' | 'Withdrawal' | 'Rebalance';
    vault: 'High Risk Vault' | 'Low Risk Vault';
    description: string;
    timestamp: string;
    txHash: string;
};

export function PortfolioDashboard() {
    const [timeframe, setTimeframe] = useState('7d');
    const [highBalance, setHighBalance] = useState(0);
    const [lowBalance, setLowBalance] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);
    const [lowRiskData, setLowRiskData] = useState<ApiResponse | null>(null);
    const [highRiskData, setHighRiskData] = useState<ApiResponse | null>(null);
    const [eventLogs, setEventLogs] = useState<EventLog[]>([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);
    const { address } = useAccount();

    const fetchData = async () => {
        if (!address) return;
        
        setIsLoadingEvents(true);

        try {
            // Define all promises
            const promises = [
                getBalanceHigh(address),
                getBalanceLow(address),
                fetch('https://eliza-agent.onrender.com/latest/high').then(res => res.json()),
                fetch('https://eliza-agent.onrender.com/latest/low').then(res => res.json()),
                getPastEventsHigh('VaultDeposit'),
                getPastEventsHigh('VaultWithdraw'),
                getPastEventsLow('VaultDeposit'),
                getPastEventsLow('VaultWithdraw'),
            ];

            const [
                highBalanceResult,
                lowBalanceResult,
                highRiskApiResult,
                lowRiskApiResult,
                highRiskDeposits,
                highRiskWithdrawals,
                lowRiskDeposits,
                lowRiskWithdrawals,
            ] = await Promise.all(promises);

            // Process Balances and API Data
            const highBalance = Number(highBalanceResult) || 0;
            const lowBalance = Number(lowBalanceResult) || 0;
            setHighBalance(highBalance);
            setLowBalance(lowBalance);
            setTotalBalance(highBalance + lowBalance);
            setHighRiskData(highRiskApiResult);
            setLowRiskData(lowRiskApiResult);
            
            // Process Event Logs
            const processEvents = (events: any[], type: EventLog['type'], vault: EventLog['vault']): EventLog[] => {
    if (!events) return [];
    return events.map(event => ({
        type,
        vault,
        description: `${type === 'Deposit' ? 'Deposited' : 'Withdrew'} assets from ${vault}`,
        timestamp: event.timestamp,
        txHash: event.transactionHash
    } as EventLog)); // Explicitly type the returned object
};

// Create the allEvents array with proper typing
const allEvents: EventLog[] = [
    ...processEvents(highRiskDeposits, 'Deposit', 'High Risk Vault'),
    ...processEvents(highRiskWithdrawals, 'Withdrawal', 'High Risk Vault'),
    ...processEvents(lowRiskDeposits, 'Deposit', 'Low Risk Vault'),
    ...processEvents(lowRiskWithdrawals, 'Withdrawal', 'Low Risk Vault'),
  
];

// Now the sort and setState will work without type errors
allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
setEventLogs(allEvents);

        } catch (error) {
            console.error('Error fetching portfolio data:', error);
        } finally {
            setIsLoadingEvents(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [address]);

    // Calculate derived portfolio stats
    const lowRiskAllocation = totalBalance > 0 ? (lowBalance / totalBalance) * 100 : 0;
    const highRiskAllocation = totalBalance > 0 ? (highBalance / totalBalance) * 100 : 0;
    const lowRiskApy = lowRiskData?.selectedPool?.apy || 0;
    const highRiskApy = highRiskData?.selectedPool?.apy || 0;
    const weightedApy = totalBalance > 0
        ? ((lowBalance * lowRiskApy) + (highBalance * highRiskApy)) / totalBalance
        : 0;

    const portfolioStats = {
        totalValue: totalBalance,
        totalEarned: 0, // Placeholder
        weeklyChange: 0, // Placeholder
        currentAPY: weightedApy,
        positions: [
            {
                vault: 'Low Risk Vault',
                balance: lowBalance,
                earned: 0, // Placeholder
                apy: lowRiskApy,
                allocation: lowRiskAllocation
            },
            {
                vault: 'High Risk Vault',
                balance: highBalance,
                earned: 0, // Placeholder
                apy: highRiskApy,
                allocation: highRiskAllocation
            }
        ]
    };

    const transactions = [
        // Transaction data remains the same
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
                            ${portfolioStats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                            {portfolioStats.currentAPY.toFixed(2)}%
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
                        <div className="text-yellow-400 text-sm">
                            {highRiskAllocation.toFixed(0)}% High / {lowRiskAllocation.toFixed(0)}% Low
                        </div>
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
                                        {position.apy.toFixed(2)}% APY
                                    </Badge>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Balance</span>
                                        <span className="text-white">${position.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Earned</span>
                                        <span className="text-green-400">+${position.earned.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Allocation</span>
                                        <span className="text-white">{position.allocation.toFixed(2)}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Event Log Section */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                    <CardTitle className="text-white flex items-center">
                        <BookCopy className="w-5 h-5 mr-2 text-cyan-400" />
                        Event Log
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoadingEvents ? (
                        <div className="text-center text-slate-400">Loading event history...</div>
                    ) : eventLogs.length > 0 ? (
                        <div className="space-y-4">
                            {eventLogs.map((log, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                    <div className="flex items-center">
                                        <div className="mr-4">
                                            {log.type === 'Rebalance' && <TrendingUp className="w-5 h-5 text-purple-400" />}
                                            {log.type === 'Withdrawal' && <ArrowUpRight className="w-5 h-5 text-red-400" />}
                                            {log.type === 'Deposit' && <ArrowDownRight className="w-5 h-5 text-green-400" />}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{log.type} {log.type !== 'Rebalance' && `(${log.vault.replace(' Vault','')})`}</p>
                                            <p className="text-slate-300 text-sm">{log.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-400 text-sm mb-1">{log.timestamp}</p>
                                        <a
                                            href={`https://sepolia.etherscan.io/tx/${log.txHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center justify-end"
                                        >
                                            View on Etherscan <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-slate-400">No events found for this address.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}