import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Filter, Settings as SettingsIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NotificationBellProps {
  className?: string;
}

const NotificationBell = ({ className }: NotificationBellProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [preferences, setPreferences] = useState({
    push_notifications_enabled: true,
    email_notifications_enabled: true,
    price_alerts_enabled: true,
    weekly_summary_enabled: true,
  });
  const [showSettings, setShowSettings] = useState(false);

  // Fetch notifications count and recent items
  const fetchNotificationData = async () => {
    if (!user) return;

    try {
      // Get unread count
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

      setUnreadCount(count || 0);

      // Get recent notifications
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentNotifications(data || []);

      // Get preferences
      const { data: profile } = await supabase
        .from('profiles')
        .select('push_notifications_enabled, email_notifications_enabled, price_alerts_enabled, weekly_summary_enabled')
        .eq('id', user.id)
        .single();

      if (profile) {
        setPreferences(profile);
      }
    } catch (error) {
      console.error('Error fetching notification data:', error);
    }
  };

  // Update preferences
  const updatePreferences = async (newPreferences: typeof preferences) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(newPreferences)
        .eq('id', user.id);

      if (error) throw error;

      setPreferences(newPreferences);
      toast({
        title: "Settings Updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update preferences",
        variant: "destructive",
      });
    }
  };

  // Create a test notification
  const createTestNotification = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('create_notification', {
        p_user_id: user.id,
        p_title: 'Test Notification',
        p_message: 'This is a test notification to verify the system is working correctly.',
        p_type: 'info',
        p_category: 'system',
        p_action_url: '/somatech?module=notifications',
        p_action_label: 'View All',
        p_priority: 2
      });

      if (error) throw error;

      toast({
        title: "Test Notification Created",
        description: "Check your notification center to see it.",
      });

      fetchNotificationData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create test notification",
        variant: "destructive",
      });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`relative ${className}`}
          onClick={fetchNotificationData}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount}</Badge>
              )}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Recent notifications and alerts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Settings Panel */}
          {showSettings && (
            <Card>
              <CardContent className="pt-4 space-y-3">
                <h4 className="font-medium text-sm">Notification Preferences</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications" className="text-sm">Push Notifications</Label>
                  <Switch
                    id="push-notifications"
                    checked={preferences.push_notifications_enabled}
                    onCheckedChange={(checked) => 
                      updatePreferences({ ...preferences, push_notifications_enabled: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="text-sm">Email Notifications</Label>
                  <Switch
                    id="email-notifications"
                    checked={preferences.email_notifications_enabled}
                    onCheckedChange={(checked) => 
                      updatePreferences({ ...preferences, email_notifications_enabled: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="price-alerts" className="text-sm">Price Alerts</Label>
                  <Switch
                    id="price-alerts"
                    checked={preferences.price_alerts_enabled}
                    onCheckedChange={(checked) => 
                      updatePreferences({ ...preferences, price_alerts_enabled: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="weekly-summary" className="text-sm">Weekly Summary</Label>
                  <Switch
                    id="weekly-summary"
                    checked={preferences.weekly_summary_enabled}
                    onCheckedChange={(checked) => 
                      updatePreferences({ ...preferences, weekly_summary_enabled: checked })
                    }
                  />
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={createTestNotification}
                  className="w-full mt-3"
                >
                  Send Test Notification
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Recent Notifications */}
          <div className="space-y-3">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200' : 'bg-muted/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-grow">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(notification.created_at)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {notification.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.href = '/somatech?module=notifications'}
              className="flex-1"
            >
              View All
            </Button>
            
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={async () => {
                  if (!user) return;
                  await supabase
                    .from('notifications')
                    .update({ read: true, read_at: new Date().toISOString() })
                    .eq('user_id', user.id)
                    .eq('read', false);
                  
                  setUnreadCount(0);
                  toast({
                    title: "All notifications marked as read",
                  });
                }}
                className="flex-1"
              >
                Mark All Read
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationBell;