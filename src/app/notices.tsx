import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { colors } from "../styles/theme";

type Notice = {
  id: string;
  title: string;
  date: string;
  priority: "High" | "Medium" | "General";
  content: string;
};

export default function Notices() {
  const router = useRouter();

  const [notices] = useState<Notice[]>([
    {
      id: "n-1",
      title: "Water maintenance scheduled",
      date: "10 Oct 2026",
      priority: "High",
      content:
        "Water supply maintenance will be carried out on Sunday morning between 9:00 AM and 11:00 AM. Residents are requested to store water in advance.",
    },
    {
      id: "n-2",
      title: "Visitor entry timing update",
      date: "08 Oct 2026",
      priority: "Medium",
      content:
        "Gate entry timings for visitors have been extended till 9:00 PM for the next two weekends.",
    },
    {
      id: "n-3",
      title: "Community cleanliness drive",
      date: "04 Oct 2026",
      priority: "General",
      content:
        "The society committee is organizing a community cleanliness drive this Saturday at 8:00 AM.",
    },
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>

          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>GATED</Text>
            <Text style={styles.title}>Notices</Text>
          </View>
        </View>

        {notices.map((notice) => (
          <View key={notice.id} style={styles.noticeCard}>
            <View style={styles.noticeHeader}>
              <Text style={styles.noticeTitle}>{notice.title}</Text>
              <Text
                style={[
                  styles.priorityPill,
                  notice.priority === "High"
                    ? styles.high
                    : notice.priority === "Medium"
                      ? styles.medium
                      : styles.general,
                ]}
              >
                {notice.priority}
              </Text>
            </View>

            <Text style={styles.noticeDate}>{notice.date}</Text>
            <Text style={styles.noticeContent}>{notice.content}</Text>
          </View>
        ))}
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
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 36,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 18,
  },
  backButton: {
    paddingRight: 12,
  },
  backText: {
    color: colors.brown,
    fontSize: 34,
    lineHeight: 34,
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    color: colors.brown,
    fontFamily: "Georgia",
    fontSize: 12,
    letterSpacing: 1.5,
  },
  title: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 4,
  },
  noticeCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    marginBottom: 14,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  noticeHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noticeTitle: {
    color: colors.ink,
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    marginRight: 12,
  },
  priorityPill: {
    borderRadius: 12,
    fontSize: 10,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  high: {
    backgroundColor: "#FFE1E0",
    color: "#C53B3B",
  },
  medium: {
    backgroundColor: "#FFF1BE",
    color: "#9A6A00",
  },
  general: {
    backgroundColor: "#DFF3D9",
    color: "#28742D",
  },
  noticeDate: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 8,
  },
  noticeContent: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
  },
});
