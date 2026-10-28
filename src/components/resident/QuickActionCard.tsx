import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, Text, View } from "react-native";

import { dashboardColors, dashboardStyles } from "../../styles/dashboardStyles";

type QuickActionCardProps = {
  icon: SymbolViewProps["name"];
  title: string;
  detail: string;
  onPress: () => void;
};

export default function QuickActionCard({
  icon,
  title,
  detail,
  onPress,
}: QuickActionCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        dashboardStyles.actionCard,
        pressed && { opacity: 0.8 },
      ]}
      onPress={onPress}
    >
      <View style={dashboardStyles.actionIcon}>
        <SymbolView
          name={icon}
          tintColor={dashboardColors.brown}
          size={22}
        />
      </View>

      <Text style={dashboardStyles.actionTitle}>{title}</Text>

      <Text style={dashboardStyles.actionDetail}>{detail}</Text>
    </Pressable>
  );
}
