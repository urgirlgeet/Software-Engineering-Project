import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

import ComplaintCard, {
  AdminComplaint,
} from "../components/admin/ComplaintCard";
import BackButton from "../components/BackButton";
import { supabase } from "../lib/supabase";
import { dashboardStyles } from "../styles/dashboardStyles";

export default function Complaints() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<AdminComplaint[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadComplaints = async () => {
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

          const { data: profile, error: profileError } = await supabase
            .from("users")
            .select("society_id, role")
            .eq("auth_user_id", user.id)
            .single();

          if (profileError || !profile || profile.role !== "admin") {
            Alert.alert(
              "Access Denied",
              "Only society admins can view complaints.",
            );
            router.replace("/signin");
            return;
          }

          const { data, error } = await supabase
            .from("complaints")
            .select(
              "id, title, category, priority, status, created_at, assigned_to",
            )
            .eq("society_id", profile.society_id)
            .order("created_at", { ascending: false });

          if (error) {
            Alert.alert("Unable to load complaints", error.message);
            return;
          }

          setComplaints(data || []);
        } catch {
          Alert.alert("Unable to load complaints", "Please try again.");
        } finally {
          setLoading(false);
        }
      };

      void loadComplaints();
    }, [router]),
  );

  return (
    <SafeAreaView style={dashboardStyles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={dashboardStyles.container}
        showsVerticalScrollIndicator={false}
      >
        <BackButton onPress={() => router.back()} />

        <View style={dashboardStyles.sectionHeading}>
          <View style={dashboardStyles.sectionTitleWrap}>
            <Text style={dashboardStyles.sectionTitle}>Society Complaints</Text>
            <Text style={dashboardStyles.count}>{complaints.length}</Text>
          </View>
        </View>

        {loading ? (
          <Text style={dashboardStyles.statusText}>Loading complaints...</Text>
        ) : complaints.length === 0 ? (
          <View style={dashboardStyles.requestCard}>
            <Text style={dashboardStyles.statusText}>
              No complaints have been submitted yet.
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
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}