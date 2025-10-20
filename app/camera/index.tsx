import { Redirect, Stack, useRouter } from "expo-router";
import { Text, View, StyleSheet } from "react-native"
import {Camera, useCameraDevice, useCameraPermission} from "react-native-vision-camera"

const CameraIndex = () => {
  const { hasPermission } = useCameraPermission();
  const microphonePermission = Camera.getMicrophonePermissionStatus();
  const redirectToPermission = !hasPermission || microphonePermission !== "not-determined";

  const cameraDevice = useCameraDevice("back");

  const router = useRouter();

  if(redirectToPermission) return <Redirect href="/permissions" />;

  if(!cameraDevice) return <></>;

  return (
    <>
      <Stack.Screen options={{headerTitle: "Permissions"}} />
      
      <View style={styles.container}>
        <View style={styles.spacer}></View>
      
        <Text style={styles.subTitle}>SyntaxilitY Camera needs access to a few permissions in order to work properly.</Text>   
        
        <View style={styles.spacer}></View>
      </View>
    </>
  )
}

export default CameraIndex

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    subTitle: {
      textAlign: 'center',
    },
    footNote: {
      fontSize: 12,
      fontWeight: 'bold',
      letterSpacing: 2,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    spacer: {
      marginVertical: 8,
    },
    permissionContainer: {
      backgroundColor: '#ffffff20',
      borderRadius: 10,
      padding: 10,
      justifyContent: 'space-between'
    },
    permissionText: {
      marginLeft: 10,
      flexShrink: 1,
    },
    continueButton: {
      padding: 10,
      borderWidth: 2,
      borderColor: 'white',
      borderRadius: 50,
      alignSelf: 'center',
    },
})