import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BackButton from "../components/BackButton";
import { supabase } from "../lib/supabase";
import { adminApprovalsStyles as styles } from "../styles/screens/adminApprovals";
import { colors } from "../styles/theme";

type User = {
  id: string;
  request_id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  requested_at: string;
};

export default function AdminApprovals() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        router.replace("/signin");
        return;
      }

      // Check that the logged-in user is a society admin
      const { data: admin, error: adminError } = await supabase
        .from("users")
        .select("role, society_id")
        .eq("auth_user_id", authData.user.id)
        .single();

      if (adminError || !admin || admin.role !== "admin" || !admin.society_id) {
        Alert.alert("Access Denied", "You do not have access to approvals.");
        router.replace("/signin");
        return;
      }

      const { data: requests, error } = await supabase
        .from("society_admin_requests")
        .select("id, user_id, status, requested_at")
        .eq("society_id", admin.society_id)
        .order("requested_at", { ascending: false });

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      const userIds = (requests || []).map((request) => request.user_id);
      if (userIds.length === 0) {
        setUsers([]);
        return;
      }

      const { data: profiles, error: profilesError } = await supabase
        .from("users")
        .select("id, name, email, phone, role")
        .in("id", userIds);

      if (profilesError) {
        Alert.alert("Error", profilesError.message);
        return;
      }

      setUsers(
        (requests || [])
          .map((request) => {
            const profile = (profiles || []).find(
              (item) => item.id === request.user_id,
            );
            return profile
              ? {
                  ...profile,
                  request_id: request.id,
                  status: request.status,
                  requested_at: request.requested_at,
                }
              : null;
          })
          .filter((user): user is User => user !== null),
      );
    } finally {
      setLoading(false);
    }
  };

  const updateApproval = async (
    userId: string,
    status: "approved" | "rejected",
  ) => {
    const { error } = await supabase
      .from("society_admin_requests")
      .update({
        status,
        approved_at: status === "approved" ? new Date().toISOString() : null,
      })
      .eq("id", userId);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert(
      status === "approved" ? "Approved" : "Rejected",
      `User has been ${status}.`,
    );

    loadApprovals();
  };

  const pendingUsers = users.filter((user) => user.status === "pending");

  const activeUsers = users.filter((user) => user.status === "approved");

  const rejectedUsers = users.filter((user) => user.status === "rejected");

  const renderUser = (user: User, showActions: boolean) => (
    <View style={styles.userCard} key={user.id}>
      <View style={styles.userHeader}>
        <View style={styles.userAvatar}>
          <SymbolView
            name={{ ios: "person.fill", android: "person", web: "person" }}
            tintColor={colors.brown}
            size={22}
          />
        </View>
        <View style={styles.userIdentity}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userRole}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.userInfoRow}>
        <SymbolView
          name={{ ios: "envelope", android: "mail", web: "mail" }}
          tintColor={colors.muted}
          size={17}
        />
        <Text style={styles.userInfo}>{user.email}</Text>
      </View>
      <View style={styles.userInfoRow}>
        <SymbolView
          name={{ ios: "phone", android: "phone", web: "phone" }}
          tintColor={colors.muted}
          size={17}
        />
        <Text style={styles.userInfo}>{user.phone}</Text>
      </View>

      <View style={styles.statusContainer}>
        <SymbolView
          name={{
            ios:
              user.status === "approved"
                ? "checkmark.circle.fill"
                : "clock",
            android: user.status === "approved" ? "check_circle" : "schedule",
            web: user.status === "approved" ? "check_circle" : "schedule",
          }}
          tintColor={colors.brown}
          size={16}
        />
        <Text style={styles.statusText}>
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </Text>
      </View>

      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.approveButton}
            onPress={() => updateApproval(user.request_id, "approved")}
          >
            <SymbolView
              name={{ ios: "checkmark", android: "check", web: "check" }}
              tintColor={colors.white}
              size={17}
            />
            <Text style={styles.actionText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            style={styles.rejectButton}
            onPress={() => updateApproval(user.request_id, "rejected")}
          >
            <SymbolView
              name={{ ios: "xmark", android: "close", web: "close" }}
              tintColor={colors.white}
              size={17}
            />
            <Text style={styles.actionText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.brown} size="large" />
        <Text style={styles.loadingText}>Loading approvals...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />

        <View style={styles.pageHeading}>
          <View style={styles.pageIcon}>
            <SymbolView
              name={{
                ios: "person.badge.key",
                android: "admin_panel_settings",
                web: "admin_panel_settings",
              }}
              tintColor={colors.brown}
              size={23}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Approvals</Text>
            <Text style={styles.subtitle}>
              Manage society member approvals
            </Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          Pending Approvals ({pendingUsers.length})
        </Text>

        {pendingUsers.length === 0 ? (
          <Text style={styles.emptyText}>No pending approvals.</Text>
        ) : (
          pendingUsers.map((user) => renderUser(user, true))
        )}

        <Text style={styles.sectionTitle}>
          Active Approvals ({activeUsers.length})
        </Text>

        {activeUsers.length === 0 ? (
          <Text style={styles.emptyText}>No active users.</Text>
        ) : (
          activeUsers.map((user) => renderUser(user, false))
        )}

        <Text style={styles.sectionTitle}>
          Rejected ({rejectedUsers.length})
        </Text>

        {rejectedUsers.length === 0 ? (
          <Text style={styles.emptyText}>No rejected users.</Text>
        ) : (
          rejectedUsers.map((user) => renderUser(user, false))
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
