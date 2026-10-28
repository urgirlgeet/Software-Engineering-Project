// src/app/signup.tsx

import { useRouter } from "expo-router";
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
import { saveSignupDraft } from "../lib/signupDraft";

export default function SignUp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleNext = () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();

    if (
      !trimmedName ||
      !trimmedPhone ||
      !trimmedEmail ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      Alert.alert("Invalid email", "Enter a valid email address.");
      return;
    }

    const phoneDigits = trimmedPhone.replace(/\D/g, "");
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      Alert.alert("Invalid phone number", "Enter a valid contact number.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }

    saveSignupDraft({
      name: trimmedName,
      phone: trimmedPhone,
      email: trimmedEmail,
      password,
    });
    router.push("/society");
  };

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formHeader}>
          <BrandMark />

          <Text style={styles.eyebrow}>GATED</Text>

          <Text style={styles.pageTitle}>Create Account</Text>

          <Text style={styles.pageSubtitle}>
            Join your gated residential community.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeading}>
            <SymbolView
              name={{
                ios: "person",
                android: "person",
                web: "person",
              }}
              tintColor={colors.brown}
              size={22}
            />

            <Text style={styles.sectionTitle}>Resident Particulars</Text>
          </View>

          <Text style={styles.label}>Full Name</Text>

          <View style={styles.inputWithIcon}>
            <SymbolView
              name={{ ios: "person", android: "person", web: "person" }}
              tintColor={colors.muted}
              size={20}
            />
            <TextInput
              style={styles.iconInput}
              placeholder="Enter your full name"
              placeholderTextColor={colors.placeholder}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <Text style={styles.label}>Mobile Contact</Text>

          <View style={styles.inputWithIcon}>
            <SymbolView
              name={{
                ios: "phone",
                android: "phone",
                web: "phone",
              }}
              tintColor={colors.muted}
              size={20}
            />

            <TextInput
              style={styles.iconInput}
              placeholder="Enter your mobile number"
              placeholderTextColor={colors.placeholder}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.label}>Email Address</Text>

          <View style={styles.inputWithIcon}>
            <SymbolView
              name={{
                ios: "envelope",
                android: "mail",
                web: "mail",
              }}
              tintColor={colors.muted}
              size={20}
            />

            <TextInput
              style={styles.iconInput}
              placeholder="Enter your email"
              placeholderTextColor={colors.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <Text style={styles.label}>Password</Text>

          <View style={styles.inputWithIcon}>
            <SymbolView
              name={{ ios: "lock", android: "lock", web: "lock" }}
              tintColor={colors.muted}
              size={20}
            />
            <TextInput
              style={styles.iconInput}
              placeholder="Enter your password"
              placeholderTextColor={colors.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Text style={styles.label}>Confirm Password</Text>

          <View style={styles.inputWithIcon}>
            <SymbolView
              name={{
                ios: "lock.shield",
                android: "verified_user",
                web: "verified_user",
              }}
              tintColor={colors.muted}
              size={20}
            />
            <TextInput
              style={styles.iconInput}
              placeholder="Confirm your password"
              placeholderTextColor={colors.placeholder}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, styles.formButton]}
          onPress={handleNext}
        >
          <Text style={styles.primaryButtonText}>Create Account</Text>

          <SymbolView
            name={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
            tintColor={colors.white}
            size={20}
          />
        </TouchableOpacity>

        <Text style={styles.terms}>
          By registering, you agree to the estate bylaws and resident charter of
          your selected community.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
