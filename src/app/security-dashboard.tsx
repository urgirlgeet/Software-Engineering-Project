import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function SecurityDashboard() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.replace("/signin");
      return;
    }

    const { data: profile, error } = await supabase
      .from("users")
      .select("role")
      .eq("auth_user_id", data.user.id)
      .single();

    if (error || !profile || profile.role !== "security") {
      Alert.alert("Access Denied", "You do not have access to this dashboard.");
      router.replace("/signin");
      return;
    }

    setChecking(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/signin");
  };

  if (checking) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>GATED</Text>
        <Text style={styles.subtitle}>Security Dashboard</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Visitor Requests</Text>
          <Text style={styles.cardText}>
            View and manage visitor entry requests.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Deliveries</Text>
          <Text style={styles.cardText}>Manage incoming delivery entries.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Gate Activity</Text>
          <Text style={styles.cardText}>
            View recent entry and exit activity.
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F3E8D3",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#6B3E2E",
    fontSize: 17,
    fontWeight: "600",
  },

  container: {
    flex: 1,
    backgroundColor: "#F3E8D3",
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#6B3E2E",
  },

  subtitle: {
    fontSize: 18,
    color: "#A65D3B",
    marginTop: 6,
    fontWeight: "600",
  },

  content: {
    flex: 1,
    gap: 16,
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
    marginBottom: 6,
  },

  cardText: {
    fontSize: 14,
    color: "#7A5545",
  },

  signOutButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#A65D3B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  signOutText: {
    color: "#FFF8ED",
    fontSize: 16,
    fontWeight: "600",
  },
});
