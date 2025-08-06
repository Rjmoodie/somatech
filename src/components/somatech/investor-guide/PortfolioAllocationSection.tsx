import React from "react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from "recharts";
import { Card, CardContent } from "../../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import { BarChart3 } from "lucide-react";

const allocationStrategies = [
  {
    id: "60-40",
    name: "60/40 Portfolio",
    data: [
      { name: "Equities", value: 60 },
      { name: "Bonds", value: 40 },
    ],
    description:
      "Balances long-term equity growth with bond stability. Ideal for moderate-risk investors.",
    link: {
      url: "https://www.raymondjames.com/talentfinancialservices/our-perspective/2024/05/14/building-a-diversified-investment-portfolio?utm_source=chatgpt.com",
      label: "Raymond James: Building a Diversified Investment Portfolio"
    },
    keyTakeaway: "This strategy provides a balanced approach to growth and stability."
  },
  {
    id: "risk-parity",
    name: "Risk Parity",
    data: [
      { name: "Equities", value: 25 },
      { name: "Bonds", value: 40 },
      { name: "Commodities", value: 20 },
      { name: "Cash", value: 15 },
    ],
    description:
      "Allocates capital to equalize risk across asset types using volatility-based weighting.",
    link: {
      url: "https://www.investopedia.com/terms/r/risk-parity.asp?utm_source=chatgpt.com",
      label: "Investopedia: Risk Parity: Definition, Strategies, Example"
    },
    keyTakeaway: "This strategy aims to minimize volatility by equalizing risk across different asset classes."
  },
  {
    id: "core-satellite",
    name: "Core-Satellite",
    data: [
      { name: "Core Index Funds", value: 80 },
      { name: "Active Positions", value: 20 },
    ],
    description:
      "Combines passive index exposure with high-conviction, actively managed satellite positions.",
    link: {
      url: "https://www.investopedia.com/articles/financial-theory/08/core-satellite-investing.asp?utm_source=chatgpt.com",
      label: "Investopedia: A Guide to Core-Satellite Investing"
    },
    keyTakeaway: "This strategy leverages the benefits of passive investing combined with active management."
  },
  {
    id: "barbell",
    name: "Barbell Strategy",
    data: [
      { name: "Safe Assets", value: 90 },
      { name: "High-Risk Assets", value: 10 },
    ],
    description:
      "Minimizes downside risk while allowing upside optionality through a small risky allocation.",
    link: {
      url: "https://corporatefinanceinstitute.com/resources/career-map/sell-side/capital-markets/barbell-strategy/?utm_source=chatgpt.com",
      label: "Corporate Finance Institute: Barbell Strategy"
    },
    keyTakeaway: "This strategy is particularly effective for investors seeking to balance risk and return."
  },
  {
    id: "factor-investing",
    name: "Factor Investing",
    data: [
      { name: "Value", value: 30 },
      { name: "Momentum", value: 25 },
      { name: "Size", value: 20 },
      { name: "Quality", value: 15 },
      { name: "Low Volatility", value: 10 },
    ],
    description:
      "Targets academic factors proven to offer long-term outperformance (e.g., value, momentum).",
    link: {
      url: "https://www.blackrock.com/us/individual/investment-ideas/what-is-factor-investing?utm_source=chatgpt.com",
      label: "BlackRock: What is Factor Investing?"
    },
    keyTakeaway: "This strategy focuses on proven factors that have historically contributed to investment success."
  },
];

const COLORS = ["#3b82f6", "#06b6d4", "#f59e42", "#f43f5e", "#a78bfa"];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#111827"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontFamily="IBM Plex Sans, Inter, Arial, sans-serif"
      fontWeight={700}
      fontSize={16}
      className="dark:fill-white"
    >
      {`${name}: ${value}%`}
    </text>
  );
};

export default function PortfolioAllocationSection() {
  return (
    <section className="w-full py-10 bg-gradient-to-br from-white via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <Card className="p-8 w-full shadow-xl bg-white/90 dark:bg-gray-900/90">
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="text-blue-500" size={28} />
              <h2 className="text-3xl heading-stern mb-1 dark:text-white">Portfolio Allocation Strategies</h2>
            </div>
            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mb-6" />
            <Tabs defaultValue="60-40" className="w-full">
              <TabsList className="flex flex-wrap justify-center gap-2 mb-8">
                {allocationStrategies.map((strategy) => (
                  <TabsTrigger key={strategy.id} value={strategy.id} className="transition-all duration-200 hover:scale-105 text-base px-4 py-2 subheading-stern">
                    {strategy.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {allocationStrategies.map((strategy) => (
                <TabsContent key={strategy.id} value={strategy.id}>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <PieChart width={480} height={340}>
                      <Pie
                        data={strategy.data}
                        cx="50%"
                        cy="50%"
                        outerRadius={140}
                        fill="#8884d8"
                        dataKey="value"
                        label={renderCustomizedLabel}
                        style={{ fontFamily: 'IBM Plex Sans', fontWeight: 700 }}
                      >
                        {strategy.data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ background: '#fff', color: '#111827', fontWeight: 600, fontFamily: 'IBM Plex Sans' }} wrapperStyle={{ zIndex: 50 }} cursor={{ fill: '#e0e7ff', opacity: 0.2 }} />
                      <Legend
                        iconType="circle"
                        formatter={(value, entry, index) => (
                          <span className="flex items-center gap-2">
                            <span style={{ background: COLORS[index % COLORS.length], borderRadius: '50%', width: 12, height: 12, display: 'inline-block' }} />
                            <span className="text-gray-800 dark:text-gray-100 font-semibold">{value}</span>
                          </span>
                        )}
                      />
                    </PieChart>
                    <div className="text-md md:text-lg leading-relaxed max-w-lg">
                      <h3 className="text-xl subheading-stern mb-2 dark:text-white">{strategy.name}</h3>
                      <p className="mb-3 dark:text-gray-200">{strategy.description}</p>
                      <a
                        href={strategy.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-blue-600 underline hover:text-blue-800 dark:text-cyan-400"
                      >
                        Learn more: {strategy.link.label}
                      </a>
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-gray-800 rounded-lg text-blue-900 dark:text-cyan-200 text-base font-medium shadow-sm">
                        <span className="font-bold">Key Takeaway:</span> {strategy.keyTakeaway || "This strategy offers a unique approach to balancing risk and return."}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
} 