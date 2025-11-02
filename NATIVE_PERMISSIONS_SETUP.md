# Native Platform Permissions Setup

This guide explains the permissions configured for HuddleMe's location and Bluetooth features.

## Android Permissions (AndroidManifest.xml)

### Bluetooth LE
```xml
<uses-feature android:name="android.hardware.bluetooth_le" android:required="true"/>
```

### Location Permissions
- `ACCESS_FINE_LOCATION` - For precise GPS location
- `ACCESS_COARSE_LOCATION` - For approximate location
- `ACCESS_BACKGROUND_LOCATION` - For background location tracking

### Bluetooth Permissions
- **Android 11 and below**: `BLUETOOTH`, `BLUETOOTH_ADMIN`
- **Android 12+ (API 31+)**: `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`, `BLUETOOTH_ADVERTISE`

## iOS Permissions (Info.plist)

### Required Device Capabilities
```xml
<string>bluetooth-le</string>
```

### Location Usage Descriptions
- `NSLocationWhenInUseUsageDescription` - Location access while app is in use
- `NSLocationAlwaysAndWhenInUseUsageDescription` - Background location access
- `NSLocationAlwaysUsageDescription` - Always-on location access

### Bluetooth Usage Descriptions
- `NSBluetoothAlwaysUsageDescription` - Bluetooth for proximity detection
- `NSBluetoothPeripheralUsageDescription` - Bluetooth peripheral mode

## Setup Instructions

### For Android
1. The `AndroidManifest.xml` is already configured in `android/app/src/main/`
2. Run `npx cap sync android` to apply changes
3. Permissions will be requested at runtime when needed

### For iOS
1. The `Info.plist` is already configured in `ios/App/App/`
2. Run `npx cap sync ios` to apply changes
3. Permissions will be requested at runtime when needed

## Runtime Permission Handling

The app uses the LocationPermissionModal component to request permissions:
- User clicks "Allow Location Access"
- Native permission dialog appears
- App receives permission status
- Location tracking starts if granted

## Testing Permissions

### Android
```bash
adb shell pm list permissions -d -g
adb shell dumpsys package com.huddleme.app
```

### iOS
Check Settings > Privacy > Location Services > HuddleMe
Check Settings > Privacy > Bluetooth > HuddleMe
