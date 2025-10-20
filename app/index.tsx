import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Switch, Alert } from "react-native";
import { Camera, CameraPermissionStatus } from "react-native-vision-camera";
import * as ExpoMediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";

const PermissionScreen = () => {
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");
  const [microphonePermissionStatus, setMicrophonePermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");

  const [mediaLibraryPermission, requestMediaLibraryPermissions] =
    ExpoMediaLibrary.usePermissions();

  // Check initial permission status
  useEffect(() => {
    const checkPermissions = async () => {
      const camera = await Camera.getCameraPermissionStatus();
      const mic = await Camera.getMicrophonePermissionStatus();
      setCameraPermissionStatus(camera);
      setMicrophonePermissionStatus(mic);
    };
    checkPermissions();
  }, []);

  // Derived boolean states for UI switches
  const cameraGranted = cameraPermissionStatus === "granted";
  const microphoneGranted = microphonePermissionStatus === "granted";
  const mediaGranted = mediaLibraryPermission?.granted ?? false;

  // Request camera permission
  const handleCameraSwitch = async (value: boolean) => {
    if (value) {
      const status = await Camera.requestCameraPermission();
      setCameraPermissionStatus(status);
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Camera access is required.");
      }
    } else {
      Alert.alert("Camera Disabled", "You can re-enable it in app settings.");
      setCameraPermissionStatus("denied");
    }
  };

  // Request microphone permission
  const handleMicrophoneSwitch = async (value: boolean) => {
    if (value) {
      const status = await Camera.requestMicrophonePermission();
      setMicrophonePermissionStatus(status);
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Microphone access is required.");
      }
    } else {
      Alert.alert(
        "Microphone Disabled",
        "You can re-enable it in app settings."
      );
      setMicrophonePermissionStatus("denied");
    }
  };

  // Request media library permission
  const handleMediaSwitch = async (value: boolean) => {
    if (value) {
      const { status } = await requestMediaLibraryPermissions();
      if (status === "granted") {
        await ExpoMediaLibrary.getAlbumsAsync(); // optional check
      } else {
        Alert.alert(
          "Permission Denied",
          "Media library access is required to save photos or videos."
        );
      }
    } else {
      Alert.alert(
        "Media Access Disabled",
        "You can re-enable it in app settings."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Permissions</Text>

      <View style={styles.permissionItem}>
        <Text style={styles.label}>Camera Access</Text>
        <Switch value={cameraGranted} onValueChange={handleCameraSwitch} />
      </View>

      <View style={styles.permissionItem}>
        <Text style={styles.label}>Microphone Access</Text>
        <Switch
          value={microphoneGranted}
          onValueChange={handleMicrophoneSwitch}
        />
      </View>

      <View style={styles.permissionItem}>
        <Text style={styles.label}>Media Library Access</Text>
        <Switch value={mediaGranted} onValueChange={handleMediaSwitch} />
      </View>

      {/* Continue Button with Icon */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 40,
        }}
      >
        <Ionicons name="arrow-forward" size={26} color="white" />
      </View>


      <Text style={styles.footer}>
        Please enable all permissions to continue using the camera features.
      </Text>
    </View>
  );
};

export default PermissionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#E6F4FE",
    marginBottom: 40,
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 10,
  },
  label: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  footer: {
    marginTop: 40,
    color: "#888",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
});
