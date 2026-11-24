import { useRouter } from "expo-router";
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

import AppNavigation from "../components/AppNavigation";
import { supabase } from "../lib/supabase";
import { colors } from "../styles/theme";

type Notice = {
  id: string;
  title: string;
  date: string;
  publishedBy: string;
  content: string;
  priority: string;
};

type UserProfile = {
  id: string;
  society_id: string;
  role: string;
};

export default function Notices() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [priority, setPriority] = useState("General");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    const loadNotices = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        Alert.alert("Unable to load notices", authError.message);
        setLoadError(authError.message);
        setLoading(false);
        return;
      }

      if (!user) {
        router.replace("/signin");
        return;
      }

      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("id, society_id, role")
        .eq("auth_user_id", user.id)
        .single();

      if (profileError || !userProfile) {
        const message =
          profileError?.message || "Your account profile was not found.";
        Alert.alert(
          "Unable to load notices",
          message,
        );
        setLoadError(message);
        setLoading(false);
        return;
      }

      setProfile(userProfile);

      const { data, error } = await supabase
        .from("apartment_notices")
        .select("id, title, body, priority, created_at")
        .eq("society_id", userProfile.society_id)
        .order("created_at", { ascending: false });

      if (error) {
        Alert.alert("Unable to load notices", error.message);
        setLoadError(error.message);
        setLoading(false);
        return;
      }

      setNotices(
        data.map((notice) => ({
          id: notice.id,
          title: notice.title,
          publishedBy: "Society administrator",
          priority: notice.priority,
          date: new Date(notice.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          content: notice.body,
        })),
      );
      setLoading(false);
    };

    void loadNotices().catch((error: unknown) => {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred.";
      setLoadError(message);
      setLoading(false);
      Alert.alert("Unable to load notices", message);
    });
  }, [router]);

  const publishNotice = async () => {
    const trimmedTitle = title.trim();
    const trimmedDetails = details.trim();

    if (!profile || profile.role !== "admin") {
      Alert.alert("Not allowed", "Only an administrator can publish notices.");
      return;
    }

    if (!trimmedTitle || !trimmedDetails) {
      Alert.alert("Notice details required", "Enter a title and details.");
      return;
    }

    setPublishing(true);
    try {
      const { data, error } = await supabase
        .from("apartment_notices")
        .insert({
          society_id: profile.society_id,
          author_id: profile.id,
          title: trimmedTitle,
          body: trimmedDetails,
          priority,
        })
        .select("id, title, body, priority, created_at")
        .single();

      if (error) {
        Alert.alert("Unable to publish notice", error.message);
        return;
      }

      setNotices((current) => [
        {
          id: data.id,
          title: data.title,
          publishedBy: "Society administrator",
          priority: data.priority,
          date: new Date(data.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          content: data.body,
        },
        ...current,
      ]);
      setTitle("");
      setDetails("");
      setPriority("General");
    } catch (error) {
      Alert.alert(
        "Unable to publish notice",
        error instanceof Error ? error.message : "An unexpected error occurred.",
      );
    } finally {
      setPublishing(false);
    }
  };

  const deleteNotice = async (noticeId: string) => {
    setDeletingId(noticeId);
    try {
      const { error } = await supabase
        .from("apartment_notices")
        .delete()
        .eq("id", noticeId);

      if (error) {
        Alert.alert("Unable to delete notice", error.message);
        return;
      }

      setNotices((current) => current.filter((notice) => notice.id !== noticeId));
    } catch (error) {
      Alert.alert(
        "Unable to delete notice",
        error instanceof Error ? error.message : "An unexpected error occurred.",
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <AppNavigation
          role={profile?.role}
          active="Notice board"
        />

        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>SOCIETY UPDATES</Text>
            <Text style={styles.title}>Notice board</Text>
          </View>
        </View>

        {profile?.role === "admin" && (
          <View style={styles.publishPanel}>
            <Text style={styles.panelTitle}>Publish a notice</Text>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              placeholder="Notice title"
              placeholderTextColor={colors.placeholder}
            />
            <Text style={styles.label}>Details</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={details}
              onChangeText={setDetails}
              maxLength={2000}
              multiline
              textAlignVertical="top"
              placeholder="Share an update with your community"
              placeholderTextColor={colors.placeholder}
            />
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityOptions}>
              {["General", "Important", "Urgent"].map((option) => (
                <Pressable
                  key={option}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: priority === option }}
                  onPress={() => setPriority(option)}
                  style={[
                    styles.priorityOption,
                    priority === option && styles.priorityOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityOptionText,
                      priority === option && styles.priorityOptionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              accessibilityRole="button"
              disabled={publishing}
              onPress={() => void publishNotice()}
              style={({ pressed }) => [
                styles.publishButton,
                pressed && styles.pressed,
                publishing && styles.disabled,
              ]}
            >
              <Text style={styles.publishButtonText}>
                {publishing ? "Publishing..." : "Publish notice"}
              </Text>
            </Pressable>
          </View>
        )}

        {!loading && notices.map((notice) => (
          <View key={notice.id} style={styles.noticeCard}>
            <View style={styles.noticeHeader}>
              <Text style={styles.publisher}>{notice.publishedBy}</Text>
              <View style={styles.noticeMeta}>
                <Text style={styles.priorityBadge}>{notice.priority}</Text>
                <Text style={styles.noticeDate}>{notice.date}</Text>
              </View>
            </View>
            <Text style={styles.noticeTitle}>{notice.title}</Text>
            <Text style={styles.noticeContent}>{notice.content}</Text>
            {profile?.role === "admin" && (
              <Pressable
                accessibilityRole="button"
                disabled={deletingId === notice.id}
                onPress={() => void deleteNotice(notice.id)}
                style={[
                  styles.deleteButton,
                  deletingId === notice.id && styles.disabled,
                ]}
              >
                <Text style={styles.deleteButtonText}>
                  {deletingId === notice.id ? "Deleting..." : "Delete notice"}
                </Text>
              </Pressable>
            )}
          </View>
        ))}
        {!loading && !loadError && notices.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>There are no notices yet.</Text>
          </View>
        )}
        {loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Loading notices...</Text>
          </View>
        )}
        {!!loadError && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{loadError}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    alignSelf: "center",
    flexGrow: 1,
    maxWidth: 1120,
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 36,
    width: "100%",
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 26,
    marginTop: 38,
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    color: colors.brown,
    fontSize: 12,
    letterSpacing: 1.5,
    fontWeight: "700",
  },
  title: {
    color: colors.ink,
    fontSize: 36,
    fontWeight: "800",
    marginTop: 4,
  },
  publishPanel: {
    backgroundColor: colors.white,
    borderColor: colors.softCopper,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 22,
    padding: 24,
  },
  panelTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 18,
  },
  label: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 10,
  },
  priorityOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  priorityOption: {
    borderColor: colors.softCopper,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  priorityOptionSelected: {
    backgroundColor: colors.selected,
    borderColor: colors.brown,
  },
  priorityOptionText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  priorityOptionTextSelected: {
    color: colors.brown,
  },
  input: {
    backgroundColor: colors.white,
    borderColor: "#D5DFE3",
    borderRadius: 8,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 15,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  multilineInput: {
    minHeight: 112,
  },
  publishButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.brown,
    borderRadius: 8,
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  publishButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.55,
  },
  noticeCard: {
    backgroundColor: colors.white,
    borderColor: colors.softCopper,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
    padding: 22,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  noticeHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  noticeMeta: {
    alignItems: "flex-end",
  },
  priorityBadge: {
    backgroundColor: colors.selected,
    borderRadius: 12,
    color: colors.brown,
    fontSize: 10,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  noticeTitle: {
    color: colors.ink,
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    marginRight: 12,
  },
  publisher: {
    color: colors.brown,
    fontSize: 12,
    fontWeight: "700",
  },
  noticeDate: {
    color: colors.muted,
    fontSize: 12,
  },
  noticeContent: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 18,
  },
  deleteButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.errorSurface,
    borderRadius: 8,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  deleteButtonText: {
    color: "#A63C3C",
    fontSize: 13,
    fontWeight: "700",
  },
  emptyState: {
    backgroundColor: colors.white,
    borderColor: colors.softCopper,
    borderRadius: 14,
    borderWidth: 1,
    padding: 24,
  },
  emptyText: {
    color: colors.muted,
    textAlign: "center",
  },
});
