import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const riskStrategies = [
  {
    title: 'Volatility Assessment',
    description:
      'Evaluates how much an investment’s price fluctuates over time. Helps investors understand the potential range of returns (and losses) they may face.',
    tools: [
      'Beta (vs market)',
      'Standard Deviation',
      'Sharpe Ratio'
    ],
    learnMore: 'https://www.investopedia.com/terms/s/sharperatio.asp'
  },
  {
    title: 'Diversification',
    description:
      'Allocating capital across different asset classes, regions, and sectors to reduce concentration risk and improve portfolio resilience.',
    tools: [
      'Geographic: U.S., Europe, EM',
      'Sector: Tech, Energy, Health, etc.',
      'Asset Class: Stocks, Bonds, REITs'
    ],
    learnMore: 'https://investor.vanguard.com/investor-resources-education/investing/importance-of-diversification'
  },
  {
    title: 'Tail Risk Protection',
    description:
      'Hedging against rare, extreme market downturns using options, gold, or volatility-based instruments.',
    tools: [
      'Protective Puts',
      'Gold ETFs',
      'Long Volatility ETFs (e.g. VXX, UVXY)'
    ],
    learnMore: 'https://blogs.cfainstitute.org/investor/2020/10/26/tail-risk-hedging-strategies/'
  },
  {
    title: 'Scenario Planning',
    description:
      'Anticipating macroeconomic shocks and preparing targeted hedges for events like inflation or recessions.',
    tools: [
      'TIPS for inflation',
      'Defensive stocks',
      'Short-duration/floating-rate bonds'
    ],
    learnMore: 'https://www.morningstar.com/lp/scenario-analysis'
  }
];

export default function RiskManagementSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="w-full py-10 bg-gradient-to-br from-white via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="text-blue-500" size={32} />
          <h2 className="text-3xl font-bold heading-stern mb-1 dark:text-white">Risk Management Strategies</h2>
        </div>
        <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mb-6" />
        <TooltipProvider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {riskStrategies.map((strategy) => (
              <Card key={strategy.title} className="shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg bg-white/90 dark:bg-gray-900/90">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold dark:text-white">{strategy.title}
                      {strategy.title === 'Volatility Assessment' && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 text-blue-500 cursor-help">?</span>
                          </TooltipTrigger>
                          <TooltipContent>How much an investment’s price fluctuates over time.</TooltipContent>
                        </Tooltip>
                      )}
                      {strategy.title === 'Tail Risk Protection' && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 text-blue-500 cursor-help">?</span>
                          </TooltipTrigger>
                          <TooltipContent>Protection against rare, extreme market events.</TooltipContent>
                        </Tooltip>
                      )}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setExpanded(expanded === strategy.title ? null : strategy.title)
                      }
                      aria-label={expanded === strategy.title ? `Collapse ${strategy.title}` : `Expand ${strategy.title}`}
                    >
                      {expanded === strategy.title ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                  </div>
                  {expanded === strategy.title && (
                    <div className="mt-2 text-base space-y-2 animate-fade-in dark:text-gray-200">
                      <p>{strategy.description}</p>
                      <ul className="list-disc list-inside">
                        {strategy.tools.map((tool) => (
                          <li key={tool}>{tool}</li>
                        ))}
                      </ul>
                      <a
                        href={strategy.learnMore}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800 dark:text-cyan-400"
                      >
                        Learn more
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </section>
  );
} 