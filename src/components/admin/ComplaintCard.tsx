import { SymbolView } from "expo-symbols";
import { Pressable, Text, View } from "react-native";

import {
  dashboardColors,
  dashboardStyles,
} from "../../styles/dashboardStyles";

export type AdminComplaint = {
  id: string;
  title: string | null;
  category: string | null;
  priority: string | null;
  status: string | null;
  created_at: string | null;
  assigned_to: string | null;
};

type ComplaintCardProps = {
  complaint: AdminComplaint;
  onPress?: () => void;
  onAssign?: () => void;
};

export default function ComplaintCard({
  complaint,
  onPress,
  onAssign,
}: ComplaintCardProps) {
  const priority = complaint.priority || "low";
  const status = complaint.status || "submitted";

  const priorityStyle =
    priority === "urgent" || priority === "high"
      ? dashboardStyles.priority
      : priority === "normal" || priority === "medium"
        ? dashboardStyles.mediumPriority
        : dashboardStyles.lowPriority;

  const date = complaint.created_at
    ? new Date(complaint.created_at).toLocaleDateString()
    : "Recently";

  return (
    <View style={dashboardStyles.requestCard}>
      <Pressable onPress={onPress}>
        <View style={dashboardStyles.requestHeader}>
          <Text style={dashboardStyles.category}>
            {(complaint.category || "Other").toUpperCase()}
          </Text>

          <Text style={dashboardStyles.separator}>•</Text>

          <Text style={dashboardStyles.requestDate}>{date}</Text>

          <Text style={priorityStyle}>{priority.toUpperCase()}</Text>
        </View>

        <Text style={dashboardStyles.requestTitle}>
          {complaint.title || "Untitled complaint"}
        </Text>

        <View style={dashboardStyles.requestFooter}>
          <Text style={dashboardStyles.statusText}>Status: {status}</Text>
          {onPress && (
            <View style={dashboardStyles.actionInline}>
              <Text style={dashboardStyles.requestAction}>View details</Text>
              <SymbolView
                name={{
                  ios: "arrow.right",
                  android: "arrow_forward",
                  web: "arrow_forward",
                }}
                tintColor={dashboardColors.brown}
                size={15}
              />
            </View>
          )}
        </View>
      </Pressable>

      {onAssign && !["resolved", "closed", "rejected"].includes(status) && (
        <Pressable
          accessibilityRole="button"
          onPress={onAssign}
          style={{ alignSelf: "flex-end", paddingTop: 10 }}
        >
          <View style={dashboardStyles.actionInline}>
            <Text style={dashboardStyles.requestAction}>
              {complaint.assigned_to ? "Reassign" : "Assign"}
            </Text>
            <SymbolView
              name={{
                ios: "arrow.right",
                android: "arrow_forward",
                web: "arrow_forward",
              }}
              tintColor={dashboardColors.brown}
              size={15}
            />
          </View>
        </Pressable>
      )}
    </View>
  );
}
