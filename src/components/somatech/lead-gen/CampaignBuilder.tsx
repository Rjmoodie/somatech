import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Mail, 
  Users, 
  Target, 
  Send, 
  Calendar,
  BarChart3,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchContext } from './context';
import { keilaService, REAL_ESTATE_TEMPLATES } from '@/services/keilaService';

interface CampaignBuilderProps {
  isVisible: boolean;
  onClose: () => void;
}

interface AgentInfo {
  name: string;
  email: string;
  phone: string;
  company: string;
}

export const CampaignBuilder: React.FC<CampaignBuilderProps> = ({
  isVisible,
  onClose
}) => {
  const { state } = useSearchContext();
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [campaignName, setCampaignName] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [agentInfo, setAgentInfo] = useState<AgentInfo>({
    name: '',
    email: '',
    phone: '',
    company: 'SomaTech Investment Platform'
  });
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [campaignStatus, setCampaignStatus] = useState<'draft' | 'sending' | 'sent' | 'error'>('draft');
  const [campaignId, setCampaignId] = useState<string | null>(null);

  // Get available templates
  const templates = keilaService.getRealEstateTemplates();

  // Filter leads based on selection
  const filteredLeads = state.results.filter(lead => 
    selectedLeads.includes(lead.id)
  );

  // Calculate campaign statistics
  const campaignStats = {
    totalRecipients: filteredLeads.length,
    avgEquity: filteredLeads.length > 0 
      ? filteredLeads.reduce((sum, lead) => sum + (lead.equity_percent || 0), 0) / filteredLeads.length 
      : 0,
    avgValue: filteredLeads.length > 0 
      ? filteredLeads.reduce((sum, lead) => sum + (lead.estimated_value || 0), 0) / filteredLeads.length 
      : 0,
    highEquityCount: filteredLeads.filter(lead => (lead.equity_percent || 0) > 50).length,
    distressedCount: filteredLeads.filter(lead => 
      lead.status === 'distressed' || lead.status === 'foreclosure'
    ).length
  };

  // Handle lead selection
  const handleLeadSelection = (leadId: string, selected: boolean) => {
    if (selected) {
      setSelectedLeads(prev => [...prev, leadId]);
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
    }
  };

  // Handle template selection
  const handleTemplateSelection = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = REAL_ESTATE_TEMPLATES[templateId as keyof typeof REAL_ESTATE_TEMPLATES];
    if (template) {
      setCampaignName(`${template.name} - ${new Date().toLocaleDateString()}`);
      setCustomSubject(template.subject);
    }
  };

  // Create and send campaign
  const handleSendCampaign = async () => {
    if (!selectedTemplate || filteredLeads.length === 0) {
      return;
    }

    setIsLoading(true);
    setCampaignStatus('sending');

    try {
      const campaign = await keilaService.createRealEstateCampaign(
        filteredLeads,
        selectedTemplate as keyof typeof REAL_ESTATE_TEMPLATES,
        agentInfo
      );

      setCampaignId(campaign.id);
      setCampaignStatus('sent');
      
      // Reset form after successful send
      setTimeout(() => {
        setSelectedLeads([]);
        setSelectedTemplate('');
        setCampaignName('');
        setCustomSubject('');
        setCampaignStatus('draft');
      }, 3000);

    } catch (error) {
      console.error('Campaign creation failed:', error);
      setCampaignStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick selection presets
  const quickSelections = [
    {
      name: 'High Equity Properties',
      filter: (lead: any) => (lead.equity_percent || 0) > 50,
      count: state.results.filter(lead => (lead.equity_percent || 0) > 50).length
    },
    {
      name: 'Distressed Properties',
      filter: (lead: any) => lead.status === 'distressed' || lead.status === 'foreclosure',
      count: state.results.filter(lead => 
        lead.status === 'distressed' || lead.status === 'foreclosure'
      ).length
    },
    {
      name: 'Absentee Owners',
      filter: (lead: any) => lead.owner_type === 'absentee' || lead.owner_type === 'out_of_state',
      count: state.results.filter(lead => 
        lead.owner_type === 'absentee' || lead.owner_type === 'out_of_state'
      ).length
    },
    {
      name: 'All Properties',
      filter: () => true,
      count: state.results.length
    }
  ];

  const handleQuickSelection = (filter: (lead: any) => boolean) => {
    const filteredIds = state.results.filter(filter).map(lead => lead.id);
    setSelectedLeads(filteredIds);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Email Campaign Builder
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create and send professional real estate campaigns
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>

          <div className="flex h-[calc(90vh-80px)]">
            {/* Left Panel - Lead Selection */}
            <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">Select Recipients</h3>
                  
                  {/* Quick Selection Buttons */}
                  <div className="space-y-2 mb-4">
                    {quickSelections.map((preset, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickSelection(preset.filter)}
                        className="w-full justify-between"
                      >
                        <span>{preset.name}</span>
                        <Badge variant="secondary">{preset.count}</Badge>
                      </Button>
                    ))}
                  </div>

                  <Separator />

                  {/* Individual Lead Selection */}
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {state.results.map((lead) => (
                      <div
                        key={lead.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedLeads.includes(lead.id)
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => handleLeadSelection(lead.id, !selectedLeads.includes(lead.id))}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{lead.address}</p>
                            <p className="text-xs text-gray-500">
                              {lead.owner_name} • ${(lead.estimated_value || 0).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={lead.equity_percent > 50 ? "default" : "secondary"}>
                              {lead.equity_percent}% equity
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Campaign Configuration */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Campaign Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Campaign Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {campaignStats.totalRecipients}
                        </div>
                        <div className="text-sm text-gray-500">Recipients</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          ${campaignStats.avgValue.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Avg Value</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {campaignStats.avgEquity.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500">Avg Equity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {campaignStats.highEquityCount}
                        </div>
                        <div className="text-sm text-gray-500">High Equity</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Template Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Template</CardTitle>
                    <CardDescription>
                      Choose a professional template for your campaign
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedTemplate} onValueChange={handleTemplateSelection}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {template.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Campaign Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="campaign-name">Campaign Name</Label>
                      <Input
                        id="campaign-name"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="Enter campaign name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="subject-line">Subject Line</Label>
                      <Input
                        id="subject-line"
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        placeholder="Enter subject line"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Agent Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Agent Information</CardTitle>
                    <CardDescription>
                      Your contact information will appear in the email
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="agent-name">Name</Label>
                        <Input
                          id="agent-name"
                          value={agentInfo.name}
                          onChange={(e) => setAgentInfo(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="agent-email">Email</Label>
                        <Input
                          id="agent-email"
                          type="email"
                          value={agentInfo.email}
                          onChange={(e) => setAgentInfo(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="agent-phone">Phone</Label>
                      <Input
                        id="agent-phone"
                        value={agentInfo.phone}
                        onChange={(e) => setAgentInfo(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Send Options */}
                <Card>
                  <CardHeader>
                    <CardTitle>Send Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="schedule-campaign">Schedule Campaign</Label>
                        <p className="text-sm text-gray-500">Send at a specific time</p>
                      </div>
                      <Switch
                        id="schedule-campaign"
                        checked={isScheduled}
                        onCheckedChange={setIsScheduled}
                      />
                    </div>
                    
                    {isScheduled && (
                      <div>
                        <Label htmlFor="scheduled-date">Send Date & Time</Label>
                        <Input
                          id="scheduled-date"
                          type="datetime-local"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Send Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    {campaignStatus === 'sending' && (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Sending campaign...</span>
                      </div>
                    )}
                    {campaignStatus === 'sent' && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Campaign sent successfully!</span>
                      </div>
                    )}
                    {campaignStatus === 'error' && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Failed to send campaign</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSendCampaign}
                      disabled={!selectedTemplate || filteredLeads.length === 0 || isLoading}
                      className="flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {isScheduled ? 'Schedule Campaign' : 'Send Campaign'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 