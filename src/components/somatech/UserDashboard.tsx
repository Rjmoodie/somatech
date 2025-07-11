import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Clock, Target, Award, Calendar, Activity, FileText } from "lucide-react";

interface UsageStats {
  total_analyses: number;
  watchlist_items: number;
  saved_plans: number;
  login_count: number;
  last_login: string;
  member_since: string;
  profile_completion: number;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<UsageStats>({
    total_analyses: 0,
    watchlist_items: 0,
    saved_plans: 0,
    login_count: 0,
    last_login: '',
    member_since: '',
    profile_completion: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchRecentActivity();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Fetch profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('login_count, last_login_at, created_at, profile_completion_score')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Fetch watchlist count
      const { count: watchlistCount, error: watchlistError } = await supabase
        .from('watchlist')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (watchlistError) throw watchlistError;

      // Fetch retirement plans count
      const { count: plansCount, error: plansError } = await supabase
        .from('retirement_plans')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (plansError) throw plansError;

      // Fetch BRRRR deals count
      const { count: dealsCount, error: dealsError } = await supabase
        .from('brrrr_deals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (dealsError) throw dealsError;

      setStats({
        total_analyses: (watchlistCount || 0),
        watchlist_items: watchlistCount || 0,
        saved_plans: (plansCount || 0) + (dealsCount || 0),
        login_count: profile?.login_count || 0,
        last_login: profile?.last_login_at || '',
        member_since: profile?.created_at || user.created_at,
        profile_completion: profile?.profile_completion_score || 0
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    if (!user) return;

    try {
      // Get recent watchlist additions
      const { data: watchlistData, error: watchlistError } = await supabase
        .from('watchlist')
        .select('ticker, added_at, company_name')
        .eq('user_id', user.id)
        .order('added_at', { ascending: false })
        .limit(3);

      if (watchlistError) throw watchlistError;

      // Get recent plans
      const { data: plansData, error: plansError } = await supabase
        .from('retirement_plans')
        .select('plan_name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(2);

      if (plansError) throw plansError;

      const activity = [
        ...(watchlistData || []).map(item => ({
          type: 'watchlist',
          title: `Added ${item.ticker} to watchlist`,
          subtitle: item.company_name,
          timestamp: item.added_at,
          icon: TrendingUp
        })),
        ...(plansData || []).map(item => ({
          type: 'plan',
          title: `Created retirement plan: ${item.plan_name}`,
          subtitle: 'Retirement Planning',
          timestamp: item.created_at,
          icon: Target
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getMembershipDuration = () => {
    if (!stats.member_since) return '0 days';
    const memberSince = new Date(stats.member_since);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - memberSince.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Track your progress and activity on SomaTech
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="elegant-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">{stats.total_analyses}</p>
                  <p className="text-sm text-muted-foreground">Analyses</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="elegant-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">{stats.watchlist_items}</p>
                  <p className="text-sm text-muted-foreground">Watchlist Items</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="elegant-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">{stats.saved_plans}</p>
                  <p className="text-sm text-muted-foreground">Saved Plans</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="elegant-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">{stats.login_count}</p>
                  <p className="text-sm text-muted-foreground">Total Logins</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Completion */}
          <Card className="premium-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                Profile Completion
              </CardTitle>
              <CardDescription className="text-base">
                Complete your profile to unlock all features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{stats.profile_completion}%</span>
                </div>
                <Progress value={stats.profile_completion} className="h-2" />
              </div>
              
              {stats.profile_completion < 100 && (
                <Button 
                  size="sm" 
                  onClick={() => window.location.href = '/somatech?module=account-settings'}
                  className="w-full"
                >
                  Complete Profile
                </Button>
              )}
              
              {stats.profile_completion === 100 && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <Award className="h-4 w-4" />
                  <span>Profile Complete!</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="premium-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium">{formatDate(stats.member_since)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Membership Duration</span>
                <span className="text-sm font-medium">{getMembershipDuration()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Login</span>
                <span className="text-sm font-medium">{formatDateTime(stats.last_login)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Account Status</span>
                <Badge variant="default">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="premium-card">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-success" />
              </div>
              Recent Activity
            </CardTitle>
            <CardDescription className="text-base">
              Your latest actions on SomaTech
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 surface-card hover:bg-muted/30 transition-colors">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="font-medium text-sm text-foreground">{activity.title}</div>
                        <div className="text-xs text-muted-foreground">{activity.subtitle}</div>
                      </div>
                      <div className="text-xs text-muted-foreground flex-shrink-0">
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No recent activity. Start by analyzing a stock or creating a plan!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;