import { StyleSheet, Text, View } from "react-native";

import { colors } from "../styles/theme";

export default function Explore() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GATED</Text>
      <Text style={styles.subtitle}>Apartment Tracker</Text>
      <Text style={styles.text}>Explore your apartment community.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: 24,
  },
  title: {
    color: colors.brown,
    fontFamily: "Georgia",
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 20,
    marginTop: 6,
  },
  text: {
    color: colors.muted,
    fontSize: 15,
    marginTop: 16,
  },
});
