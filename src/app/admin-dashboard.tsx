import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useCallback, useState } from "react";
import {
    Alert,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from "react-native";

import AppNavigation from "../components/AppNavigation";
import { supabase } from "../lib/supabase";
import { dashboardColors, dashboardStyles } from "../styles/dashboardStyles";

import ComplaintCard, {
    AdminComplaint,
} from "../components/admin/ComplaintCard";

import AssignComplaintModal from "../components/admin/AssignComplaint";

type AdminProfile = {
  name: string;
  society_id: string;
};

type AdminActionProps = {
  icon: SymbolViewProps["name"];
  title: string;
  detail: string;
  onPress: () => void;
};

function AdminAction({ icon, title, detail, onPress }: AdminActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        dashboardStyles.actionCard,
        pressed && { opacity: 0.8 },
      ]}
      onPress={onPress}
    >
      <View style={dashboardStyles.actionIcon}>
        <SymbolView
          name={icon}
          tintColor={dashboardColors.brown}
          size={23}
        />
      </View>

      <Text style={dashboardStyles.actionTitle}>{title}</Text>

      <Text style={dashboardStyles.actionDetail}>{detail}</Text>
    </Pressable>
  );
}

export default function AdminDashboard() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [societyName, setSocietyName] = useState("");
  const [complaints, setComplaints] = useState<AdminComplaint[]>([]);

  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(
    null,
  );

  const [showAssignModal, setShowAssignModal] = useState(false);

  const loadComplaints = useCallback(async (societyId: string) => {
    const { data, error } = await supabase
      .from("complaints")
      .select("id, title, category, priority, status, created_at, assigned_to")
      .eq("society_id", societyId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.log("Complaint fetch error:", error);
      return;
    }

    setComplaints(data || []);
  }, []);

  const loadDashboard = useCallback(async () => {
    setChecking(true);
    try {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        router.replace("/signin");
        return;
      }

      const { data: admin, error } = await supabase
        .from("users")
        .select("id, name, society_id, role")
        .eq("auth_user_id", authData.user.id)
        .single();

      if (error || !admin || admin.role !== "admin") {
        Alert.alert(
          "Access Denied",
          "You do not have access to this dashboard.",
        );

        router.replace("/signin");
        return;
      }

      setProfile({
        name: admin.name,
        society_id: admin.society_id,
      });

      const { data: society } = await supabase
        .from("societies")
        .select("name")
        .eq("id", admin.society_id)
        .single();

      if (society) {
        setSocietyName(society.name);
      }

      await loadComplaints(admin.society_id);
    } catch {
      Alert.alert("Error", "Unable to load your dashboard.");
    } finally {
      setChecking(false);
    }
  }, [loadComplaints, router]);

  useFocusEffect(
    useCallback(() => {
      void loadDashboard();
    }, [loadDashboard]),
  );

  const openAssignModal = (complaintId: string) => {
    setSelectedComplaint(complaintId);
    setShowAssignModal(true);
  };

  const closeAssignModal = () => {
    setShowAssignModal(false);
    setSelectedComplaint(null);
  };

  const handleAssigned = async () => {
    if (profile) {
      await loadComplaints(profile.society_id);
    }
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
        <AppNavigation role="admin" active="Home" />

        <View style={dashboardStyles.welcome}>
          <Text style={dashboardStyles.eyebrow}>SOCIETY SERVICES</Text>
          <Text style={dashboardStyles.welcomeTitle}>Hello, {profile.name}</Text>
          <Text style={dashboardStyles.welcomeSubtitle}>
            Administrator dashboard{societyName ? ` · ${societyName}` : ""}
          </Text>
        </View>

        <View style={dashboardStyles.sectionHeading}>
          <View style={dashboardStyles.sectionTitleWrap}>
            <Text style={dashboardStyles.sectionTitle}>Society services</Text>
          </View>
        </View>

        <View style={dashboardStyles.actionGrid}>
          <AdminAction
            icon={{
              ios: "exclamationmark.bubble",
              android: "chat_bubble",
              web: "chat_bubble",
            }}
            title="Complaints"
            detail="Raise an issue and follow it through the resolution process."
            onPress={() => router.push("/complaints")}
          />

          <AdminAction
            icon={{ ios: "megaphone", android: "campaign", web: "campaign" }}
            title="Notice board"
            detail="Read society updates and important announcements."
            onPress={() => router.push("/notices")}
          />

          <AdminAction
            icon={{
              ios: "calendar",
              android: "calendar_month",
              web: "calendar_month",
            }}
            title="Facility booking"
            detail="Reserve shared facilities and review upcoming bookings."
            onPress={() => router.push("/explore")}
          />

          <AdminAction
            icon={{ ios: "creditcard", android: "credit_card", web: "credit_card" }}
            title="Billing dashboard"
            detail="Create bills and review collected and outstanding balances."
            onPress={() => router.push("/bills")}
          />
        </View>

        <View style={dashboardStyles.sectionHeading}>
          <View style={dashboardStyles.sectionTitleWrap}>
            <Text style={dashboardStyles.sectionTitle}>Administration</Text>
          </View>
        </View>

        <View style={dashboardStyles.actionGrid}>
          <AdminAction
            icon={{
              ios: "person.badge.plus",
              android: "person_add",
              web: "person_add",
            }}
            title="Approvals"
            detail="Review resident access requests."
            onPress={() => router.push("/admin-approvals")}
          />
          <AdminAction
            icon={{ ios: "wrench.and.screwdriver", android: "build", web: "build" }}
            title="Maintenance team"
            detail="Monitor assigned maintenance work."
            onPress={() => router.push("/maintenance-dashboard")}
          />
        </View>

        <View style={dashboardStyles.sectionHeading}>
          <View style={dashboardStyles.sectionTitleWrap}>
            <Text style={dashboardStyles.sectionTitle}>
              Resident Complaints
            </Text>

            <Text style={dashboardStyles.count}>{complaints.length}</Text>
          </View>
        </View>

        {complaints.length === 0 ? (
          <View style={dashboardStyles.requestCard}>
            <Text style={dashboardStyles.statusText}>
              No complaints submitted.
            </Text>
          </View>
        ) : (
          complaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onPress={() =>
                router.push({
                  pathname: "/complaint-details" as any,
                  params: { id: complaint.id },
                })
              }
              onAssign={() => openAssignModal(complaint.id)}
            />
          ))
        )}

        <View style={{ height: 70 }} />
      </ScrollView>

      <AssignComplaintModal
        visible={showAssignModal}
        complaintId={selectedComplaint}
        societyId={profile.society_id}
        onClose={closeAssignModal}
        onAssigned={handleAssigned}
      />
    </SafeAreaView>
  );
}
