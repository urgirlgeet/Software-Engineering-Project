import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function CompleteSignup() {
  const router = useRouter();

  const { name, phone, email, password, society, role, apartment, employeeId } =
    useLocalSearchParams<{
      name: string;
      phone: string;
      email: string;
      password: string;
      society: string;
      role: string;
      apartment: string;
      employeeId: string;
    }>();

  const [error, setError] = useState("");

  useEffect(() => {
    createAccount();
  }, []);

  const createAccount = async () => {
    try {
      // 1. Create authentication account
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!data.user) {
        setError("Account could not be created.");
        return;
      }

      // 2. Find society ID
      const { data: societyData, error: societyError } = await supabase
        .from("societies")
        .select("id")
        .eq("name", society)
        .single();

      if (societyError || !societyData) {
        setError("Selected society could not be found.");
        return;
      }

      let apartmentId: string | null = null;

      if (role === "resident") {
        const { data: apartmentData, error: apartmentError } = await supabase
          .from("apartments")
          .select("id")
          .eq("society_id", societyData.id)
          .eq("flat_number", apartment.trim())
          .single();

        if (apartmentError || !apartmentData) {
          setError("Selected apartment could not be found in this society.");
          return;
        }

        apartmentId = apartmentData.id;
      }

      // 3. Create user profile using the existing users/apartments relationship.
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        auth_user_id: data.user.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        society_id: societyData.id,
        role: role,
        apartment_id: apartmentId,
      });

      if (profileError) {
        setError(profileError.message);
        return;
      }

      if (role === "admin") {
        const { error: requestError } = await supabase
          .from("society_admin_requests")
          .insert({
            user_id: data.user.id,
            society_id: societyData.id,
            status: "pending",
            requested_at: new Date().toISOString(),
          });

        if (requestError) {
          setError(requestError.message);
          return;
        }

        router.replace("/pending-approval");
      } else if (role === "resident") {
        router.replace("/resident-dashboard");
      } else if (role === "maintenance") {
        router.replace("/maintenance-dashboard");
      } else if (role === "security") {
        router.replace("/security-dashboard");
      } else {
        setError("Invalid user role.");
      }
    } catch (error) {
      setError("Something went wrong while creating your account.");
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up Failed</Text>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#A65D3B" />

      <Text style={styles.title}>Creating Your Account</Text>

      <Text style={styles.subtitle}>
        Please wait while we set up your GATED account.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E8D3",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#6B3E2E",
    marginTop: 25,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#A65D3B",
    marginTop: 10,
    textAlign: "center",
  },

  error: {
    fontSize: 15,
    color: "#8B0000",
    marginTop: 15,
    textAlign: "center",
  },
});
