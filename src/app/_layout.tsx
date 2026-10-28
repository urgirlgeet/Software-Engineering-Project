import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import BrandMark from "../components/BrandMark";
import { supabase } from "../lib/supabase";
import { colors, styles } from "../styles/theme";

export default function RootLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        const { data: profile } = await supabase
          .from("users")
          .select("id, role")
          .eq("auth_user_id", data.session.user.id)
          .single();

        if (!profile) {
          await supabase.auth.signOut();
          router.replace("/signin");
          setLoading(false);
          return;
        }

        if (profile.role === "admin") {
          router.replace("/admin-dashboard");
        } else if (profile.role === "resident") {
          router.replace("/resident-dashboard");
        } else if (profile.role === "maintenance") {
          router.replace("/maintenance-dashboard");
        } else if (profile.role === "security") {
          router.replace("/security-dashboard");
        }
      }

      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar style="dark" />
        <BrandMark />
        <ActivityIndicator
          color={colors.brown}
          size="large"
          style={{ marginTop: 24 }}
        />
        <Text style={[styles.pageSubtitle, { marginTop: 14 }]}>
          Preparing your community
        </Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
