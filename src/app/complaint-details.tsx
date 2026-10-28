import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import AssignComplaintModal from "../components/admin/AssignComplaint";
import BackButton from "../components/BackButton";
import { supabase } from "../lib/supabase";
import { dashboardColors, dashboardStyles } from "../styles/dashboardStyles";

type ComplaintDetails = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  assigned_to: string | null;
  resolution_note: string | null;
  resolved_at: string | null;
  user_id: string;
};

type StaffProfile = {
  id: string;
  name: string;
  society_id: string;
  role: "admin" | "maintenance";
};

export default function ComplaintDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [complaint, setComplaint] = useState<ComplaintDetails | null>(null);
  const [residentName, setResidentName] = useState("");
  const [assignedName, setAssignedName] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);

  const loadComplaint = async () => {
    if (!id) {
      Alert.alert("Complaint not found", "A complaint ID was not provided.");
      router.back();
      return;
    }

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/signin");
        return;
      }

      const { data: staff, error: profileError } = await supabase
        .from("users")
        .select("id, name, society_id, role")
        .eq("auth_user_id", user.id)
        .single();

      if (
        profileError ||
        !staff ||
        (staff.role !== "admin" && staff.role !== "maintenance")
      ) {
        Alert.alert("Access Denied", "You cannot access this complaint.");
        router.replace("/signin");
        return;
      }

      const authorizedProfile: StaffProfile = {
        id: staff.id,
        name: staff.name,
        society_id: staff.society_id,
        role: staff.role,
      };
      setProfile(authorizedProfile);

      let complaintQuery = supabase
        .from("complaints")
        .select(
          "id, title, description, category, priority, status, created_at, assigned_to, resolution_note, resolved_at, user_id",
        )
        .eq("id", id)
        .eq("society_id", staff.society_id);

      if (staff.role === "maintenance") {
        complaintQuery = complaintQuery.eq("assigned_to", staff.id);
      }

      const { data, error } = await complaintQuery.single();
      if (error || !data) {
        Alert.alert(
          "Unable to load complaint",
          error?.message || "This complaint could not be found.",
        );
        return;
      }

      setComplaint(data);
      setResolutionNote(data.resolution_note || "");

      const { data: resident, error: residentError } = await supabase
        .from("users")
        .select("name")
        .eq("id", data.user_id)
        .single();

      if (residentError) {
        Alert.alert("Unable to load resident", residentError.message);
      } else {
        setResidentName(resident.name);
      }

      if (data.assigned_to) {
        const { data: assignee, error: assigneeError } = await supabase
          .from("users")
          .select("name")
          .eq("id", data.assigned_to)
          .single();

        if (assigneeError) {
          Alert.alert("Unable to load assignee", assigneeError.message);
        } else {
          setAssignedName(assignee.name);
        }
      } else {
        setAssignedName("");
      }
    } catch {
      Alert.alert("Unable to load complaint", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const updateWorkStatus = async () => {
    if (!complaint || !profile || profile.role !== "maintenance") return;

    const nextStatus =
      complaint.status === "assigned"
        ? "in_progress"
        : complaint.status === "in_progress"
          ? "resolved"
          : null;

    if (!nextStatus) return;

    if (nextStatus === "resolved" && !resolutionNote.trim()) {
      Alert.alert(
        "Resolution note required",
        "Describe the work completed before resolving this complaint.",
      );
      return;
    }

    try {
      setUpdating(true);
      const { data, error } = await supabase
        .from("complaints")
        .update({
          status: nextStatus,
          updated_at: new Date().toISOString(),
          ...(nextStatus === "resolved"
            ? {
                resolution_note: resolutionNote.trim(),
                resolved_at: new Date().toISOString(),
              }
            : {}),
        })
        .eq("id", complaint.id)
        .eq("society_id", profile.society_id)
        .eq("assigned_to", profile.id)
        .select("id")
        .single();

      if (error || !data) {
        Alert.alert(
          "Unable to update complaint",
          error?.message || "The complaint was not updated.",
        );
        return;
      }

      await loadComplaint();
    } catch {
      Alert.alert("Unable to update complaint", "Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const refreshAfterAssignment = async () => {
    setAssignModalVisible(false);
    await loadComplaint();
  };

  if (loading) {
    return (
      <View style={dashboardStyles.loadingContainer}>
        <Text style={dashboardStyles.loadingText}>Loading complaint...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={dashboardStyles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={dashboardStyles.container}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton onPress={() => router.back()} />

        {complaint && profile ? (
          <>
            <View style={dashboardStyles.sectionHeading}>
              <View style={dashboardStyles.sectionTitleWrap}>
                <Text style={dashboardStyles.sectionTitle}>
                  Complaint Details
                </Text>
              </View>
            </View>

            <View style={dashboardStyles.requestCard}>
              <Text style={dashboardStyles.category}>
                {complaint.category.toUpperCase()} ·{" "}
                {complaint.priority.toUpperCase()} PRIORITY
              </Text>
              <Text style={[dashboardStyles.requestTitle, { marginTop: 12 }]}>
                {complaint.title}
              </Text>
              <Text style={[dashboardStyles.statusText, { marginTop: 12 }]}>
                {complaint.description}
              </Text>
              <Text style={[dashboardStyles.statusText, { marginTop: 12 }]}>
                Submitted by {residentName || "Resident"} on{" "}
                {new Date(complaint.created_at).toLocaleString()}
              </Text>
              <Text style={[dashboardStyles.statusText, { marginTop: 8 }]}>
                Status: {complaint.status.replace(/_/g, " ")}
              </Text>
              <Text style={[dashboardStyles.statusText, { marginTop: 8 }]}>
                Assigned to: {assignedName || "Not assigned"}
              </Text>
              {complaint.resolved_at && (
                <Text style={[dashboardStyles.statusText, { marginTop: 8 }]}>
                  Resolved: {new Date(complaint.resolved_at).toLocaleString()}
                </Text>
              )}
              {complaint.resolution_note && (
                <Text style={[dashboardStyles.statusText, { marginTop: 8 }]}>
                  Resolution: {complaint.resolution_note}
                </Text>
              )}
            </View>

            {profile.role === "admin" &&
              !["resolved", "closed", "rejected"].includes(complaint.status) && (
              <Pressable
                onPress={() => setAssignModalVisible(true)}
                style={[
                  styles.actionButton,
                ]}
              >
                <Text style={styles.actionButtonText}>
                  {complaint.assigned_to
                    ? "Reassign Complaint"
                    : "Assign Complaint"}
                </Text>
              </Pressable>
            )}

            {profile.role === "maintenance" &&
              complaint.status === "in_progress" && (
                <View style={[dashboardStyles.requestCard, { marginTop: 16 }]}>
                  <Text style={dashboardStyles.sectionTitle}>
                    Resolution summary
                  </Text>
                  <TextInput
                    value={resolutionNote}
                    onChangeText={setResolutionNote}
                    multiline
                    textAlignVertical="top"
                    placeholder="Describe the work completed"
                    placeholderTextColor={dashboardColors.muted}
                    style={{
                      backgroundColor: dashboardColors.peach,
                      borderColor: dashboardColors.border,
                      borderRadius: 9,
                      borderWidth: 1,
                      color: dashboardColors.ink,
                      minHeight: 100,
                      marginTop: 12,
                      padding: 12,
                    }}
                  />
                </View>
              )}

            {profile.role === "maintenance" &&
              (complaint.status === "assigned" ||
                complaint.status === "in_progress") && (
                <Pressable
                  onPress={updateWorkStatus}
                  disabled={updating}
                  style={[
                    styles.actionButton,
                    updating && { opacity: 0.6 },
                  ]}
                >
                  <Text style={styles.actionButtonText}>
                    {updating
                      ? "Updating..."
                      : complaint.status === "assigned"
                        ? "Start Work"
                        : "Mark Resolved"}
                  </Text>
                </Pressable>
              )}
          </>
        ) : (
          <View style={dashboardStyles.requestCard}>
            <Text style={dashboardStyles.statusText}>
              This complaint is unavailable.
            </Text>
          </View>
        )}
      </ScrollView>

      {profile?.role === "admin" && (
        <AssignComplaintModal
          visible={assignModalVisible}
          complaintId={complaint?.id || null}
          societyId={profile.society_id}
          onClose={() => setAssignModalVisible(false)}
          onAssigned={refreshAfterAssignment}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    backgroundColor: dashboardColors.brown,
    borderRadius: 9,
    marginTop: 16,
    padding: 14,
  },
  actionButtonText: {
    color: dashboardColors.white,
    fontSize: 14,
    fontWeight: "600",
  },
});
