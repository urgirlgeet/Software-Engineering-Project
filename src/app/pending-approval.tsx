import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import BrandMark from "../components/BrandMark";
import { colors, styles } from "../styles/theme";

export default function PendingApproval() {
  const router = useRouter();

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: "100%", maxWidth: 520, alignSelf: "center" }}>
          <View style={styles.pendingTopBar}>
            <BrandMark size={26} />
            <Text style={styles.pendingBrandText}>GATED</Text>
            <View style={styles.pendingPortalMark}>
              <SymbolView
                name={{
                  ios: "building.2",
                  android: "business",
                  web: "business",
                }}
                tintColor={colors.brown}
                size={18}
              />
              <Text style={styles.pendingPortalText}>Member access</Text>
            </View>
          </View>

          <View style={styles.pendingHeader}>
            <Text style={styles.pendingEyebrow}>SOCIETY ADMINISTRATION</Text>
            <Text style={styles.pendingTitle}>Approval not required</Text>
            <Text style={styles.pendingSubtitle}>
              You can sign in and use your community account right away.
            </Text>
          </View>

          <View style={styles.pendingCard}>
            <View style={styles.pendingStatusIconWrap}>
              <View style={styles.pendingStatusIcon}>
                <SymbolView
                  name={{
                    ios: "person.crop.circle.badge.clock",
                    android: "pending",
                    web: "pending",
                  }}
                  tintColor={colors.brown}
                  size={48}
                />
              </View>
            </View>

            <View style={styles.pendingPill}>
              <Text style={styles.pendingDot}>●</Text>
              <Text style={styles.pendingText}>ACCESS AVAILABLE</Text>
            </View>

            <Text style={styles.pendingRequestTitle}>You’re all set</Text>
            <Text style={styles.pendingDescription}>
              Your account does not need administrator approval. Continue to
              sign in to open your dashboard.
            </Text>

            <View style={styles.pendingNotice}>
              <SymbolView
                name={{
                  ios: "info.circle",
                  android: "info",
                  web: "info",
                }}
                tintColor={colors.brown}
                size={21}
              />
              <Text style={styles.pendingNoticeText}>
                If you just created your account, use the same email and
                password to sign in.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { marginTop: 24 }]}
              onPress={() => router.replace("/signin")}
            >
              <Text style={styles.primaryButtonText}>Continue to sign in</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.pendingFooter}>
            Email confirmation may still be required if it is enabled in
            Supabase Auth.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
