import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
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
        .select("id, role")
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
      <StatusBar style="dark" />

      <View style={styles.authContainer}>
        <View style={styles.authContent}>
          <View style={styles.authHeader}>
            <Text style={styles.authBrand}>APARTMENT TRACKER</Text>
            <Text style={[styles.pageTitle, styles.authTitle]}>
              Welcome back
            </Text>
            <Text style={[styles.pageSubtitle, styles.authSubtitle]}>
              Sign in to manage your society services.
            </Text>
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
                New resident?{" "}
                <Text style={styles.link}>Create an account</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
