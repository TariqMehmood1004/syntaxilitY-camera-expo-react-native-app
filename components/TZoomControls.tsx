import {
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import Animated, {BounceIn, FadeOutRight} from "react-native-reanimated";

const MIN_ZOOM = 1;
const MAX_ZOOM = 128;
const NEUTRAL_ZOOM = 1;
const zoomOptions = [1,2,3,4,5];

export default function TZoomControls(
    {
        setZoom,
        setShowZoomControls,
        zoom
    }: {
        setZoom: (zoom: number) => void,
        setShowZoomControls: (show: boolean) => void,
        zoom: number
    }
) {
    const {width, height} = useWindowDimensions();
    const radius = Math.min(width, height - 100) * 0.35;

    const handleZoomPressed = (zoomFactor: number) => {
        if(zoomFactor === -1) {
            // reset to neutral
            setZoom(NEUTRAL_ZOOM);
        } else {
            // calculate new zoom value
            const newZoom = Math.min(Math.max(zoomFactor, MIN_ZOOM), MAX_ZOOM);
            setZoom(newZoom);
        }
    }

    return (
        <>
            <View style={{flex:1, padding:10, zIndex: 100, position: "absolute",}}>
                {zoomOptions.map((z, i) => {
                    const angle = (i / zoomOptions.length / 3) * 1.65 * Math.PI - Math.PI / 0.99;
                    const x = Math.cos(angle) * radius + 320;
                    const y = Math.sin(angle) * radius + height / 30;

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
                                onPress={() => handleZoomPressed(z)}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 25,
                                    backgroundColor: zoom === z ? "#ffffff" : "#37373750",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    zIndex: 100000
                                }}>
                                    <Text style={{fontSize: 17, color: zoom === z ? "#000000" : "#ffffff"}}>{z}x</Text>
                                </TouchableHighlight>
                        </Animated.View>
                    );
                })}
            </View>
        </>
    );  
}