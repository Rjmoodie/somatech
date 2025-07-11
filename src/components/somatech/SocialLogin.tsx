import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Chrome, Apple, Github, Mail, Smartphone, Shield, Zap } from "lucide-react";

const SocialLogin = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'github') => {
    setLoading(provider);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/somatech?module=dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Redirecting...",
        description: `Opening ${provider} sign-in page`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to sign in with ${provider}`,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const socialProviders = [
    {
      id: 'google' as const,
      name: 'Google',
      icon: Chrome,
      description: 'Sign in with your Google account',
      available: true,
      color: 'text-red-600'
    },
    {
      id: 'apple' as const,
      name: 'Apple',
      icon: Apple,
      description: 'Sign in with your Apple ID',
      available: false,
      color: 'text-gray-800 dark:text-white'
    },
    {
      id: 'github' as const,
      name: 'GitHub',
      icon: Github,
      description: 'Sign in with your GitHub account',
      available: false,
      color: 'text-gray-800 dark:text-white'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Social Login Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Sign-In Options
          </CardTitle>
          <CardDescription>
            Sign in faster with your existing accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {socialProviders.map((provider) => {
            const IconComponent = provider.icon;
            return (
              <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg border ${provider.color}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{provider.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {provider.description}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {provider.available ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialLogin(provider.id)}
                      disabled={loading === provider.id}
                    >
                      {loading === provider.id ? "Connecting..." : "Connect"}
                    </Button>
                  ) : (
                    <Badge variant="secondary">Coming Soon</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Why Use Social Login?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium">Faster Access</div>
                <div className="text-sm text-muted-foreground">
                  Skip the signup process with one-click authentication
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium">Enhanced Security</div>
                <div className="text-sm text-muted-foreground">
                  Leverage the security infrastructure of major providers
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <div className="font-medium">Cross-Device Sync</div>
                <div className="text-sm text-muted-foreground">
                  Access your account seamlessly across all devices
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <div className="font-medium">Auto Profile Setup</div>
                <div className="text-sm text-muted-foreground">
                  Automatically populate your profile with verified information
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Traditional Email Signup */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Prefer email? You can still create an account with your email address using the traditional signup form above.
        </p>
      </div>
    </div>
  );
};

export default SocialLogin;