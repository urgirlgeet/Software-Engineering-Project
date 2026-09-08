import { useRouter } from "expo-router";
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

export default function SignUp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join GATED Apartment Tracker</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#A98F82"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor="#A98F82"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#A98F82"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor="#A98F82"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter your password"
            placeholderTextColor="#A98F82"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleNext}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInLink}
            onPress={() => router.push("/signin")}
          >
            <Text style={styles.signInText}>
              Already have an account? <Text style={styles.link}>Sign In</Text>
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
    marginBottom: 25,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#6B3E2E",
  },

  subtitle: {
    fontSize: 15,
    letterSpacing: 0.5,
    color: "#A65D3B",
    marginTop: 7,
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

  button: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#A65D3B",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },

  buttonText: {
    color: "#FFF8ED",
    fontSize: 17,
    fontWeight: "600",
  },

  signInLink: {
    alignItems: "center",
    marginTop: 20,
  },

  signInText: {
    color: "#6B3E2E",
    fontSize: 15,
  },

  link: {
    color: "#A65D3B",
    fontWeight: "700",
  },
});
