# Supabase Setup Guide

## Current Status
- ✅ Docker Desktop running
- ✅ Supabase local development setup running
- ✅ Database migration applied successfully
- ✅ Properties table created with sample data
- ✅ Database query code updated
- ✅ All buttons functional and working
- ✅ CSV export functionality implemented
- ✅ Real-time filtering working

## Step-by-Step Resolution

### Step 1: Start Docker Desktop
1. Open Docker Desktop application
2. Wait for it to fully start (check system tray for Docker icon)
3. Verify it's running by opening Docker Desktop dashboard

### Step 2: Start Supabase
Once Docker Desktop is running, run these commands:

```bash
# Navigate to the somatech directory
cd somatech

# Start Supabase
npx supabase start

# Check status
npx supabase status
```

### Step 3: Apply Database Migration
```bash
# Push the clean migration to the database
npx supabase db push
```

### Step 4: Verify Database Connection
The application should now:
- ✅ Connect to real Supabase database
- ✅ Load 5 sample properties from database
- ✅ Apply real-time filtering
- ✅ Show proper search results

### Step 5: Test the Application
1. Start the development server: `npm run dev`
2. Navigate to the lead generation page
3. Test search and filtering functionality
4. Verify property details are loading from database

## Troubleshooting

### If Docker Desktop won't start:
- Restart Docker Desktop
- Check Windows Services for Docker
- Ensure virtualization is enabled in BIOS

### If Supabase won't start:
```bash
# Reset Supabase
npx supabase stop
npx supabase start --reset
```

### If migration fails:
```bash
# Reset database
npx supabase db reset
npx supabase db push
```

## Expected Results

After successful setup:
- ✅ Database connected with 5 sample properties
- ✅ Real-time filtering working
- ✅ Search functionality operational
- ✅ Map markers displaying from database
- ✅ Property details loading from database

## Next Steps

Once Supabase is working:
1. Add more sample data
2. Implement real-time updates
3. Add user authentication
4. Deploy to production

## Database Schema

The migration creates these tables:
- `properties` - Main property data
- `saved_searches` - User saved search filters
- `saved_leads` - User saved properties
- `skip_tracing_results` - Contact information
- `comparable_sales` - Market analysis data
- `cash_buyers` - Buyer database
- `campaigns` - Marketing campaigns
- `campaign_results` - Campaign tracking

All tables include proper indexes, RLS policies, and triggers for optimal performance. 