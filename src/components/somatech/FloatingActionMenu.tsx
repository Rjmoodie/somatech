import { quickActions } from './quickActionsConfig';
import React, { useState, useEffect, memo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingActionMenuProps {
  onModuleSelect: (module: string) => void;
}

const MemoQuickActionButton = memo(({ action, onClick }: { action: any; onClick: (module: string) => void }) => (
  <Button
    key={action.module}
    onClick={() => onClick(action.module)}
    className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 bg-gradient-to-r ${action.color} border-0 animate-bounce-subtle touch-manipulation`}
    style={{ animationDelay: `${action.id.length * 10}ms` }}
    title={action.title}
    aria-label={action.title}
  >
    <action.icon className="h-6 w-6 text-white" />
  </Button>
));
MemoQuickActionButton.displayName = 'MemoQuickActionButton';

const FloatingActionMenu = ({ onModuleSelect }: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const floatingActions = quickActions.filter(a => a.floating);

  const handleActionClick = (module: string) => {
    onModuleSelect(module);
    setIsOpen(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.floating-action-menu')) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-8 right-8 z-50 floating-action-menu">
      {/* Quick Action Buttons */}
      <div className={`flex flex-col-reverse space-y-reverse space-y-3 mb-4 transition-all duration-300 ${
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}>
        {floatingActions.map((action) => (
          <MemoQuickActionButton key={action.id} action={action} onClick={handleActionClick} />
        ))}
      </div>
      {/* Main FAB */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 transition-all duration-300 hover:scale-110 active:scale-95 touch-manipulation ${
          isOpen ? "rotate-45" : "rotate-0"
        }`}
        aria-label={isOpen ? "Close quick actions" : "Open quick actions"}
      >
        <Plus className="h-8 w-8 text-white transition-transform duration-300" />
      </Button>
    </div>
  );
};

export default FloatingActionMenu;