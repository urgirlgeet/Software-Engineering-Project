import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
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

import {
  complaintCategories,
  complaintPriorities,
} from "../constants/complaints";
import { supabase } from "../lib/supabase";
import { colors as themeColors } from "../styles/theme";
import BackButton from "../components/BackButton";

const maintenanceCategories = [
  "Electrical",
  "Plumbing",
  "HVAC",
  "Security",
  "Other",
];

type RequestType = "complaint" | "maintenance";

type ExistingRequest = {
  category: string;
  created_at: string;
  description: string;
  priority: string;
  status: string;
  title: string;
  updated_at: string | null;
  assigned_to: string | null;
  resolution_note: string | null;
  resolved_at: string | null;
};

function FormLabel({
  icon,
  label,
}: {
  icon: SymbolViewProps["name"];
  label: string;
}) {
  return (
    <View style={styles.fieldLabel}>
      <SymbolView name={icon} tintColor={colors.brown} size={17} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export default function Request() {
  const router = useRouter();

  const { type, id } = useLocalSearchParams<{
    type?: RequestType;
    id?: string;
  }>();

  const requestType: RequestType =
    type === "maintenance" ? "maintenance" : "complaint";

  const isMaintenance = requestType === "maintenance";
  const categories = isMaintenance ? maintenanceCategories : complaintCategories;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] =
    useState<(typeof complaintPriorities)[number]>("normal");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [existingRequest, setExistingRequest] =
    useState<ExistingRequest | null>(null);
  const [loadingRequest, setLoadingRequest] = useState(Boolean(id));
  const [assignedName, setAssignedName] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadRequest = async () => {
      setLoadingRequest(true);
      try {
        const table = isMaintenance ? "maintenance_requests" : "complaints";
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          Alert.alert("Unable to load request", authError.message);
          return;
        }

        if (!user) {
          router.replace("/signin");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("id")
          .eq("auth_user_id", user.id)
          .single();

        if (profileError || !profile) {
          Alert.alert(
            "Unable to load request",
            profileError?.message || "Your user profile could not be found.",
          );
          return;
        }

        const { data, error } = await supabase
          .from(table)
          .select(
            "title, category, priority, status, description, created_at, updated_at, assigned_to, resolution_note, resolved_at",
          )
          .eq("id", id)
          .eq("user_id", profile.id)
          .single();

        if (error || !data) {
          Alert.alert(
            "Unable to load request",
            error?.message || "This request could not be found.",
            [{ text: "Back", onPress: () => router.back() }],
          );
        } else {
          setExistingRequest(data);
          if (data.assigned_to) {
            const { data: assignee, error: assigneeError } = await supabase
              .from("users")
              .select("name")
              .eq("id", data.assigned_to)
              .single();

            if (assigneeError) {
              Alert.alert(
                "Unable to load assignment",
                assigneeError.message,
              );
            } else {
              setAssignedName(assignee.name);
            }
          }
        }
      } catch {
        Alert.alert("Unable to load request", "Please try again.");
      } finally {
        setLoadingRequest(false);
      }
    };

    loadRequest();
  }, [id, isMaintenance]);

  const handleSubmit = async () => {
    if (
      !title.trim() ||
      !category ||
      !categories.includes(category) ||
      !description.trim()
    ) {
      Alert.alert(
        "Incomplete request",
        "Please complete the subject, choose a valid category, and add a description.",
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
      const createdAt = new Date().toISOString();

      const { error } = await supabase.from(table).insert({
        user_id: profile.id,
        society_id: profile.society_id,
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        status: "submitted",
        created_at: createdAt,
        updated_at: createdAt,
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
          assignedName={assignedName}
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
            <BackButton onPress={() => router.back()} style={styles.backButton} />

            <View style={styles.headerCopy}>
              <Text style={styles.title}>
                {isMaintenance ? "Request Maintenance" : "Raise Complaint"}
              </Text>

              <Text style={styles.subtitle}>
                SOCIETY SERVICE • RESIDENT PORTAL
              </Text>
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
                  : "SOCIETY SERVICE REQUEST"}
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
            <FormLabel
              icon={{
                ios: "text.alignleft",
                android: "subject",
                web: "subject",
              }}
              label="Issue Subject"
            />

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={
                isMaintenance
                  ? "Describe the maintenance issue"
                  : "e.g. Intermittent corridor lighting on 4th floor"
              }
              placeholderTextColor={colors.placeholder}
              style={styles.input}
            />

            <FormLabel
              icon={{ ios: "tag", android: "label", web: "label" }}
              label="Category"
            />

            <Pressable
              style={styles.categorySelector}
              onPress={() => setCategoryOpen(true)}
            >
              <Text
                style={[styles.categoryValue, !category && styles.placeholder]}
              >
                {category || "Select Category"}
              </Text>
              <SymbolView
                name={{
                  ios: "chevron.down",
                  android: "expand_more",
                  web: "expand_more",
                }}
                tintColor={colors.brown}
                size={20}
              />
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

            <FormLabel
              icon={{ ios: "flag", android: "flag", web: "flag" }}
              label="Priority Level"
            />

            <View style={styles.priorityRow}>
              {complaintPriorities.map((item) => (
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

            <FormLabel
              icon={{
                ios: "text.alignleft",
                android: "subject",
                web: "subject",
              }}
              label="Description"
            />

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder={
                isMaintenance
                  ? "Describe the facility work required"
                  : "Describe the issue in detail for the facility team..."
              }
              placeholderTextColor={colors.placeholder}
              multiline
              textAlignVertical="top"
              style={[styles.input, styles.description]}
            />

            <Pressable
              style={[styles.submitButton, submitting && styles.disabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitText}>
                {submitting ? "Submitting..." : "Submit Request"}
              </Text>

              <SymbolView
                name={{
                  ios: "arrow.right",
                  android: "arrow_forward",
                  web: "arrow_forward",
                }}
                tintColor={colors.white}
                size={20}
              />
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
  assignedName,
  onBack,
}: {
  request: ExistingRequest;
  isMaintenance: boolean;
  assignedName: string | null;
  onBack: () => void;
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.statusContainer}>
        <View style={styles.statusHeader}>
          <BackButton onPress={onBack} style={styles.backButton} />
          <View style={styles.headerCopy}>
            <Text style={styles.title}>
              {isMaintenance ? "Maintenance Status" : "Complaint Status"}
            </Text>
            <Text style={styles.subtitle}>REQUEST TRACKING • SOCIETY SERVICE</Text>
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
          {assignedName && <StatusRow label="Assigned to" value={assignedName} />}
          {request.updated_at && (
            <StatusRow
              label="Last Updated"
              value={new Date(request.updated_at).toLocaleString()}
            />
          )}
          {request.resolved_at && (
            <StatusRow
              label="Resolved"
              value={new Date(request.resolved_at).toLocaleString()}
            />
          )}
        </View>

        {request.resolution_note && (
          <View style={styles.statusNotice}>
            <Text style={styles.statusNoticeTitle}>Resolution</Text>
            <Text style={styles.statusNoticeText}>{request.resolution_note}</Text>
          </View>
        )}

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
  const icon: SymbolViewProps["name"] =
    label === "Category"
      ? { ios: "tag", android: "label", web: "label" }
      : label === "Priority"
        ? { ios: "flag", android: "flag", web: "flag" }
        : label === "Assigned to"
          ? { ios: "person", android: "person", web: "person" }
          : { ios: "clock", android: "schedule", web: "schedule" };

  return (
    <View style={styles.statusRow}>
      <View style={styles.statusLabel}>
        <SymbolView name={icon} tintColor={colors.brown} size={15} />
        <Text style={styles.statusRowLabel}>{label}</Text>
      </View>
      <Text style={styles.statusRowValue}>{value}</Text>
    </View>
  );
}

const colors = {
  background: themeColors.background,
  brown: themeColors.copper,
  darkBrown: themeColors.brown,
  ink: themeColors.ink,
  muted: themeColors.muted,
  peach: themeColors.peach,
  peachStrong: themeColors.peachStrong,
  white: themeColors.white,
  placeholder: themeColors.placeholder,
  border: themeColors.softCopper,
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
    paddingBottom: 34,
    paddingHorizontal: 22,
    paddingTop: 22,
  },

  statusHeader: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 24,
  },

  statusCard: {
    backgroundColor: colors.peach,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
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
    fontSize: 23,
    fontWeight: "700",
    marginTop: 17,
  },

  statusDescription: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
  },

  statusRow: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 12,
  },

  statusRowLabel: {
    color: colors.muted,
    fontSize: 13,
  },

  statusLabel: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
  },

  statusRowValue: {
    color: colors.ink,
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 15,
    textAlign: "right",
  },

  statusNotice: {
    backgroundColor: colors.peachStrong,
    borderRadius: 12,
    marginTop: 16,
    padding: 15,
  },

  statusNoticeTitle: {
    color: colors.darkBrown,
    fontSize: 15,
    fontWeight: "600",
  },

  statusNoticeText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },

  container: {
    paddingBottom: 34,
    paddingHorizontal: 22,
    paddingTop: 22,
  },

  header: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 24,
  },

  backButton: {
    paddingRight: 18,
  },

  headerCopy: {
    flex: 1,
  },

  title: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 25,
    fontWeight: "700",
  },

  subtitle: {
    color: colors.brown,
    fontSize: 12,
    letterSpacing: 1,
    marginTop: 3,
  },

  headerIcon: {
    alignItems: "center",
    backgroundColor: colors.darkBrown,
    borderRadius: 28,
    height: 48,
    justifyContent: "center",
    width: 48,
  },

  docket: {
    alignItems: "center",
    backgroundColor: colors.peach,
    borderColor: colors.brown,
    borderRadius: 18,
    borderWidth: 1.5,
    flexDirection: "row",
    minHeight: 96,
    paddingHorizontal: 16,
  },

  docketIcon: {
    alignItems: "center",
    backgroundColor: colors.peachStrong,
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    width: 56,
  },

  docketCopy: {
    flex: 1,
    marginLeft: 14,
  },

  docketTitle: {
    color: colors.darkBrown,
    fontSize: 17,
  },

  docketSubtitle: {
    color: colors.brown,
    fontSize: 11,
    marginTop: 4,
  },

  draftingPill: {
    backgroundColor: colors.peachStrong,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },

  draftingText: {
    color: colors.darkBrown,
    fontSize: 11,
  },

  modeSwitch: {
    backgroundColor: colors.peach,
    borderColor: colors.brown,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: "row",
    marginTop: 20,
    padding: 5,
  },

  mode: {
    alignItems: "center",
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    height: 48,
    justifyContent: "center",
  },

  activeMode: {
    backgroundColor: colors.brown,
  },

  modeText: {
    color: colors.darkBrown,
    fontSize: 14,
  },

  activeModeText: {
    color: colors.white,
    fontWeight: "600",
  },

  formCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 20,
    padding: 20,
  },

  label: {
    color: colors.darkBrown,
    fontSize: 15,
    fontWeight: "600",
  },

  fieldLabel: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
    marginTop: 14,
  },

  input: {
    backgroundColor: colors.peach,
    borderColor: colors.brown,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 15,
    minHeight: 52,
    paddingHorizontal: 14,
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
    height: 52,
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },

  categoryValue: {
    color: colors.darkBrown,
    fontSize: 15,
  },

  placeholder: {
    color: colors.placeholder,
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
    fontSize: 17,
    marginBottom: 8,
  },

  categoryMenuOption: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingVertical: 15,
  },

  categoryMenuText: {
    color: colors.ink,
    fontSize: 15,
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
    fontSize: 14,
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
    minHeight: 48,
  },

  selectedPriority: {
    backgroundColor: colors.brown,
  },

  priorityText: {
    color: colors.darkBrown,
    fontSize: 14,
  },

  description: {
    height: 140,
    paddingTop: 14,
  },

  submitButton: {
    alignItems: "center",
    backgroundColor: colors.brown,
    borderRadius: 12,
    flexDirection: "row",
    height: 56,
    justifyContent: "center",
    marginTop: 24,
  },

  disabled: {
    opacity: 0.6,
  },

  submitText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },

});
