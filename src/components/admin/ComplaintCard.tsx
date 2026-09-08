import { Pressable, Text, View } from "react-native";

import { dashboardStyles } from "../../styles/dashboardStyles";

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
  onAssign?: () => void;
};

export default function ComplaintCard({
  complaint,
  onAssign,
}: ComplaintCardProps) {
  const priority = complaint.priority || "low";
  const status = complaint.status || "submitted";

  const priorityStyle =
    priority === "high"
      ? dashboardStyles.priority
      : priority === "medium"
        ? dashboardStyles.mediumPriority
        : dashboardStyles.lowPriority;

  const date = complaint.created_at
    ? new Date(complaint.created_at).toLocaleDateString()
    : "Recently";

  return (
    <Pressable style={dashboardStyles.requestCard} onPress={onAssign}>
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

        {onAssign && (
          <Text style={dashboardStyles.requestAction}>Assign →</Text>
        )}
      </View>
    </Pressable>
  );
}
