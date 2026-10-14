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

  const handleContinue = () => {
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

    if (!role) {
      Alert.alert("Error", "Invalid user role.");
      return;
    }

    router.push({
      pathname: "/complete-signup",
      params: {
        name,
        phone,
        email,
        password,
        society,
        role,
        apartment: role === "resident" ? apartment.trim() : "",
        employeeId: role !== "resident" ? employeeId.trim() : "",
      },
    });
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
            style={[styles.primaryButton, styles.formButton]}
            onPress={handleContinue}
          >
            <Text style={styles.primaryButtonText}>Create Account</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
