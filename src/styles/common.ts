import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const commonStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    paddingHorizontal: 28,
    paddingTop: 22,
    paddingBottom: 34,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },

  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 23,
  },

  label: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },

  input: {
    height: 64,
    backgroundColor: colors.input,
    borderRadius: 16,
    paddingHorizontal: 18,
    fontSize: 16,
    color: colors.text,
  },

  primaryButton: {
    height: 62,
    backgroundColor: colors.primary,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.white,
  },
});
