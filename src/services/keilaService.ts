import { supabase } from '@/integrations/supabase/client';

// Keila API Configuration
const getKeilaConfig = () => {
  // For client-side, use a default configuration
  // In production, these would be set via environment variables
  const baseUrl = 'http://localhost:4000';
  const apiKey = 'demo-api-key'; // This would be set via environment variables
  
  return {
    baseUrl,
    apiKey,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  };
};

// Real Estate Campaign Templates
export const REAL_ESTATE_TEMPLATES = {
  investmentOpportunity: {
    name: 'Investment Opportunity',
    subject: 'Exclusive Investment Opportunity in {{neighborhood}}',
    html: 
      '<!DOCTYPE html>' +
      '<html>' +
      '<head>' +
        '<meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
        '<title>Investment Opportunity</title>' +
        '<style>' +
          'body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }' +
          '.container { max-width: 600px; margin: 0 auto; padding: 20px; }' +
          '.header { background: #3B82F6; color: white; padding: 20px; text-align: center; }' +
          '.content { padding: 20px; background: #f9f9f9; }' +
          '.property-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #3B82F6; }' +
          '.cta-button { display: inline-block; background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 15px 0; }' +
          '.footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }' +
        '</style>' +
      '</head>' +
      '<body>' +
        '<div class="container">' +
          '<div class="header">' +
            '<h1>Investment Opportunity</h1>' +
          '</div>' +
          '<div class="content">' +
            '<p>Hi {{contact.name}},</p>' +
            '' +
            '<p>I found your property at <strong>{{contact.properties.address}}</strong> and noticed it has significant equity potential that could be perfect for an investment opportunity.</p>' +
            '' +
            '<div class="property-details">' +
              '<h3>Property Details:</h3>' +
              '<ul>' +
                '<li><strong>Estimated Value:</strong> ${{contact.properties.estimated_value}}</li>' +
                '<li><strong>Equity Percentage:</strong> {{contact.properties.equity_percent}}%</li>' +
                '<li><strong>Investment Score:</strong> {{contact.properties.investment_score}}/10</li>' +
                '<li><strong>Property Type:</strong> {{contact.properties.property_type}}</li>' +
              '</ul>' +
            '</div>' +
            '' +
            '<p>This property shows excellent potential for:</p>' +
            '<ul>' +
              '<li>Cash-out refinancing</li>' +
              '<li>Rental income generation</li>' +
              '<li>Property value appreciation</li>' +
              '<li>Portfolio diversification</li>' +
            '</ul>' +
            '' +
            '<p>Would you be interested in discussing this investment opportunity? I can provide:</p>' +
            '<ul>' +
              '<li>Detailed market analysis</li>' +
              '<li>Investment strategy options</li>' +
              '<li>Cash flow projections</li>' +
              '<li>Exit strategy planning</li>' +
            '</ul>' +
            '' +
            '<div style="text-align: center;">' +
              '<a href="mailto:{{agent.email}}?subject=Investment Opportunity - {{contact.properties.address}}" class="cta-button">' +
                'Schedule a Consultation' +
              '</a>' +
            '</div>' +
            '' +
            '<p>Best regards,<br>' +
            '<strong>{{agent.name}}</strong><br>' +
            '{{agent.phone}}<br>' +
            '{{agent.email}}</p>' +
          '</div>' +
          '<div class="footer">' +
            '<p>This email was sent by SomaTech Investment Platform</p>' +
            '<p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>' +
          '</div>' +
        '</div>' +
      '</body>' +
      '</html>'
  },
  
  distressedPropertyAlert: {
    name: 'Distressed Property Alert',
    subject: 'Quick Cash Offer for {{address}}',
    html: 
      '<!DOCTYPE html>' +
      '<html>' +
      '<head>' +
        '<meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
        '<title>Cash Offer</title>' +
        '<style>' +
          'body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }' +
          '.container { max-width: 600px; margin: 0 auto; padding: 20px; }' +
          '.header { background: #EF4444; color: white; padding: 20px; text-align: center; }' +
          '.content { padding: 20px; background: #f9f9f9; }' +
          '.offer-box { background: #FEF3C7; padding: 15px; margin: 15px 0; border: 2px solid #F59E0B; }' +
          '.cta-button { display: inline-block; background: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 15px 0; }' +
          '.footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }' +
        '</style>' +
      '</head>' +
      '<body>' +
        '<div class="container">' +
          '<div class="header">' +
            '<h1>Quick Cash Offer</h1>' +
          '</div>' +
          '<div class="content">' +
            '<p>Hi {{contact.name}},</p>' +
            '' +
            '<p>I can provide a <strong>quick cash offer</strong> for your property at <strong>{{contact.properties.address}}</strong>.</p>' +
            '' +
            '<div class="offer-box">' +
              '<h3>What We Offer:</h3>' +
              '<ul>' +
                '<li>✅ <strong>Cash offer</strong> - No financing delays</li>' +
                '<li>✅ <strong>Close in 7 days</strong> - Fast closing</li>' +
                '<li>✅ <strong>No repairs needed</strong> - As-is condition</li>' +
                '<li>✅ <strong>No commissions</strong> - Direct sale</li>' +
                '<li>✅ <strong>Flexible closing date</strong> - Your timeline</li>' +
              '</ul>' +
            '</div>' +
            '' +
            '<p>This is perfect if you need to:</p>' +
            '<ul>' +
              '<li>Stop foreclosure proceedings</li>' +
              '<li>Relocate quickly</li>' +
              '<li>Divest from the property</li>' +
              '<li>Access cash immediately</li>' +
              '<li>Avoid costly repairs</li>' +
            '</ul>' +
            '' +
            '<div style="text-align: center;">' +
              '<a href="tel:{{agent.phone}}" class="cta-button">' +
                'Call Now: {{agent.phone}}' +
              '</a>' +
            '</div>' +
            '' +
            '<p>I\'m available 24/7 to discuss your situation and provide a fair cash offer.</p>' +
            '' +
            '<p>Best regards,<br>' +
            '<strong>{{agent.name}}</strong><br>' +
            '{{agent.phone}}<br>' +
            '{{agent.email}}</p>' +
          '</div>' +
          '<div class="footer">' +
            '<p>This email was sent by SomaTech Investment Platform</p>' +
            '<p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>' +
          '</div>' +
        '</div>' +
      '</body>' +
      '</html>'
  },
  
  marketUpdate: {
    name: 'Market Update',
    subject: '{{neighborhood}} Market Update - {{month}} {{year}}',
    html: 
      '<!DOCTYPE html>' +
      '<html>' +
      '<head>' +
        '<meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
        '<title>Market Update</title>' +
        '<style>' +
          'body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }' +
          '.container { max-width: 600px; margin: 0 auto; padding: 20px; }' +
          '.header { background: #8B5CF6; color: white; padding: 20px; text-align: center; }' +
          '.content { padding: 20px; background: #f9f9f9; }' +
          '.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }' +
          '.stat-box { background: white; padding: 15px; text-align: center; border-radius: 5px; }' +
          '.cta-button { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 15px 0; }' +
          '.footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }' +
        '</style>' +
      '</head>' +
      '<body>' +
        '<div class="container">' +
          '<div class="header">' +
            '<h1>{{neighborhood}} Market Update</h1>' +
            '<p>{{month}} {{year}}</p>' +
          '</div>' +
          '<div class="content">' +
            '<p>Hi {{contact.name}},</p>' +
            '' +
            '<p>Here\'s your monthly market update for the {{neighborhood}} area:</p>' +
            '' +
            '<div class="stats-grid">' +
              '<div class="stat-box">' +
                '<h3>Average Sale Price</h3>' +
                '<p style="font-size: 24px; color: #8B5CF6; font-weight: bold;">${{market_stats.avg_price}}</p>' +
                '<p style="color: #10B981;">+{{market_stats.price_change}}%</p>' +
              '</div>' +
              '<div class="stat-box">' +
                '<h3>Days on Market</h3>' +
                '<p style="font-size: 24px; color: #8B5CF6; font-weight: bold;">{{market_stats.days_on_market}}</p>' +
                '<p style="color: #EF4444;">{{market_stats.dom_change}}%</p>' +
              '</div>' +
              '<div class="stat-box">' +
                '<h3>Inventory</h3>' +
                '<p style="font-size: 24px; color: #8B5CF6; font-weight: bold;">{{market_stats.inventory}}</p>' +
                '<p style="color: #F59E0B;">{{market_stats.inventory_change}}%</p>' +
              '</div>' +
              '<div class="stat-box">' +
                '<h3>Market Score</h3>' +
                '<p style="font-size: 24px; color: #8B5CF6; font-weight: bold;">{{market_stats.market_score}}/10</p>' +
                '<p style="color: #10B981;">Strong Market</p>' +
              '</div>' +
            '</div>' +
            '' +
            '<h3>Market Insights:</h3>' +
            '<ul>' +
              '<li>{{market_insights.insight_1}}</li>' +
              '<li>{{market_insights.insight_2}}</li>' +
              '<li>{{market_insights.insight_3}}</li>' +
            '</ul>' +
            '' +
            '<h3>Investment Opportunities:</h3>' +
            '<p>{{investment_opportunities.description}}</p>' +
            '' +
            '<div style="text-align: center;">' +
              '<a href="mailto:{{agent.email}}?subject=Market Update Discussion" class="cta-button">' +
                'Schedule Market Review' +
              '</a>' +
            '</div>' +
            '' +
            '<p>Best regards,<br>' +
            '<strong>{{agent.name}}</strong><br>' +
            '{{agent.phone}}<br>' +
            '{{agent.email}}</p>' +
          '</div>' +
          '<div class="footer">' +
            '<p>This email was sent by SomaTech Investment Platform</p>' +
            '<p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>' +
          '</div>' +
        '</div>' +
      '</body>' +
      '</html>'
  }
};

// Keila API Service
export class KeilaService {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    const config = getKeilaConfig();
    this.baseUrl = config.baseUrl;
    this.headers = config.headers;
  }

  // Campaign Management
  async createCampaign(campaignData: {
    name: string;
    subject: string;
    template: string;
    recipients: any[];
    scheduledAt?: string;
  }) {
    try {
      // For demo purposes, simulate a successful campaign creation
      console.log('Creating campaign:', campaignData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock response
      return {
        id: `campaign_${Date.now()}`,
        name: campaignData.name,
        status: 'sent',
        recipients_count: campaignData.recipients.length,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Keila API Error:', error);
      throw error;
    }
  }

  async getCampaigns() {
    try {
      // Mock campaigns data
      return [
        {
          id: 'campaign_1',
          name: 'Investment Opportunity - 1/15/2025',
          status: 'sent',
          recipients_count: 25,
          created_at: '2025-01-15T10:00:00Z'
        },
        {
          id: 'campaign_2',
          name: 'Distressed Property Alert - 1/14/2025',
          status: 'sent',
          recipients_count: 15,
          created_at: '2025-01-14T14:30:00Z'
        }
      ];
    } catch (error) {
      console.error('Keila API Error:', error);
      throw error;
    }
  }

  async getCampaignAnalytics(campaignId: string) {
    try {
      // Mock analytics data
      return {
        campaign_id: campaignId,
        sent: 25,
        delivered: 23,
        opened: 18,
        clicked: 8,
        bounced: 2,
        open_rate: 72,
        click_rate: 32,
        bounce_rate: 8
      };
    } catch (error) {
      console.error('Keila API Error:', error);
      throw error;
    }
  }

  // Contact Management
  async createContactList(listData: {
    name: string;
    description?: string;
  }) {
    try {
      // Mock contact list creation
      return {
        id: `list_${Date.now()}`,
        name: listData.name,
        description: listData.description,
        contacts_count: 0,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Keila API Error:', error);
      throw error;
    }
  }

  async addContactsToList(listId: string, contacts: any[]) {
    try {
      // Mock adding contacts to list
      return {
        list_id: listId,
        contacts_added: contacts.length,
        total_contacts: contacts.length,
        status: 'success'
      };
    } catch (error) {
      console.error('Keila API Error:', error);
      throw error;
    }
  }

  // Real Estate Specific Methods
  async createRealEstateCampaign(leads: any[], templateType: keyof typeof REAL_ESTATE_TEMPLATES, agentInfo: any) {
    const template = REAL_ESTATE_TEMPLATES[templateType];
    
    // Transform leads to contacts with real estate properties
    const contacts = leads.map(lead => ({
      email: lead.owner_email || lead.email,
      name: lead.owner_name || 'Property Owner',
      properties: {
        address: lead.address,
        city: lead.city,
        state: lead.state,
        zip: lead.zip,
        estimated_value: lead.estimated_value,
        equity_percent: lead.equity_percent,
        property_type: lead.property_type,
        investment_score: this.calculateInvestmentScore(lead),
        neighborhood: lead.city
      }
    }));

    const campaignData = {
      name: `${template.name} - ${new Date().toLocaleDateString()}`,
      subject: template.subject,
      html: template.html,
      recipients: contacts,
      agent: agentInfo
    };

    return await this.createCampaign(campaignData);
  }

  private calculateInvestmentScore(lead: any): number {
    let score = 0;
    
    // Equity score (0-40 points)
    if (lead.equity_percent > 50) score += 40;
    else if (lead.equity_percent > 30) score += 30;
    else if (lead.equity_percent > 20) score += 20;
    else score += 10;
    
    // Property value score (0-30 points)
    if (lead.estimated_value > 500000) score += 30;
    else if (lead.estimated_value > 300000) score += 25;
    else if (lead.estimated_value > 200000) score += 20;
    else score += 15;
    
    // Owner type score (0-20 points)
    if (lead.owner_type === 'absentee') score += 20;
    else if (lead.owner_type === 'out_of_state') score += 15;
    else score += 10;
    
    // Property status score (0-10 points)
    if (lead.status === 'distressed') score += 10;
    else if (lead.status === 'foreclosure') score += 10;
    else score += 5;
    
    return Math.min(score, 100);
  }

  // Template Management
  getRealEstateTemplates() {
    return Object.keys(REAL_ESTATE_TEMPLATES).map(key => ({
      id: key,
      name: REAL_ESTATE_TEMPLATES[key as keyof typeof REAL_ESTATE_TEMPLATES].name,
      subject: REAL_ESTATE_TEMPLATES[key as keyof typeof REAL_ESTATE_TEMPLATES].subject
    }));
  }

  getTemplateById(templateId: string) {
    return REAL_ESTATE_TEMPLATES[templateId as keyof typeof REAL_ESTATE_TEMPLATES];
  }
}

// Export singleton instance
export const keilaService = new KeilaService(); 