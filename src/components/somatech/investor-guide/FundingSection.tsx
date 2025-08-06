import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Banknote } from 'lucide-react';

const FundingSection = () => {
  const [selectedTab, setSelectedTab] = useState('why');

  return (
    <section className="w-full py-10 bg-gradient-to-br from-white via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-2">
          <Banknote className="text-blue-500" size={32} />
          <h1 className="text-3xl font-bold heading-gradient mb-1 dark:text-white">💸 Funding: Powering Growth & Strategic Expansion</h1>
        </div>
        <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mb-6" />
        <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl p-8">
          <Tabs defaultValue="why" onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-4 w-full mb-8">
              <TabsTrigger value="why" className="transition-all duration-200 hover:scale-105 text-base py-2 subheading-stern">Why Funding</TabsTrigger>
              <TabsTrigger value="sources" className="transition-all duration-200 hover:scale-105 text-base py-2 subheading-stern">Funding Sources</TabsTrigger>
              <TabsTrigger value="usage" className="transition-all duration-200 hover:scale-105 text-base py-2 subheading-stern">Use of Funds</TabsTrigger>
              <TabsTrigger value="case-studies" className="transition-all duration-200 hover:scale-105 text-base py-2 subheading-stern">Case Studies</TabsTrigger>
            </TabsList>

            {/* Tab 1 */}
            <TabsContent value="why">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["Operating Expenses", "Growth & Hiring", "Product & Innovation", "Acquisition Strategy", "Financial Cushion"].map((reason, i) => (
                  <Card key={i} className="hover:shadow-md">
                    <CardContent className="p-4">
                      <CardTitle className="text-lg font-semibold">{reason}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {reason === 'Operating Expenses' && 'Salaries, rent, utilities, insurance'}
                        {reason === 'Growth & Hiring' && 'Expand teams, marketing, locations'}
                        {reason === 'Product & Innovation' && 'R&D, upgrades, innovation pipeline'}
                        {reason === 'Acquisition Strategy' && 'Merge, buy competitors or assets'}
                        {reason === 'Financial Cushion' && 'Cash buffer for downturns or market shocks'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tab 2 */}
            <TabsContent value="sources">
              <Accordion type="single" collapsible className="w-full">
                {[{
                  title: 'Bank Loans',
                  desc: 'Traditional debt financing secured with collateral.',
                  link: 'https://www.sba.gov/funding-programs/loans'
                }, {
                  title: 'SBA Loans',
                  desc: 'U.S. government-backed loans for small businesses.',
                  link: 'https://www.sba.gov/funding-programs/loans'
                }, {
                  title: 'Angel Investors',
                  desc: 'Early-stage capital from high-net-worth individuals.',
                  link: 'https://www.angelcapitalassociation.org/'
                }, {
                  title: 'Venture Capital',
                  desc: 'Institutional equity funding for high-growth startups.',
                  link: 'https://nvca.org/about-us/what-is-venture-capital/'
                }, {
                  title: 'Crowdfunding',
                  desc: 'Raise public funds through digital platforms.',
                  link: 'https://wefunder.com/learn/startups'
                }, {
                  title: 'Equipment Leasing',
                  desc: 'Access expensive equipment without upfront costs.',
                  link: 'https://www.investopedia.com/terms/e/equipment-lease.asp'
                }, {
                  title: 'M&A / LBOs',
                  desc: 'Capital through mergers, acquisitions or leveraged buyouts.',
                  link: 'https://corporatefinanceinstitute.com/resources/valuation/mergers-acquisitions-ma/'
                }].map((item, i) => (
                  <AccordionItem value={`item-${i}`} key={i}>
                    <AccordionTrigger>{item.title}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm mb-2">{item.desc}</p>
                      <a href={item.link} className="text-blue-500 underline text-sm" target="_blank">Learn more</a>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            {/* Tab 3 */}
            <TabsContent value="usage">
              <div className="space-y-4">
                {[{
                  title: 'Essential Ops', desc: 'Pay bills, payroll, rent, inventory.'
                }, {
                  title: 'Emergency Reserve', desc: 'Set aside 6–12 months operating cash.'
                }, {
                  title: 'Growth Investment', desc: 'Marketing, hiring, production, channels.'
                }, {
                  title: 'Debt Reduction', desc: 'Lower liabilities to strengthen cash flow.'
                }, {
                  title: 'R&D and Tech', desc: 'Upgrade infrastructure and innovate.'
                }, {
                  title: 'Dividends/Profit Sharing', desc: 'Return value to shareholders.'
                }, {
                  title: 'Market Expansion', desc: 'Open new markets or product lines.'
                }].map((item, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <CardTitle>{item.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tab 4 */}
            <TabsContent value="case-studies">
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-4">
                    <CardTitle>📈 Pipe.com (Venture Capital)</CardTitle>
                    <p className="text-sm">Raised $250M to scale globally and unlock liquidity via B2B marketplace.</p>
                    <a href="https://techcrunch.com/2021/03/30/pipe-raises-250m-at-2b-valuation/" className="text-blue-500 underline text-sm" target="_blank">Read more</a>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <CardTitle>🌐 Jot Coffee (Crowdfunding)</CardTitle>
                    <p className="text-sm">Raised $1.6M via Wefunder to scale production and brand marketing.</p>
                    <a href="https://wefunder.com/jot" className="text-blue-500 underline text-sm" target="_blank">View Campaign</a>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <CardTitle>💼 Main Street (Hybrid Funding)</CardTitle>
                    <p className="text-sm">Used angel + SBA loan to fund team and operations.</p>
                    <span className="text-muted-foreground text-xs">No public link available.</span>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          <small className="text-sm text-muted-foreground mt-6 block text-center dark:text-cyan-200">
            Last updated: July 2025 — based on Q2 filings.
          </small>
        </div>
      </div>
    </section>
  );
};

export default FundingSection; 