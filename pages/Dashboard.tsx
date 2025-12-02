import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, DollarSign, Users } from 'lucide-react';
import { Select } from '../components/ui/Select';
import { useAuth } from '../context/AuthContext';

const stats = [
  { 
    title: 'Total Receivables', 
    value: '₹ 12,45,000', 
    change: '+12.5%', 
    trend: 'up' as const, 
    icon: ArrowDownRight, 
    color: 'text-success', 
    bg: 'bg-success-bg',
    subtitle: 'Current',
    description: 'Amount to receive'
  },
  { 
    title: 'Total Payables', 
    value: '₹ 8,32,000', 
    change: '-2.4%', 
    trend: 'down' as const, 
    icon: ArrowUpRight, 
    color: 'text-danger', 
    bg: 'bg-danger-bg',
    subtitle: 'Overdue: ₹ 1.2L',
    description: 'Amount to pay'
  },
  { 
    title: 'Cash & Bank', 
    value: '₹ 45,23,000', 
    change: '+8.2%', 
    trend: 'up' as const, 
    icon: Wallet, 
    color: 'text-info', 
    bg: 'bg-info-bg',
    subtitle: 'Across 4 accounts',
    description: 'Liquidity'
  },
  { 
    title: 'Net Profit', 
    value: '₹ 4,12,000', 
    change: '+1.4%', 
    trend: 'up' as const, 
    icon: TrendingUp, 
    color: 'text-purple-600', 
    bg: 'bg-purple-100',
    subtitle: 'This Month',
    description: 'Earnings'
  },
];

const cashFlowData = [
  { name: 'Jan', in: 400000, out: 240000 },
  { name: 'Feb', in: 300000, out: 139800 },
  { name: 'Mar', in: 200000, out: 980000 },
  { name: 'Apr', in: 278000, out: 390800 },
  { name: 'May', in: 189000, out: 480000 },
  { name: 'Jun', in: 239000, out: 380000 },
  { name: 'Jul', in: 349000, out: 430000 },
];

const incomeExpenseData = [
  { name: 'Week 1', income: 40000, expense: 24000 },
  { name: 'Week 2', income: 30000, expense: 13980 },
  { name: 'Week 3', income: 20000, expense: 58000 },
  { name: 'Week 4', income: 27800, expense: 39080 },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('This Fiscal Year');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-content-strong">Financial Overview</h2>
          <p className="text-content-sub text-sm">Real-time business insights and performance.</p>
        </div>
        <div className="w-full sm:w-48">
           <Select
             value={period}
             onChange={setPeriod}
             options={[
               { label: 'This Fiscal Year', value: 'This Fiscal Year' },
               { label: 'Last Quarter', value: 'Last Quarter' },
               { label: 'Last Month', value: 'Last Month' },
             ]}
             className="mb-0"
           />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-surface rounded-xl shadow-sm border border-divider p-4 sm:p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-content-sub text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold text-content-strong mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-divider">
               <span className={`text-xs font-semibold ${stat.trend === 'up' ? 'text-success' : 'text-danger'} flex items-center`}>
                {stat.change}
              </span>
              <span className="text-xs text-content-sub">{stat.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cash Flow Chart */}
        <div className="lg:col-span-2 bg-surface p-4 sm:p-6 rounded-xl shadow-sm border border-divider min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-lg font-bold text-content-strong">Cash Flow</h3>
                <p className="text-xs text-content-sub">Inflow vs Outflow over time</p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="in" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorIn)" name="Cash In" />
                <Area type="monotone" dataKey="out" stroke="#ef4444" fillOpacity={1} fill="url(#colorOut)" name="Cash Out" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income vs Expense */}
        <div className="bg-surface p-4 sm:p-6 rounded-xl shadow-sm border border-divider min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-content-strong">Income vs Expense</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeExpenseData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Top Accounts / Bank Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface rounded-xl shadow-sm border border-divider p-6">
              <h3 className="text-lg font-bold text-content-strong mb-4">Bank Accounts</h3>
              <div className="space-y-4">
                  {[
                      { name: 'HDFC Main Account', number: '**** 8821', balance: '₹ 24,50,000' },
                      { name: 'SBI Current Account', number: '**** 1204', balance: '₹ 12,20,000' },
                      { name: 'Petty Cash', number: '-', balance: '₹ 45,000' }
                  ].map((acc, i) => (
                      <div key={i} className="flex justify-between items-center p-3 hover:bg-surface-highlight rounded-lg transition-colors border border-divider">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-surface-highlight rounded-full text-content-normal">
                                  <CreditCard className="w-5 h-5" />
                              </div>
                              <div>
                                  <p className="font-medium text-content-strong">{acc.name}</p>
                                  <p className="text-xs text-content-sub">{acc.number}</p>
                              </div>
                          </div>
                          <p className="font-bold text-content-strong">{acc.balance}</p>
                      </div>
                  ))}
              </div>
          </div>

          <div className="bg-surface rounded-xl shadow-sm border border-divider p-6">
              <h3 className="text-lg font-bold text-content-strong mb-4">Pending Tasks</h3>
              <div className="space-y-3">
                 <div className="flex items-start gap-3 p-3 bg-warning-bg rounded-lg border border-warning/20">
                    <div className="mt-0.5"><DollarSign className="w-4 h-4 text-warning-text" /></div>
                    <div>
                        <p className="text-sm font-medium text-warning-text">3 Invoices Overdue</p>
                        <p className="text-xs text-warning-text/80 mt-1">Total value ₹ 45,000. Follow up with customers.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3 p-3 bg-info-bg rounded-lg border border-info/20">
                    <div className="mt-0.5"><Users className="w-4 h-4 text-info-text" /></div>
                    <div>
                        <p className="text-sm font-medium text-info-text">New Vendor Approval</p>
                        <p className="text-xs text-info-text/80 mt-1">Tech Solutions Ltd requires approval.</p>
                    </div>
                 </div>
              </div>
          </div>
      </div>
    </div>
  );
};