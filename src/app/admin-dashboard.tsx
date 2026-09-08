import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function AdminDashboard() {
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

    if (error || !profile || profile.role !== "admin") {
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
        <Text style={styles.title}>Society Admin Dashboard</Text>
        <Text style={styles.subtitle}>Manage your society</Text>
      </View>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/admin-approvals")}
      >
        <Text style={styles.cardTitle}>Approvals</Text>
        <Text style={styles.cardText}>
          Review pending and active user approvals
        </Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Residents</Text>
          <Text style={styles.cardText}>Manage society residents</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Complaints</Text>
          <Text style={styles.cardText}>View and manage complaints</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Announcements</Text>
          <Text style={styles.cardText}>Create and manage announcements</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Society Management</Text>
          <Text style={styles.cardText}>Manage society information</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Text style={styles.logoutText}>Sign Out</Text>
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
