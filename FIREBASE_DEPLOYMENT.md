# Firebase Hosting Deployment Guide

## Prerequisites
- Node.js and npm installed
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created at https://console.firebase.google.com

## Step 1: Build the Application
```bash
npm install
npm run build
```

## Step 2: Login to Firebase
```bash
firebase login
```

## Step 3: Initialize Firebase Hosting
```bash
firebase init hosting
```

Select:
- Use existing project (select your Firebase project)
- Public directory: `dist`
- Configure as single-page app: `Yes`
- Set up automatic builds with GitHub: `No`
- Overwrite index.html: `No`

## Step 4: Deploy to Firebase
```bash
firebase deploy --only hosting
```

Your app will be live at: `https://YOUR-PROJECT-ID.web.app`

## Step 5: Create Admin Account

### Option A: Firebase Console
1. Go to Firebase Console > Authentication > Users
2. Click "Add User"
3. Email: admin@huddleme.app
4. Password: cisco
5. Save the User ID

### Option B: Using Firebase CLI
```bash
firebase auth:import admin-users.json
```

Create `admin-users.json`:
```json
{
  "users": [{
    "localId": "admin-user-id",
    "email": "admin@huddleme.app",
    "passwordHash": "cisco",
    "displayName": "Admin"
  }]
}
```

## Environment Variables
Ensure these are set in your `.env` file:
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
