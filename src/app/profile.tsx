import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppNavigation from "../components/AppNavigation";
import { supabase } from "../lib/supabase";
import { colors } from "../styles/theme";

type ProfileData = {
  name: string;
  username: string;
  email: string;
  phone: string;
  apartment: string;
  society: string;
  role: string;
};

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  resident: "Resident",
  maintenance: "Maintenance",
  security: "Security",
};

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/signin");
        return;
      }

      const { data: userProfile, error } = await supabase
        .from("users")
        .select("id, name, email, phone, apartment_id, society_id, role")
        .eq("auth_user_id", user.id)
        .single();

      if (error || !userProfile) {
        Alert.alert(
          "Unable to load profile",
          error?.message || "Your account profile was not found.",
        );
        return;
      }

      let apartment = "Not provided";
      if (userProfile.apartment_id) {
        const { data, error: apartmentError } = await supabase
          .from("apartments")
          .select("flat_number")
          .eq("id", userProfile.apartment_id)
          .single();

        if (apartmentError) {
          Alert.alert("Unable to load apartment", apartmentError.message);
          return;
        }
        apartment = data?.flat_number || apartment;
      }

      let society = "Not provided";
      if (userProfile.society_id) {
        const { data, error: societyError } = await supabase
          .from("societies")
          .select("name")
          .eq("id", userProfile.society_id)
          .single();

        if (societyError) {
          Alert.alert("Unable to load society", societyError.message);
          return;
        }
        society = data?.name || society;
      }

      setProfile({
        name: userProfile.name || "Not provided",
        username: user.user_metadata?.username || user.email || "Not provided",
        email: userProfile.email || user.email || "Not provided",
        phone: userProfile.phone || "Not provided",
        apartment,
        society,
        role: userProfile.role,
      });
    } catch (error) {
      Alert.alert(
        "Unable to load profile",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      void loadProfile();
    }, [loadProfile]),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {profile && <AppNavigation role={profile.role} active="My profile" />}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>ACCOUNT DETAILS</Text>
          <Text style={styles.title}>My profile</Text>
          {profile ? (
            <Text style={styles.muted}>
              Profile linked to {profile.username}
            </Text>
          ) : null}
        </View>
        {loading ? (
          <ActivityIndicator color={colors.brown} size="large" />
        ) : profile ? (
          <View style={styles.card}>
            <ProfileRow label="Full name" value={profile.name} />
            <ProfileRow label="Username" value={profile.username} />
            <ProfileRow label="Phone number" value={profile.phone} />
            <ProfileRow label="Apartment / flat" value={profile.apartment} />
            <ProfileRow label="Society" value={profile.society} />
            <ProfileRow label="Email" value={profile.email} />
            <ProfileRow
              label="Role"
              value={roleLabels[profile.role] || profile.role}
              last
            />
          </View>
        ) : (
          <Text style={styles.muted}>Profile details are unavailable.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    alignSelf: "center",
    maxWidth: 1120,
    paddingBottom: 48,
    paddingHorizontal: 24,
    paddingTop: 42,
    width: "100%",
  },
  heading: {
    marginBottom: 24,
  },
  eyebrow: {
    color: colors.brown,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 8,
  },
  muted: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  card: {
    backgroundColor: colors.white,
    borderColor: colors.softCopper,
    borderRadius: 14,
    borderWidth: 1,
    maxWidth: 820,
    paddingHorizontal: 24,
  },
  row: {
    gap: 6,
    paddingVertical: 16,
  },
  rowBorder: {
    borderBottomColor: colors.softCopper,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    color: colors.muted,
    fontSize: 13,
  },
  rowValue: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "600",
  },
});
