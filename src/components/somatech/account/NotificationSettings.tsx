import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail, MessageSquare, TrendingUp } from "lucide-react";

interface NotificationPreferences {
  email: boolean;
  in_app: boolean;
  marketing: boolean;
  analysis_complete: boolean;
  watchlist_alerts: boolean;
  market_updates: boolean;
  weekly_summary: boolean;
}

const NotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    in_app: true,
    marketing: false,
    analysis_complete: true,
    watchlist_alerts: true,
    market_updates: false,
    weekly_summary: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotificationPreferences();
    }
  }, [user]);

  const fetchNotificationPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('notification_preferences')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.notification_preferences) {
        setPreferences(prev => ({
          ...prev,
          ...(data.notification_preferences as Record<string, boolean>)
        }));
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: NotificationPreferences) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          user_id: user.id,
          notification_preferences: newPreferences as any,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setPreferences(newPreferences);
      toast({
        title: "Success",
        description: "Notification preferences updated",
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      });
    }
  };

  const handleToggle = (key: keyof NotificationPreferences) => {
    const newPreferences = { ...preferences, [key]: !preferences[key] };
    updatePreferences(newPreferences);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* General Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>General Notifications</CardTitle>
          </div>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={preferences.email}
              onCheckedChange={() => handleToggle('email')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center gap-2">
                <Label>In-App Notifications</Label>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Receive notifications within the application
              </p>
            </div>
            <Switch
              checked={preferences.in_app}
              onCheckedChange={() => handleToggle('in_app')}
              disabled
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Communications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new features and promotions
              </p>
            </div>
            <Switch
              checked={preferences.marketing}
              onCheckedChange={() => handleToggle('marketing')}
            />
          </div>
        </CardContent>
      </Card>

      {/* SomaTech Specific */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <CardTitle>SomaTech Notifications</CardTitle>
          </div>
          <CardDescription>
            Notifications specific to your SomaTech activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Analysis Complete</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when your stock analysis is ready
              </p>
            </div>
            <Switch
              checked={preferences.analysis_complete}
              onCheckedChange={() => handleToggle('analysis_complete')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Watchlist Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Price alerts and updates for your watchlist stocks
              </p>
            </div>
            <Switch
              checked={preferences.watchlist_alerts}
              onCheckedChange={() => handleToggle('watchlist_alerts')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Market Updates</Label>
              <p className="text-sm text-muted-foreground">
                Daily market summaries and key economic news
              </p>
            </div>
            <Switch
              checked={preferences.market_updates}
              onCheckedChange={() => handleToggle('market_updates')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Summary</Label>
              <p className="text-sm text-muted-foreground">
                Weekly roundup of your portfolio and activities
              </p>
            </div>
            <Switch
              checked={preferences.weekly_summary}
              onCheckedChange={() => handleToggle('weekly_summary')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Frequency */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <CardTitle>Email Frequency</CardTitle>
          </div>
          <CardDescription>
            Control how often you receive email notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg bg-muted">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4" />
                <span className="font-medium">Email Digest</span>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Bundle multiple notifications into a single daily or weekly email digest to reduce inbox clutter.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;