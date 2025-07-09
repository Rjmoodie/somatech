import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Lock, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess?: () => void;
}

const AuthDialog = ({ open, onOpenChange, onAuthSuccess }: AuthDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState("signin");

  const handleAuth = async (type: 'signin' | 'signup') => {
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    if (type === 'signup' && !username.trim()) {
      toast({
        title: "Validation Error", 
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = type === 'signin' 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ 
            email, 
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                username: username.trim()
              }
            }
          });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        } else if (error.message.includes('Password should be at least 6 characters')) {
          throw new Error('Password must be at least 6 characters long.');
        } else {
          throw new Error(error.message);
        }
      }

      if (type === 'signup' && !data.user?.email_confirmed_at) {
        toast({
          title: "Check Your Email",
          description: "Please check your email and click the confirmation link to complete your registration.",
        });
      } else {
        toast({
          title: "Success!",
          description: type === 'signin' ? "You've been signed in successfully" : "Account created successfully",
        });
        
        // Reset form
        setEmail("");
        setPassword("");
        setUsername("");
        onOpenChange(false);
        onAuthSuccess?.();
      }
    } catch (error) {
      console.error(`${type} error:`, error);
      toast({
        title: type === 'signin' ? "Sign In Failed" : "Sign Up Failed",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Access
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Sign in to your SomaTech account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="signin-email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signin-password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button 
                  onClick={() => handleAuth('signin')} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Join SomaTech to start creating campaigns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="signup-username" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Username
                  </Label>
                  <Input
                    id="signup-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (min 6 characters)"
                    required
                  />
                </div>
                <Button 
                  onClick={() => handleAuth('signup')} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export const useAuth = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<{ username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, email')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }
      
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You've been signed out successfully",
      });
    }
  };

  return { user, profile, loading, signOut };
};

export default AuthDialog;