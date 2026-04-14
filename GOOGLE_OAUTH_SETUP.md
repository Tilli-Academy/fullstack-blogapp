# Google OAuth Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name: `BlogSpace` (or any name)
4. Click **"Create"**

## Step 2: Enable Google+ API

1. In the project dashboard, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click **"Enable"**

## Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** → Click **"Create"**
3. Fill in the required fields:
   - **App name**: BlogSpace
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Click **"Save and Continue"**
5. **Scopes**: Skip this (click "Save and Continue")
6. **Test users**: Skip this (click "Save and Continue")
7. Click **"Back to Dashboard"**

## Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Choose **"Web application"**
4. Fill in:
   - **Name**: BlogSpace Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     http://10.10.0.36:3003
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/api/auth/callback/google
     http://10.10.0.36:3003/api/auth/callback/google
     ```
5. Click **"Create"**

## Step 5: Copy Credentials

You'll see a popup with:
- **Client ID**: `123456789-abcdefg.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxxxxxxx`

**Copy both values!**

## Step 6: Add to .env File

Open your `.env` file and add:

```env
GOOGLE_CLIENT_ID="your-client-id-here"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
```

## Step 7: Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Step 8: Test It!

1. Go to `/login` or `/signup`
2. Click **"Continue with Google"**
3. Sign in with your Google account
4. You should be redirected back to your blog! ✅

---

## Production Setup

When deploying to production (e.g., Vercel):

1. Go back to **Google Cloud Console** → **Credentials**
2. Edit your OAuth client
3. Add production URLs:
   - **Authorized JavaScript origins**:
     ```
     https://yourdomain.com
     ```
   - **Authorized redirect URIs**:
     ```
     https://yourdomain.com/api/auth/callback/google
     ```
4. Add the same `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to your production environment variables

---

## Troubleshooting

### Error: redirect_uri_mismatch
- Make sure the redirect URI in Google Console exactly matches your app URL
- Include the port number: `http://10.10.0.36:3003/api/auth/callback/google`

### Error: access_denied
- Check OAuth consent screen is configured
- Try adding your email as a test user if app is in testing mode

### Profile not created
- Check server logs for errors
- Verify the `signIn` callback in `auth.js` is running
