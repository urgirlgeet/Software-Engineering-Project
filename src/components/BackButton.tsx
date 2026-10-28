import { SymbolView } from "expo-symbols";
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors } from "../styles/theme";

type BackButtonProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function BackButton({ onPress, style }: BackButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={onPress}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
    >
      <SymbolView
        name={{ ios: "arrow.left", android: "arrow_back", web: "arrow_back" }}
        tintColor={colors.brown}
        size={18}
      />
      <Text style={styles.label}>Back</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 7,
    minHeight: 40,
    paddingVertical: 8,
  },
  label: {
    color: colors.brown,
    fontSize: 14,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
});
