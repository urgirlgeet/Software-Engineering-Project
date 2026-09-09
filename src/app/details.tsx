import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { supabase } from "../lib/supabase";
import { colors, styles } from "../styles/theme";

export default function Details() {
  const router = useRouter();

  const { name, phone, email, password, society, role } = useLocalSearchParams<{
    name: string;
    phone: string;
    email: string;
    password: string;
    society: string;
    role: string;
  }>();

  const [apartment, setApartment] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);

  const getDashboard = () => {
    switch (role) {
      case "resident":
        return "/resident-dashboard";
      case "admin":
        return "/admin-dashboard";
      case "security":
        return "/security-dashboard";
      case "maintenance":
        return "/maintenance-dashboard";
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (role) {
      case "resident":
        return "Resident Details";
      case "admin":
        return "Admin Details";
      case "security":
        return "Security Details";
      case "maintenance":
        return "Maintenance Details";
      default:
        return "Additional Details";
    }
  };

  const getSubtitle = () => {
    switch (role) {
      case "resident":
        return "Enter your apartment details";
      case "admin":
      case "security":
      case "maintenance":
        return "Enter your employee identification";
      default:
        return "Complete your profile";
    }
  };

  const handleContinue = async () => {
    if (role === "resident" && !apartment.trim()) {
      Alert.alert("Error", "Please enter your apartment number.");
      return;
    }

    if (
      (role === "admin" || role === "security" || role === "maintenance") &&
      !employeeId.trim()
    ) {
      Alert.alert("Error", "Please enter your employee ID.");
      return;
    }

    const dashboard = getDashboard();

    if (!dashboard) {
      Alert.alert("Error", "Invalid user role.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        Alert.alert("Sign Up Failed", error.message);
        return;
      }

      if (!data.user) {
        Alert.alert("Sign Up Failed", "Unable to create your account.");
        return;
      }

      const { data: societyData, error: societyError } = await supabase
        .from("societies")
        .select("id")
        .eq("name", society)
        .single();

      if (societyError || !societyData) {
        Alert.alert("Error", "Selected society could not be found.");
        return;
      }

      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        auth_user_id: data.user.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        society_id: societyData.id,
        role,
        approval_status: "approved",
        apartment_number: role === "resident" ? apartment.trim() : null,
        employee_id: role !== "resident" ? employeeId.trim() : null,
      });

      if (profileError) {
        Alert.alert("Profile Creation Failed", profileError.message);
        return;
      }

      router.replace(dashboard as any);
    } catch {
      Alert.alert("Error", "Something went wrong while creating your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <View style={styles.authHeader}>
          <View style={styles.logoTile}>
            <Text style={styles.logoText}>G</Text>
          </View>

          <Text style={styles.eyebrow}>GATED LIVING SANCTUARY</Text>

          <Text style={styles.pageTitle}>{getTitle()}</Text>

          <Text style={styles.pageSubtitle}>{getSubtitle()}</Text>
        </View>

        <View style={styles.form}>
          <View
            style={[
              styles.inputWithIcon,
              {
                justifyContent: "center",
                marginBottom: 18,
              },
            ]}
          >
            <Text
              style={{
                color: colors.brown,
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              {society}
            </Text>
          </View>

          {role === "resident" && (
            <>
              <Text style={styles.label}>Apartment Number</Text>

              <TextInput
                style={styles.input}
                placeholder="e.g. A-204"
                placeholderTextColor={colors.placeholder}
                value={apartment}
                onChangeText={setApartment}
                autoCapitalize="characters"
              />
            </>
          )}

          {(role === "admin" ||
            role === "security" ||
            role === "maintenance") && (
            <>
              <Text style={styles.label}>Employee ID</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your employee ID"
                placeholderTextColor={colors.placeholder}
                value={employeeId}
                onChangeText={setEmployeeId}
                autoCapitalize="characters"
              />
            </>
          )}

          <TouchableOpacity
            style={[
              styles.primaryButton,
              styles.formButton,
              loading && styles.disabled,
            ]}
            onPress={handleContinue}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? "Creating Account..." : "Create Account"}
            </Text>

            {!loading && <Text style={styles.arrow}>→</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
