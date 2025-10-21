import { Redirect, router, useFocusEffect } from "expo-router";
import { Text, View, StyleSheet, Platform, StatusBar, Linking, TouchableHighlight, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import { Camera, CameraPermissionStatus, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import { useState, useCallback, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TObscuraButton } from "@/components/TObscuraButton";
import { BlurView } from "expo-blur"
import { FontAwesome5 } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import TZoomControls from "@/components/TZoomControls";
import TExposureControls from "@/components/TExposureControls";

const CameraIndex = () => {
  const { hasPermission: hasCameraPermission, requestPermission: requestCameraPermission } = useCameraPermission();
  const [microphonePermission, setMicrophonePermission] = useState<CameraPermissionStatus>("not-determined");
  const [isLoading, setIsLoading] = useState(true);

  const [cameraPosition, setCameraPosition] = useState<"front" | "back">("back");

  const cameraDevice = useCameraDevice(cameraPosition);
  const [showZoomControls, setShowZoomControls] = useState(false);
  const [showExposureControls, setShowExposureControls] = useState(false);

  const [galleryPhotos, setGalleryPhotos] = useState<MediaLibrary.Asset[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        const assets = await MediaLibrary.getAssetsAsync({
          mediaType: "photo",
          sortBy: ["creationTime"],
          first: 3, // fetch 3 latest photos
        });
        setGalleryPhotos(assets.assets);
      }
    })();
  }, []);

  // camera reference
  const cameraRef = useRef<Camera>(null);

  // options
  const [zoom, setZoom] = useState(cameraDevice?.neutralZoom);
  const [exposure, setExposure] = useState(0);
  const [flash, setFlash] = useState<"on" | "off">("off");
  const [torch, setTorch] = useState<"on" | "off">("off");

  const [isCapturing, setIsCapturing] = useState(false);

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

  const handleTakePhoto = async () => {
    if (!cameraRef.current || !cameraDevice) return;

    // close all Exposure and Zoom controls
    setShowZoomControls(false);
    setShowExposureControls(false);
    
    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePhoto({
        flash: flash,
        enableShutterSound: false,
      });

      router.push({
        pathname: "/media",
        params: {
          media: photo.path,
          type: "photo",
        },
      })
    } catch (error) {
      console.error("Error taking photo:", error);
    } finally {
      setIsCapturing(false); // Hide loader
    }
  };

  if (!cameraDevice) return null;

  return (
    <>
      <SafeAreaView style={styles.container} edges={[]}>

        {/* Camera */}
        <View style={{
          flex: 1,
          width: "100%",
          height: "100%",
          borderRadius: 10,
          overflow: "hidden",
          position: "relative"
        }}>
          <Camera
            ref={cameraRef}
            style={{ flex: 1 }}
            device={cameraDevice}
            isActive
            zoom={zoom}
            exposure={exposure}
            torch={torch}
            photo
            video
          />
          <BlurView
            tint="dark"
            intensity={0}
            style={{
              position: "absolute",
              left: "50%",
              transform: [{ translateX: -70 }],
              top: 45,
              padding: 10,
              borderRadius: 10,
              overflow: "hidden"
            }}
            experimentalBlurMethod="dimezisBlurView"
          >
            <Text style={styles.blurView}>
              Exposure: {exposure} | Zoom: {zoom}
            </Text>
          </BlurView>

          <TObscuraButton
              iconName={
                cameraPosition === "front"
                  ? "camera-reverse-outline"
                  : "camera-outline"
              }
              onPress={() =>
                setCameraPosition(cameraPosition === "front" ? "back" : "front")
              }
              containerStyle={{
                position: "absolute",
                top: 40,
                right: 20,
                backgroundColor: "#37373740",
              }}
            />

          <TObscuraButton
              iconName={torch === "on" ? "flashlight" : "flashlight-outline"}
              onPress={() => setTorch(torch === "on" ? "off" : "on")}
              containerStyle={{
                position: "absolute",
                top: 40,
                left: 20,
              }}
            />
        </View>

        {/* Options */}
        <View
          style={{
            position: "absolute",
            bottom: 0, // slightly above screen edge
            alignSelf: "center", // center horizontally
            width: "100%", // take 100% of screen width
            padding: 20,
          }}
        >
          {/* Middle section */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 10,
            }}
          >

            {/* Photos */}
            <TouchableOpacity
              onPress={() => {
                const link = Platform.select({
                  ios: "photos-redirect://",
                  android: "content://media/external/images/media",
                  default: "content://media/external/images/media",
                });
                Linking.openURL(link);
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "#37373720",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#37373720",
              }}
            >
              {galleryPhotos.length > 0 ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 40,
                    height: 40,
                  }}
                >
                  {galleryPhotos.map((photo, index) => (
                    <Image
                      key={index}
                      source={{ uri: photo.uri }}
                      style={{
                        width: "100%",
                        height: "100%",
                        resizeMode: "cover",
                      }}
                    />
                  ))}
                </View>
              ) : (
                <FontAwesome5 name="image" size={30} color="white" />
              )}
            </TouchableOpacity>

            <TObscuraButton
              iconName={"settings-outline"}
              onPress={() => router.push("/settings")}
            />
          </View>

          {/* Bottom section (Capture Button) */}
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
            }}
          >

            {showExposureControls ? (
              <TExposureControls 
                setShowExposureControls={setShowExposureControls}
                setExposure={setExposure}
                exposure={exposure}
                key={exposure}
              />
            ) : null}

            <TObscuraButton
              title="+/-"
              onPress={() => {
                setShowExposureControls((prev) => {
                  const newState = !prev;
                  if (newState) setShowZoomControls(false); // close zoom if exposure opens
                  return newState;
                });
              }}
              iconSize={40}
              containerStyle={{alignSelf: "center", width: 50, height: 50, borderRadius: 50}}
            />

            <TouchableHighlight
              onPress={handleTakePhoto}
              disabled={isCapturing}
              style={{
                width: 80,
                height: 80,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
              underlayColor="rgba(255,255,255,0.1)"
            >
              {isCapturing ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <FontAwesome5 name="dot-circle" size={60} color="white" />
              )}
            </TouchableHighlight>
            
            {showZoomControls ? (
              <TZoomControls 
                setShowZoomControls={setShowZoomControls}
                setZoom={setZoom}
                zoom={zoom ?? 1}
                key={zoom}
              />
            ) : null}
            
            <TObscuraButton
              title={`${zoom ?? 1}x`}
              onPress={() => {
                setShowZoomControls((prev) => {
                  const newState = !prev;
                  if (newState) setShowExposureControls(false); // close exposure if zoom opens
                  return newState;
                });
              }}
              iconSize={40}
              containerStyle={{alignSelf: "center", width: 50, height: 50, borderRadius: 50}}
            />
          </View>
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
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
