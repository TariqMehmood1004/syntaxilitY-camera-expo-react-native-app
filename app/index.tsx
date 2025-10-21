import { Redirect, useFocusEffect } from "expo-router";
import { Text, View, StyleSheet, Platform, StatusBar, Linking } from "react-native";
import { Camera, CameraPermissionStatus, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TObscuraButton } from "@/components/TObscuraButton";
import { BlurView } from "expo-blur"

const CameraIndex = () => {
  const { hasPermission: hasCameraPermission, requestPermission: requestCameraPermission } = useCameraPermission();
  const [microphonePermission, setMicrophonePermission] = useState<CameraPermissionStatus>("not-determined");
  const [isLoading, setIsLoading] = useState(true);

  const [cameraPosition, setCameraPosition] = useState<"front" | "back">("back");

  const cameraDevice = useCameraDevice(cameraPosition);

  // options
  const [zoom, setZoom] = useState(cameraDevice?.neutralZoom);
  const [exposure, setExposure] = useState(0);
  const [flash, setFlash] = useState<"on" | "off">("off");
  const [torch, setTorch] = useState<"on" | "off">("off");

  // Recheck permissions every time screen gains focus
  useFocusEffect(
    useCallback(() => {
      const checkPermissions = () => {
        setIsLoading(true);
        const micStatus = Camera.getMicrophonePermissionStatus();
        setMicrophonePermission(micStatus);
        setIsLoading(false);
      };
      checkPermissions();
    }, [])
  );

  // While checking permissions, don't render redirect yet
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.footNote}>Checking permissions...</Text>
      </View>
    );
  }

  // Redirect only when any permission not granted
  const redirectToPermission =
    !hasCameraPermission ||
    microphonePermission === "not-determined" ||
    microphonePermission === "denied";

  if (redirectToPermission) {
    return <Redirect href="/permissions" />;
  }

  if (!cameraDevice) return null;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={{
          flex: 2,
          borderRadius: 10,
          overflow: "hidden",
          backgroundColor: "red"
        }}>
          <Camera 
            style={{ flex: 1 }} 
            device={cameraDevice} 
            isActive
            zoom={zoom}
            exposure={exposure}
            resizeMode="cover"
            torch={torch}
            />
            <BlurView
              tint="dark"
              intensity={100}
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                padding: 10,
                borderRadius: 10,
              }}
              experimentalBlurMethod="dimezisBlurView"
            >
              <Text style={styles.blurView}>
                Exposure: {exposure} | Zoom: {zoom}
              </Text>
            </BlurView>
        </View>

        <View style={{ 
          flex: 1,
          borderRadius: 10,
          padding: 8,
          }}>

            {/* Top section */}
            <View style={{
              flex: 0.7,
            }}>
              <Text style={styles.footNote}>Max FPS: {cameraDevice.formats[0].maxFps}</Text>
              <Text style={styles.footNote}>Width: {cameraDevice.formats[0].photoWidth} | Height: {cameraDevice.formats[0].photoHeight}</Text>
              <Text style={styles.footNote}>Camera: {cameraDevice.name}</Text>
            </View>

            {/* Middle section */}
            <View style={{
              flex: 0.7,
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}>
              <TObscuraButton
                iconName = {torch === "on" ? "flashlight" : "flashlight-outline"}
                onPress = {() => setTorch(torch === "on" ? "off" : "on")}
                containerStyle = {{ alignSelf: "center" }}
              />

              <TObscuraButton
                iconName = {cameraPosition === "front" ? "camera-reverse-outline" : "camera-outline"}
                onPress = {() => setCameraPosition(cameraPosition === "front" ? "back" : "front")}
                containerStyle = {{ alignSelf: "center" }}
              />

              <TObscuraButton
                iconName = {"image-outline"}
                onPress = {() => {
                  const link = Platform.select({
                    ios: "photos-redirect://",
                    android: "content://media/external/images/media",
                    default: "content://media/external/images/media"
                  })
                  Linking.openURL(link);
                }}
                containerStyle = {{ alignSelf: "center" }}
              />

              {/* Settings */}
              <TObscuraButton
                iconName = {"settings-outline"}
                onPress = {() => {}}
                containerStyle = {{ alignSelf: "center" }}
              />

            </View>

            {/* Bottom section */}

          </View>
      </SafeAreaView>
    </>
  );
};

export default CameraIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  footNote: {
    fontSize: 14,
    fontWeight: "500",
    color: "#eee6e6ff",
  },
  spacer: {
    marginVertical: 8,
  },
  blurView: {
    fontSize: 14,
    fontWeight: "500",
    color: "#eee6e6ff",
    borderRadius: 10,
  },
});
