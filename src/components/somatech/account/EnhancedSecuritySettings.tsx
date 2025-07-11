import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, Key, Mail, AlertTriangle, Download, Trash2, History, Smartphone, Eye, EyeOff } from "lucide-react";

interface LoginActivity {
  id: string;
  login_timestamp: string;
  ip_address: string | null;
  user_agent: string;
  device_type: string;
  location: string;
  success: boolean;
}

const EnhancedSecuritySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
  const [showLoginHistory, setShowLoginHistory] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSecuritySettings();
      fetchLoginActivity();
    }
  }, [user]);

  const fetchSecuritySettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('two_factor_enabled, email_verified')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setTwoFactorEnabled(data?.two_factor_enabled || false);
    } catch (error) {
      console.error('Error fetching security settings:', error);
    }
  };

  const fetchLoginActivity = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('login_activity')
        .select('*')
        .eq('user_id', user.id)
        .order('login_timestamp', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLoginActivity((data || []).map(item => ({
        ...item,
        ip_address: item.ip_address?.toString() || 'Unknown'
      })));
    } catch (error) {
      console.error('Error fetching login activity:', error);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendPasswordReset = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password reset email sent. Check your inbox.",
      });
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDataExport = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('data_export_requests')
        .insert({
          user_id: user.id,
          request_type: 'export'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Data export request submitted. You'll receive an email when ready.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to request data export",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccountDeletion = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('data_export_requests')
        .insert({
          user_id: user.id,
          request_type: 'deletion'
        });

      if (error) throw error;

      toast({
        title: "Account Deletion Requested",
        description: "Your account deletion request has been submitted. This action cannot be undone.",
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to request account deletion",
        variant: "destructive",
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <CardTitle>Change Password</CardTitle>
          </div>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={handleChangePassword} 
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Two-Factor Authentication</CardTitle>
          </div>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">TOTP Authentication</h4>
                {twoFactorEnabled ? (
                  <Badge variant="default">Enabled</Badge>
                ) : (
                  <Badge variant="secondary">Disabled</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Use an authenticator app like Google Authenticator or Authy
              </p>
            </div>
            <Button variant="outline" disabled>
              {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
            </Button>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
            <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-medium">Coming Soon</h4>
              <p className="text-sm text-muted-foreground">
                Two-factor authentication is currently in development. You'll be notified when this feature becomes available.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Login Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5" />
              <CardTitle>Login Activity</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowLoginHistory(!showLoginHistory)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showLoginHistory ? "Hide" : "View"} History
            </Button>
          </div>
          <CardDescription>
            Monitor recent login activity on your account
          </CardDescription>
        </CardHeader>
        {showLoginHistory && (
          <CardContent>
            <div className="space-y-3">
              {loginActivity.length > 0 ? (
                loginActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(activity.device_type)}
                      <div>
                        <div className="font-medium">{activity.device_type}</div>
                        <div className="text-sm text-muted-foreground">
                          {activity.ip_address} • {activity.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatTimestamp(activity.login_timestamp)}
                      </div>
                      <Badge variant={activity.success ? "default" : "destructive"}>
                        {activity.success ? "Success" : "Failed"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No login activity recorded yet
                </p>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      <Separator />

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Data & Privacy</CardTitle>
          <CardDescription>
            Manage your personal data and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <h4 className="font-medium">Export Your Data</h4>
              <p className="text-sm text-muted-foreground">
                Download a copy of all your personal data (GDPR compliant)
              </p>
            </div>
            <Button variant="outline" onClick={handleRequestDataExport} disabled={loading}>
              <Download className="h-4 w-4 mr-2" />
              Request Export
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
            <div className="space-y-1">
              <h4 className="font-medium text-destructive">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers. Are you absolutely sure?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRequestAccountDeletion}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Yes, Delete My Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
            <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-medium">Data Processing Notice</h4>
              <p className="text-sm text-muted-foreground">
                Data export and deletion requests are processed manually and may take up to 30 days to complete. 
                You'll receive email notifications about the status of your request.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSecuritySettings;