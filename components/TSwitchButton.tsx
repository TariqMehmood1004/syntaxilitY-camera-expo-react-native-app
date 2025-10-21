import React from "react";
import { View, Text, StyleSheet, Switch, ViewStyle, TextStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TSwitchButtonProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  value: boolean;
  onToggle: () => void;
  trackColor?: { true: string; false?: string };
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
}

const TSwitchButton: React.FC<TSwitchButtonProps> = ({
  icon = "camera-outline",
  title,
  description,
  value,
  onToggle,
  trackColor = { true: "orange" },
  containerStyle,
  titleStyle,
  descriptionStyle,
}) => {
  return (
    <View style={StyleSheet.compose(styles.row, [styles.permissionContainer, containerStyle])}>
      <Ionicons name={icon} size={26} color="gray" />
      <View style={styles.textContainer}>
        <Text style={[styles.subTitle, titleStyle]}>{title}</Text>
        {description ? <Text style={[styles.footNote, descriptionStyle]}>{description}</Text> : null}
      </View>
      <Switch
        trackColor={trackColor}
        value={value}
        onChange={onToggle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  permissionContainer: {
    paddingHorizontal: 16,
    backgroundColor: "#171717",
    borderRadius: 8,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    flexDirection: "column",
    gap: 3,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  footNote: {
    fontSize: 12,
    color: "gray",
  },
});

export default TSwitchButton;
