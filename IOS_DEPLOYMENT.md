# iOS App Store Deployment Guide for HuddleMe

## Prerequisites

### 1. Apple Developer Account
- Enroll in the Apple Developer Program ($99/year)
- Visit: https://developer.apple.com/programs/
- Complete enrollment (can take 24-48 hours for approval)

### 2. Development Tools
```bash
# Install Xcode from Mac App Store (macOS required)
# Install Xcode Command Line Tools
xcode-select --install

# Install CocoaPods
sudo gem install cocoapods
```

## Step 1: Configure iOS Project

### Install Capacitor for iOS
```bash
npm install @capacitor/ios
npx cap add ios
```

### Update capacitor.config.json
```json
{
  "appId": "com.huddleme.app",
  "appName": "HuddleMe",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "ios": {
    "contentInset": "always",
    "backgroundColor": "#ffffff"
  }
}
```

### Build and Sync
```bash
npm run build
npx cap sync ios
npx cap open ios
```

## Step 2: Configure Xcode Project

### In Xcode:
1. **Select your team** (requires Apple Developer account)
   - Click on project name in navigator
   - Select "Signing & Capabilities"
   - Choose your team from dropdown

2. **Configure Bundle Identifier**
   - Set to: `com.huddleme.app`
   - Must be unique across App Store

3. **Set Deployment Target**
   - Minimum: iOS 13.0 or higher
   - Recommended: iOS 14.0+

4. **Add Capabilities**
   - Push Notifications
   - Background Modes (Background fetch, Remote notifications)
   - Sign in with Apple (if using)

5. **Configure Info.plist**
   - Add privacy descriptions for:
     - NSLocationWhenInUseUsageDescription
     - NSBluetoothAlwaysUsageDescription
     - NSCameraUsageDescription (if using)
     - NSPhotoLibraryUsageDescription

## Step 3: App Store Connect Setup

### Create App Record
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill in details:
   - **Platform**: iOS
   - **Name**: HuddleMe
   - **Primary Language**: English
   - **Bundle ID**: com.huddleme.app
   - **SKU**: HUDDLEME001
   - **User Access**: Full Access

### App Information
- **Category**: Social Networking
- **Secondary Category**: Lifestyle
- **Content Rights**: Check if you own rights
- **Age Rating**: Complete questionnaire

### Pricing and Availability
- **Price**: Free (with in-app purchases)
- **Availability**: All territories or select specific

## Step 4: Prepare App Metadata

### Required Screenshots (use Xcode Simulator)
- **6.7" Display** (iPhone 14 Pro Max): 1290 x 2796 pixels
- **6.5" Display** (iPhone 11 Pro Max): 1242 x 2688 pixels
- **5.5" Display** (iPhone 8 Plus): 1242 x 2208 pixels

Minimum 3 screenshots, maximum 10 per device size.

### App Preview Video (Optional but Recommended)
- 15-30 seconds
- Same resolutions as screenshots
- Show key features: Radar, Chat, Meetups

### App Icon
- **1024 x 1024 pixels**
- No transparency
- No rounded corners (Apple adds them)
- Located in: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### Text Content
**App Name**: HuddleMe (30 characters max)

**Subtitle**: Meet People Nearby Instantly (30 characters max)

**Description** (4000 characters max):
```
HuddleMe helps you discover and connect with interesting people nearby in real-time. Whether you're looking for friends, networking opportunities, or spontaneous meetups, HuddleMe makes it easy.

KEY FEATURES:
• Real-time Radar - See who's nearby and available right now
• Instant Messaging - Chat with connections seamlessly
• Smart Meetup Proposals - Suggest venues and times effortlessly
• Privacy First - Control your visibility and who can see you
• Offline Support - Queue actions when offline, sync automatically

PERFECT FOR:
✓ Meeting new friends in your area
✓ Professional networking at events
✓ Finding activity partners
✓ Spontaneous social gatherings
✓ Connecting with like-minded people

PREMIUM FEATURES:
• Unlimited connections
• Advanced filters
• Priority visibility
• Read receipts
• Custom themes

Download HuddleMe today and start making meaningful connections!
```

**Keywords**: meetup, social, nearby, friends, networking, chat, radar, local (100 characters max)

**Promotional Text** (170 characters, updatable without new version):
```
🎉 New: Background sync keeps you connected even offline! Plus improved radar accuracy and faster messaging.
```

**Support URL**: https://huddleme.app/support
**Marketing URL**: https://huddleme.app
**Privacy Policy URL**: https://huddleme.app/privacy (REQUIRED)

## Step 5: Build for Release

### In Xcode:
1. Select "Any iOS Device (arm64)" as destination
2. Product → Archive
3. Wait for archive to complete
4. Organizer window opens automatically

### Upload to App Store Connect:
1. Select your archive
2. Click "Distribute App"
3. Choose "App Store Connect"
4. Select "Upload"
5. Choose automatic signing
6. Click "Upload"

## Step 6: Submit for Review

### In App Store Connect:
1. Go to your app → version
2. Complete all required fields:
   - Screenshots (all required sizes)
   - App description
   - Keywords
   - Support URL
   - Privacy Policy URL

3. **App Review Information**:
   - Contact information
   - Demo account (if app requires login)
   - Notes for reviewer

4. **Version Release**:
   - Automatic release after approval
   - Manual release (you control timing)
   - Scheduled release

5. Click "Submit for Review"

## Step 7: Review Process

### Timeline
- **Initial Review**: 24-48 hours typically
- **Resubmission**: Usually faster (12-24 hours)

### Common Rejection Reasons
1. **Missing Privacy Policy**: Ensure URL is accessible
2. **Crashes**: Test thoroughly before submission
3. **Incomplete Information**: Fill all metadata fields
4. **Guideline Violations**: Review App Store Guidelines
5. **Permissions**: Explain why you need each permission

### App Store Review Guidelines
- https://developer.apple.com/app-store/review/guidelines/

## Step 8: Post-Approval

### After Approval:
1. App appears in App Store within 24 hours
2. Monitor reviews and ratings
3. Respond to user feedback
4. Track analytics in App Store Connect

### Updates:
```bash
# Increment version in package.json and Xcode
npm run build
npx cap sync ios
# Archive and upload new version
```

## In-App Purchases Setup

### Create In-App Purchases:
1. App Store Connect → Features → In-App Purchases
2. Click "+" to create new
3. Types for HuddleMe:
   - **Auto-Renewable Subscription**: Premium membership
   - **Consumable**: Boost visibility

### Configure Subscriptions:
- **Reference Name**: HuddleMe Premium Monthly
- **Product ID**: com.huddleme.premium.monthly
- **Price**: $9.99/month
- **Subscription Group**: Premium Features

## TestFlight Beta Testing

### Before App Store Release:
1. Upload build to App Store Connect
2. Complete beta app information
3. Add internal testers (up to 100)
4. Add external testers (up to 10,000)
5. External testing requires beta app review

### Invite Testers:
- Send invites via email
- Testers install TestFlight app
- Receive automatic updates

## Troubleshooting

### Build Errors:
```bash
# Clean build folder
npx cap sync ios
cd ios
pod install
cd ..
```

### Code Signing Issues:
- Verify Apple Developer account is active
- Check provisioning profiles in Xcode
- Ensure bundle ID matches App Store Connect

### Upload Failures:
- Check Xcode version is latest
- Verify internet connection
- Try uploading via Application Loader

## Monitoring and Analytics

### App Store Connect Analytics:
- Downloads and installations
- Crashes and performance
- User engagement
- Conversion rates

### Recommended Tools:
- Firebase Analytics
- Crashlytics for crash reporting
- Revenue tracking for subscriptions

## Compliance

### Required for Social Apps:
- ✅ Privacy Policy (GDPR compliant)
- ✅ Terms of Service
- ✅ Age rating (17+ recommended for social)
- ✅ Content moderation plan
- ✅ User reporting system
- ✅ Block/mute functionality

### Data Privacy:
- Declare data collection in App Privacy section
- Location data usage
- User content handling
- Third-party data sharing

## Resources

- **Apple Developer**: https://developer.apple.com
- **App Store Connect**: https://appstoreconnect.apple.com
- **Human Interface Guidelines**: https://developer.apple.com/design/human-interface-guidelines/
- **Capacitor iOS Docs**: https://capacitorjs.com/docs/ios
- **TestFlight**: https://developer.apple.com/testflight/

## Cost Summary

- **Apple Developer Program**: $99/year
- **Mac Computer**: Required for Xcode (if you don't have one)
- **Optional Services**:
  - App Store Optimization tools
  - Professional screenshots/videos
  - Beta testing services

## Next Steps

1. ✅ Enroll in Apple Developer Program
2. ✅ Install Xcode and development tools
3. ✅ Add iOS platform to HuddleMe
4. ✅ Configure Xcode project
5. ✅ Create App Store Connect record
6. ✅ Prepare screenshots and metadata
7. ✅ Build and archive app
8. ✅ Submit for review
9. ✅ Monitor review process
10. ✅ Launch and promote!

---

**Need Help?** Contact Apple Developer Support or consult the Capacitor community for technical issues.
