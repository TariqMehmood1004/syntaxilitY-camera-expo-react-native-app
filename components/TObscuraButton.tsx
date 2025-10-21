import { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import {
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    ViewStyle
} from "react-native"
import { Colors } from "../constants/theme";

interface ButtonProps {
    onPress: () => void;
    title?: string;
    iconName?: ComponentProps<typeof Ionicons>["name"];
    containerStyle?: StyleProp<ViewStyle>;
    iconSize?: number;
}

export function TObscuraButton({
    onPress,
    title,
    iconName,
    containerStyle,
    iconSize = 24,
}: ButtonProps) {
    return (
        <>
            <TouchableOpacity 
                onPress={onPress}
                style={[
                    styles.container,
                    {
                        width: title ? "100%" : 50,
                        height: 50,
                        backgroundColor: "transparent",
                        shadowColor: "transparent",
                        borderRadius: title ? 6 : 50,
                        alignSelf: "flex-start"
                    },
                    containerStyle
                ]}
            >
                {iconName && <Ionicons name={iconName} size={iconSize ?? 28} color="white" />}
                {title && <Text style={{ color: "white", fontSize: 16, fontWeight: 600 }}>{title}</Text>}

            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.light.background,
        padding: 10,
        borderRadius: 10,
        shadowColor: "#373737",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});