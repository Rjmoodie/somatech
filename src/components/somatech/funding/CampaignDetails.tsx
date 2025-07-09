import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Heart, Share2, Calendar, Target, Users, MessageCircle } from "lucide-react";
import { FundingCampaign, Donation } from "../types";
import { supabase } from "@/integrations/supabase/client";
import DonationForm from "./DonationForm";
import { toast } from "@/hooks/use-toast";

interface CampaignDetailsProps {
  campaign: FundingCampaign;
  onBack: () => void;
  onUpdate: (campaign: FundingCampaign) => void;
}

const CampaignDetails = ({ campaign, onBack, onUpdate }: CampaignDetailsProps) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDonationForm, setShowDonationForm] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, [campaign.id]);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('campaign_id', campaign.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonation = async (donationData: any) => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .insert([{
          ...donationData,
          campaign_id: campaign.id
        }])
        .select()
        .single();

      if (error) throw error;

      // Update the campaign with new amount
      const updatedCampaign = {
        ...campaign,
        current_amount: campaign.current_amount + donationData.amount
      };
      
      onUpdate(updatedCampaign);
      setDonations([data, ...donations]);
      setShowDonationForm(false);
      
      toast({
        title: "Thank you!",
        description: "Your donation has been processed successfully.",
      });
    } catch (error) {
      console.error('Error processing donation:', error);
      toast({
        title: "Error",
        description: "Failed to process donation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysLeft = (deadline: string | undefined) => {
    if (!deadline) return null;
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      car: 'bg-blue-500',
      education: 'bg-green-500',
      business: 'bg-purple-500',
      medical: 'bg-red-500',
      emergency: 'bg-orange-500',
      housing: 'bg-yellow-500',
      other: 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const handleShare = () => {
    const url = `${window.location.origin}/campaign/${campaign.url_slug || campaign.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Campaign link has been copied to clipboard.",
    });
  };

  const progress = calculateProgress(campaign.current_amount, campaign.target_amount);
  const daysLeft = getDaysLeft(campaign.deadline);
  const donorsCount = donations.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button onClick={() => setShowDonationForm(true)} className="gap-2">
            <Heart className="h-4 w-4" />
            Donate Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{campaign.title}</CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={`text-white ${getCategoryBadgeColor(campaign.category)}`}
                  >
                    {campaign.category.charAt(0).toUpperCase() + campaign.category.slice(1)}
                  </Badge>
                </div>
                {campaign.status !== 'active' && (
                  <Badge 
                    variant={campaign.status === 'completed' ? 'default' : 'destructive'}
                  >
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Campaign Image */}
              {campaign.image_url && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <img 
                    src={campaign.image_url} 
                    alt={campaign.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Description */}
              <div className="prose max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {campaign.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Projection Results */}
          {campaign.projection_data && (
            <Card>
              <CardHeader>
                <CardTitle>Campaign Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Target Amount:</span>
                      <span className="font-medium">{formatCurrency(campaign.projection_data.targetAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Projected Amount:</span>
                      <span className="font-medium">{formatCurrency(campaign.projection_data.projectedAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expected Donors:</span>
                      <span className="font-medium">{campaign.projection_data.expectedDonors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Weekly Target:</span>
                      <span className="font-medium">{formatCurrency(campaign.projection_data.weeklyTarget)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Success Probability:</span>
                      <span className={`font-medium ${campaign.projection_data.successProbability >= 80 ? 'text-green-600' : campaign.projection_data.successProbability >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {campaign.projection_data.successProbability}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Weeks to Complete:</span>
                      <span className="font-medium">{campaign.projection_data.weeksToComplete}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Optimistic Scenario:</span>
                      <span className="font-medium">{formatCurrency(campaign.projection_data.optimisticAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span className={`font-medium ${campaign.projection_data.onTrack ? 'text-green-600' : 'text-yellow-600'}`}>
                        {campaign.projection_data.onTrack ? 'On Track' : 'Needs Adjustment'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Financial Breakdown */}
          {campaign.financial_breakdown && (
            <Card>
              <CardHeader>
                <CardTitle>Financial Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(campaign.financial_breakdown as any[]).map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{item.title}</span>
                      <span className="font-medium">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(campaign.target_amount)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Donations List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : donations.length === 0 ? (
                <p className="text-muted-foreground">No donations yet. Be the first to support this campaign!</p>
              ) : (
                <div className="space-y-4">
                  {donations.slice(0, 10).map((donation) => (
                    <div key={donation.id} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {donation.is_anonymous 
                              ? 'Anonymous' 
                              : donation.donor_name || 'Anonymous'
                            }
                          </p>
                          {donation.message && (
                            <p className="text-sm text-muted-foreground mt-1">
                              "{donation.message}"
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(donation.amount)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(donation.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {donations.length > 10 && (
                    <p className="text-sm text-muted-foreground text-center">
                      And {donations.length - 10} more donations...
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-2xl font-bold">
                    {formatCurrency(campaign.current_amount)}
                  </span>
                  <span className="text-muted-foreground">
                    of {formatCurrency(campaign.target_amount)}
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="text-sm text-muted-foreground">
                  {progress.toFixed(1)}% funded
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold">{donorsCount}</div>
                  <div className="text-sm text-muted-foreground">Donors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {daysLeft !== null ? daysLeft : '∞'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {daysLeft !== null ? 'Days left' : 'No deadline'}
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setShowDonationForm(true)} 
                className="w-full gap-2"
                disabled={campaign.status !== 'active'}
              >
                <Heart className="h-4 w-4" />
                Donate Now
              </Button>
            </CardContent>
          </Card>

          {/* Campaign Info */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Created {new Date(campaign.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span>{formatCurrency(campaign.target_amount)} goal</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{donorsCount} supporters</span>
              </div>
              {campaign.deadline && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Ends {new Date(campaign.deadline).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Donation Form Dialog */}
      {showDonationForm && (
        <DonationForm
          campaign={campaign}
          onClose={() => setShowDonationForm(false)}
          onDonation={handleDonation}
        />
      )}
    </div>
  );
};

export default CampaignDetails;