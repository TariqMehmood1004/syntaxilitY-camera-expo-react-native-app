import { useEffect, useState, useCallback } from "react";
import { Text, View, StyleSheet, Alert, Pressable } from "react-native";
import { Camera, CameraPermissionStatus } from "react-native-vision-camera";
import * as ExpoMediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import TSwitchButton from "@/components/TSwitchButton";

const PermissionScreen = () => {
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");
  const [microphonePermissionStatus, setMicrophonePermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");

  const [mediaLibraryPermission, requestMediaLibraryPermissions] =
    ExpoMediaLibrary.usePermissions();

  const [refresh, setRefresh] = useState(0); // used to trigger re-render/reset

  // Load initial permission statuses on mount or refresh
  useEffect(() => {
    const loadPermissions = async () => {
      const camera = await Camera.getCameraPermissionStatus();
      const mic = await Camera.getMicrophonePermissionStatus();
      const media = await ExpoMediaLibrary.getPermissionsAsync();

      setCameraPermissionStatus(camera);
      setMicrophonePermissionStatus(mic);
      // @ts-ignore
      if (media?.status === "granted") {
        requestMediaLibraryPermissions();
      }
    };
    loadPermissions();
  }, [refresh]); // triggers recheck when re-rendered

  const requestMicrophonePermission = async () => {
    try {
      const status = await Camera.requestMicrophonePermission();
      setMicrophonePermissionStatus(status);
    } catch (error) {
      console.error("Error requesting microphone permission:", error);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const status = await Camera.requestCameraPermission();
      setCameraPermissionStatus(status);
    } catch (error) {
      console.error("Error requesting camera permission:", error);
    }
  };

  const handleContinue = useCallback(() => {
    if (
      cameraPermissionStatus === "granted" &&
      microphonePermissionStatus === "granted" &&
      mediaLibraryPermission?.granted
    ) {
      router.replace("/");
    } else {
      Alert.alert(
        "Permissions not granted",
        "Please go to settings and enable permissions",
        [
          {
            text: "Done",
            onPress: () => {},
          },
        ]
      );
    }
  }, [
    cameraPermissionStatus,
    microphonePermissionStatus,
    mediaLibraryPermission,
  ]);

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Permissions" }} />

      <View style={styles.container}>
        
        <View style={styles.spacer}></View>
        <View style={styles.spacer}></View>

        <Text style={styles.title}>
          SyntaxilitY Camera needs access to work properly.
        </Text>

        <View style={styles.spacer}></View>
        <View style={styles.spacer}></View>

        <View style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}>
          <Ionicons name="lock-closed-outline" size={26} color="orange" />
          <Text style={styles.footNoteText}>Required</Text>
        </View>

        <View style={styles.spacer}></View>

        {/* Switches */}
        <TSwitchButton
          icon="camera-outline"
          title="Camera"
          description="Used for taking photos and videos"
          value={cameraPermissionStatus === "granted"}
          onToggle={requestCameraPermission}
        />

        <TSwitchButton
          icon="mic-outline"
          title="Microphone"
          description="Used for recording audio"
          value={microphonePermissionStatus === "granted"}
          onToggle={requestMicrophonePermission}
        />

        <TSwitchButton
          icon="library-outline"
          title="Library"
          description="Used for saving photos and videos"
          value={mediaLibraryPermission?.granted === true}
          // @ts-ignore
          onToggle={async () => await requestMediaLibraryPermissions()}
        />

        <View style={styles.spacer}></View>
        <View style={styles.row}>
          <Pressable
            android_ripple={{
              color: "white",
              borderless: true,
              radius: 30,
            }}
            onPress={handleContinue}
            style={styles.continueButton}
          >
            <Ionicons name="arrow-forward" size={26} color="white" />
          </Pressable>
        </View>

        <View style={styles.spacer}></View>
        <Text style={styles.footNote}>
          Please enable all permissions to continue using the camera features.
        </Text>
      </View>
    </>
  );
};

export default PermissionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  footNote: {
    fontSize: 12,
    color: "#595959",
    textAlign: "center",
  },
  footNoteText: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
    letterSpacing: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  spacer: {
    marginVertical: 8,
  },
  continueButton: {
    padding: 10,
    borderWidth: 2,
    backgroundColor: "#373737",
    borderRadius: 50,
    alignSelf: "center",
  },
});
