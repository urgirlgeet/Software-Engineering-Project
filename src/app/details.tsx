import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

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
        return "Enter your admin identification";
      case "security":
        return "Enter your employee identification";
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
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
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

        <View style={styles.header}>
          <Text style={styles.title}>{getTitle()}</Text>

          <Text style={styles.subtitle}>{getSubtitle()}</Text>

          <View style={styles.societyBadge}>
            <Text style={styles.societyText}>{society}</Text>
          </View>
        </View>

        <View style={styles.form}>
          {role === "resident" && (
            <>
              <Text style={styles.label}>Apartment Number</Text>

              <TextInput
                style={styles.input}
                placeholder="e.g. A-204"
                placeholderTextColor="#A98F82"
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
                placeholderTextColor="#A98F82"
                value={employeeId}
                onChangeText={setEmployeeId}
                autoCapitalize="characters"
              />
            </>
          )}

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#F3E8D3",
  },

  container: {
    flexGrow: 1,
    backgroundColor: "#F3E8D3",
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingRight: 15,
    marginBottom: 25,
  },

  backText: {
    color: "#6B3E2E",
    fontSize: 18,
    fontWeight: "600",
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#6B3E2E",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    letterSpacing: 0.5,
    color: "#A65D3B",
    marginTop: 7,
    textAlign: "center",
  },

  societyBadge: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#E8D2BB",
  },

  societyText: {
    color: "#6B3E2E",
    fontSize: 14,
    fontWeight: "600",
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B3E2E",
    marginBottom: 7,
    marginTop: 12,
  },

  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: "#C89B7B",
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#FFF8ED",
    color: "#4E3025",
    fontSize: 16,
  },

  continueButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#A65D3B",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  continueText: {
    color: "#FFF8ED",
    fontSize: 17,
    fontWeight: "600",
  },
});
