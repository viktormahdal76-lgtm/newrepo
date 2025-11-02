# Deploy HuddleMe to Free Hosting

## Quick Deploy to Netlify (Recommended - 2 minutes)

### Option 1: Deploy from GitHub (Easiest)

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/huddlemedemo.git
   git push -u origin main
   ```

2. **Deploy on Netlify:**
   - Go to [netlify.com](https://netlify.com) and sign up (free)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select your repository
   - Build settings (auto-detected):
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

3. **Set custom subdomain:**
   - Go to Site settings → Domain management
   - Click "Options" → "Edit site name"
   - Change to: `huddlemedemo`
   - Your site will be live at: **huddlemedemo.netlify.app**

### Option 2: Deploy with Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod

# Follow prompts and set site name to "huddlemedemo"
```

## Alternative: Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Set project name to "huddlemedemo"**
   - Your site will be live at: **huddlemedemo.vercel.app**

## Alternative: Deploy to Render

1. Go to [render.com](https://render.com) and sign up (free)
2. Click "New" → "Static Site"
3. Connect your GitHub repository
4. Settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Your site will be at: **huddlemedemo.onrender.com**

## Alternative: GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json:**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. Your site will be at: **yourusername.github.io/huddlemedemo**

## Post-Deployment

After deployment, your HuddleMe website will be live with:
- ✅ Free hosting
- ✅ Free SSL certificate (HTTPS)
- ✅ Automatic deployments on code changes
- ✅ CDN for fast global access
- ✅ Custom subdomain (huddlemedemo)

**Recommended:** Use Netlify for the best free hosting experience with easy setup and automatic deployments.
