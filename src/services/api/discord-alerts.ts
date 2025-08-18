import axios from 'axios';
import { PDUFAData } from './pdufa-scraper';

export interface DiscordAlert {
  type: 'pdufa_today' | 'pdufa_tomorrow';
  data: PDUFAData[];
  timestamp: string;
}

export interface DiscordWebhookPayload {
  content?: string;
  embeds?: DiscordEmbed[];
  username?: string;
  avatar_url?: string;
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: DiscordField[];
  footer?: DiscordFooter;
  timestamp?: string;
  thumbnail?: DiscordThumbnail;
}

export interface DiscordField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordFooter {
  text: string;
  icon_url?: string;
}

export interface DiscordThumbnail {
  url: string;
}

export class DiscordAlertService {
  private readonly webhookUrl = 'https://discordapp.com/api/webhooks/1405025532323827842/Lj61sBgYfjG4wm0AXTg25hIijDrsTyeOqFEWURSaO6BVt8nJSQhZYpag7r4ChAz_OWP2';
  private readonly botName = 'PDUFA Alert Bot';
  private readonly botAvatar = 'https://cdn.discordapp.com/attachments/123456789/123456789/fda-logo.png';

  async sendPDUFATodayAlert(pdufaData: PDUFAData[]): Promise<boolean> {
    if (pdufaData.length === 0) return true;

    const embed: DiscordEmbed = {
      title: '🚨 PDUFA Decision Day Alert',
      description: `**${pdufaData.length} PDUFA decision(s) scheduled for today!**`,
      color: 0xFF0000, // Red
      fields: pdufaData.map(item => ({
        name: `${item.ticker !== 'N/A' ? `$${item.ticker}` : ''} ${item.company}`,
        value: `**Drug:** ${item.drug}\n**Indication:** ${item.indication}\n**Review Type:** ${item.reviewType}\n**Status:** ${item.status}\n**Source:** [View Details](${item.sourceUrl})`,
        inline: false
      })),
      footer: {
        text: 'PDUFA Alert System • Powered by SomaTech'
      },
      timestamp: new Date().toISOString()
    };

    const payload: DiscordWebhookPayload = {
      content: `@here **PDUFA Decision Day Alert** - ${pdufaData.length} decision(s) expected today!`,
      embeds: [embed],
      username: this.botName,
      avatar_url: this.botAvatar
    };

    return this.sendWebhook(payload);
  }

  async sendPDUFATomorrowAlert(pdufaData: PDUFAData[]): Promise<boolean> {
    if (pdufaData.length === 0) return true;

    const embed: DiscordEmbed = {
      title: '⚠️ PDUFA Decision Tomorrow Alert',
      description: `**${pdufaData.length} PDUFA decision(s) scheduled for tomorrow!**`,
      color: 0xFFA500, // Orange
      fields: pdufaData.map(item => ({
        name: `${item.ticker !== 'N/A' ? `$${item.ticker}` : ''} ${item.company}`,
        value: `**Drug:** ${item.drug}\n**Indication:** ${item.indication}\n**Review Type:** ${item.reviewType}\n**Status:** ${item.status}\n**Source:** [View Details](${item.sourceUrl})`,
        inline: false
      })),
      footer: {
        text: 'PDUFA Alert System • Powered by SomaTech'
      },
      timestamp: new Date().toISOString()
    };

    const payload: DiscordWebhookPayload = {
      content: `@here **PDUFA Decision Tomorrow Alert** - ${pdufaData.length} decision(s) expected tomorrow!`,
      embeds: [embed],
      username: this.botName,
      avatar_url: this.botAvatar
    };

    return this.sendWebhook(payload);
  }

  async sendWeeklySummary(pdufaData: PDUFAData[]): Promise<boolean> {
    if (pdufaData.length === 0) return true;

    const embed: DiscordEmbed = {
      title: '📅 Weekly PDUFA Calendar Summary',
      description: `**${pdufaData.length} PDUFA decision(s) scheduled for this week**`,
      color: 0x00FF00, // Green
      fields: pdufaData.map(item => ({
        name: `${item.pdufaDate} - ${item.ticker !== 'N/A' ? `$${item.ticker}` : ''} ${item.company}`,
        value: `**Drug:** ${item.drug}\n**Indication:** ${item.indication}`,
        inline: true
      })),
      footer: {
        text: 'PDUFA Alert System • Powered by SomaTech'
      },
      timestamp: new Date().toISOString()
    };

    const payload: DiscordWebhookPayload = {
      content: `📅 **Weekly PDUFA Summary** - ${pdufaData.length} decision(s) this week`,
      embeds: [embed],
      username: this.botName,
      avatar_url: this.botAvatar
    };

    return this.sendWebhook(payload);
  }

  async sendErrorAlert(error: string, context: string): Promise<boolean> {
    const embed: DiscordEmbed = {
      title: '❌ PDUFA System Error',
      description: `**Error in ${context}**\n\`\`\`${error}\`\`\``,
      color: 0xFF0000, // Red
      footer: {
        text: 'PDUFA Alert System • Error Report'
      },
      timestamp: new Date().toISOString()
    };

    const payload: DiscordWebhookPayload = {
      content: `❌ **PDUFA System Error** - Check logs for details`,
      embeds: [embed],
      username: this.botName,
      avatar_url: this.botAvatar
    };

    return this.sendWebhook(payload);
  }

  async sendTestAlert(): Promise<boolean> {
    const embed: DiscordEmbed = {
      title: '🧪 PDUFA Alert System Test',
      description: 'This is a test message to verify the Discord webhook integration is working correctly.',
      color: 0x0099FF, // Blue
      footer: {
        text: 'PDUFA Alert System • Test Message'
      },
      timestamp: new Date().toISOString()
    };

    const payload: DiscordWebhookPayload = {
      content: '🧪 **Test Alert** - PDUFA system is operational',
      embeds: [embed],
      username: this.botName,
      avatar_url: this.botAvatar
    };

    return this.sendWebhook(payload);
  }

  private async sendWebhook(payload: DiscordWebhookPayload): Promise<boolean> {
    try {
      const response = await axios.post(this.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.status === 204) {
        console.log('Discord webhook sent successfully');
        return true;
      } else {
        console.error('Discord webhook failed:', response.status, response.data);
        return false;
      }
    } catch (error) {
      console.error('Error sending Discord webhook:', error);
      return false;
    }
  }

  async validateWebhook(): Promise<boolean> {
    try {
      const response = await axios.get(this.webhookUrl, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      console.error('Discord webhook validation failed:', error);
      return false;
    }
  }
}

export const discordAlerts = new DiscordAlertService();
