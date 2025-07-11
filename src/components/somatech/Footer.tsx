import React from "react";
import { Separator } from "@/components/ui/separator";

interface FooterProps {
  onPrivacyClick: () => void;
}

const Footer = ({ onPrivacyClick }: FooterProps) => {
  return (
    <footer className="mt-8 pt-6">
      <Separator className="mb-6" />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-semibold">SomaTech</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={onPrivacyClick}
            className="hover:text-foreground transition-colors"
          >
            Privacy Policy
          </button>
          <a 
            href="mailto:support@somatech.com" 
            className="hover:text-foreground transition-colors"
          >
            Contact
          </a>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;