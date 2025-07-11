import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Keyboard, Search, Star, Calculator, FileText } from "lucide-react";

const KeyboardShortcutsHelp = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Show help with Ctrl/Cmd + /
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        setOpen(true);
      }
      // Close with Escape
      if (event.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const shortcuts = [
    {
      category: "General",
      icon: Keyboard,
      items: [
        { keys: ["Ctrl", "/"], description: "Show keyboard shortcuts" },
        { keys: ["Esc"], description: "Close dialogs/modals" },
        { keys: ["Ctrl", "K"], description: "Global search (coming soon)" },
      ]
    },
    {
      category: "Navigation", 
      icon: Search,
      items: [
        { keys: ["1"], description: "Go to Dashboard" },
        { keys: ["2"], description: "Go to Stock Analysis" },
        { keys: ["3"], description: "Go to Watchlist" },
        { keys: ["4"], description: "Go to Business Valuation" },
        { keys: ["5"], description: "Go to Cash Flow" },
      ]
    },
    {
      category: "Actions",
      icon: Star,
      items: [
        { keys: ["Enter"], description: "Submit forms" },
        { keys: ["Ctrl", "S"], description: "Save current work" },
        { keys: ["Ctrl", "Z"], description: "Undo last action" },
      ]
    }
  ];

  const renderKey = (key: string) => (
    <Badge variant="outline" className="px-2 py-1 text-xs font-mono">
      {key}
    </Badge>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Keyboard className="h-5 w-5" />
            <span>Keyboard Shortcuts</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {shortcuts.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.category}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Icon className="h-5 w-5" />
                    <span>{section.category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {item.description}
                        </span>
                        <div className="flex items-center space-x-1">
                          {item.keys.map((key, keyIndex) => (
                            <React.Fragment key={keyIndex}>
                              {keyIndex > 0 && (
                                <span className="text-muted-foreground text-xs">+</span>
                              )}
                              {renderKey(key)}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Press <Badge variant="outline" className="mx-1">Ctrl</Badge> + <Badge variant="outline" className="mx-1">/</Badge> anytime to show this help</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsHelp;