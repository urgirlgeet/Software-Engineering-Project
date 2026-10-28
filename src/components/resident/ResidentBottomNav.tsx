import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, Text, View } from "react-native";

import { dashboardColors, dashboardStyles } from "../../styles/dashboardStyles";

type ResidentBottomNavProps = {
  active: string;
  onNavigate: (route: string) => void;
};

const items: {
  label: string;
  icon: SymbolViewProps["name"];
  route: string;
}[] = [
  {
    label: "Home",
    icon: { ios: "house.fill", android: "home", web: "home" },
    route: "/resident-dashboard",
  },
  {
    label: "Requests",
    icon: { ios: "doc.text", android: "description", web: "description" },
    route: "/request",
  },
  {
    label: "Visitors",
    icon: { ios: "person.2", android: "people", web: "people" },
    route: "/visitors",
  },
  {
    label: "Notices",
    icon: { ios: "megaphone", android: "campaign", web: "campaign" },
    route: "/notices",
  },
];

export default function ResidentBottomNav({
  active,
  onNavigate,
}: ResidentBottomNavProps) {
  return (
    <View style={dashboardStyles.bottomNav}>
      {items.map((item) => {
        const isActive = item.label === active;

        return (
          <Pressable
            key={item.label}
            style={dashboardStyles.navItem}
            onPress={() => onNavigate(item.route)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <SymbolView
              name={item.icon}
              tintColor={
                isActive ? dashboardColors.brown : dashboardColors.muted
              }
              size={20}
            />

            <Text
              style={[
                dashboardStyles.navLabel,
                isActive && dashboardStyles.activeNavLabel,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
