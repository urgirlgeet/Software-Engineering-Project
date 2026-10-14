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

export default function SignUp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleNext = () => {
    if (!name || !phone || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
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

    router.push({
      pathname: "/society",
      params: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password,
      },
    });
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
          <View style={styles.logoTile}>
            <SymbolView
              name={{
                ios: "door.left.hand.open",
                android: "door_open",
                web: "door_open",
              }}
              tintColor={colors.brown}
              size={32}
            />
          </View>

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

          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor={colors.placeholder}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

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

          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={colors.ink}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Confirm Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor={colors.ink}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, styles.formButton]}
          onPress={handleNext}
        >
          <Text style={styles.primaryButtonText}>Create Account</Text>

          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By registering, you agree to the estate bylaws and resident charter of
          your selected community.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
