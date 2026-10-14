import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../lib/supabase";

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
      <Text style={styles.userName}>{user.name}</Text>

      <Text style={styles.userRole}>
        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
      </Text>

      <Text style={styles.userInfo}>{user.email}</Text>
      <Text style={styles.userInfo}>{user.phone}</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Status: {user.status}</Text>
      </View>

      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => updateApproval(user.request_id, "approved")}
          >
            <Text style={styles.actionText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => updateApproval(user.request_id, "rejected")}
          >
            <Text style={styles.actionText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading approvals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Approvals</Text>
        <Text style={styles.subtitle}>Manage society member approvals</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F3E8D3",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#6B3E2E",
    fontSize: 17,
    fontWeight: "600",
  },

  container: {
    flex: 1,
    backgroundColor: "#F3E8D3",
    paddingHorizontal: 28,
    paddingTop: 55,
  },

  header: {
    marginBottom: 25,
  },

  backButton: {
    color: "#A65D3B",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#6B3E2E",
  },

  subtitle: {
    fontSize: 16,
    color: "#A65D3B",
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#6B3E2E",
    marginTop: 15,
    marginBottom: 12,
  },

  userCard: {
    backgroundColor: "#FFF8ED",
    borderWidth: 1.5,
    borderColor: "#C89B7B",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
  },

  userName: {
    fontSize: 19,
    fontWeight: "700",
    color: "#6B3E2E",
  },

  userRole: {
    fontSize: 14,
    fontWeight: "700",
    color: "#A65D3B",
    marginTop: 4,
  },

  userInfo: {
    fontSize: 14,
    color: "#6B3E2E",
    marginTop: 5,
  },

  statusContainer: {
    marginTop: 10,
  },

  statusText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#A65D3B",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },

  approveButton: {
    flex: 1,
    backgroundColor: "#A65D3B",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  rejectButton: {
    flex: 1,
    backgroundColor: "#6B3E2E",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  actionText: {
    color: "#FFF8ED",
    fontSize: 14,
    fontWeight: "700",
  },

  emptyText: {
    color: "#A65D3B",
    fontSize: 14,
    marginBottom: 15,
  },
});
