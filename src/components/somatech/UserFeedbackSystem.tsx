import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  MessageSquare, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  X,
  ChevronUp,
  Star
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FeedbackItem {
  id: string;
  type: 'bug' | 'suggestion' | 'question';
  message: string;
  email?: string;
  timestamp: Date;
  status: 'pending' | 'resolved';
}

interface NavigationHintProps {
  hint: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  show: boolean;
  onDismiss: () => void;
}

const NavigationHint: React.FC<NavigationHintProps> = ({ hint, position, show, onDismiss }) => {
  if (!show) return null;

  return (
    <div className={cn(
      "fixed z-50 bg-primary text-primary-foreground p-3 rounded-lg shadow-lg max-w-xs animate-fade-in",
      {
        'top-4 left-1/2 transform -translate-x-1/2': position === 'top',
        'bottom-4 left-1/2 transform -translate-x-1/2': position === 'bottom',
        'left-4 top-1/2 transform -translate-y-1/2': position === 'left',
        'right-4 top-1/2 transform -translate-y-1/2': position === 'right',
      }
    )}>
      <div className="flex items-start gap-2">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p className="text-sm">{hint}</p>
        <Button
          size="sm"
          variant="ghost"
          className="h-auto p-0 text-primary-foreground hover:text-primary-foreground/80"
          onClick={onDismiss}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

const UserFeedbackSystem: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [feedbackType, setFeedbackType] = useState<'bug' | 'suggestion' | 'question'>('suggestion');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuickFeedback, setShowQuickFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [showNavigationHints, setShowNavigationHints] = useState(false);
  const [currentHint, setCurrentHint] = useState('');

  // Navigation hints based on common user issues
  const navigationHints = [
    "💡 Use the bottom navigation on mobile to quickly switch between tools",
    "🔍 Try the search filters to find specific campaigns or businesses",
    "📱 Tap the menu button (☰) for full navigation options",
    "🎯 Click 'My Campaigns' to view and manage your created campaigns",
    "💰 Use the projection calculator when creating campaigns for better success rates"
  ];

  useEffect(() => {
    // Show navigation hints for new users
    const hasSeenHints = localStorage.getItem('navigation-hints-seen');
    if (!hasSeenHints) {
      setTimeout(() => {
        setCurrentHint(navigationHints[Math.floor(Math.random() * navigationHints.length)]);
        setShowNavigationHints(true);
        localStorage.setItem('navigation-hints-seen', 'true');
      }, 3000);
    }
  }, []);

  const dismissHint = () => {
    setShowNavigationHints(false);
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Please enter your feedback",
        description: "We'd love to hear your thoughts!",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, you'd send this to your backend
      const feedbackItem: FeedbackItem = {
        id: Date.now().toString(),
        type: feedbackType,
        message: feedback.trim(),
        email: email.trim() || undefined,
        timestamp: new Date(),
        status: 'pending'
      };

      // Store locally for now (in real app, send to backend)
      const existingFeedback = JSON.parse(localStorage.getItem('user-feedback') || '[]');
      existingFeedback.push(feedbackItem);
      localStorage.setItem('user-feedback', JSON.stringify(existingFeedback));

      toast({
        title: "Thank you for your feedback!",
        description: "We appreciate your input and will review it soon.",
      });

      // Reset form
      setFeedback('');
      setEmail('');
      setRating(0);
      setIsOpen(false);
      
    } catch (error) {
      toast({
        title: "Failed to submit feedback",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickRating = (stars: number) => {
    setRating(stars);
    toast({
      title: "Thanks for rating!",
      description: stars >= 4 ? "We're glad you're enjoying the app!" : "We'll work on improving your experience.",
    });
    setShowQuickFeedback(false);
  };

  const getFeedbackIcon = () => {
    switch (feedbackType) {
      case 'bug':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'suggestion':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'question':
        return <Info className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <>
      {/* Navigation Hints */}
      <NavigationHint
        hint={currentHint}
        position="top"
        show={showNavigationHints}
        onDismiss={dismissHint}
      />

      {/* Floating Feedback Button */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        {/* Quick Rating Popover */}
        <Popover open={showQuickFeedback} onOpenChange={setShowQuickFeedback}>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="bg-background shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Star className="h-4 w-4 mr-1" />
              Rate
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" side="top">
            <div className="text-center">
              <p className="text-sm font-medium mb-2">How's your experience?</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    size="sm"
                    variant="ghost"
                    className="p-1 h-auto"
                    onClick={() => handleQuickRating(star)}
                  >
                    <Star 
                      className={cn(
                        "h-4 w-4",
                        star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      )} 
                    />
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Main Feedback Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              className="shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
              size="sm"
            >
              <MessageSquare className="h-4 w-4" />
              Feedback
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getFeedbackIcon()}
                Share Your Feedback
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Feedback Type Selection */}
              <div className="grid grid-cols-3 gap-2">
                {(['bug', 'suggestion', 'question'] as const).map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant={feedbackType === type ? 'default' : 'outline'}
                    onClick={() => setFeedbackType(type)}
                    className="capitalize"
                  >
                    {type === 'bug' && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {type === 'suggestion' && <MessageSquare className="h-3 w-3 mr-1" />}
                    {type === 'question' && <Info className="h-3 w-3 mr-1" />}
                    {type}
                  </Button>
                ))}
              </div>

              {/* Feedback Message */}
              <Textarea
                placeholder={`Tell us about your ${feedbackType}...`}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="resize-none"
              />

              {/* Optional Email */}
              <Input
                placeholder="Email (optional, for follow-up)"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Submit Button */}
              <Button 
                onClick={handleSubmitFeedback}
                disabled={isSubmitting}
                className="w-full gap-2"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Submit Feedback
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default UserFeedbackSystem;