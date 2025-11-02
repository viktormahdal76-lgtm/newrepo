# Deploying HuddleMe to huddleme.com

## Prerequisites
- Node.js 18+ installed
- Domain name (huddleme.com) registered
- Hosting provider account (Vercel, Netlify, or similar)

## Build the Application

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This creates an optimized production build in the `dist` folder.

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Configure custom domain:
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add `huddleme.com` and `www.huddleme.com`
   - Update DNS records at your domain registrar:
     - Add A record: `@` → `76.76.21.21`
     - Add CNAME: `www` → `cname.vercel-dns.com`

### Option 2: Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

3. Configure custom domain:
   - Go to Netlify Dashboard → Domain Settings
   - Add custom domain: `huddleme.com`
   - Update DNS at your registrar:
     - Add A record: `@` → Netlify's IP
     - Add CNAME: `www` → your-site.netlify.app

### Option 3: Manual Deployment

1. Build the app: `npm run build`
2. Upload `dist` folder contents to your web server
3. Configure your web server to serve `index.html` for all routes
4. Point `huddleme.com` DNS to your server IP

## DNS Configuration

At your domain registrar (GoDaddy, Namecheap, etc.):

1. Add A record:
   - Host: `@`
   - Points to: Your hosting provider's IP
   - TTL: 3600

2. Add CNAME record:
   - Host: `www`
   - Points to: Your hosting provider's domain
   - TTL: 3600

## SSL Certificate

Most hosting providers (Vercel, Netlify) provide free SSL certificates automatically.

For manual deployment:
- Use Let's Encrypt for free SSL
- Or use Cloudflare for free SSL + CDN

## Environment Variables

If using Firebase or Supabase, set these in your hosting provider:

```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

## Verify Deployment

1. Visit https://huddleme.com
2. Test all features:
   - Landing page loads
   - Login/signup works
   - BLE scanning functions
   - All routes work correctly

## Continuous Deployment

Connect your Git repository to Vercel/Netlify for automatic deployments on push:

1. Link repository in hosting dashboard
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Every push to main branch auto-deploys

## Troubleshooting

- **404 on refresh**: Configure server to serve index.html for all routes
- **Blank page**: Check browser console for errors
- **DNS not working**: Wait 24-48 hours for DNS propagation
- **SSL issues**: Ensure HTTPS is enforced in hosting settings
