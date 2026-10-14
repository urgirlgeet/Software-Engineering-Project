// src/styles/theme.ts

import { StyleSheet } from "react-native";

export const colors = {
  background: "#FFF9F7",
  ink: "#1F0D08",
  brown: "#7E4022",
  copper: "#AE6039",
  softCopper: "#FFDCD0",
  peach: "#FFF0EB",
  peachStrong: "#FFE0D5",
  muted: "#6D5B55",
  white: "#FFFFFF",
  placeholder: "#6D5952",
  selected: "#FFE4DB",
  shadow: "#6F3D2A",
  error: "#8B0000",
} as const;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 34,
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 28,
  },

  logoTile: {
    alignItems: "center",
    backgroundColor: "#FFE9E2",
    borderRadius: 17,
    height: 63,
    justifyContent: "center",
    width: 63,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },

  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.brown,
    borderRadius: 13,
    flexDirection: "row",
    height: 56,
    justifyContent: "center",
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "600",
  },

  secondaryButton: {
    alignItems: "center",
    backgroundColor: colors.peach,
    borderRadius: 13,
    flexDirection: "row",
    height: 56,
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "600",
  },

  pageTitle: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },

  pageSubtitle: {
    color: colors.muted,
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },

  label: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 7,
  },

  input: {
    backgroundColor: colors.peach,
    borderRadius: 10,
    color: colors.ink,
    fontSize: 16,
    height: 48,
    paddingHorizontal: 14,
  },

  disabled: {
    opacity: 0.6,
  },

  // ADD THESE STYLES INSIDE src/styles/theme.ts
  // Put them before the "// Pending approval" section.

  featureCard: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 16,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 16,
  },

  featureIcon: {
    alignItems: "center",
    backgroundColor: colors.peach,
    borderRadius: 14,
    height: 52,
    justifyContent: "center",
    marginBottom: 9,
    width: 52,
  },

  featureTitle: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },

  featureDetail: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
    textAlign: "center",
  },

  hero: {
    alignItems: "center",
  },

  logoHalo: {
    alignItems: "center",
    backgroundColor: colors.peach,
    borderRadius: 80,
    height: 150,
    justifyContent: "center",
    marginBottom: 18,
    width: 150,
  },

  eyebrow: {
    color: colors.brown,
    fontFamily: "Georgia",
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  title: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 42,
    fontWeight: "700",
    letterSpacing: 2,
  },

  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    textAlign: "center",
  },

  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 34,
  },

  features: {
    flexDirection: "row",
    gap: 10,
    marginTop: 30,
  },

  networkCard: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 16,
    flexDirection: "row",
    marginTop: 14,
    padding: 16,
  },

  networkIcon: {
    alignItems: "center",
    backgroundColor: colors.peach,
    borderRadius: 13,
    height: 52,
    justifyContent: "center",
    width: 52,
  },

  networkCopy: {
    flex: 1,
    marginLeft: 13,
  },

  networkTitle: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 16,
    fontWeight: "700",
  },

  networkDetail: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },

  activePill: {
    backgroundColor: colors.peachStrong,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  activeText: {
    color: colors.brown,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.7,
  },

  actions: {
    marginTop: 25,
    gap: 12,
  },

  arrow: {
    color: colors.white,
    fontSize: 24,
    marginLeft: 10,
  },

  pressed: {
    opacity: 0.75,
  },

  footer: {
    alignItems: "center",
    marginTop: 25,
  },

  trustLine: {
    alignItems: "center",
    flexDirection: "row",
  },

  trustText: {
    color: colors.muted,
    fontSize: 12,
    marginLeft: 7,
  },

  terms: {
    color: colors.muted,
    fontFamily: "Georgia",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 13,
    textAlign: "center",
  },

  formHeader: {
    alignItems: "center",
    marginBottom: 28,
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

  inputWithIcon: {
    alignItems: "center",
    backgroundColor: colors.peach,
    borderRadius: 10,
    flexDirection: "row",
    height: 48,
    paddingHorizontal: 13,
  },

  iconInput: {
    color: colors.ink,
    flex: 1,
    fontSize: 16,
    height: 48,
    marginLeft: 10,
  },

  formButton: {
    marginTop: 30,
  },

  authContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 28,
    paddingTop: 50,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingRight: 15,
  },

  backText: {
    color: colors.brown,
    fontSize: 18,
    fontWeight: "600",
  },

  authContent: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 70,
  },

  authHeader: {
    alignItems: "center",
    marginBottom: 35,
  },

  logoText: {
    color: colors.brown,
    fontFamily: "Georgia",
    fontSize: 26,
    fontWeight: "700",
  },

  form: {
    width: "100%",
  },

  signUpLink: {
    alignItems: "center",
    marginTop: 22,
    paddingVertical: 10,
  },

  signUpText: {
    color: colors.ink,
    fontSize: 15,
  },

  link: {
    color: colors.brown,
    fontWeight: "700",
  },

  // Pending approval

  pendingTopBar: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 42,
  },

  pendingBrandMark: {
    alignItems: "center",
    backgroundColor: colors.peachStrong,
    borderRadius: 24,
    height: 45,
    justifyContent: "center",
    width: 45,
  },

  pendingBrandText: {
    color: colors.ink,
    fontSize: 18,
    letterSpacing: 1,
    marginLeft: 10,
  },

  pendingPortalMark: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: "auto",
  },

  pendingPortalText: {
    color: colors.ink,
    fontSize: 16,
    marginLeft: 7,
  },

  pendingHeader: {
    alignItems: "center",
    marginBottom: 29,
  },

  pendingEyebrow: {
    color: colors.brown,
    fontSize: 14,
    letterSpacing: 1.6,
    marginBottom: 12,
  },

  pendingTitle: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 34,
    fontWeight: "700",
  },

  pendingSubtitle: {
    color: colors.muted,
    fontSize: 17,
    marginTop: 9,
  },

  pendingCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 27,
    shadowColor: colors.brown,
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },

  pendingStatusIconWrap: {
    alignItems: "center",
  },

  pendingStatusIcon: {
    alignItems: "center",
    backgroundColor: colors.peach,
    borderRadius: 50,
    height: 100,
    justifyContent: "center",
    width: 100,
  },

  pendingBadgeIcon: {
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

  pendingDot: {
    color: colors.brown,
    fontSize: 13,
    marginRight: 6,
  },

  pendingText: {
    color: colors.brown,
    fontSize: 14,
    letterSpacing: 0.8,
  },

  pendingRequestTitle: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 23,
    textAlign: "center",
  },

  pendingDescription: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 26,
    marginTop: 13,
    textAlign: "center",
  },

  pendingPipeline: {
    backgroundColor: colors.peach,
    borderRadius: 12,
    marginTop: 27,
    padding: 18,
  },

  pendingPipelineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  pendingPipelineTitle: {
    color: colors.ink,
    fontSize: 16,
  },

  pendingStage: {
    color: colors.brown,
    fontSize: 15,
    fontWeight: "600",
  },

  pendingStepsLine: {
    flexDirection: "row",
    height: 3,
    left: 30,
    position: "absolute",
    right: 30,
    top: 78,
  },

  pendingStepLine: {
    backgroundColor: "#D8B8AC",
    flex: 1,
  },

  pendingActiveLine: {
    backgroundColor: colors.brown,
  },

  pendingSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 21,
  },

  pendingStep: {
    alignItems: "center",
    width: "30%",
  },

  pendingStepIcon: {
    alignItems: "center",
    backgroundColor: colors.peachStrong,
    borderRadius: 20,
    height: 38,
    justifyContent: "center",
    width: 38,
  },

  pendingActiveStepIcon: {
    backgroundColor: colors.brown,
  },

  pendingStepLabel: {
    color: colors.ink,
    fontSize: 14,
    marginTop: 9,
  },

  pendingActiveStepLabel: {
    color: colors.brown,
    fontWeight: "600",
  },

  pendingRecordBox: {
    backgroundColor: colors.peach,
    borderRadius: 12,
    marginTop: 27,
    padding: 17,
  },

  pendingRecordHeader: {
    alignItems: "center",
    backgroundColor: colors.peachStrong,
    borderRadius: 6,
    flexDirection: "row",
    padding: 11,
  },

  pendingRecordText: {
    color: colors.ink,
    flex: 1,
    fontSize: 13,
    letterSpacing: 0.4,
    marginLeft: 9,
  },

  pendingRecordCode: {
    color: colors.brown,
    fontSize: 12,
    marginLeft: 8,
  },

  pendingRecordRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  pendingRecordLabel: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },

  pendingRowLabel: {
    color: colors.muted,
    fontSize: 14,
    marginLeft: 9,
  },

  pendingRowValue: {
    color: colors.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
  },

  pendingRowPending: {
    backgroundColor: colors.peachStrong,
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 6,
  },

  pendingRowPendingText: {
    color: colors.brown,
    fontSize: 13,
  },

  pendingNotice: {
    alignItems: "center",
    backgroundColor: colors.peachStrong,
    borderRadius: 11,
    flexDirection: "row",
    marginTop: 27,
    padding: 15,
  },

  pendingNoticeText: {
    color: colors.muted,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 11,
  },

  pendingFooter: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 23,
    marginTop: 31,
    textAlign: "center",
  },

  pendingFooterLink: {
    color: colors.brown,
    textDecorationLine: "underline",
  },
});

export type ColorName = keyof typeof colors;
