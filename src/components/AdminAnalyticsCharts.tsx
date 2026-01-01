import React, { useState } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { TrendingUp, Users, IndianRupee, Calendar } from 'lucide-react';
import { Language, TRANSLATIONS } from '@/lib/translations';

interface AdminAnalyticsChartsProps {
  lang: Language;
}

// Generate mock data for charts
const generateTransactionData = (days: number) => {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const baseVolume = 50000 + Math.random() * 100000;
    const baseCredits = 50 + Math.random() * 150;
    data.push({
      date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      fullDate: date.toISOString().split('T')[0],
      volume: Math.round(baseVolume + Math.sin(i * 0.5) * 20000),
      credits: Math.round(baseCredits + Math.cos(i * 0.3) * 30),
      transactions: Math.round(5 + Math.random() * 15),
    });
  }
  return data;
};

const generateUserGrowthData = (days: number) => {
  const data = [];
  const now = new Date();
  let totalSellers = 800;
  let totalBuyers = 300;
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    totalSellers += Math.round(2 + Math.random() * 5);
    totalBuyers += Math.round(1 + Math.random() * 3);
    data.push({
      date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      fullDate: date.toISOString().split('T')[0],
      sellers: totalSellers,
      buyers: totalBuyers,
      total: totalSellers + totalBuyers,
    });
  }
  return data;
};

const generateCreditTypeData = () => [
  { name: 'Verra VCS', value: 18500, fill: 'hsl(158, 64%, 35%)' },
  { name: 'Gold Standard', value: 12300, fill: 'hsl(38, 92%, 50%)' },
  { name: 'CDM Credits', value: 8900, fill: 'hsl(220, 60%, 35%)' },
  { name: 'India VCS', value: 5980, fill: 'hsl(25, 95%, 53%)' },
];

type TimeRange = 'daily' | 'weekly' | 'monthly';

const AdminAnalyticsCharts: React.FC<AdminAnalyticsChartsProps> = ({ lang }) => {
  const t = (key: keyof typeof TRANSLATIONS.en) => TRANSLATIONS[lang][key];
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');

  const getDaysForRange = (range: TimeRange) => {
    switch (range) {
      case 'daily': return 7;
      case 'weekly': return 28;
      case 'monthly': return 90;
    }
  };

  const transactionData = generateTransactionData(getDaysForRange(timeRange));
  const userGrowthData = generateUserGrowthData(getDaysForRange(timeRange));
  const creditTypeData = generateCreditTypeData();

  const timeRangeButtons: { value: TimeRange; label: string }[] = [
    { value: 'daily', label: lang === 'en' ? '7 Days' : '7 दिन' },
    { value: 'weekly', label: lang === 'en' ? '4 Weeks' : '4 सप्ताह' },
    { value: 'monthly', label: lang === 'en' ? '3 Months' : '3 महीने' },
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-muted-foreground" />
          <span className="font-semibold text-foreground">
            {lang === 'en' ? 'Analytics Period' : 'विश्लेषण अवधि'}
          </span>
        </div>
        <div className="flex gap-2">
          {timeRangeButtons.map(btn => (
            <button
              key={btn.value}
              onClick={() => setTimeRange(btn.value)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                timeRange === btn.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Volume & Credits Chart */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary/20 text-primary">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">
              {lang === 'en' ? 'Transaction Trends' : 'लेन-देन रुझान'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {lang === 'en' ? 'Volume and credits traded over time' : 'समय के साथ मात्रा और क्रेडिट व्यापार'}
            </p>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={transactionData}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(158, 64%, 35%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(158, 64%, 35%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="creditsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(220, 60%, 35%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(220, 60%, 35%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => `${value}t`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number, name: string) => [
                  name === 'volume' ? `₹${value.toLocaleString('en-IN')}` : `${value} tonnes`,
                  name === 'volume' ? (lang === 'en' ? 'Volume' : 'मात्रा') : (lang === 'en' ? 'Credits' : 'क्रेडिट')
                ]}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="volume"
                name={lang === 'en' ? 'Volume (₹)' : 'मात्रा (₹)'}
                stroke="hsl(158, 64%, 35%)"
                strokeWidth={2}
                fill="url(#volumeGradient)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="credits"
                name={lang === 'en' ? 'Credits (tonnes)' : 'क्रेडिट (टन)'}
                stroke="hsl(220, 60%, 35%)"
                strokeWidth={2}
                fill="url(#creditsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-secondary/20 text-secondary">
            <Users size={24} />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">
              {lang === 'en' ? 'User Growth' : 'उपयोगकर्ता वृद्धि'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {lang === 'en' ? 'Platform user acquisition over time' : 'समय के साथ प्लेटफॉर्म उपयोगकर्ता अधिग्रहण'}
            </p>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sellers"
                name={lang === 'en' ? 'Farmers/Sellers' : 'किसान/विक्रेता'}
                stroke="hsl(158, 64%, 35%)"
                strokeWidth={3}
                dot={{ fill: 'hsl(158, 64%, 35%)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="buyers"
                name={lang === 'en' ? 'Industries/Buyers' : 'उद्योग/खरीदार'}
                stroke="hsl(220, 60%, 35%)"
                strokeWidth={3}
                dot={{ fill: 'hsl(220, 60%, 35%)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="total"
                name={lang === 'en' ? 'Total Users' : 'कुल उपयोगकर्ता'}
                stroke="hsl(38, 92%, 50%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Credit Type Distribution */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-accent/20 text-accent">
            <IndianRupee size={24} />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">
              {lang === 'en' ? 'Credits by Type' : 'प्रकार के अनुसार क्रेडिट'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {lang === 'en' ? 'Distribution of traded credits by certification type' : 'प्रमाणन प्रकार के अनुसार व्यापार किए गए क्रेडिट का वितरण'}
            </p>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={creditTypeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
              <XAxis 
                type="number"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <YAxis 
                type="category"
                dataKey="name"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                width={100}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number) => [`${value.toLocaleString()} tonnes`, lang === 'en' ? 'Credits' : 'क्रेडिट']}
              />
              <Bar 
                dataKey="value" 
                radius={[0, 8, 8, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {creditTypeData.map((item) => (
            <div key={item.name} className="bg-muted rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                <span className="text-sm font-medium text-muted-foreground">{item.name}</span>
              </div>
              <p className="text-xl font-bold text-foreground">{item.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{t('tonnes')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsCharts;