import { StyleSheet, Text, View } from "react-native";

export default function AdminDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Society Admin Dashboard</Text>
      <Text style={styles.subtitle}>Welcome to GATED</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E8D3",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#6B3E2E",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#A65D3B",
    marginTop: 8,
  },
});
