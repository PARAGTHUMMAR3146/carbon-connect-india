import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { PRICE_HISTORY } from '@/lib/mockData';
import { Language } from '@/lib/translations';

interface PriceChartProps {
  lang: Language;
}

const PriceChart: React.FC<PriceChartProps> = ({ lang }) => {
  const formattedData = PRICE_HISTORY.map(item => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString(lang === 'en' ? 'en-IN' : 'hi-IN', { 
      day: 'numeric', 
      month: 'short' 
    }),
  }));

  const minPrice = Math.min(...PRICE_HISTORY.map(p => p.price)) - 50;
  const maxPrice = Math.max(...PRICE_HISTORY.map(p => p.price)) + 50;

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-foreground">
            {lang === 'en' ? 'Carbon Price Trend' : 'कार्बन मूल्य रुझान'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {lang === 'en' ? 'Last 30 days' : 'पिछले 30 दिन'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">₹/tonne</span>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(158, 64%, 35%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(158, 64%, 35%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="displayDate" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(160, 10%, 45%)', fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={[minPrice, maxPrice]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(160, 10%, 45%)', fontSize: 12 }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(150, 15%, 88%)',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [`₹${value}`, lang === 'en' ? 'Price' : 'मूल्य']}
              labelFormatter={(label) => label}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(158, 64%, 35%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
