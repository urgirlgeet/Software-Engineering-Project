import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ResidentDashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Resident Dashboard</Text>
        <Text style={styles.subtitle}>Welcome to GATED</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Apartment</Text>
          <Text style={styles.cardText}>Your apartment details</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Complaints</Text>
          <Text style={styles.cardText}>Raise and track complaints</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Announcements</Text>
          <Text style={styles.cardText}>View society announcements</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace("/signin")}
      >
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E8D3",
    paddingHorizontal: 28,
    paddingTop: 60,
  },

  header: {
    marginBottom: 30,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#6B3E2E",
  },

  subtitle: {
    fontSize: 16,
    color: "#A65D3B",
    marginTop: 7,
  },

  content: {
    gap: 15,
  },

  card: {
    backgroundColor: "#FFF8ED",
    borderWidth: 1.5,
    borderColor: "#C89B7B",
    borderRadius: 14,
    padding: 20,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6B3E2E",
  },

  cardText: {
    fontSize: 14,
    color: "#A65D3B",
    marginTop: 6,
  },

  logoutButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#A65D3B",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 30,
  },

  logoutText: {
    color: "#FFF8ED",
    fontSize: 16,
    fontWeight: "600",
  },
});