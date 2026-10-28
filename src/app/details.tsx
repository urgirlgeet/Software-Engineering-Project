import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
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
import BrandMark from "../components/BrandMark";
import BackButton from "../components/BackButton";

export default function Details() {
  const router = useRouter();

  const { society, societyId, role } = useLocalSearchParams<{
    society: string;
    societyId: string;
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
        society,
        societyId,
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
        <StatusBar style="dark" />

        <BackButton onPress={() => router.back()} style={styles.backButton} />

        <View style={styles.authHeader}>
          <BrandMark />

          <Text style={styles.eyebrow}>GATED LIVING SANCTUARY</Text>

          <Text style={styles.pageTitle}>{getTitle()}</Text>

          <Text style={styles.pageSubtitle}>{getSubtitle()}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.societySummary}>
            <View style={styles.sectionHeading}>
              <SymbolView
                name={{ ios: "building.2", android: "business", web: "business" }}
                tintColor={colors.brown}
                size={20}
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.societySummaryLabel}>Selected community</Text>
                <Text style={styles.societySummaryName}>{society}</Text>
              </View>
            </View>
          </View>

          {role === "resident" && (
            <>
              <Text style={styles.label}>Apartment</Text>

              <View style={styles.inputWithIcon}>
                <SymbolView
                  name={{ ios: "door.left.hand.open", android: "door_front", web: "door_front" }}
                  tintColor={colors.muted}
                  size={20}
                />
                <TextInput
                  style={styles.iconInput}
                  placeholder="e.g. A-101"
                  placeholderTextColor={colors.placeholder}
                  value={apartment}
                  onChangeText={setApartment}
                  autoCapitalize="characters"
                />
              </View>
            </>
          )}

          {(role === "admin" ||
            role === "security" ||
            role === "maintenance") && (
            <>
              <Text style={styles.label}>Employee ID</Text>

              <View style={styles.inputWithIcon}>
                <SymbolView
                  name={{ ios: "person.text.rectangle", android: "badge", web: "badge" }}
                  tintColor={colors.muted}
                  size={20}
                />
                <TextInput
                  style={styles.iconInput}
                  placeholder="Enter your employee ID"
                  placeholderTextColor={colors.placeholder}
                  value={employeeId}
                  onChangeText={setEmployeeId}
                  autoCapitalize="characters"
                />
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, styles.formButton]}
            onPress={handleContinue}
          >
            <Text style={styles.primaryButtonText}>Create Account</Text>
            <SymbolView
              name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
              tintColor={colors.white}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
