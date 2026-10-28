import { SymbolView } from "expo-symbols";
import { Pressable, Text, View } from "react-native";

import {
  dashboardColors,
  dashboardStyles,
} from "../../styles/dashboardStyles";

export type RequestItem = {
  id: string;
  title: string | null;
  category: string | null;
  priority: string | null;
  status: string | null;
  created_at: string | null;
};

type RequestCardProps = {
  item: RequestItem;
  onPress?: () => void;
};

export default function RequestCard({ item, onPress }: RequestCardProps) {
  const category = item?.category || "Other";
  const title = item?.title || "Untitled request";
  const priority = item?.priority || "low";
  const status = item?.status || "submitted";

  const formattedDate = item?.created_at
    ? new Date(item.created_at).toLocaleDateString()
    : "Recently";

  const priorityStyle =
    priority === "high"
      ? dashboardStyles.priority
      : priority === "medium"
        ? dashboardStyles.mediumPriority
        : dashboardStyles.lowPriority;

  return (
    <Pressable style={dashboardStyles.requestCard} onPress={onPress}>
      <View style={dashboardStyles.requestHeader}>
        <Text style={dashboardStyles.category}>{category.toUpperCase()}</Text>

        <Text style={dashboardStyles.separator}>•</Text>

        <Text style={dashboardStyles.requestDate}>{formattedDate}</Text>

        <Text style={priorityStyle}>{priority.toUpperCase()}</Text>
      </View>

      <Text style={dashboardStyles.requestTitle}>{title}</Text>

      <View style={dashboardStyles.requestFooter}>
        <Text style={dashboardStyles.statusText}>Status: {status}</Text>

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
      </View>
    </Pressable>
  );
}
