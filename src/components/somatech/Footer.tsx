import React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface FooterProps {
  onPrivacyClick: () => void;
  onTermsClick: () => void;
}

const Footer = ({ onPrivacyClick, onTermsClick }: FooterProps) => {
  return (
    <footer className="mt-8 pt-6">
      <Separator className="mb-6" />
      
      {/* Discord Community Section */}
      <div className="flex justify-center mb-6">
        <Button 
          asChild
          variant="outline" 
          className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <a 
            href="https://discord.gg/YOURINVITELINK" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-4 w-4" />
            Join the SomaTech Community
          </a>
        </Button>
      </div>
      
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
            href="mailto:support@somatech.pro" 
            className="hover:text-foreground transition-colors"
          >
            Contact
          </a>
          <button 
            onClick={onTermsClick}
            className="hover:text-foreground transition-colors"
          >
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;