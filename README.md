
## Camera dependencies
```bash
npx expo install react-native-vision-camera
npx expo install expo-blur
npx expo install expo-av
npx expo install expo-audio
npx expo install expo-video
npx expo install expo-media-library
```

## Run Build Command (EAS Build)
Expo now uses EAS (Expo Application Services) for building standalone apps.

```npx eas build -p android --profile preview```

This will generate an APK (for local testing) by default in preview mode.

---

To generate a Play Store ready AAB, use:

```npx eas build -p android --profile production```

.apk → installable directly on device
.aab → Play Store publishing format