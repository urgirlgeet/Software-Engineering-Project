import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { supabase } from "../lib/supabase";
import { colors, styles } from "../styles/theme";

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const getDashboard = (role: string) => {
    switch (role) {
      case "resident":
        return "/resident-dashboard";

      case "admin":
        return "/admin-dashboard";

      case "maintenance":
        return "/maintenance-dashboard";

      case "security":
        return "/security-dashboard";

      default:
        return null;
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        Alert.alert("Sign In Failed", error.message);
        return;
      }

      if (!data.user) {
        Alert.alert("Error", "Unable to sign in.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("auth_user_id", data.user.id)
        .single();

      if (profileError || !profile) {
        Alert.alert("Error", "User profile not found.");
        return;
      }

      const dashboard = getDashboard(profile.role);

      if (!dashboard) {
        Alert.alert("Error", "Invalid user role.");
        return;
      }

      router.replace(dashboard as any);
    } catch {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.authContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <View style={styles.authContent}>
          <View style={styles.authHeader}>
            <View style={styles.logoTile}>
              <Text style={styles.logoText}>G</Text>
            </View>

            <Text style={styles.pageTitle}>Welcome Back</Text>

            <Text style={styles.pageSubtitle}>Sign in to GATED</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={colors.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[
                styles.primaryButton,
                styles.formButton,
                loading && styles.disabled,
              ]}
              onPress={handleSignIn}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signUpLink}
              activeOpacity={0.7}
              onPress={() => router.push("/signup")}
            >
              <Text style={styles.signUpText}>
                Don't have an account? <Text style={styles.link}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
