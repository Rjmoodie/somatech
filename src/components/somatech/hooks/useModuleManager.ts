import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { usePerformance } from '@/components/somatech/PerformanceProvider';
import { useError } from '@/components/somatech/ErrorProvider';
import { modules } from '@/components/somatech/constants';
import { toast } from '@/hooks/use-toast';

interface ModuleState {
  activeModule: string;
  sidebarCollapsed: boolean;
  globalTicker: string;
}

interface ModuleManagerReturn {
  state: ModuleState;
  setActiveModule: (module: string) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setGlobalTicker: (ticker: string) => void;
  handleModuleChange: (module: string) => void;
  restoreModuleState: () => void;
  saveModuleState: () => void;
}

export const useModuleManager = (): ModuleManagerReturn => {
  const [state, setState] = useState<ModuleState>({
    activeModule: 'dashboard',
    sidebarCollapsed: false,
    globalTicker: 'AAPL'
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { trackPerformance, debounce } = usePerformance();
  const { reportError } = useError();

  // Handle URL parameters and module state
  useEffect(() => {
    const moduleParam = searchParams.get('module');
    const donation = searchParams.get('donation');
    const sessionId = searchParams.get('session_id');
    
    // Set active module from URL parameter
    if (moduleParam && (modules.find(m => m.id === moduleParam) || 
        moduleParam === 'privacy-policy' || moduleParam === 'terms-of-service')) {
      setState(prev => ({ ...prev, activeModule: moduleParam }));
    }
    
    if (donation === 'success' && sessionId) {
      setState(prev => ({ ...prev, activeModule: 'funding-campaigns' }));
    } else if (donation === 'cancelled') {
      toast({
        title: "Donation cancelled",
        description: "Your donation was cancelled. You can try again anytime.",
        variant: "default",
      });
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Handle browser back/forward button
  useEffect(() => {
    const handlePopState = () => {
      const moduleParam = new URLSearchParams(window.location.search).get('module');
      if (moduleParam && modules.find(m => m.id === moduleParam)) {
        setState(prev => ({ ...prev, activeModule: moduleParam }));
      } else if (!moduleParam) {
        setState(prev => ({ ...prev, activeModule: 'dashboard' }));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save module state to sessionStorage for persistence
  useEffect(() => {
    sessionStorage.setItem('somatech-module-state', JSON.stringify(state));
  }, [state]);

  // Restore module state on page load
  useEffect(() => {
    const savedState = sessionStorage.getItem('somatech-module-state');
    if (savedState && !searchParams.get('module')) {
      try {
        const parsedState = JSON.parse(savedState);
        setState(prev => ({ ...prev, ...parsedState }));
      } catch (error) {
        console.error('Failed to restore module state:', error);
      }
    }
  }, []);

  const setActiveModule = useCallback((module: string) => {
    setState(prev => ({ ...prev, activeModule: module }));
  }, []);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setState(prev => ({ ...prev, sidebarCollapsed: collapsed }));
  }, []);

  const setGlobalTicker = useCallback((ticker: string) => {
    setState(prev => ({ ...prev, globalTicker: ticker }));
  }, []);

  const handleModuleChange = useCallback(
    debounce((module: string) => {
      try {
        trackPerformance('moduleChange', () => {
          setActiveModule(module);
          
          // Update URL with module parameter
          const newSearchParams = new URLSearchParams(searchParams);
          if (module === 'dashboard') {
            newSearchParams.delete('module');
          } else {
            newSearchParams.set('module', module);
          }
          
          // Preserve other parameters
          const donation = searchParams.get('donation');
          const sessionId = searchParams.get('session_id');
          if (donation) newSearchParams.set('donation', donation);
          if (sessionId) newSearchParams.set('session_id', sessionId);
          
          setSearchParams(newSearchParams);
          
          // Ensure proper scroll behavior
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
        });
      } catch (error) {
        reportError(error as Error, 'module-change');
      }
    }, 150),
    [searchParams, setSearchParams, setActiveModule, trackPerformance, reportError, debounce]
  );

  const restoreModuleState = useCallback(() => {
    const savedState = sessionStorage.getItem('somatech-module-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setState(prev => ({ ...prev, ...parsedState }));
      } catch (error) {
        console.error('Failed to restore module state:', error);
      }
    }
  }, []);

  const saveModuleState = useCallback(() => {
    sessionStorage.setItem('somatech-module-state', JSON.stringify(state));
  }, [state]);

  return {
    state,
    setActiveModule,
    setSidebarCollapsed,
    setGlobalTicker,
    handleModuleChange,
    restoreModuleState,
    saveModuleState
  };
}; 