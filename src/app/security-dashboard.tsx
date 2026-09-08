import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from "react-native";

import { supabase } from "../lib/supabase";
import { dashboardColors, dashboardStyles } from "../styles/dashboardStyles";

type Profile = {
  name: string | null;
  society_id: string | null;
};

export default function SecurityDashboard() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile>({
    name: null,
    society_id: null,
  });
  const [societyName, setSocietyName] = useState("Your Society");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/signin");
        return;
      }

      const { data: userProfile, error } = await supabase
        .from("users")
        .select("name, society_id, role")
        .eq("auth_user_id", user.id)
        .single();

      if (error || !userProfile) {
        Alert.alert("Error", "Unable to load your profile.");
        router.replace("/signin");
        return;
      }

      if (userProfile.role !== "security") {
        router.replace("/signin");
        return;
      }

      setProfile({
        name: userProfile.name,
        society_id: userProfile.society_id,
      });

      if (userProfile.society_id) {
        const { data: society } = await supabase
          .from("societies")
          .select("name")
          .eq("id", userProfile.society_id)
          .single();

        if (society?.name) {
          setSocietyName(society.name);
        }
      }
    } catch {
      Alert.alert("Error", "Something went wrong while loading the dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (loading) {
    return (
      <View style={dashboardStyles.loadingContainer}>
        <Text style={dashboardStyles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={dashboardStyles.safeArea}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={dashboardStyles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={dashboardStyles.topBar}>
          <View>
            <Text style={dashboardStyles.pageTitle}>GATED</Text>
            <Text style={dashboardStyles.pageSubtitle}>SECURITY PORTAL</Text>
          </View>

          <Pressable onPress={() => router.replace("/")}>
            <View style={dashboardStyles.homeMark}>
              <Text style={{ color: dashboardColors.white }}>⌂</Text>
            </View>
          </Pressable>
        </View>

        <View style={dashboardStyles.profileBanner}>
          <View style={dashboardStyles.profileCopy}>
            <Text style={dashboardStyles.bannerEyebrow}>SECURITY DESK</Text>

            <Text style={dashboardStyles.greeting}>
              Hello, {profile.name || "Security Staff"}
            </Text>

            <View style={dashboardStyles.addressLine}>
              <Text style={{ color: dashboardColors.brown }}>•</Text>
              <Text style={dashboardStyles.address}>{societyName}</Text>
            </View>
          </View>
        </View>

        <View style={dashboardStyles.sectionHeading}>
          <View style={dashboardStyles.sectionTitleWrap}>
            <Text style={dashboardStyles.sectionTitle}>Security Desk</Text>
          </View>
        </View>

        <View style={dashboardStyles.actionGrid}>
          <Pressable
            style={dashboardStyles.actionCard}
            onPress={() => router.push("/visitors" as any)}
          >
            <Text style={dashboardStyles.actionTitle}>Visitors</Text>
            <Text style={dashboardStyles.actionDetail}>
              Manage visitor entries
            </Text>
          </Pressable>

          <Pressable
            style={dashboardStyles.actionCard}
            onPress={() => router.push("/deliveries" as any)}
          >
            <Text style={dashboardStyles.actionTitle}>Deliveries</Text>
            <Text style={dashboardStyles.actionDetail}>
              Track incoming deliveries
            </Text>
          </Pressable>

          <Pressable
            style={dashboardStyles.actionCard}
            onPress={() => router.push("/gate-activity" as any)}
          >
            <Text style={dashboardStyles.actionTitle}>Gate Activity</Text>
            <Text style={dashboardStyles.actionDetail}>View gate activity</Text>
          </Pressable>

          <Pressable
            style={dashboardStyles.actionCard}
            onPress={() => router.push("/residents" as any)}
          >
            <Text style={dashboardStyles.actionTitle}>Residents</Text>
            <Text style={dashboardStyles.actionDetail}>
              View resident information
            </Text>
          </Pressable>

          <Pressable
            style={dashboardStyles.actionCard}
            onPress={() => router.push("/emergency" as any)}
          >
            <Text style={dashboardStyles.actionTitle}>Emergency</Text>
            <Text style={dashboardStyles.actionDetail}>
              Emergency information
            </Text>
          </Pressable>

          <Pressable
            style={dashboardStyles.actionCard}
            onPress={() => router.push("/notices" as any)}
          >
            <Text style={dashboardStyles.actionTitle}>Announcements</Text>
            <Text style={dashboardStyles.actionDetail}>
              Society announcements
            </Text>
          </Pressable>
        </View>

        <View style={dashboardStyles.sectionHeading}>
          <View style={dashboardStyles.sectionTitleWrap}>
            <Text style={dashboardStyles.sectionTitle}>Account</Text>
          </View>
        </View>

        <Pressable style={dashboardStyles.requestShortcut} onPress={logout}>
          <Text style={dashboardStyles.requestShortcutText}>Sign Out</Text>

          <Text style={dashboardStyles.requestShortcutArrow}>→</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
