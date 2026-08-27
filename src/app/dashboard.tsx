import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [apartment, setApartment] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      Alert.alert("Error", "You are not signed in.");
      router.replace("/signin");
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("name, apartment_number")
      .eq("id", user.id)
      .single();

    if (error) {
      Alert.alert("Error", "Could not load your profile.");
      setLoading(false);
      return;
    }

    setName(data.name);
    setApartment(data.apartment_number);
    setLoading(false);
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A65D3B" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.logo}>GATED</Text>
        <Text style={styles.subtitle}>Apartment Tracker</Text>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.welcome}>Welcome{name ? `, ${name}` : ""}!</Text>

        <Text style={styles.description}>
          Manage your apartment, requests, notices and more.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Apartment</Text>

        <Text style={styles.apartment}>{apartment || "Not assigned"}</Text>

        <Text style={styles.resident}>Resident</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Maintenance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Complaints</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Notices</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Payments</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E8D3",
    paddingHorizontal: 28,
    paddingTop: 70,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F3E8D3",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#6B3E2E",
    fontSize: 16,
    marginTop: 12,
  },

  logo: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 4,
    color: "#6B3E2E",
  },

  subtitle: {
    fontSize: 14,
    letterSpacing: 1,
    color: "#A65D3B",
    marginTop: 3,
  },

  welcomeSection: {
    marginTop: 50,
  },

  welcome: {
    fontSize: 30,
    fontWeight: "800",
    color: "#6B3E2E",
  },

  description: {
    fontSize: 15,
    color: "#806457",
    marginTop: 8,
    lineHeight: 22,
  },

  card: {
    backgroundColor: "#FFF8ED",
    borderRadius: 16,
    padding: 22,
    marginTop: 30,
    borderWidth: 1.5,
    borderColor: "#C89B7B",
  },

  cardTitle: {
    fontSize: 14,
    color: "#806457",
  },

  apartment: {
    fontSize: 28,
    fontWeight: "800",
    color: "#6B3E2E",
    marginTop: 5,
  },

  resident: {
    fontSize: 14,
    color: "#A65D3B",
    marginTop: 3,
  },

  actions: {
    marginTop: 25,
    gap: 12,
  },

  actionButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#A65D3B",
    justifyContent: "center",
    alignItems: "center",
  },

  actionText: {
    color: "#FFF8ED",
    fontSize: 16,
    fontWeight: "600",
  },

  logoutButton: {
    marginTop: "auto",
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#6B3E2E",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "#6B3E2E",
    fontSize: 16,
    fontWeight: "600",
  },
});
