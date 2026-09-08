import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
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

  const { name, phone, email, password } = useLocalSearchParams<{
    name: string;
    phone: string;
    email: string;
    password: string;
  }>();

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
        name: name,
        phone: phone,
        email: email,
        password: password,
        society: selectedSociety,
      },
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />

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
        <Text style={styles.eyebrow}>GATED LIVING</Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Select your residence, gate pass, and{"\n"}society services.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <SymbolView
            name={{ ios: "building.2", android: "business", web: "business" }}
            tintColor={colors.brown}
            size={22}
          />
          <Text style={styles.sectionTitle}>Residential Society</Text>
          <Text style={styles.residentialId}>Residential ID</Text>
        </View>

        <Text style={styles.label}>Community Registry</Text>

        {societies.map((society) => (
          <TouchableOpacity
            key={society}
            style={[
              styles.societyOption,
              selectedSociety === society && styles.selectedOption,
            ]}
            onPress={() => setSelectedSociety(society)}
          >
            <SymbolView
              name={{ ios: "building.2", android: "business", web: "business" }}
              tintColor={
                selectedSociety === society ? colors.brown : colors.muted
              }
              size={20}
            />
            <Text
              style={[
                styles.societyText,
                selectedSociety === society && styles.selectedText,
              ]}
            >
              {society}
            </Text>

            {selectedSociety === society && (
              <Text style={styles.checkmark}>●</Text>
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
          <SymbolView
            name={{
              ios: "questionmark.circle",
              android: "help_outline",
              web: "help_outline",
            }}
            tintColor={colors.muted}
            size={20}
          />
          <Text
            style={[
              styles.societyText,
              selectedSociety === "not-listed" && styles.selectedText,
            ]}
          >
            My society isn't listed
          </Text>

          {selectedSociety === "not-listed" && (
            <Text style={styles.checkmark}>●</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Continue</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.helperText}>
        Encrypted Residential Network • Gate Node 04
      </Text>
    </ScrollView>
  );
}

const colors = {
  background: "#FFF9F7",
  brown: "#91441F",
  ink: "#24100A",
  muted: "#806D66",
  peach: "#FFF0EB",
  selected: "#FFE4DB",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 29,
    paddingTop: 43,
    paddingBottom: 38,
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  logoTile: {
    alignItems: "center",
    backgroundColor: "#FFE9E2",
    borderRadius: 18,
    height: 102,
    justifyContent: "center",
    marginBottom: 29,
    width: 102,
  },

  eyebrow: {
    color: colors.brown,
    fontFamily: "Georgia",
    fontSize: 20,
    letterSpacing: 1.6,
    marginBottom: 19,
  },

  title: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 48,
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    color: "#4E3D38",
    fontSize: 23,
    lineHeight: 36,
    marginTop: 21,
    textAlign: "center",
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 23,
    paddingHorizontal: 36,
    paddingVertical: 31,
    shadowColor: "#6F3D2A",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 13,
  },

  sectionTitle: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 12,
  },

  residentialId: {
    color: colors.brown,
    fontSize: 16,
    marginLeft: "auto",
  },

  label: {
    color: colors.ink,
    fontSize: 16,
    marginBottom: 10,
    marginTop: 11,
  },

  societyOption: {
    alignItems: "center",
    backgroundColor: colors.peach,
    borderRadius: 11,
    flexDirection: "row",
    minHeight: 57,
    marginBottom: 11,
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },

  selectedOption: {
    backgroundColor: colors.selected,
  },

  societyText: {
    color: colors.ink,
    flex: 1,
    fontSize: 17,
    marginLeft: 10,
  },

  selectedText: {
    color: colors.brown,
    fontWeight: "600",
  },

  checkmark: {
    color: colors.brown,
    fontSize: 15,
    fontWeight: "600",
  },

  continueButton: {
    alignItems: "center",
    backgroundColor: colors.brown,
    borderRadius: 13,
    flexDirection: "row",
    height: 72,
    justifyContent: "center",
    marginTop: 28,
  },

  continueText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "600",
  },

  arrow: {
    color: colors.white,
    fontSize: 31,
    marginLeft: 11,
  },

  helperText: {
    color: colors.muted,
    fontFamily: "Georgia",
    fontSize: 14,
    lineHeight: 17,
    marginTop: 13,
    textAlign: "center",
  },
});
