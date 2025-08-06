import { Lightbulb } from 'lucide-react';

export default function InvestorGuideIntroduction() {
  return (
    <section className="w-full py-12 md:py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="p-8 w-full shadow-xl bg-white/90 dark:bg-gray-900/90 rounded-2xl flex flex-col md:flex-row items-center gap-10 animate-fade-in">
          {/* Left: Hero Text */}
          <div className="flex-1 flex flex-col items-start md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center rounded-full bg-blue-100 p-3 dark:bg-gray-800">
                <Lightbulb className="text-blue-500" size={36} />
              </span>
              <h1 className="text-4xl md:text-5xl heading-stern leading-tight dark:text-white">
                Welcome to the SomaTech Investor Guide
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-6 max-w-2xl">
              Your curated gateway into informed investing. This guide breaks down global economic signals, portfolio construction, research methodology, and funding strategies to help investors and operators make structured decisions. Whether you're a founder, retail investor, or institutional analyst, this guide is tailored to help you think, plan, and act like a modern, informed investor.
            </p>
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-md p-6 mb-4 w-full max-w-lg border border-blue-100 dark:border-gray-700">
              <h2 className="text-xl subheading-stern mb-2 flex items-center gap-2 dark:text-white">
                <Lightbulb className="text-blue-400" size={20} /> What You'll Learn
              </h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 space-y-1">
                <li>How to interpret global macro signals</li>
                <li>Portfolio construction strategies</li>
                <li>Research tools and data sources</li>
                <li>Risk management approaches</li>
                <li>Funding strategies for startups and businesses</li>
              </ul>
            </div>
          </div>
          {/* Right: Visual/Accent (optional) */}
          <div className="flex-1 flex justify-center items-center">
            <div className="w-full max-w-md h-64 md:h-80 bg-gradient-to-tr from-blue-200 via-cyan-200 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-3xl shadow-lg flex items-center justify-center">
              <span className="text-6xl md:text-7xl">💡</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// .heading-gradient CSS should be in your global styles as before. 