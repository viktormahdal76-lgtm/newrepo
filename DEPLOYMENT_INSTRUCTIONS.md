# Deploy HuddleMe to https://huddleme.web.app

## Quick Deployment Steps

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Configure Firebase Project
The project is already configured for `huddleme` Firebase project.
Ensure your Firebase project ID is `huddleme` in the Firebase Console.

### 4. Update Environment Variables
Edit `.env.production` with your actual Firebase credentials:
- Get these from Firebase Console > Project Settings > General
- Add your Firebase API key, app ID, and other credentials

### 5. Build the Application
```bash
npm install
npm run build
```

### 6. Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

Your app will be live at: **https://huddleme.web.app**

## Alternative: One-Command Deployment
```bash
npm run build && firebase deploy --only hosting
```

## Verify Deployment
After deployment, visit:
- Main site: https://huddleme.web.app
- Firebase Console: https://console.firebase.google.com/project/huddleme/hosting

## Troubleshooting

### If project ID doesn't match:
```bash
firebase use --add
# Select your project and set alias as 'default'
```

### If build fails:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Update Firebase project:
```bash
firebase projects:list
firebase use huddleme
```

## Custom Domain (Optional)
To use a custom domain:
1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow DNS configuration steps
