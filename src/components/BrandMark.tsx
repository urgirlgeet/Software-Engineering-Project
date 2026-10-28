import { SymbolView } from "expo-symbols";
import { View } from "react-native";

import { colors, styles } from "../styles/theme";

type BrandMarkProps = {
  size?: number;
};

export default function BrandMark({ size = 32 }: BrandMarkProps) {
  return (
    <View style={styles.logoTile} accessible accessibilityLabel="GATED">
      <SymbolView
        name={{
          ios: "door.left.hand.open",
          android: "door_open",
          web: "door_open",
        }}
        tintColor={colors.brown}
        size={size}
      />
    </View>
  );
}
