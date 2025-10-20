import { useEffect, useState } from "react"
import { Text, View, StyleSheet } from "react-native"
import { Camera, CameraPermissionStatus } from "react-native-vision-camera"
import * as ExpoMediaLibrary from "expo-media-library"

const PermissionScreen = () => {
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<CameraPermissionStatus>("not-determined");
  const [microphonePermissionStatus, setMicrophonePermissionStatus] = useState<CameraPermissionStatus>("not-determined");
  
  const [mediaLibraryPermission, requestMediaLibraryPermissions] = ExpoMediaLibrary.usePermissions();

  useEffect(() => {
    (async () => {
      const { status } = await ExpoMediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Media Library permission not granted");
      }
    })();
  }, []);

    return (
    <>
      <View style={styles.container}>
            <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">SyntaxilitY Camera</Text>
        </View>
    </>
  )
}

export default PermissionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})