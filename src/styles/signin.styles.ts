import { StyleSheet } from "react-native";

export const signinStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E8D3",
    paddingHorizontal: 28,
    paddingTop: 60,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingRight: 15,
  },

  backText: {
    color: "#6B3E2E",
    fontSize: 18,
    fontWeight: "600",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 80,
  },

  header: {
    alignItems: "center",
    marginBottom: 35,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#6B3E2E",
  },

  subtitle: {
    fontSize: 16,
    letterSpacing: 0.8,
    color: "#A65D3B",
    marginTop: 8,
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B3E2E",
    marginBottom: 7,
    marginTop: 14,
  },

  input: {
    height: 54,
    borderWidth: 1.5,
    borderColor: "#C89B7B",
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#FFF8ED",
    color: "#4E3025",
    fontSize: 16,
  },

  signInButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#A65D3B",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  signInButtonDisabled: {
    opacity: 0.6,
  },

  signInButtonText: {
    color: "#FFF8ED",
    fontSize: 17,
    fontWeight: "600",
  },

  signUpLink: {
    alignItems: "center",
    marginTop: 22,
    paddingVertical: 10,
  },

  signUpText: {
    color: "#6B3E2E",
    fontSize: 15,
  },

  link: {
    color: "#A65D3B",
    fontWeight: "700",
  },
});
