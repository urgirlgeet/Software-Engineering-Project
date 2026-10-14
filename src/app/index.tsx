// src/app/index.tsx

import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { colors, styles } from "../styles/theme";

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
          name={{
            ios:
              icon === "person_key"
                ? "person.badge.key"
                : icon === "home"
                  ? "house"
                  : "checkmark.shield",
          }}
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
                name={{
                  ios: "door.left.hand.open",
                  android: "door_open",
                  web: "door_open",
                }}
                tintColor="#FBE5D6"
                size={72}
              />
            </View>
          </View>

          <Text style={styles.eyebrow}>RESIDENTIAL SANCTUARY</Text>

          <Text style={styles.title}>GATED</Text>

          <Text style={styles.subtitle}>
            Refined community living and estate{"\n"}
            management for modern residential societies.
          </Text>
        </View>

        <View style={styles.features}>
          <FeatureCard
            icon="verified_user"
            title="Concierge"
            detail="Intake & Gate"
          />

          <FeatureCard
            icon="person_key"
            title="Passcodes"
            detail="Private Access"
          />

          <FeatureCard
            icon="home"
            title="Estates"
            detail={"Verified\nEnclave"}
          />
        </View>

        <View style={styles.networkCard}>
          <View style={styles.networkIcon}>
            <SymbolView
              name={{
                ios: "person.crop.circle.badge.checkmark",
                android: "shield_person",
                web: "shield_person",
              }}
              tintColor={colors.brown}
              size={30}
            />
          </View>

          <View style={styles.networkCopy}>
            <Text style={styles.networkTitle}>Society Network</Text>

            <Text style={styles.networkDetail}>
              Continuous estate surveillance
            </Text>
          </View>

          <View style={styles.activePill}>
            <Text style={styles.activeText}>ACTIVE</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
            onPress={() => router.push("/signin")}
          >
            <Text style={styles.primaryButtonText}>Sign In</Text>

            <Text style={styles.arrow}>→</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.pressed,
            ]}
            onPress={() => router.push("/signup")}
          >
            <Text style={styles.secondaryButtonText}>
              Request Society Access
            </Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <View style={styles.trustLine}>
            <SymbolView
              name={{
                ios: "checkmark.square",
                android: "check_box",
                web: "check_box",
              }}
              tintColor={colors.brown}
              size={21}
            />

            <Text style={styles.trustText}>
              Securing over 450+ residential communities
            </Text>
          </View>

          <Text style={styles.terms}>
            By continuing, you acknowledge our Private Community Charter{"\n"}&
            Terms.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
