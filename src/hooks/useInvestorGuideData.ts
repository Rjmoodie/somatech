import { useQuery } from '@tanstack/react-query';
import {
  fetchGlobalMacroData,
  fetchCountryAnalysisData,
  fetchIndustryBreakdownData,
  fetchSectorIntelligenceData,
  fetchCompanyDeepDiveData,
} from '@/api/investorGuideData';

export function useGlobalMacroData() {
  return useQuery({
    queryKey: ['globalMacro'],
    queryFn: fetchGlobalMacroData,
  });
}

export function useCountryAnalysisData() {
  return useQuery({
    queryKey: ['countryAnalysis'],
    queryFn: fetchCountryAnalysisData,
  });
}

export function useIndustryBreakdownData() {
  return useQuery({
    queryKey: ['industryBreakdown'],
    queryFn: fetchIndustryBreakdownData,
  });
}

export function useSectorIntelligenceData() {
  return useQuery({
    queryKey: ['sectorIntelligence'],
    queryFn: fetchSectorIntelligenceData,
  });
}

export function useCompanyDeepDiveData(symbol: string) {
  return useQuery({
    queryKey: ['companyDeepDive', symbol],
    queryFn: () => fetchCompanyDeepDiveData(symbol),
    enabled: !!symbol,
  });
} 