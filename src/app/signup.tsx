import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
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
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
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
          <Text style={styles.eyebrow}>GATED LIVING SANCTUARY</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join your gated residential community.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeading}>
            <SymbolView
              name={{ ios: "person", android: "person", web: "person" }}
              tintColor={colors.brown}
              size={22}
            />
            <Text style={styles.sectionTitle}>Resident Particulars</Text>
          </View>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Alexandra Chen"
            placeholderTextColor="#6D5952"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Mobile Contact</Text>
          <View style={styles.inputWithIcon}>
            <SymbolView
              name={{ ios: "phone", android: "phone", web: "phone" }}
              tintColor={colors.muted}
              size={20}
            />
            <TextInput
              style={styles.iconInput}
              placeholder="+1 (555) 382-9014"
              placeholderTextColor="#6D5952"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWithIcon}>
            <SymbolView
              name={{ ios: "envelope", android: "mail", web: "mail" }}
              tintColor={colors.muted}
              size={20}
            />
            <TextInput
              style={styles.iconInput}
              placeholder="alexandra@estate.com"
              placeholderTextColor="#6D5952"
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
            placeholder="••••••••••••••"
            placeholderTextColor={colors.ink}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••••••••"
            placeholderTextColor={colors.ink}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Create Account</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By registering, you agree to the estate bylaws and resident{"\n"}
          charter of your selected community.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const colors = {
  background: "#FFF9F7",
  brown: "#91441F",
  ink: "#24100A",
  muted: "#806D66",
  peach: "#FFF0EB",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 34,
  },

  header: {
    alignItems: "center",
    marginBottom: 28,
  },

  logoTile: {
    alignItems: "center",
    backgroundColor: "#FFE9E2",
    borderRadius: 17,
    height: 63,
    justifyContent: "center",
    marginBottom: 13,
    width: 63,
  },

  eyebrow: {
    color: colors.brown,
    fontFamily: "Georgia",
    fontSize: 12,
    letterSpacing: 1.2,
    marginBottom: 8,
  },

  title: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 26,
    fontWeight: "700",
  },

  subtitle: {
    color: "#4E3D38",
    fontSize: 16,
    marginTop: 9,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 13,
    paddingHorizontal: 18,
    paddingVertical: 20,
    shadowColor: "#6F3D2A",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  sectionHeading: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 9,
  },

  sectionTitle: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 12,
  },

  label: {
    color: colors.ink,
    fontSize: 15,
    marginBottom: 6,
    marginTop: 13,
  },

  input: {
    backgroundColor: colors.peach,
    borderRadius: 10,
    color: colors.ink,
    fontSize: 16,
    height: 41,
    paddingHorizontal: 13,
  },

  inputWithIcon: {
    alignItems: "center",
    backgroundColor: colors.peach,
    borderRadius: 10,
    flexDirection: "row",
    height: 44,
    paddingHorizontal: 13,
  },

  iconInput: {
    color: colors.ink,
    flex: 1,
    fontSize: 16,
    height: 44,
    marginLeft: 10,
  },

  button: {
    alignItems: "center",
    backgroundColor: colors.brown,
    borderRadius: 12,
    flexDirection: "row",
    height: 53,
    justifyContent: "center",
    marginTop: 31,
  },

  buttonText: {
    color: colors.white,
    fontSize: 19,
    fontWeight: "600",
  },

  arrow: {
    color: colors.white,
    fontSize: 25,
    marginLeft: 11,
  },

  terms: {
    color: "#4E3D38",
    fontFamily: "Georgia",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 13,
    textAlign: "center",
  },
});
