import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { supabase } from "../lib/supabase";

const categories = ["Electrical", "Plumbing", "HVAC", "Security", "Other"];

const priorities = ["low", "medium", "high"] as const;

type RequestType = "complaint" | "maintenance";

type ExistingRequest = {
  category: string;
  created_at: string;
  description: string;
  priority: string;
  status: string;
  title: string;
  updated_at: string | null;
};

export default function Request() {
  const router = useRouter();

  const { type, id } = useLocalSearchParams<{
    type?: RequestType;
    id?: string;
  }>();

  const requestType: RequestType =
    type === "maintenance" ? "maintenance" : "complaint";

  const isMaintenance = requestType === "maintenance";

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<(typeof priorities)[number]>("low");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [existingRequest, setExistingRequest] =
    useState<ExistingRequest | null>(null);
  const [loadingRequest, setLoadingRequest] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;

    const loadRequest = async () => {
      const table = isMaintenance ? "maintenance_requests" : "complaints";
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/signin");
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (!profile) {
        setLoadingRequest(false);
        return;
      }

      const { data, error } = await supabase
        .from(table)
        .select(
          "title, category, priority, status, description, created_at, updated_at",
        )
        .eq("id", id)
        .eq("user_id", profile.id)
        .single();

      if (error || !data) {
        Alert.alert(
          "Unable to load request",
          "This request could not be found.",
          [{ text: "Back", onPress: () => router.back() }],
        );
      } else {
        setExistingRequest(data);
      }
      setLoadingRequest(false);
    };

    loadRequest();
  }, [id, isMaintenance]);

  const handleSubmit = async () => {
    if (!title.trim() || !category || !description.trim()) {
      Alert.alert(
        "Incomplete request",
        "Please complete the subject, category, and description.",
      );
      return;
    }

    try {
      setSubmitting(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/signin");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("id, society_id, role")
        .eq("auth_user_id", user.id)
        .single();

      if (profileError || !profile) {
        Alert.alert("Unable to submit", "Your profile could not be found.");
        return;
      }

      if (profile.role !== "resident") {
        Alert.alert(
          "Unable to submit",
          "Only residents can submit this request.",
        );
        return;
      }

      const table = isMaintenance ? "maintenance_requests" : "complaints";

      const { error } = await supabase.from(table).insert({
        user_id: profile.id,
        society_id: profile.society_id,
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        status: "submitted",
      });

      if (error) {
        Alert.alert("Unable to submit", error.message);
        return;
      }

      Alert.alert(
        isMaintenance ? "Maintenance request submitted" : "Complaint submitted",
        isMaintenance
          ? "Your maintenance request has been submitted successfully."
          : "Your complaint has been submitted successfully.",
        [
          {
            text: "Done",
            onPress: () => router.replace("/resident-dashboard"),
          },
        ],
      );
    } catch {
      Alert.alert(
        "Unable to submit",
        "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (id) {
    if (loadingRequest) {
      return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.statusLoading}>
            <Text style={styles.statusLoadingText}>
              Loading request status...
            </Text>
          </View>
        </SafeAreaView>
      );
    }

    if (existingRequest) {
      return (
        <RequestStatus
          request={existingRequest}
          isMaintenance={isMaintenance}
          onBack={() => router.back()}
        />
      );
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.safeArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>

            <View style={styles.headerCopy}>
              <Text style={styles.title}>
                {isMaintenance ? "Request Maintenance" : "Raise Complaint"}
              </Text>

              <Text style={styles.subtitle}>ESTATE REGISTRY • FLAT 402</Text>
            </View>

            <View style={styles.headerIcon}>
              <SymbolView
                name={{
                  ios: "building.2",
                  android: "business",
                  web: "business",
                }}
                tintColor={colors.white}
                size={24}
              />
            </View>
          </View>

          <View style={styles.docket}>
            <View style={styles.docketIcon}>
              <SymbolView
                name={{
                  ios: "doc.text",
                  android: "description",
                  web: "description",
                }}
                tintColor={colors.brown}
                size={28}
              />
            </View>

            <View style={styles.docketCopy}>
              <Text style={styles.docketTitle}>
                {isMaintenance ? "Maintenance Request" : "New Registry Docket"}
              </Text>

              <Text style={styles.docketSubtitle}>
                {isMaintenance
                  ? "FACILITY SERVICE REQUEST"
                  : "ESTATE STEWARDSHIP • SECTOR 4"}
              </Text>
            </View>

            <View style={styles.draftingPill}>
              <Text style={styles.draftingText}>DRAFTING</Text>
            </View>
          </View>

          <View style={styles.modeSwitch}>
            <Pressable
              style={[styles.mode, !isMaintenance && styles.activeMode]}
              onPress={() =>
                router.replace({
                  pathname: "/request",
                  params: { type: "complaint" },
                })
              }
            >
              <SymbolView
                name={{
                  ios: "exclamationmark.triangle",
                  android: "warning",
                  web: "warning",
                }}
                tintColor={!isMaintenance ? colors.white : colors.brown}
                size={21}
              />

              <Text
                style={[
                  styles.modeText,
                  !isMaintenance && styles.activeModeText,
                ]}
              >
                Complaint
              </Text>
            </Pressable>

            <Pressable
              style={[styles.mode, isMaintenance && styles.activeMode]}
              onPress={() =>
                router.replace({
                  pathname: "/request",
                  params: { type: "maintenance" },
                })
              }
            >
              <SymbolView
                name={{
                  ios: "wrench.and.screwdriver",
                  android: "build",
                  web: "build",
                }}
                tintColor={isMaintenance ? colors.white : colors.brown}
                size={21}
              />

              <Text
                style={[
                  styles.modeText,
                  isMaintenance && styles.activeModeText,
                ]}
              >
                Maintenance
              </Text>
            </Pressable>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>Issue Subject</Text>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={
                isMaintenance
                  ? "Describe the maintenance issue"
                  : "e.g. Intermittent corridor lighting on 4th floor"
              }
              placeholderTextColor="#9DA6B6"
              style={styles.input}
            />

            <Text style={styles.label}>Category</Text>

            <Pressable
              style={styles.categorySelector}
              onPress={() => setCategoryOpen(true)}
            >
              <Text
                style={[styles.categoryValue, !category && styles.placeholder]}
              >
                {category || "Select Category"}
              </Text>
              <Text style={styles.categoryChevron}>⌄</Text>
            </Pressable>

            <Modal
              visible={categoryOpen}
              transparent
              animationType="fade"
              onRequestClose={() => setCategoryOpen(false)}
            >
              <Pressable
                style={styles.modalBackdrop}
                onPress={() => setCategoryOpen(false)}
              >
                <View style={styles.categoryMenu}>
                  <Text style={styles.categoryMenuTitle}>Select Category</Text>
                  {categories.map((item) => (
                    <Pressable
                      key={item}
                      style={styles.categoryMenuOption}
                      onPress={() => {
                        setCategory(item);
                        setCategoryOpen(false);
                      }}
                    >
                      <Text style={styles.categoryMenuText}>{item}</Text>
                    </Pressable>
                  ))}
                </View>
              </Pressable>
            </Modal>

            <Text style={styles.label}>Priority Level</Text>

            <View style={styles.priorityRow}>
              {priorities.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setPriority(item)}
                  style={[
                    styles.priorityOption,
                    priority === item && styles.selectedPriority,
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      priority === item && styles.selectedText,
                    ]}
                  >
                    {item[0].toUpperCase() + item.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Description</Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder={
                isMaintenance
                  ? "Describe the facility work required"
                  : "Describe the issue in detail for the facility team..."
              }
              placeholderTextColor="#9DA6B6"
              multiline
              textAlignVertical="top"
              style={[styles.input, styles.description]}
            />

            <View style={styles.documentation}>
              <View style={styles.cameraIcon}>
                <SymbolView
                  name={{
                    ios: "camera",
                    android: "photo_camera",
                    web: "photo_camera",
                  }}
                  tintColor={colors.brown}
                  size={27}
                />
              </View>

              <Text style={styles.documentationTitle}>
                Attach photo (optional, image_url)
              </Text>

              <Text style={styles.documentationText}>JPEG, PNG up to 10MB</Text>
            </View>

            <Pressable
              style={[styles.submitButton, submitting && styles.disabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitText}>
                {submitting ? "Submitting..." : "Submit Request"}
              </Text>

              <Text style={styles.submitArrow}>→</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function RequestStatus({
  request,
  isMaintenance,
  onBack,
}: {
  request: ExistingRequest;
  isMaintenance: boolean;
  onBack: () => void;
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.statusContainer}>
        <View style={styles.statusHeader}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>
              {isMaintenance ? "Maintenance Status" : "Complaint Status"}
            </Text>
            <Text style={styles.subtitle}>ESTATE REGISTRY • FLAT 402</Text>
          </View>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>
              {request.status.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.statusTitle}>{request.title}</Text>
          <Text style={styles.statusDescription}>{request.description}</Text>

          <StatusRow label="Category" value={request.category} />
          <StatusRow label="Priority" value={request.priority} />
          <StatusRow
            label="Submitted"
            value={new Date(request.created_at).toLocaleString()}
          />
          {request.updated_at && (
            <StatusRow
              label="Last Updated"
              value={new Date(request.updated_at).toLocaleString()}
            />
          )}
        </View>

        <View style={styles.statusNotice}>
          <Text style={styles.statusNoticeTitle}>Request tracking</Text>
          <Text style={styles.statusNoticeText}>
            Your {isMaintenance ? "maintenance request" : "complaint"} is saved
            in the society records. The status shown here updates when the
            society team takes action.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statusRow}>
      <Text style={styles.statusRowLabel}>{label}</Text>
      <Text style={styles.statusRowValue}>{value}</Text>
    </View>
  );
}

const colors = {
  background: "#FFF9F7",
  brown: "#AE6039",
  darkBrown: "#713719",
  ink: "#3A1B10",
  muted: "#806D66",
  peach: "#FFF5E9",
  peachStrong: "#F4E5CB",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },

  statusLoading: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },

  statusLoadingText: {
    color: colors.brown,
    fontSize: 17,
  },

  statusContainer: {
    paddingBottom: 40,
    paddingHorizontal: 28,
    paddingTop: 25,
  },

  statusHeader: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 35,
  },

  statusCard: {
    backgroundColor: colors.peach,
    borderColor: colors.brown,
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 25,
  },

  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.peachStrong,
    borderRadius: 16,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },

  statusBadgeText: {
    color: colors.darkBrown,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.8,
  },

  statusTitle: {
    color: colors.darkBrown,
    fontFamily: "Georgia",
    fontSize: 27,
    fontWeight: "700",
    marginTop: 22,
  },

  statusDescription: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 27,
    marginTop: 14,
  },

  statusRow: {
    borderTopColor: "#E3C8B9",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
    paddingTop: 15,
  },

  statusRowLabel: {
    color: colors.muted,
    fontSize: 15,
  },

  statusRowValue: {
    color: colors.ink,
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 15,
    textAlign: "right",
  },

  statusNotice: {
    backgroundColor: colors.peachStrong,
    borderRadius: 13,
    marginTop: 20,
    padding: 18,
  },

  statusNoticeTitle: {
    color: colors.darkBrown,
    fontSize: 17,
    fontWeight: "600",
  },

  statusNoticeText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
  },

  container: {
    paddingBottom: 30,
    paddingHorizontal: 28,
    paddingTop: 20,
  },

  header: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 45,
  },

  backButton: {
    paddingRight: 18,
  },

  backArrow: {
    color: colors.ink,
    fontSize: 42,
    lineHeight: 42,
  },

  headerCopy: {
    flex: 1,
  },

  title: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 29,
    fontWeight: "700",
  },

  subtitle: {
    color: colors.brown,
    fontSize: 15,
    letterSpacing: 1.4,
    marginTop: 3,
  },

  headerIcon: {
    alignItems: "center",
    backgroundColor: colors.darkBrown,
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    width: 56,
  },

  docket: {
    alignItems: "center",
    backgroundColor: colors.peach,
    borderColor: colors.brown,
    borderRadius: 18,
    borderWidth: 1.5,
    flexDirection: "row",
    minHeight: 145,
    paddingHorizontal: 28,
  },

  docketIcon: {
    alignItems: "center",
    backgroundColor: colors.peachStrong,
    borderRadius: 35,
    height: 69,
    justifyContent: "center",
    width: 69,
  },

  docketCopy: {
    flex: 1,
    marginLeft: 20,
  },

  docketTitle: {
    color: colors.darkBrown,
    fontSize: 25,
  },

  docketSubtitle: {
    color: colors.brown,
    fontSize: 14,
    marginTop: 4,
  },

  draftingPill: {
    backgroundColor: "#FFF1BF",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },

  draftingText: {
    color: colors.darkBrown,
    fontSize: 15,
  },

  modeSwitch: {
    backgroundColor: colors.peach,
    borderColor: colors.brown,
    borderRadius: 17,
    borderWidth: 1.5,
    flexDirection: "row",
    marginTop: 34,
    padding: 7,
  },

  mode: {
    alignItems: "center",
    borderRadius: 14,
    flex: 1,
    flexDirection: "row",
    gap: 13,
    height: 64,
    justifyContent: "center",
  },

  activeMode: {
    backgroundColor: colors.brown,
  },

  modeText: {
    color: colors.darkBrown,
    fontSize: 20,
  },

  activeModeText: {
    color: colors.white,
    fontWeight: "600",
  },

  formCard: {
    backgroundColor: colors.peach,
    borderColor: colors.brown,
    borderRadius: 20,
    borderWidth: 1.5,
    marginTop: 34,
    padding: 28,
  },

  label: {
    color: colors.darkBrown,
    fontSize: 22,
    marginBottom: 12,
    marginTop: 3,
  },

  input: {
    backgroundColor: colors.peach,
    borderColor: colors.brown,
    borderRadius: 17,
    borderWidth: 1.5,
    color: colors.ink,
    fontSize: 19,
    minHeight: 80,
    paddingHorizontal: 27,
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  categorySelector: {
    alignItems: "center",
    backgroundColor: colors.peach,
    borderColor: colors.brown,
    borderRadius: 17,
    borderWidth: 1.5,
    flexDirection: "row",
    height: 80,
    justifyContent: "space-between",
    paddingHorizontal: 27,
  },

  categoryValue: {
    color: colors.darkBrown,
    fontSize: 19,
  },

  placeholder: {
    color: "#9DA6B6",
  },

  categoryChevron: {
    color: colors.brown,
    fontSize: 27,
    fontWeight: "700",
  },

  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(58, 27, 16, 0.28)",
    flex: 1,
    justifyContent: "center",
    padding: 28,
  },

  categoryMenu: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 20,
    width: "100%",
  },

  categoryMenuTitle: {
    color: colors.darkBrown,
    fontFamily: "Georgia",
    fontSize: 22,
    marginBottom: 8,
  },

  categoryMenuOption: {
    borderTopColor: "#F0DCD0",
    borderTopWidth: 1,
    paddingVertical: 15,
  },

  categoryMenuText: {
    color: colors.ink,
    fontSize: 17,
  },

  categoryOption: {
    borderColor: colors.brown,
    borderRadius: 15,
    borderWidth: 1.5,
    minWidth: "30%",
    paddingHorizontal: 13,
    paddingVertical: 12,
  },

  categoryText: {
    color: colors.darkBrown,
    fontSize: 16,
    textAlign: "center",
  },

  selectedOption: {
    backgroundColor: colors.brown,
  },

  selectedText: {
    color: colors.white,
    fontWeight: "600",
  },

  priorityRow: {
    flexDirection: "row",
    gap: 12,
  },

  priorityOption: {
    alignItems: "center",
    borderColor: colors.brown,
    borderRadius: 15,
    borderWidth: 1.5,
    flex: 1,
    justifyContent: "center",
    minHeight: 60,
  },

  selectedPriority: {
    backgroundColor: colors.brown,
  },

  priorityText: {
    color: colors.darkBrown,
    fontSize: 18,
  },

  description: {
    height: 180,
    paddingTop: 20,
  },

  documentation: {
    alignItems: "center",
    backgroundColor: colors.peachStrong,
    borderColor: colors.brown,
    borderRadius: 17,
    borderStyle: "dashed",
    borderWidth: 1.5,
    marginTop: 31,
    paddingHorizontal: 15,
    paddingVertical: 28,
  },

  cameraIcon: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    width: 56,
  },

  documentationTitle: {
    color: colors.darkBrown,
    fontSize: 18,
    marginTop: 17,
    textAlign: "center",
  },

  documentationText: {
    color: colors.brown,
    fontSize: 16,
    marginTop: 7,
  },

  submitButton: {
    alignItems: "center",
    backgroundColor: colors.brown,
    borderRadius: 17,
    flexDirection: "row",
    height: 88,
    justifyContent: "center",
    marginTop: 38,
  },

  disabled: {
    opacity: 0.6,
  },

  submitText: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "600",
  },

  submitArrow: {
    color: colors.white,
    fontSize: 34,
    marginLeft: 18,
  },
});
