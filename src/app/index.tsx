import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const colors = {
  background: "#FFF9F7",
  ink: "#1F0D08",
  brown: "#7E4022",
  copper: "#AE6039",
  softCopper: "#FFDCD0",
  muted: "#6D5B55",
  white: "#FFFFFF",
};

type FeatureCardProps = {
  icon: "verified_user" | "person_key" | "home";
  title: string;
  detail: string;
};

function FeatureCard({ icon, title, detail }: FeatureCardProps) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureIcon}>
        <SymbolView
          name={{ ios: icon === "person_key" ? "person.badge.key" : icon === "home" ? "house" : "checkmark.shield", android: icon, web: icon }}
          tintColor={colors.brown}
          size={28}
        />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDetail}>{detail}</Text>
    </View>
  );
}

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.logoHalo}>
            <View style={styles.logoTile}>
              <SymbolView
                name={{ ios: "door.left.hand.open", android: "door_open", web: "door_open" }}
                tintColor="#FBE5D6"
                size={72}
              />
            </View>
          </View>
          <Text style={styles.eyebrow}>RESIDENTIAL SANCTUARY</Text>
          <Text style={styles.title}>GATED</Text>
          <Text style={styles.subtitle}>
            Refined community living and estate{"\n"}management for modern residential societies.
          </Text>
        </View>

        <View style={styles.features}>
          <FeatureCard icon="verified_user" title="Concierge" detail="Intake & Gate" />
          <FeatureCard icon="person_key" title="Passcodes" detail="Private Access" />
          <FeatureCard icon="home" title="Estates" detail={"Verified\nEnclave"} />
        </View>

        <View style={styles.networkCard}>
          <View style={styles.networkIcon}>
            <SymbolView
              name={{ ios: "person.crop.circle.badge.checkmark", android: "shield_person", web: "shield_person" }}
              tintColor={colors.brown}
              size={30}
            />
          </View>
          <View style={styles.networkCopy}>
            <Text style={styles.networkTitle}>Society Network</Text>
            <Text style={styles.networkDetail}>Continuous estate surveillance</Text>
          </View>
          <View style={styles.activePill}>
            <Text style={styles.activeText}>ACTIVE</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sign in"
            style={({ pressed }) => [styles.signInButton, pressed && styles.pressed]}
            onPress={() => router.push("/signin")}
          >
            <Text style={styles.signInText}>Sign In</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Request society access"
            style={({ pressed }) => [styles.signUpButton, pressed && styles.pressed]}
            onPress={() => router.push("/signup")}
          >
            <Text style={styles.signUpText}>Request Society Access</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <View style={styles.trustLine}>
            <SymbolView
              name={{ ios: "checkmark.square", android: "check_box", web: "check_box" }}
              tintColor={colors.brown}
              size={21}
            />
            <Text style={styles.trustText}>Securing over 450+ residential communities</Text>
          </View>
          <Text style={styles.terms}>
            By continuing, you acknowledge our Private Community Charter{"\n"}& Terms.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    alignItems: "stretch",
    paddingHorizontal: 29,
    paddingTop: 22,
    paddingBottom: 34,
  },

  hero: {
    alignItems: "center",
  },

  logoHalo: {
    alignItems: "center",
    justifyContent: "center",
    width: 232,
    height: 232,
    borderRadius: 116,
    backgroundColor: "#FFEAE3",
    borderWidth: 14,
    borderColor: "#FFF0EB",
    marginBottom: 41,
  },

  logoTile: {
    alignItems: "center",
    justifyContent: "center",
    width: 145,
    height: 145,
    borderRadius: 38,
    backgroundColor: "#8E6251",
  },

  eyebrow: {
    color: colors.brown,
    fontSize: 20,
    fontWeight: "500",
    letterSpacing: 2,
    marginBottom: 27,
  },

  title: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 47,
    fontWeight: "700",
    letterSpacing: 0,
  },

  subtitle: {
    color: "#4E3D38",
    fontSize: 24,
    lineHeight: 40,
    marginTop: 26,
    textAlign: "center",
  },

  features: {
    flexDirection: "row",
    gap: 14,
    marginTop: 61,
  },

  featureCard: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 21,
    flex: 1,
    minHeight: 189,
    paddingHorizontal: 8,
    paddingTop: 22,
    shadowColor: "#6F3D2A",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  featureIcon: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFE1D7",
    borderRadius: 28,
    height: 57,
    marginBottom: 11,
    width: 57,
  },

  featureTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },

  featureDetail: {
    color: "#5B4943",
    fontSize: 19,
    lineHeight: 27,
    textAlign: "center",
  },

  networkCard: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 21,
    flexDirection: "row",
    marginTop: 36,
    minHeight: 130,
    paddingHorizontal: 29,
    shadowColor: "#6F3D2A",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  networkIcon: {
    alignItems: "center",
    backgroundColor: "#FFE1D7",
    borderRadius: 35,
    height: 70,
    justifyContent: "center",
    width: 70,
  },

  networkCopy: {
    flex: 1,
    marginLeft: 23,
  },

  networkTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "600",
  },

  networkDetail: {
    color: "#5B4943",
    fontSize: 18,
    marginTop: 2,
  },

  activePill: {
    backgroundColor: colors.softCopper,
    borderRadius: 22,
    paddingHorizontal: 17,
    paddingVertical: 8,
  },

  activeText: {
    color: colors.brown,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1.5,
  },

  actions: {
    gap: 21,
    marginTop: 43,
  },

  signInButton: {
    alignItems: "center",
    backgroundColor: colors.copper,
    borderRadius: 25,
    flexDirection: "row",
    height: 102,
    justifyContent: "center",
    shadowColor: "#713A24",
    shadowOpacity: 0.28,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  signInText: {
    color: colors.white,
    fontSize: 31,
    fontWeight: "500",
  },

  arrow: {
    color: colors.white,
    fontSize: 43,
    fontWeight: "300",
    marginLeft: 18,
    marginTop: -4,
  },

  signUpButton: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 25,
    height: 102,
    justifyContent: "center",
    shadowColor: "#6F3D2A",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  signUpText: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "600",
  },

  pressed: {
    opacity: 0.82,
  },

  footer: {
    alignItems: "center",
    marginTop: 59,
  },

  trustLine: {
    alignItems: "center",
    flexDirection: "row",
  },

  trustText: {
    color: colors.brown,
    fontSize: 20,
    marginLeft: 8,
  },

  terms: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 25,
    marginTop: 25,
    textAlign: "center",
  },
});
    justifyContent: "center",
    alignItems: "center",
  },

  signInText: {
    color: "#6B3E2E",
    fontSize: 17,
    fontWeight: "600",
  },
});
