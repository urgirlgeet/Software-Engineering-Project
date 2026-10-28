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

            <Text style={dashboardStyles.pageSubtitle}>
              SOCIETY ADMINISTRATION
            </Text>
          </View>

          <Pressable
            style={dashboardStyles.homeMark}
            onPress={() => router.push("/admin-dashboard")}
          >
            <SymbolView
              name={{
                ios: "house.fill",
                android: "home",
                web: "home",
              }}
              tintColor={dashboardColors.peachStrong}
              size={18}
            />
          </Pressable>
        </View>

        <View style={dashboardStyles.profileBanner}>
          <View style={dashboardStyles.profileCopy}>
            <Text style={dashboardStyles.bannerEyebrow}>SOCIETY ADMIN</Text>

            <Text style={dashboardStyles.greeting}>
              Welcome, {profile.name}
            </Text>

            <View style={dashboardStyles.addressLine}>
              <SymbolView
                name={{
                  ios: "building.2",
                  android: "business",
                  web: "business",
                }}
                tintColor={dashboardColors.brown}
                size={15}
              />

              <Text style={dashboardStyles.address}>
                {societyName || "Society"}
              </Text>
            </View>
          </View>
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
            detail="Review resident access"
            onPress={() => router.push("/admin-approvals")}
          />

          <AdminAction
            icon={{ ios: "person.3", android: "groups", web: "groups" }}
            title="Residents"
            detail="Manage society residents"
            onPress={() => router.push("/residents" as any)}
          />

          <AdminAction
            icon={{
              ios: "exclamationmark.bubble",
              android: "chat_bubble",
              web: "chat_bubble",
            }}
            title="Complaints"
            detail="Manage resident complaints"
            onPress={() => router.push("/complaints" as any)}
          />

          <AdminAction
            icon={{ ios: "wrench.and.screwdriver", android: "build", web: "build" }}
            title="Maintenance"
            detail="Monitor maintenance work"
            onPress={() => router.push("/maintenance-dashboard")}
          />

          <AdminAction
            icon={{ ios: "megaphone", android: "campaign", web: "campaign" }}
            title="Announcements"
            detail="Manage society notices"
            onPress={() => router.push("/notices" as any)}
          />

          <AdminAction
            icon={{
              ios: "shield.lefthalf.filled",
              android: "security",
              web: "security",
            }}
            title="Security"
            detail="Monitor gate activity"
            onPress={() => router.push("/security-dashboard")}
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

        <View style={dashboardStyles.sectionHeading}>
          <View style={dashboardStyles.sectionTitleWrap}>
            <Text style={dashboardStyles.sectionTitle}>Society Management</Text>
          </View>
        </View>

        <Pressable
          style={dashboardStyles.requestCard}
          onPress={() => router.push("/society" as any)}
        >
          <View style={dashboardStyles.requestHeader}>
            <SymbolView
              name={{
                ios: "building.2.fill",
                android: "business",
                web: "business",
              }}
              tintColor={dashboardColors.brown}
              size={21}
            />

            <Text style={[dashboardStyles.requestTitle, { marginLeft: 10 }]}>
              Society Information
            </Text>
          </View>

          <Text style={dashboardStyles.requestDate}>
            View and manage society information
          </Text>
        </Pressable>

        <Pressable style={dashboardStyles.requestCard} onPress={handleSignOut}>
          <View style={dashboardStyles.requestHeader}>
            <SymbolView
              name={{
                ios: "rectangle.portrait.and.arrow.right",
                android: "logout",
                web: "logout",
              }}
              tintColor={dashboardColors.brown}
              size={21}
            />

            <Text style={[dashboardStyles.requestTitle, { marginLeft: 10 }]}>
              Sign Out
            </Text>
          </View>
        </Pressable>

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
