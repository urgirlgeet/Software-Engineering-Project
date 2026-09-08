import { StyleSheet } from "react-native";
import { colors } from "./theme";

export const styles = StyleSheet.create({
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
