import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CreateCampaignForm, FundingCampaign } from "../types";
import { campaignCategories } from "../constants";
import { toast } from "@/hooks/use-toast";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCampaignCreated: (campaign: FundingCampaign) => void;
}

const CreateCampaignDialog = ({ open, onOpenChange, onCampaignCreated }: CreateCampaignDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<CreateCampaignForm>({
    title: "",
    category: "",
    description: "",
    target_amount: 0,
    visibility: "public",
    financial_breakdown: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.description || !formData.target_amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      let image_url = null;
      
      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('campaign-media')
          .upload(fileName, imageFile);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('campaign-media')
          .getPublicUrl(fileName);
        
        image_url = publicUrl;
      }

      // Create URL slug from title
      const url_slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const { data, error } = await supabase
        .from('funding_campaigns')
        .insert([
          {
            ...formData,
            user_id: user.id,
            image_url,
            url_slug,
            financial_breakdown: formData.financial_breakdown?.length 
              ? formData.financial_breakdown 
              : null
          }
        ])
        .select()
        .single();

      if (error) throw error;

      onCampaignCreated(data as FundingCampaign);
      setFormData({
        title: "",
        category: "",
        description: "",
        target_amount: 0,
        visibility: "public",
        financial_breakdown: []
      });
      setImageFile(null);
      
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addBreakdownItem = () => {
    setFormData({
      ...formData,
      financial_breakdown: [
        ...(formData.financial_breakdown || []),
        { title: "", amount: 0 }
      ]
    });
  };

  const removeBreakdownItem = (index: number) => {
    setFormData({
      ...formData,
      financial_breakdown: formData.financial_breakdown?.filter((_, i) => i !== index)
    });
  };

  const updateBreakdownItem = (index: number, field: 'title' | 'amount', value: string | number) => {
    setFormData({
      ...formData,
      financial_breakdown: formData.financial_breakdown?.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Funding Campaign</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Campaign Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Help Me Buy My First Car"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {campaignCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell your story, your needs, your plan..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="target_amount">Target Amount ($) *</Label>
              <Input
                id="target_amount"
                type="number"
                value={formData.target_amount}
                onChange={(e) => setFormData({ ...formData, target_amount: parseFloat(e.target.value) || 0 })}
                placeholder="10000"
                min="1"
                required
              />
            </div>

            <div>
              <Label htmlFor="deadline">Deadline (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="image">Campaign Image (Optional)</Label>
            <div className="mt-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {imageFile && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Selected: {imageFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setImageFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Financial Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Breakdown (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.financial_breakdown?.map((item, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label>Item</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => updateBreakdownItem(index, 'title', e.target.value)}
                      placeholder="Tuition"
                    />
                  </div>
                  <div className="w-32">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={item.amount}
                      onChange={(e) => updateBreakdownItem(index, 'amount', parseFloat(e.target.value) || 0)}
                      placeholder="5000"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeBreakdownItem(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBreakdownItem}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardContent>
          </Card>

          {/* Visibility */}
          <div>
            <Label>Visibility</Label>
            <Select
              value={formData.visibility}
              onValueChange={(value) => setFormData({ ...formData, visibility: value as 'public' | 'private' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Anyone can discover</SelectItem>
                <SelectItem value="private">Private - Only accessible via link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampaignDialog;