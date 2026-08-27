import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <Text style={styles.title}>GATED</Text>
        <Text style={styles.subtitle}>Apartment Tracker</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => router.push("/signin")}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E8D3",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingTop: 120,
    paddingBottom: 55,
  },

  brand: {
    alignItems: "center",
  },

  title: {
    fontSize: 58,
    fontWeight: "800",
    letterSpacing: 5,
    color: "#6B3E2E",
  },

  subtitle: {
    fontSize: 18,
    letterSpacing: 1.5,
    color: "#A65D3B",
    marginTop: 8,
  },

  buttons: {
    gap: 14,
  },

  signUpButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#A65D3B",
    justifyContent: "center",
    alignItems: "center",
  },

  signUpText: {
    color: "#FFF8ED",
    fontSize: 17,
    fontWeight: "600",
  },

  signInButton: {
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#6B3E2E",
    justifyContent: "center",
    alignItems: "center",
  },

  signInText: {
    color: "#6B3E2E",
    fontSize: 17,
    fontWeight: "600",
  },
});
