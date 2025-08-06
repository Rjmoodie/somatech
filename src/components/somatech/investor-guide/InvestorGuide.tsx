import React, { useRef } from "react";
import InvestorGuideIntroduction from "./InvestorGuideIntroduction";
import PortfolioAllocationSection from "./PortfolioAllocationSection";
import KeyHoldingsSection from "./KeyHoldingsSection";
import RiskManagementSection from "./RiskManagementSection";
import FundingSection from "./FundingSection";
import { modules } from "../constants";
import SEO from "../../SEO";

const module = modules.find(m => m.id === "investor-guide");

const sections = [
  { id: "introduction", label: "Introduction", component: InvestorGuideIntroduction },
  { id: "portfolio", label: "Portfolio Allocation", component: PortfolioAllocationSection },
  { id: "holdings", label: "Key Holdings", component: KeyHoldingsSection },
  { id: "risk", label: "Risk Management", component: RiskManagementSection },
  { id: "funding", label: "Funding", component: FundingSection },
];

const InvestorGuide: React.FC = () => {
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleScrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // JSON-LD structured data for the investor guide
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": module?.name,
    "description": module?.seo?.description,
    "applicationCategory": "EducationApplication",
    "operatingSystem": "All",
    "publisher": {
      "@type": "Organization",
      "name": "SomaTech"
    }
  };

  return (
    <>
      {module?.seo && (
        <SEO
          title={module.seo.title}
          description={module.seo.description}
          keywords={module.seo.keywords}
          url={typeof window !== 'undefined' ? window.location.href : undefined}
          jsonLd={jsonLd}
        />
      )}
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto">
        {/* TOC Sidebar */}
        <nav className="hidden md:block w-56 sticky top-8 self-start mr-8">
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  className="text-left w-full px-2 py-1 rounded hover:bg-blue-100"
                  onClick={() => handleScrollTo(section.id)}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        {/* Main Content */}
        <div className="flex-1 space-y-16">
          {sections.map(({ id, component: SectionComponent }) => (
            <div
              key={id}
              id={id}
              ref={(el) => (sectionRefs.current[id] = el)}
              className="scroll-mt-24"
            >
              <SectionComponent />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InvestorGuide; 