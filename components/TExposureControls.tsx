import {
    Platform,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import Animated, {BounceIn, FadeOutRight} from "react-native-reanimated";

const exposureOptionsAndroid = [-10, -5, 0, 5, 10];
const exposureOptionsIOS = [-2, -1, 0, 1, 2];
const exposureOptions = Platform.OS === 'ios' ? exposureOptionsIOS : exposureOptionsAndroid;

export default function TExposureControls(
    {
        setExposure,
        setShowExposureControls,
        exposure
    }: {
        setExposure: (exposure: number) => void,
        setShowExposureControls: (show: boolean) => void,
        exposure: number
    }
) {
    const {width, height} = useWindowDimensions();
    const radius = Math.min(width, height - 100) * 0.35;

    const handleExposurePressed = (exposureValue: number) => {
        setExposure(exposureValue);
    }

    return (
        <>
            <View style={{flex:1, padding:10, zIndex: 100, position: "absolute",}}>
                {exposureOptions.map((z, i) => {
                    const angle = (i / exposureOptions.length / 3) * 1.75 * Math.PI - Math.PI / 2.1;
                    const x = Math.cos(angle) * radius - 20;
                    const y = Math.sin(angle) * radius + height / 25;

                    return (
                        <Animated.View
                            key={i}
                            exiting={FadeOutRight.delay(i * 100)}
                            entering={BounceIn.delay(i * 100)}
                            style={{
                                position: "absolute",
                                left: x,
                                top: y,
                            }}
                        >
                            <TouchableHighlight
                                onPress={() => handleExposurePressed(z)}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 25,
                                    backgroundColor: exposure === z ? "#ffffff" : "#ffffff20",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    zIndex: 100000
                                }}>
                                    <Text style={{fontSize: 17, color: exposure === z ? "#000000" : "#ffffff"}}>{z}</Text>
                                </TouchableHighlight>
                        </Animated.View>
                    );
                })}
            </View>
        </>
    );  
}