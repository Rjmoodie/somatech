import React, { useState } from 'react';
import { User, Settings, LogOut, Mail, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfileDropdownProps {
  username: string;
  userEmail: string;
}

export const ProfileDropdown = ({ username, userEmail }: ProfileDropdownProps) => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    email: user?.email || '',
  });

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          email: formData.email
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      setShowProfileDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
    setShowSignOutDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="group relative overflow-hidden bg-gradient-to-r from-primary/10 via-background to-accent/10 hover:from-primary/20 hover:to-accent/20 border border-border/50 hover:border-primary/30 px-3 md:px-4 py-2.5 md:py-3 rounded-xl flex items-center space-x-2 md:space-x-3 max-w-[220px] transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02]">
            <div className="relative">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary via-primary/90 to-accent rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                <User className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
            </div>
            <div className="text-sm md:text-base hidden sm:block min-w-0 flex-1">
              <div className="font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-300">
                {username}
              </div>
              <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></span>
                Pro Member
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-72 p-2 bg-gradient-to-br from-background via-background to-muted/20 border border-border/50 shadow-xl">
          <DropdownMenuLabel className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-border/30">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary via-primary/90 to-accent rounded-full flex items-center justify-center shadow-lg ring-2 ring-primary/20">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-lg truncate text-foreground">{username}</div>
              <div className="text-sm text-muted-foreground truncate">{userEmail}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="inline-block w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></span>
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Pro Member</span>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
            <User className="mr-2 h-4 w-4" />
            <span>Quick Profile Edit</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Navigating to account settings...');
            navigate('/somatech?module=account-settings');
          }}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setShowSignOutDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Settings Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-background via-background to-muted/10">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Quick Profile Edit
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary via-primary/90 to-accent rounded-full flex items-center justify-center shadow-xl ring-4 ring-primary/20">
                  <User className="h-10 w-10 text-primary-foreground" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-background flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter your username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  type="email"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Member since {new Date(user?.created_at || '').toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowProfileDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile} disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sign Out Confirmation Dialog */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You'll need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut} className="bg-red-600 hover:bg-red-700">
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};