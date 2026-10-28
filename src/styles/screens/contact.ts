import { StyleSheet } from "react-native";
import { colors } from "../theme";

export const contactStyles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 34,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingRight: 15,
    marginBottom: 25,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
    gap: 12,
  },
  title: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    marginTop: 7,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  label: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 7,
    marginTop: 12,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.softCopper,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.peach,
    color: colors.ink,
    fontSize: 16,
  },
  inputWithIcon: {
    alignItems: "center",
    backgroundColor: colors.peach,
    borderColor: colors.softCopper,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 52,
    paddingHorizontal: 13,
  },
  iconInput: {
    color: colors.ink,
    flex: 1,
    fontSize: 16,
    minHeight: 50,
    marginLeft: 10,
  },
  messageInput: {
    minHeight: 120,
    paddingTop: 15,
  },
  submitButton: {
    height: 56,
    borderRadius: 13,
    backgroundColor: colors.brown,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  submitText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
