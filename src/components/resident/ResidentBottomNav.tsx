import { SymbolView } from "expo-symbols";
import { Pressable, Text, View } from "react-native";

import { dashboardColors, dashboardStyles } from "../../styles/dashboardStyles";

type ResidentBottomNavProps = {
  active: string;
  onNavigate: (route: string) => void;
};

const items = [
  {
    label: "Home",
    icon: "house.fill",
    route: "/resident-dashboard",
  },
  {
    label: "Requests",
    icon: "doc.text",
    route: "/request",
  },
  {
    label: "Visitors",
    icon: "person.2",
    route: "/visitors",
  },
  {
    label: "Notices",
    icon: "megaphone",
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
          >
            <SymbolView
              name={{}}
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
