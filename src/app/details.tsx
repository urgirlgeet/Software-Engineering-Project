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
import { supabase } from "../lib/supabase";

export default function Details() {
  const router = useRouter();

  const { society, role } = useLocalSearchParams();

  const [apartment, setApartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);

  const getRoleTitle = () => {
    if (role === "admin") {
      return "Admin Details";
    }

    if (role === "maintenance") {
      return "Staff Details";
    }

    return "Resident Details";
  };

  const getRoleSubtitle = () => {
    if (role === "admin") {
      return "Enter your society admin details";
    }

    if (role === "maintenance") {
      return "Enter your maintenance or security details";
    }

    return "Complete your profile to continue";
  };

  const handleContinue = async () => {
    if (role === "resident" && !apartment) {
      Alert.alert("Error", "Please enter your apartment number.");
      return;
    }

    if (role === "admin" && !designation) {
      Alert.alert("Error", "Please enter your designation.");
      return;
    }

    if (role === "maintenance" && !employeeId) {
      Alert.alert("Error", "Please enter your employee ID.");
      return;
    }

    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert("Error", "User session could not be found.");
        return;
      }

      const { error } = await supabase
        .from("users")
        .update({
          apartment_number: role === "resident" ? apartment.trim() : null,
          role: role,
          society: society,
          designation: role === "admin" ? designation.trim() : null,
          employee_id: role === "maintenance" ? employeeId.trim() : null,
        })
        .eq("id", user.id);

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      if (role === "resident") {
        router.replace("/resident-dashboard");
      } else if (role === "admin") {
        router.replace("/admin-dashboard");
      } else if (role === "maintenance") {
        router.replace("/maintenance-dashboard");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.title}>{getRoleTitle()}</Text>
          <Text style={styles.subtitle}>{getRoleSubtitle()}</Text>

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

          {role === "admin" && (
            <>
              <Text style={styles.label}>Designation</Text>

              <TextInput
                style={styles.input}
                placeholder="e.g. Society President"
                placeholderTextColor="#A98F82"
                value={designation}
                onChangeText={setDesignation}
                autoCapitalize="words"
              />
            </>
          )}

          {role === "maintenance" && (
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
            style={[
              styles.continueButton,
              loading && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={loading}
          >
            <Text style={styles.continueText}>
              {loading ? "Saving..." : "Continue to Dashboard"}
            </Text>
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

  continueButtonDisabled: {
    opacity: 0.6,
  },

  continueText: {
    color: "#FFF8ED",
    fontSize: 17,
    fontWeight: "600",
  },
});
