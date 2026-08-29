import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const societies = [
  "Omaxe Royal Residency",
  "Palm Heights",
  "Sunrise Apartments",
  "Maple Residency",
  "Centra Greens",
  "Golflink Society",
];

export default function Society() {
  const router = useRouter();

  const [selectedSociety, setSelectedSociety] = useState("");

  const handleContinue = () => {
    if (!selectedSociety) {
      Alert.alert("Select Society", "Please choose your society.");
      return;
    }

    if (selectedSociety === "not-listed") {
      router.push("/contact");
      return;
    }

    router.push({
      pathname: "/role",
      params: {
        society: selectedSociety,
      },
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Society</Text>
        <Text style={styles.subtitle}>
          Select the society you are a part of
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Society</Text>

        {societies.map((society) => (
          <TouchableOpacity
            key={society}
            style={[
              styles.societyOption,
              selectedSociety === society && styles.selectedOption,
            ]}
            onPress={() => setSelectedSociety(society)}
          >
            <Text
              style={[
                styles.societyText,
                selectedSociety === society && styles.selectedText,
              ]}
            >
              {society}
            </Text>

            {selectedSociety === society && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[
            styles.societyOption,
            selectedSociety === "not-listed" && styles.selectedOption,
          ]}
          onPress={() => setSelectedSociety("not-listed")}
        >
          <Text
            style={[
              styles.societyText,
              selectedSociety === "not-listed" && styles.selectedText,
            ]}
          >
            My society isn't listed
          </Text>

          {selectedSociety === "not-listed" && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 30,
  },

  backText: {
    color: "#6B3E2E",
    fontSize: 18,
    fontWeight: "600",
  },

  header: {
    alignItems: "center",
    marginBottom: 35,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#6B3E2E",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    letterSpacing: 0.5,
    color: "#A65D3B",
    marginTop: 8,
    textAlign: "center",
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B3E2E",
    marginBottom: 12,
  },

  societyOption: {
    minHeight: 56,
    borderWidth: 1.5,
    borderColor: "#C89B7B",
    borderRadius: 12,
    backgroundColor: "#FFF8ED",
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedOption: {
    borderColor: "#A65D3B",
    backgroundColor: "#F8E4D3",
  },

  societyText: {
    color: "#4E3025",
    fontSize: 16,
    fontWeight: "500",
  },

  selectedText: {
    color: "#6B3E2E",
    fontWeight: "700",
  },

  checkmark: {
    color: "#A65D3B",
    fontSize: 20,
    fontWeight: "700",
  },

  continueButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#A65D3B",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  continueText: {
    color: "#FFF8ED",
    fontSize: 17,
    fontWeight: "600",
  },
});
