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

import ComplaintCard, {
    AdminComplaint,
} from "../components/admin/ComplaintCard";

type MaintenanceProfile = {
  name: string;
  society_id: string;
};

export default function MaintenanceDashboard() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [profile, setProfile] = useState<MaintenanceProfile | null>(null);
  const [societyName, setSocietyName] = useState("");
  const [complaints, setComplaints] = useState<AdminComplaint[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        router.replace("/signin");
        return;
      }

      const { data: maintenance, error } = await supabase
        .from("users")
        .select("id, name, society_id, role")
        .eq("auth_user_id", authData.user.id)
        .single();

      if (error || !maintenance || maintenance.role !== "maintenance") {
        Alert.alert(
          "Access Denied",
          "You do not have access to this dashboard.",
        );

        router.replace("/signin");
        return;
      }

      setProfile({
        name: maintenance.name,
        society_id: maintenance.society_id,
      });

      const { data: society } = await supabase
        .from("societies")
        .select("name")
        .eq("id", maintenance.society_id)
        .single();

      if (society?.name) {
        setSocietyName(society.name);
      }

      const { data: complaintData, error: complaintError } = await supabase
        .from("complaints")
        .select(
          "id, title, category, priority, status, created_at, assigned_to",
        )
        .eq("assigned_to", maintenance.id)
        .order("created_at", {
          ascending: false,
        });

      if (complaintError) {
        console.log("Complaint fetch error:", complaintError);
        return;
      }

      setComplaints(complaintData || []);
    } catch (error) {
      console.log("Maintenance dashboard error:", error);

      Alert.alert("Error", "Unable to load your dashboard.");
    } finally {
      setChecking(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (checking) {
    return (
      <View style={dashboardStyles.loadingContainer}>
        <Text style={dashboardStyles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (!profile) {
    return null;
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

            <Text style={dashboardStyles.pageSubtitle}>MAINTENANCE</Text>
          </View>

          <Pressable
            style={dashboardStyles.homeMark}
            onPress={() => router.push("/maintenance-dashboard")}
          >
            <Text
              style={{
                color: dashboardColors.white,
                fontSize: 18,
              }}
            >
              ⌂
            </Text>
          </Pressable>
        </View>

        <View style={dashboardStyles.profileBanner}>
          <View style={dashboardStyles.profileCopy}>
            <Text style={dashboardStyles.bannerEyebrow}>MAINTENANCE STAFF</Text>

            <Text style={dashboardStyles.greeting}>
              Welcome, {profile.name}
            </Text>

            <Text
              style={[dashboardStyles.address, { marginLeft: 0, marginTop: 5 }]}
            >
              {societyName}
            </Text>
          </View>
        </View>

        <View style={dashboardStyles.sectionHeading}>
          <View style={dashboardStyles.sectionTitleWrap}>
            <Text style={dashboardStyles.sectionTitle}>
              Assigned Complaints
            </Text>

            <Text style={dashboardStyles.count}>{complaints.length}</Text>
          </View>
        </View>

        {complaints.length === 0 ? (
          <View style={dashboardStyles.requestCard}>
            <Text style={dashboardStyles.statusText}>
              No complaints assigned to you.
            </Text>
          </View>
        ) : (
          complaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))
        )}

        <View style={dashboardStyles.sectionHeading}>
          <View style={dashboardStyles.sectionTitleWrap}>
            <Text style={dashboardStyles.sectionTitle}>Announcements</Text>
          </View>
        </View>

        <Pressable
          style={dashboardStyles.requestCard}
          onPress={() => router.push("/notices" as any)}
        >
          <Text style={dashboardStyles.requestTitle}>
            Society Announcements
          </Text>

          <Text style={[dashboardStyles.requestDate, { marginTop: 5 }]}>
            View society announcements
          </Text>
        </Pressable>

        <Pressable style={dashboardStyles.requestCard} onPress={handleSignOut}>
          <Text style={dashboardStyles.requestTitle}>Sign Out</Text>
        </Pressable>

        <View style={{ height: 70 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
