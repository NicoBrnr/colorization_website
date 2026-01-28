# Authentication Setup Guide

This guide will help you set up NextAuth.js with Google OAuth, Neon PostgreSQL database, and rate limiting for your colorization website.

## ✅ What's Been Implemented

- ✅ NextAuth.js v5 with Google OAuth
- ✅ Prisma ORM with PostgreSQL
- ✅ User authentication system
- ✅ Rate limiting (3 colorizations per day per user)
- ✅ Protected colorize API route
- ✅ Navbar with sign-in/sign-out
- ✅ Rate limit banner on colorize page
- ✅ Database models for users and usage tracking

## 📋 Setup Steps

### 1. Set Up Neon Database

1. Go to [Neon](https://neon.tech/) and sign up for a free account
2. Create a new project
3. Copy your database connection string (it looks like: `postgresql://user:password@host/database?sslmode=require`)

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen:
   - User Type: External
   - Add your app name and required info
   - Add test users (your email) if in development
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:3000` (for development)
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy your **Client ID** and **Client Secret**

### 3. Set Up Environment Variables

Create a `.env` file in the root of your project (or update existing one):

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# DeOldify API (your existing config)
DEOLDIFY_API_URL="your-deoldify-api-url"
DEOLDIFY_API_KEY="your-deoldify-api-key"
```

**To generate NEXTAUTH_SECRET**, run this command:
```bash
openssl rand -base64 32
```

Or use this Node.js one-liner:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Set Up Prisma and Database

Run these commands in order:

```bash
# Generate Prisma Client
npx prisma generate

# Push the database schema to your Neon database
npx prisma db push

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### 5. Run Your Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and test:
1. Click "Sign in" in the navbar
2. Sign in with Google
3. Go to the colorize page
4. You should see the rate limit banner showing "3 of 3 free colorizations remaining today"
5. Upload and colorize an image
6. The counter should update

## 🎯 Rate Limiting Configuration

The rate limit is currently set to **3 colorizations per day**. To change this:

Edit `lib/rate-limit.ts` and modify this line:

```typescript
const DAILY_LIMIT = 3; // Change to whatever you want
```

The limit resets at midnight (00:00) every day.

## 📁 Key Files Created/Modified

### New Files:
- `lib/auth.ts` - NextAuth configuration
- `lib/prisma.ts` - Prisma client singleton
- `lib/rate-limit.ts` - Rate limiting logic
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API routes
- `app/api/rate-limit/route.ts` - Rate limit API endpoint
- `components/ui/RateLimitBanner.tsx` - Rate limit display component
- `components/colorize/ColorizePageClient.tsx` - Updated colorize page with rate limits
- `types/next-auth.d.ts` - TypeScript definitions
- `prisma/schema.prisma` - Database schema

### Modified Files:
- `app/api/colorize/route.ts` - Added authentication and rate limit checks
- `components/ui/Navbar.tsx` - Added sign-in/sign-out functionality
- `app/[locale]/layout.tsx` - Added session passing to Navbar
- `app/[locale]/coloriser/page.tsx` - Server wrapper for colorize page
- `lib/api.ts` - Added rate limit to response
- `messages/en.json` & `messages/fr.json` - Added auth translations
- `package.json` - Added dependencies

## 🚀 For Production

When deploying to production:

1. **Update Google OAuth Settings:**
   - Add production URL to authorized origins: `https://yourdomain.com`
   - Add production callback: `https://yourdomain.com/api/auth/callback/google`

2. **Update Environment Variables:**
   ```env
   NEXTAUTH_URL="https://yourdomain.com"
   NEXTAUTH_SECRET="your-production-secret-different-from-dev"
   ```

3. **Database Migration:**
   Instead of `prisma db push`, use migrations:
   ```bash
   npx prisma migrate dev --name init
   npx prisma migrate deploy  # In production
   ```

## 🔒 Security Notes

- ✅ Rate limiting prevents abuse
- ✅ All colorization requests require authentication
- ✅ User data is stored securely in PostgreSQL
- ✅ Sessions are managed via database (not JWT in memory)
- ✅ OAuth via Google provides secure authentication

## 🐛 Troubleshooting

### "Authentication required" error
- Make sure you're signed in
- Check that `DATABASE_URL` is correct
- Verify Prisma schema is pushed: `npx prisma db push`

### Google OAuth not working
- Verify redirect URIs match exactly (with `/api/auth/callback/google`)
- Check that Google+ API is enabled
- Make sure you added yourself as a test user if app is not published

### Database connection issues
- Verify `DATABASE_URL` in `.env`
- Check Neon dashboard to ensure database is active
- Make sure connection string includes `?sslmode=require`

### Rate limit not updating
- Check browser console for errors
- Verify `prisma generate` was run
- Check database has `image_colorizations` table

## 📊 Database Schema

The Prisma schema includes these tables:

- `users` - User accounts
- `accounts` - OAuth provider connections
- `sessions` - User sessions
- `verification_tokens` - Email verification (if needed)
- `image_colorizations` - Tracks colorization usage for rate limiting

To view your data:
```bash
npx prisma studio
```

## 🎉 You're Done!

Your colorization website now has:
- ✅ User authentication with Google
- ✅ Rate limiting (3 images per day)
- ✅ Protected API routes
- ✅ User-friendly UI with sign-in/out
- ✅ Real-time rate limit display

Users can now:
1. Sign in with Google
2. Colorize up to 3 images per day for free
3. See their remaining limit in real-time
4. Get notified when limit is reached

---

## Next Steps (Optional Enhancements)

- Add more OAuth providers (GitHub, Facebook)
- Implement paid plans for unlimited colorizations
- Add user dashboard to view colorization history
- Add email notifications
- Implement image storage (Cloudflare R2, S3)
- Add admin panel for user management
