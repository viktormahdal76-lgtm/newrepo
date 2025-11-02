# Google Play Store Submission Guide

## Prerequisites Checklist
- [ ] Google Play Developer Account ($25 one-time fee)
- [ ] Privacy Policy URL (required)
- [ ] App icon 512x512 PNG
- [ ] Feature graphic 1024x500 PNG
- [ ] At least 2 screenshots per device type
- [ ] App description (max 4000 chars)
- [ ] Short description (max 80 chars)

## Step 1: Create Google Play Developer Account
1. Go to https://play.google.com/console
2. Pay $25 registration fee
3. Complete account verification
4. Accept Developer Distribution Agreement

## Step 2: Build TWA (Trusted Web Activity)

### Install Bubblewrap:
```bash
npm install -g @bubblewrap/cli
```

### Initialize Project:
```bash
bubblewrap init --manifest https://huddlemedemo.netlify.app/manifest.json
```

### Answer Prompts:
- **Application Name:** HuddleMe
- **Package ID:** com.huddleme.app
- **Host:** huddlemedemo.netlify.app
- **Start URL:** /
- **Icon URL:** https://huddlemedemo.netlify.app/icon-512.png
- **Theme Color:** #6366f1
- **Background Color:** #ffffff

### Build APK:
```bash
cd huddleme-app
bubblewrap build
```

## Step 3: Sign Your APK

### Generate Keystore:
```bash
keytool -genkey -v -keystore huddleme-release.keystore \
  -alias huddleme -keyalg RSA -keysize 2048 -validity 10000
```

**IMPORTANT:** Save keystore password securely!

### Sign APK:
```bash
bubblewrap build \
  --signingKeyPath ./huddleme-release.keystore \
  --signingKeyAlias huddleme
```

## Step 4: Create App in Play Console

### App Details:
- **App name:** HuddleMe
- **Default language:** English (United States)
- **App or game:** App
- **Free or paid:** Free

### Store Listing:
```
Short description (80 chars):
Connect with people nearby through proximity-based social networking

Full description (4000 chars):
HuddleMe helps you discover and connect with people nearby who share your interests.

🎯 KEY FEATURES:
• Proximity Radar - See who's around you in real-time
• Smart Matching - Connect based on shared interests
• Instant Chat - Message your connections
• Meetup Planning - Organize gatherings at local venues
• Privacy First - Control your visibility and data

💡 HOW IT WORKS:
1. Create your profile with interests
2. Enable location to discover nearby users
3. Browse connections on the radar
4. Send connection requests
5. Chat and plan meetups

🔒 PRIVACY & SAFETY:
• Control who sees your profile
• Block and report features
• Secure messaging
• No data selling

Perfect for:
✓ Making new friends
✓ Professional networking
✓ Finding activity partners
✓ Meeting people with shared hobbies
✓ Discovering local communities

Download HuddleMe today and start connecting!
```

### Graphics Required:

**App Icon (512x512):**
- PNG format
- No transparency
- Square, no rounded corners

**Feature Graphic (1024x500):**
- PNG or JPEG
- Showcases app on store page

**Screenshots (min 2, max 8):**
- Phone: 16:9 or 9:16 ratio
- Minimum dimension: 320px
- Maximum dimension: 3840px

**Promo Video (optional):**
- YouTube URL
- 30 seconds to 2 minutes

## Step 5: Content Rating

Complete IARC questionnaire:
1. Select app category: Social
2. Answer content questions honestly
3. Receive rating (Everyone, Teen, Mature, etc.)

## Step 6: Privacy Policy

**Required sections:**
- What data you collect
- How you use data
- How you share data
- User rights
- Contact information

**Host at:** https://huddlemedemo.netlify.app/privacy

## Step 7: App Content

### Target Audience:
- Primary: 18-24, 25-34
- Content rating: Teen or higher

### Contact Details:
- Email: support@huddleme.app
- Website: https://huddlemedemo.netlify.app
- Phone: (optional)
- Address: (required for paid apps)

### Ads Declaration:
- [ ] Contains ads (if applicable)
- [ ] No ads

## Step 8: Upload APK/AAB

1. Go to "Release" → "Production"
2. Click "Create new release"
3. Upload signed APK/AAB
4. Add release notes:
```
Initial release of HuddleMe!

Features:
• Proximity-based user discovery
• Real-time chat messaging
• Meetup planning
• Interest-based matching
• Privacy controls
```

## Step 9: Pricing & Distribution

### Countries:
- Select all or specific countries
- Consider legal requirements per country

### Pricing:
- Free (recommended for social apps)
- Or set price per country

## Step 10: Submit for Review

1. Complete all required sections
2. Review summary page
3. Click "Send for review"
4. Wait 1-7 days for approval

## Common Rejection Reasons

❌ **Missing Privacy Policy**
✅ Add comprehensive privacy policy URL

❌ **Insufficient Screenshots**
✅ Upload at least 2 high-quality screenshots

❌ **Misleading Content**
✅ Ensure description matches actual features

❌ **Broken Functionality**
✅ Test all features before submission

❌ **Policy Violations**
✅ Review Google Play policies

## Post-Approval

### Update Process:
1. Increment version code
2. Build new APK/AAB
3. Upload to Play Console
4. Submit for review (faster than initial)

### Monitoring:
- Check crash reports
- Read user reviews
- Monitor analytics
- Respond to feedback

## Support Resources

- Play Console Help: https://support.google.com/googleplay/android-developer
- Policy Center: https://play.google.com/about/developer-content-policy/
- Developer Community: https://www.reddit.com/r/androiddev/

## Timeline Estimate

- Account setup: 1-2 days
- App preparation: 2-3 days
- Initial review: 1-7 days
- **Total: 4-12 days**

Good luck with your submission! 🚀
