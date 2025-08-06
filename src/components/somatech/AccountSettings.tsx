import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Shield, Bell } from "lucide-react";
import ProfileSettings from "./account/ProfileSettings";
import EnhancedSecuritySettings from "./account/EnhancedSecuritySettings";
import NotificationSettings from "./account/NotificationSettings";
import ThemeSettings from "./account/ThemeSettings";
import { Profile } from './types';

const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
};

const updateProfile = async ({ userId, updates }: { userId: string; updates: Partial<Profile> }) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  if (error) throw error;
  return data;
};

const AccountSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => user ? fetchProfile(user.id) : Promise.resolve(null),
    enabled: !!user
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast({ title: 'Success', description: 'Profile updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const handleUpdateProfile = (updates: Partial<Profile>) => {
    if (!user || !profile) return;
    mutation.mutate({ userId: user.id, updates });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load profile data</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load profile data</p>
      </div>
    );
  }

  const getCompletionLevel = (score: number) => {
    if (score >= 80) return { label: "Complete", variant: "default" as const };
    if (score >= 50) return { label: "Good", variant: "secondary" as const };
    return { label: "Needs Work", variant: "destructive" as const };
  };

  const completionLevel = getCompletionLevel(profile.profile_completion_score);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with completion tracker */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account preferences and settings
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Profile Completion</CardTitle>
                  <CardDescription>
                    Complete your profile to get the most out of SomaTech
                  </CardDescription>
                </div>
                <Badge variant={completionLevel.variant}>
                  {completionLevel.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{profile.profile_completion_score}%</span>
                </div>
                <Progress value={profile.profile_completion_score} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings tabs */}
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Theme
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSettings profile={profile} onUpdate={handleUpdateProfile} />
          </TabsContent>

          <TabsContent value="security">
            <EnhancedSecuritySettings />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="theme">
            <ThemeSettings profile={profile} onUpdate={handleUpdateProfile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountSettings;