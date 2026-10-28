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

import { colors } from "../styles/theme";
import { contactStyles as styles } from "../styles/screens/contact";
import BrandMark from "../components/BrandMark";
import BackButton from "../components/BackButton";

export default function Contact() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [society, setSociety] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!name || !email || !society || !message) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    Alert.alert(
      "Request Submitted",
      "Thank you! We will get in touch with you soon.",
      [
        {
          text: "OK",
          onPress: () => router.replace("/signin"),
        },
      ],
    );
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
        <StatusBar style="dark" />

        <BackButton onPress={() => router.back()} style={styles.backButton} />

        <View style={styles.header}>
          <BrandMark />
          <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.subtitle}>Tell us about your society</Text>
        </View>

        <View style={styles.form}>
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

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWithIcon}>
            <SymbolView
              name={{ ios: "envelope", android: "mail", web: "mail" }}
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

          <Text style={styles.label}>Society Name</Text>
          <View style={styles.inputWithIcon}>
            <SymbolView
              name={{ ios: "building.2", android: "business", web: "business" }}
              tintColor={colors.muted}
              size={20}
            />
            <TextInput
              style={styles.iconInput}
              placeholder="Enter your society name"
              placeholderTextColor={colors.placeholder}
              value={society}
              onChangeText={setSociety}
            />
          </View>

          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Tell us about your society"
            placeholderTextColor={colors.placeholder}
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit Request</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
