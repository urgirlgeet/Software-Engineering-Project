import { StyleSheet } from "react-native";
import { colors } from "./theme";

export const signupColors = {
  peach: "#FFF0EB",
  logoBackground: "#FFE9E2",
  placeholder: "#6D5952",
  shadow: "#6F3D2A",
  subtitle: "#4E3D38",
} as const;

export const signupStyles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 34,
  },

  header: {
    alignItems: "center",
    marginBottom: 28,
  },

  logoTile: {
    alignItems: "center",
    backgroundColor: signupColors.logoBackground,
    borderRadius: 17,
    height: 63,
    justifyContent: "center",
    marginBottom: 13,
    width: 63,
  },

  eyebrow: {
    color: colors.brown,
    fontFamily: "Georgia",
    fontSize: 12,
    letterSpacing: 1.2,
    marginBottom: 8,
  },

  title: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 26,
    fontWeight: "700",
  },

  subtitle: {
    color: signupColors.subtitle,
    fontSize: 16,
    marginTop: 9,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 13,
    paddingHorizontal: 18,
    paddingVertical: 20,
    shadowColor: signupColors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
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

  label: {
    color: colors.ink,
    fontSize: 15,
    marginBottom: 6,
    marginTop: 13,
  },

  input: {
    backgroundColor: signupColors.peach,
    borderRadius: 10,
    color: colors.ink,
    fontSize: 16,
    height: 41,
    paddingHorizontal: 13,
  },

  inputWithIcon: {
    alignItems: "center",
    backgroundColor: signupColors.peach,
    borderRadius: 10,
    flexDirection: "row",
    height: 44,
    paddingHorizontal: 13,
  },

  iconInput: {
    color: colors.ink,
    flex: 1,
    fontSize: 16,
    height: 44,
    marginLeft: 10,
  },

  button: {
    alignItems: "center",
    backgroundColor: colors.brown,
    borderRadius: 12,
    flexDirection: "row",
    height: 53,
    justifyContent: "center",
    marginTop: 31,
  },

  buttonText: {
    color: colors.white,
    fontSize: 19,
    fontWeight: "600",
  },

  arrow: {
    color: colors.white,
    fontSize: 25,
    marginLeft: 11,
  },

  terms: {
    color: signupColors.subtitle,
    fontFamily: "Georgia",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 13,
    textAlign: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },
});
