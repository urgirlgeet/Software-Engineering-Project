import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
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
  brown: "#91441F",
  ink: "#24100A",
  muted: "#685650",
  peach: "#FFF0EB",
  peachStrong: "#FFE0D5",
  white: "#FFFFFF",
};

export default function PendingApproval() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View style={styles.brandMark}>
            <SymbolView
              name={{ ios: "building.2", android: "business", web: "business" }}
              tintColor={colors.brown}
              size={22}
            />
          </View>
          <Text style={styles.brandText}>GATED RESIDENCE</Text>
          <View style={styles.portalMark}>
            <SymbolView
              name={{
                ios: "checkmark.shield",
                android: "verified_user",
                web: "verified_user",
              }}
              tintColor={colors.ink}
              size={20}
            />
            <Text style={styles.portalText}>Admin Portal</Text>
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>CREDENTIALS INTAKE</Text>
          <Text style={styles.title}>Admin Verification</Text>
          <Text style={styles.subtitle}>
            Society trustee review in progress
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.statusIconWrap}>
            <View style={styles.statusIcon}>
              <SymbolView
                name={{ ios: "building.2", android: "domain", web: "domain" }}
                tintColor={colors.brown}
                size={43}
              />
              <View style={styles.badgeIcon}>
                <SymbolView
                  name={{
                    ios: "checkmark.shield",
                    android: "verified_user",
                    web: "verified_user",
                  }}
                  tintColor={colors.brown}
                  size={18}
                />
              </View>
            </View>
          </View>

          <View style={styles.pendingPill}>
            <Text style={styles.pendingDot}>●</Text>
            <Text style={styles.pendingText}>PENDING REVIEW</Text>
          </View>

          <Text style={styles.requestTitle}>Request Submitted</Text>
          <Text style={styles.description}>
            Your request for Society Administrator{"\n"}privileges has been
            submitted to the community{"\n"}oversight board. Access will be
            granted upon{"\n"}trustee confirmation.
          </Text>

          <View style={styles.pipeline}>
            <View style={styles.pipelineHeader}>
              <Text style={styles.pipelineTitle}>Review Pipeline</Text>
              <Text style={styles.stage}>Stage 1 of 3</Text>
            </View>
            <View style={styles.stepsLine}>
              <View style={[styles.stepLine, styles.activeLine]} />
              <View style={styles.stepLine} />
            </View>
            <View style={styles.steps}>
              <PipelineStep active icon="clock" label="Pending" />
              <PipelineStep icon="checkmark" label="Approved" />
              <PipelineStep icon="xmark" label="Resolved" />
            </View>
          </View>

          <View style={styles.recordBox}>
            <View style={styles.recordHeader}>
              <SymbolView
                name={{
                  ios: "person.badge.key",
                  android: "badge",
                  web: "badge",
                }}
                tintColor={colors.brown}
                size={19}
              />
              <Text style={styles.recordText}>RECORD REF:{"\n"}SAR-88204</Text>
              <Text style={styles.recordCode}>society_admin_requests</Text>
            </View>
            <RecordRow
              icon="person"
              label="Requester Name"
              value="Marcus Vance"
            />
            <RecordRow
              icon="building.2"
              label="Society"
              value="The Belclaire Residences, New York"
            />
            <RecordRow
              icon="calendar"
              label="Requested At"
              value="Oct 24, 2024 · 10:15 AM"
            />
            <RecordRow
              icon="slider.horizontal.3"
              label="Request Status"
              value="Pending"
              pending
            />
          </View>

          <View style={styles.notice}>
            <SymbolView
              name={{ ios: "info.circle", android: "info", web: "info" }}
              tintColor={colors.brown}
              size={23}
            />
            <Text style={styles.noticeText}>
              Trustees receive weekly authorization batches. Typically,
              verification completes within 24–48 business hours.
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.replace("/signin")}
        >
          <Text style={styles.primaryText}>↻</Text>
          <Text style={styles.primaryText}>Check Request Status</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.replace("/signin")}
        >
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.secondaryText}>Back to Sign In</Text>
        </Pressable>

        <Text style={styles.footer}>
          Need urgent access for property onboarding?{"\n"}
          <Text style={styles.footerLink}>Contact Trustee Council ↗</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function PipelineStep({
  active,
  icon,
  label,
}: {
  active?: boolean;
  icon: "clock" | "checkmark" | "xmark";
  label: string;
}) {
  return (
    <View style={styles.step}>
      <View style={[styles.stepIcon, active && styles.activeStepIcon]}>
        <SymbolView
          name={{
            ios:
              icon === "clock"
                ? "clock"
                : icon === "checkmark"
                  ? "checkmark"
                  : "xmark",
            android:
              icon === "clock"
                ? "schedule"
                : icon === "checkmark"
                  ? "check"
                  : "close",
            web:
              icon === "clock"
                ? "schedule"
                : icon === "checkmark"
                  ? "check"
                  : "close",
          }}
          tintColor={active ? colors.white : colors.muted}
          size={15}
        />
      </View>
      <Text style={[styles.stepLabel, active && styles.activeStepLabel]}>
        {label}
      </Text>
    </View>
  );
}

function RecordRow({
  icon,
  label,
  value,
  pending,
}: {
  icon: string;
  label: string;
  value: string;
  pending?: boolean;
}) {
  return (
    <View style={styles.recordRow}>
      <View style={styles.recordLabel}>
        <SymbolView
          name={{
            ios: icon as any,
            android: icon === "building.2" ? "business" : icon,
            web: icon === "building.2" ? "business" : icon,
          }}
          tintColor={colors.brown}
          size={17}
        />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      {pending ? (
        <View style={styles.rowPending}>
          <Text style={styles.rowPendingText}>⊙ Pending</Text>
        </View>
      ) : (
        <Text style={styles.rowValue}>{value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 22, paddingTop: 22, paddingBottom: 34 },
  topBar: { alignItems: "center", flexDirection: "row", marginBottom: 48 },
  brandMark: {
    alignItems: "center",
    backgroundColor: colors.peachStrong,
    borderRadius: 24,
    height: 45,
    justifyContent: "center",
    width: 45,
  },
  brandText: {
    color: colors.ink,
    fontSize: 18,
    letterSpacing: 1,
    marginLeft: 10,
  },
  portalMark: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: "auto",
  },
  portalText: { color: colors.ink, fontSize: 17, marginLeft: 7 },
  header: { alignItems: "center", marginBottom: 29 },
  eyebrow: {
    color: colors.brown,
    fontSize: 16,
    letterSpacing: 1.6,
    marginBottom: 15,
  },
  title: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 36,
    fontWeight: "700",
  },
  subtitle: { color: colors.muted, fontSize: 19, marginTop: 10 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingHorizontal: 27,
    paddingTop: 28,
    paddingBottom: 27,
    shadowColor: colors.brown,
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statusIconWrap: { alignItems: "center" },
  statusIcon: {
    alignItems: "center",
    backgroundColor: colors.peach,
    borderRadius: 50,
    height: 100,
    justifyContent: "center",
    width: 100,
  },
  badgeIcon: {
    alignItems: "center",
    backgroundColor: "#FF9D73",
    borderRadius: 18,
    bottom: -7,
    height: 36,
    justifyContent: "center",
    position: "absolute",
    right: -9,
    width: 36,
  },
  pendingPill: {
    alignSelf: "center",
    backgroundColor: colors.peachStrong,
    borderRadius: 18,
    flexDirection: "row",
    marginTop: 28,
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  pendingDot: { color: colors.brown, fontSize: 13, marginRight: 6 },
  pendingText: { color: colors.brown, fontSize: 14, letterSpacing: 0.8 },
  requestTitle: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 23,
    textAlign: "center",
  },
  description: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 31,
    marginTop: 13,
    textAlign: "center",
  },
  pipeline: {
    backgroundColor: colors.peach,
    borderRadius: 12,
    marginTop: 27,
    padding: 20,
  },
  pipelineHeader: { flexDirection: "row", justifyContent: "space-between" },
  pipelineTitle: { color: colors.ink, fontSize: 16 },
  stage: { color: colors.brown, fontSize: 16, fontWeight: "600" },
  stepsLine: {
    flexDirection: "row",
    height: 3,
    left: 32,
    position: "absolute",
    right: 32,
    top: 82,
  },
  stepLine: { backgroundColor: "#D8B8AC", flex: 1 },
  activeLine: { backgroundColor: colors.brown },
  steps: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 21,
  },
  step: { alignItems: "center", width: "30%" },
  stepIcon: {
    alignItems: "center",
    backgroundColor: colors.peachStrong,
    borderRadius: 20,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  activeStepIcon: { backgroundColor: colors.brown },
  stepLabel: { color: colors.ink, fontSize: 14, marginTop: 9 },
  activeStepLabel: { color: colors.brown, fontWeight: "600" },
  recordBox: {
    backgroundColor: colors.peach,
    borderRadius: 12,
    marginTop: 27,
    padding: 17,
  },
  recordHeader: {
    alignItems: "center",
    backgroundColor: colors.peachStrong,
    borderRadius: 6,
    flexDirection: "row",
    padding: 11,
  },
  recordText: {
    color: colors.ink,
    fontSize: 14,
    letterSpacing: 0.6,
    marginLeft: 9,
  },
  recordCode: { color: colors.brown, flex: 1, fontSize: 14, marginLeft: 14 },
  recordRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  recordLabel: { alignItems: "center", flexDirection: "row", flex: 1 },
  rowLabel: { color: colors.muted, fontSize: 16, marginLeft: 9 },
  rowValue: {
    color: colors.ink,
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "right",
  },
  rowPending: {
    backgroundColor: colors.peachStrong,
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 6,
  },
  rowPendingText: { color: colors.brown, fontSize: 14 },
  notice: {
    alignItems: "center",
    backgroundColor: colors.peachStrong,
    borderRadius: 11,
    flexDirection: "row",
    marginTop: 27,
    padding: 15,
  },
  noticeText: {
    color: colors.muted,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 11,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.brown,
    borderRadius: 14,
    flexDirection: "row",
    height: 64,
    justifyContent: "center",
    marginTop: 28,
  },
  primaryText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 5,
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: colors.peach,
    borderRadius: 14,
    flexDirection: "row",
    height: 64,
    justifyContent: "center",
    marginTop: 16,
  },
  backArrow: { color: colors.ink, fontSize: 28, marginRight: 13 },
  secondaryText: { color: colors.ink, fontSize: 18 },
  footer: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 23,
    marginTop: 31,
    textAlign: "center",
  },
  footerLink: { color: colors.brown, textDecorationLine: "underline" },
});
