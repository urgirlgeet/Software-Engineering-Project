import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function PendingApproval() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/signin");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Approval Pending</Text>

        <Text style={styles.message}>
          Your GATED account has been created successfully.
        </Text>

        <Text style={styles.message}>
          Your account is currently waiting for approval from your Society
          Admin.
        </Text>

        <Text style={styles.note}>
          You will be able to access your dashboard once your account is
          approved.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E8D3",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  card: {
    backgroundColor: "#FFF8ED",
    borderWidth: 1.5,
    borderColor: "#C89B7B",
    borderRadius: 18,
    padding: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#6B3E2E",
    marginBottom: 18,
  },

  message: {
    fontSize: 16,
    lineHeight: 24,
    color: "#6B3E2E",
    marginBottom: 12,
  },

  note: {
    fontSize: 14,
    lineHeight: 21,
    color: "#A65D3B",
    marginTop: 5,
  },

  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#A65D3B",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  buttonText: {
    color: "#FFF8ED",
    fontSize: 16,
    fontWeight: "600",
  },
});
