import { Text, View, useWindowDimensions, Image, TouchableHighlight, ToastAndroid } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ExpoMediaLibrary from "expo-media-library";

function MediaScreen() {
  const { width, height } = useWindowDimensions();
  const { media, type } = useLocalSearchParams<{ media: string; type: string }>();

  const router = useRouter();

  if (!media) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>No media found.</Text>
      </View>
    );
  }

  const saveToLocal = async () => {
    const { status } = await ExpoMediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      const asset = await ExpoMediaLibrary.createAssetAsync(media);
      await ExpoMediaLibrary.saveToLibraryAsync(asset.uri);
      ToastAndroid.show("Saved to media library", ToastAndroid.SHORT);

      // @ts-ignore
      router.back();
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
        {type === "photo" ? (
            <View
            style={{
                width: "100%",
                height: height * 0.65,
                aspectRatio: 1,
                borderRadius: 20,
                overflow: "hidden",
                backgroundColor: "#222",
                justifyContent: "center",
                alignItems: "center",
            }}
            >
            <Image
                source={{ uri: `file://${media}` }}
                style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
                }}
            />
            </View>
      ) : type === "video" ? (
        null
      ) : (
        <Text
          style={{
            color: "gray",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Unsupported media type.
        </Text>
      )}

      {/* Save to media library */}
      <View
        style={{
          position: "absolute",
          bottom: 30,
          width: "100%",
          alignItems: "center",
        }}
      >
        <TouchableHighlight
          onPress={saveToLocal}>
        <Text style={{ color: "#888888", fontSize: 18 }}>Save to local</Text>
      </TouchableHighlight>
      </View>
    </View>
  );
}

export default MediaScreen;