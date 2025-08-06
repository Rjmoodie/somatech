# 🚀 Keila Email Campaign System Setup

## Overview
This guide will help you set up Keila, an open-source email campaign system, integrated with SomaTech's lead generation platform.

## 📋 Prerequisites

- Docker and Docker Compose installed
- SMTP email provider (Gmail, AWS SES, SendGrid, etc.)
- Node.js and npm (for the main application)

## 🔧 Step 1: Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```bash
# Keila Configuration
NEXT_PUBLIC_KEILA_URL=http://localhost:4000
KEILA_API_KEY=your_keila_api_key_here
KEILA_SECRET_KEY_BASE=your_secret_key_base_here

# SMTP Configuration (for email sending)
KEILA_SMTP_USERNAME=your_email@gmail.com
KEILA_SMTP_PASSWORD=your_app_password
```

### SMTP Configuration Options:

#### Gmail (Recommended for Development)
```bash
KEILA_SMTP_HOST=smtp.gmail.com
KEILA_SMTP_PORT=587
KEILA_SMTP_TLS=true
```

#### AWS SES (Recommended for Production)
```bash
KEILA_SMTP_HOST=email-smtp.us-east-1.amazonaws.com
KEILA_SMTP_PORT=587
KEILA_SMTP_TLS=true
```

## 🐳 Step 2: Docker Setup

### Create Docker Network
```bash
docker network create somatech-network
```

### Start Keila Services
```bash
# Navigate to the project root
cd somatech

# Start Keila with Docker Compose
docker-compose -f docker-compose.keila.yml up -d
```

### Verify Keila is Running
```bash
# Check if containers are running
docker ps

# Check Keila logs
docker logs somatech-keila
```

## 🔑 Step 3: Keila Initial Setup

### Access Keila Admin Panel
1. Open your browser and go to `http://localhost:4000`
2. Create your first admin account
3. Configure your email settings in the admin panel

### Generate API Key
1. Go to Keila Admin Panel → Settings → API
2. Generate a new API key
3. Update your `.env.local` file with the new API key

## 📧 Step 4: Email Provider Setup

### Option A: Gmail (Development)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use the app password in your `.env.local` file

### Option B: AWS SES (Production)
1. Create an AWS SES account
2. Verify your email domain
3. Create SMTP credentials
4. Update the SMTP settings in your `.env.local` file

## 🚀 Step 5: Integration Testing

### Test the Integration
1. Start your SomaTech application:
   ```bash
   npm run dev
   ```

2. Navigate to the Lead Generation module
3. Click the "Email Campaign" button
4. Try creating a test campaign

### Verify Email Sending
1. Create a test campaign with your own email address
2. Check if the email is received
3. Verify the email template formatting

## 🔧 Step 6: Production Deployment

### Update Environment Variables
For production, update your environment variables:

```bash
# Production Keila URL
NEXT_PUBLIC_KEILA_URL=https://your-keila-domain.com

# Production SMTP settings
KEILA_SMTP_HOST=your-production-smtp-host
KEILA_SMTP_PORT=587
KEILA_SMTP_USERNAME=your-production-email
KEILA_SMTP_PASSWORD=your-production-password
```

### SSL/HTTPS Setup
1. Configure SSL certificates for your domain
2. Update Keila to use HTTPS
3. Update the `NEXT_PUBLIC_KEILA_URL` to use HTTPS

## 📊 Step 7: Monitoring & Analytics

### Keila Analytics
- Access campaign analytics at `http://localhost:4000/admin/analytics`
- Monitor open rates, click rates, and delivery status
- Track campaign performance over time

### Integration Analytics
- Campaign creation logs are available in the browser console
- Check Keila logs: `docker logs somatech-keila`
- Monitor email delivery status in Keila admin panel

## 🛠️ Troubleshooting

### Common Issues

#### 1. Keila Not Starting
```bash
# Check Docker logs
docker logs somatech-keila

# Restart Keila
docker-compose -f docker-compose.keila.yml restart
```

#### 2. Email Not Sending
- Verify SMTP credentials in `.env.local`
- Check Keila admin panel for email configuration
- Test SMTP connection in Keila settings

#### 3. API Connection Issues
- Verify `KEILA_API_KEY` is correct
- Check if Keila is accessible at the configured URL
- Ensure CORS settings are correct

#### 4. Campaign Builder Not Loading
- Check browser console for errors
- Verify `NEXT_PUBLIC_KEILA_URL` is correct
- Ensure Keila is running and accessible

### Debug Commands
```bash
# Check Keila status
docker ps | grep keila

# View Keila logs
docker logs -f somatech-keila

# Restart Keila
docker-compose -f docker-compose.keila.yml restart

# Check network connectivity
curl http://localhost:4000/api/health
```

## 📚 Additional Resources

### Keila Documentation
- [Keila GitHub Repository](https://github.com/pentacent/keila)
- [Keila Documentation](https://keila.io/docs)
- [Keila Cloud Hosting](https://app.keila.io)

### Email Marketing Best Practices
- [CAN-SPAM Compliance](https://www.ftc.gov/tips-advice/business-center/guidance/can-spam-act-compliance-guide-business)
- [Email Template Design](https://www.campaignmonitor.com/resources/guides/email-marketing-design/)
- [Real Estate Email Marketing](https://www.hubspot.com/marketing/real-estate-email-marketing)

## ✅ Verification Checklist

- [ ] Keila Docker containers are running
- [ ] Keila admin panel is accessible at `http://localhost:4000`
- [ ] SMTP settings are configured and working
- [ ] API key is generated and configured
- [ ] Campaign builder loads in SomaTech application
- [ ] Test email campaign can be created and sent
- [ ] Email templates are properly formatted
- [ ] Analytics are tracking correctly

## 🎉 Success!

Once all steps are completed, you'll have a fully functional email campaign system integrated with your SomaTech lead generation platform. Users can now:

- Create professional email campaigns from property leads
- Use pre-built real estate templates
- Track campaign performance and analytics
- Schedule campaigns for optimal timing
- Export campaign data and results

The system is now ready for production use! 