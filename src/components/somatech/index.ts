// Layout Components
export { default as SomaTechLayout } from './layout/SomaTechLayout';
export { default as SomaTechHeader } from './layout/SomaTechHeader';
export { default as SomaTechSidebar } from './layout/SomaTechSidebar';
export { default as SomaTechContent } from './layout/SomaTechContent';
export { default as SomaTechDialogs } from './layout/SomaTechDialogs';

// Core Components
export { default as Dashboard } from './Dashboard';
export { default as StockAnalysis } from './StockAnalysis';
export { default as WatchlistModule } from './WatchlistModule';
export { default as BusinessValuation } from './BusinessValuation';
export { default as CashFlowSimulator } from './CashFlowSimulator';
export { default as RetirementPlanning } from './RetirementPlanning';
export { default as RealEstateCalculatorContainer } from './RealEstateCalculatorContainer';
export { default as Marketplace } from './Marketplace';
export { default as FundingCampaigns } from './FundingCampaigns';

// Real Estate Components
export { default as RealEstateDealSourcing } from './real-estate/RealEstateDealSourcing';
export { default as DealSourcingDataManager } from './real-estate/DealSourcingDataManager';
export { default as DataIngestionPipeline } from './real-estate/DataIngestionPipeline';
export { default as DataScrapingEngine } from './real-estate/scrapers/DataScrapingEngine';
export { default as TaxDelinquentScraper } from './real-estate/scrapers/TaxDelinquentScraper';
export { default as CodeViolationScraper } from './real-estate/scrapers/CodeViolationScraper';
export { default as PreForeclosureScraper } from './real-estate/scrapers/PreForeclosureScraper';

// Expanded Data Sources
export { default as ExpandedDataSourcesDashboard } from './real-estate/scrapers/ExpandedDataSourcesDashboard';
export { expandedDataSources, ExpandedDataSource } from './real-estate/scrapers/ExpandedDataSources';
export { ExpandedDataScraper, implementationPhases } from './real-estate/scrapers/ExpandedDataSourcesImplementation';

// UI Components
export { default as DarkModeToggle } from './DarkModeToggle';
export { default as FloatingActionMenu } from './FloatingActionMenu';
export { default as BottomNavigation } from './BottomNavigation';
export { default as ResponsiveNavigation } from './ResponsiveNavigation';
export { default as GroupedNavigation } from './GroupedNavigation';
export { default as ModuleWrapper } from './ModuleWrapper';
export { default as Footer } from './Footer';
export { default as LoadingSpinner } from './LoadingSpinner';

// Auth & User Components
export { default as AuthDialog } from './AuthDialog';
export { default as AuthProvider } from './AuthProvider';
export { ProfileDropdown } from './ProfileDropdown';
export { default as AccountSettings } from './AccountSettings';
export { default as UserDashboard } from './UserDashboard';

// Onboarding Components
export { default as OnboardingWelcome } from './OnboardingWelcome';
export { default as OnboardingModal } from './OnboardingModal';
export { default as ProgressiveOnboarding } from './ProgressiveOnboarding';

// Notification Components
export { default as NotificationBell } from './NotificationBell';
export { default as NotificationCenter } from './NotificationCenter';

// Error & Performance Components
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as ErrorProvider } from './ErrorProvider';
export { default as PerformanceProvider } from './PerformanceProvider';
export { default as OfflineIndicator } from './OfflineIndicator';
export { default as NetworkStatus } from './NetworkStatus';

// Feedback & Help Components
export { default as UserFeedbackSystem } from './UserFeedbackSystem';
export { default as FeedbackHub } from './FeedbackHub';
export { default as HelpTooltip } from './HelpTooltip';

// Enterprise Components
export { default as PricingDialog } from './enterprise/PricingDialog';
export { default as SubscriptionStatus } from './enterprise/SubscriptionStatus';
export { default as OnboardingFlow } from './enterprise/OnboardingFlow';
export { default as UsageAnalytics } from './enterprise/UsageAnalytics';
export { default as AdminPanel } from './enterprise/AdminPanel';
export { default as WhiteLabelCustomizer } from './enterprise/WhiteLabelCustomizer';
export { default as AdvancedReporting } from './enterprise/AdvancedReporting';
export { default as PerformanceMonitoring } from './enterprise/PerformanceMonitoring';
export { default as CustomerSuccessDashboard } from './enterprise/CustomerSuccessDashboard';
export { default as SecurityAuditDashboard } from './enterprise/SecurityAuditDashboard';
export { default as MultiTenantArchitecture } from './enterprise/MultiTenantArchitecture';

// Legal Components
export { default as PrivacyPolicy } from './PrivacyPolicy';
export { default as TermsOfService } from './TermsOfService';

// Utility Components
export { default as PWAManager } from './PWAManager';
export { default as DonationSuccess } from './funding/DonationSuccess';

// Hooks
export { useOnboarding } from './hooks/useOnboarding';

// Types & Constants
export * from './types';
export * from './constants'; 