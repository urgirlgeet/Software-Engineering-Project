import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import BackButton from "../components/BackButton";
import BrandMark from "../components/BrandMark";
import { clearSignupDraft, getSignupDraft } from "../lib/signupDraft";
import { supabase } from "../lib/supabase";
import { colors, styles } from "../styles/theme";

const signupRoles = ["resident", "admin", "security", "maintenance"] as const;
type SignupRole = (typeof signupRoles)[number];

function getSignupErrorMessage(message: string, code?: string) {
  if (code === "PGRST202" || message.includes("lookup_signup_apartment")) {
    return "The apartment verification function is missing from Supabase. Apply the signup migration in supabase/migrations, then retry.";
  }

  if (message.toLowerCase().includes("already registered")) {
    return "An account with this email already exists. Sign in, or use a different email address.";
  }

  return message;
}

export default function CompleteSignup() {
  const router = useRouter();
  const { societyId, role, apartment, employeeId } = useLocalSearchParams<{
    societyId: string;
    role: string;
    apartment: string;
    employeeId: string;
  }>();

  const started = useRef(false);
  const [error, setError] = useState("");
  const [confirmationRequired, setConfirmationRequired] = useState(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void createAccount();
  }, []);

  const createAccount = async () => {
    const draft = getSignupDraft();

    if (
      !draft ||
      !societyId ||
      !role ||
      !signupRoles.includes(role as SignupRole)
    ) {
      setError("Your signup details expired. Please start again.");
      return;
    }

    if (role === "resident" && !apartment?.trim()) {
      setError("Enter your apartment number before creating your account.");
      return;
    }

    if (role !== "resident" && !employeeId?.trim()) {
      setError("Enter your employee ID before creating your account.");
      return;
    }

    if (!draft.name.trim() || !draft.phone.trim() || !draft.email.trim()) {
      setError("Some signup details are missing. Please start again.");
      return;
    }

    const signupRole = role as SignupRole;
    const signupMetadata = {
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      society_id: societyId,
      role: signupRole,
      ...(signupRole === "resident"
        ? { apartment: apartment.trim() }
        : { employee_id: employeeId.trim() }),
    };

    try {
      if (signupRole === "resident") {
        const { data: apartmentId, error: apartmentError } =
          await supabase.rpc("lookup_signup_apartment", {
            p_society_id: societyId,
            p_flat_number: apartment.trim(),
          });

        if (apartmentError) {
          setError(
            getSignupErrorMessage(apartmentError.message, apartmentError.code),
          );
          return;
        }

        if (!apartmentId) {
          setError(
            "That apartment number was not found in this society, or it matches more than one apartment. Check the number with your society administrator.",
          );
          return;
        }
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email: draft.email.trim(),
        password: draft.password,
        options: { data: signupMetadata },
      });

      if (authError) {
        setError(getSignupErrorMessage(authError.message, authError.code));
        clearSignupDraft();
        return;
      }

      if (!data.user) {
        setError("Supabase did not return an account. Please try again.");
        clearSignupDraft();
        return;
      }

      clearSignupDraft();

      if (!data.session) {
        setConfirmationRequired(true);
        return;
      }

      const dashboard =
        signupRole === "admin"
          ? "/admin-dashboard"
          : signupRole === "resident"
            ? "/resident-dashboard"
            : signupRole === "security"
              ? "/security-dashboard"
              : "/maintenance-dashboard";
      router.replace(dashboard);
    } catch (signupError) {
      setError(
        signupError instanceof Error
          ? signupError.message
          : "Something went wrong while creating your account.",
      );
      clearSignupDraft();
    }
  };

  const returnToSignup = () => {
    clearSignupDraft();
    router.replace("/signup");
  };

  const returnToSignin = () => {
    clearSignupDraft();
    router.replace("/signin");
  };

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar style="dark" />
        <BrandMark />
        <View style={styles.errorIcon}>
          <SymbolView
            name={{
              ios: "exclamationmark.triangle",
              android: "warning",
              web: "warning",
            }}
            tintColor={colors.error}
            size={24}
          />
        </View>
        <Text style={[styles.pageTitle, { marginTop: 20 }]}>Sign Up Failed</Text>
        <Text style={styles.inlineError}>{error}</Text>
        <TouchableOpacity
          style={[styles.primaryButton, styles.signupAction]}
          onPress={returnToSignup}
        >
          <Text style={styles.primaryButtonText}>Start again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signupSecondaryAction}
          onPress={returnToSignin}
        >
          <Text style={styles.link}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (confirmationRequired) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar style="dark" />
        <BrandMark />
        <View style={styles.errorIcon}>
          <SymbolView
            name={{
              ios: "envelope.badge",
              android: "mark_email_unread",
              web: "mark_email_unread",
            }}
            tintColor={colors.brown}
            size={24}
          />
        </View>
        <Text style={[styles.pageTitle, { marginTop: 20 }]}>
          Check your email
        </Text>
        <Text style={styles.pageSubtitle}>
          Confirm your email address, then sign in to continue. Your signup has
          been saved.
        </Text>
        <TouchableOpacity
          style={[styles.primaryButton, styles.signupAction]}
          onPress={() => router.replace("/signin")}
        >
          <Text style={styles.primaryButtonText}>Continue to sign in</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.centerContainer}>
      <StatusBar style="dark" />
      <BackButton onPress={() => router.back()} />
      <BrandMark />
      <ActivityIndicator size="large" color={colors.copper} />
      <Text style={[styles.pageTitle, { marginTop: 25 }]}>
        Creating Your Account
      </Text>
      <Text style={styles.pageSubtitle}>
        Please wait while we set up your GATED account.
      </Text>
    </View>
  );
}
