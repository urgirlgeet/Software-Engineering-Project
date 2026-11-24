import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
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
import QuickActionCard from "../components/resident/QuickActionCard";
import AppNavigation from "../components/AppNavigation";

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
        <AppNavigation role="security" active="Home" />
        <View style={dashboardStyles.welcome}>
          <Text style={dashboardStyles.eyebrow}>SOCIETY SERVICES</Text>
          <Text style={dashboardStyles.welcomeTitle}>
            Hello, {profile.name || "Security Staff"}
          </Text>
          <Text style={dashboardStyles.welcomeSubtitle}>
            Security portal · {societyName}
          </Text>
        </View>

        <View style={dashboardStyles.sectionHeading}>
          <View style={dashboardStyles.sectionTitleWrap}>
            <Text style={dashboardStyles.sectionTitle}>Security Desk</Text>
          </View>
        </View>

        <View style={dashboardStyles.actionGrid}>
          <QuickActionCard
            icon={{ ios: "person.2", android: "people", web: "people" }}
            title="Visitors"
            detail="Manage visitor entries"
            onPress={() => router.push("/visitors" as any)}
          />

          <QuickActionCard
            icon={{ ios: "shippingbox", android: "inventory_2", web: "inventory_2" }}
            title="Deliveries"
            detail="Track incoming deliveries"
            onPress={() => router.push("/deliveries" as any)}
          />

          <QuickActionCard
            icon={{ ios: "door.left.hand.open", android: "door_front", web: "door_front" }}
            title="Gate Activity"
            detail="View gate activity"
            onPress={() => router.push("/gate-activity" as any)}
          />

          <QuickActionCard
            icon={{ ios: "person.3", android: "groups", web: "groups" }}
            title="Residents"
            detail="View resident information"
            onPress={() => router.push("/residents" as any)}
          />

          <QuickActionCard
            icon={{ ios: "cross.case", android: "emergency", web: "emergency" }}
            title="Emergency"
            detail="Emergency information"
            onPress={() => router.push("/emergency" as any)}
          />

          <QuickActionCard
            icon={{ ios: "megaphone", android: "campaign", web: "campaign" }}
            title="Announcements"
            detail="Society announcements"
            onPress={() => router.push("/notices" as any)}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
