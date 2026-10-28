import { useRouter } from "expo-router";
import { useState } from "react";
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

import { colors } from "../styles/theme";

type VisitorRequest = {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  date: string;
  time: string;
  status: "Pending" | "Approved";
};

export default function Visitors() {
  const router = useRouter();

  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");

  const [requests, setRequests] = useState<VisitorRequest[]>([
    {
      id: "demo-1",
      name: "Aisha Patel",
      phone: "+91 98xxxxxx12",
      purpose: "Family visit",
      date: "2026-10-30",
      time: "18:00",
      status: "Approved",
    },
  ]);

  const handleSubmit = () => {
    if (!visitorName.trim() || !visitorPhone.trim() || !purpose.trim()) {
      Alert.alert(
        "Missing details",
        "Please fill visitor name, phone number, and purpose.",
      );
      return;
    }

    const newRequest: VisitorRequest = {
      id: `v-${Date.now()}`,
      name: visitorName.trim(),
      phone: visitorPhone.trim(),
      purpose: purpose.trim(),
      date: visitDate || "Today",
      time: visitTime || "Flexible",
      status: "Pending",
    };

    setRequests((prev) => [newRequest, ...prev]);

    setVisitorName("");
    setVisitorPhone("");
    setPurpose("");
    setVisitDate("");
    setVisitTime("");

    Alert.alert(
      "Visitor pass requested",
      "Your visitor request has been submitted to the gate desk for approval.",
    );
  };

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
            <Text style={styles.title}>Visitor Pass</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Visitor details</Text>

          <Text style={styles.label}>Full name</Text>
          <TextInput
            value={visitorName}
            onChangeText={setVisitorName}
            placeholder="Enter visitor name"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
          />

          <Text style={styles.label}>Phone number</Text>
          <TextInput
            value={visitorPhone}
            onChangeText={setVisitorPhone}
            placeholder="Enter mobile number"
            placeholderTextColor={colors.placeholder}
            keyboardType="phone-pad"
            style={styles.input}
          />

          <Text style={styles.label}>Purpose of visit</Text>
          <TextInput
            value={purpose}
            onChangeText={setPurpose}
            placeholder="Family visit / delivery / meeting"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
          />

          <View style={styles.rowTwo}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Date</Text>
              <TextInput
                value={visitDate}
                onChangeText={setVisitDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.placeholder}
                style={styles.input}
              />
            </View>

            <View style={styles.halfField}>
              <Text style={styles.label}>Time</Text>
              <TextInput
                value={visitTime}
                onChangeText={setVisitTime}
                placeholder="HH:MM"
                placeholderTextColor={colors.placeholder}
                style={styles.input}
              />
            </View>
          </View>

          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Request Visitor Pass</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.sectionLabel}>Recent invitations</Text>
        </View>

        {requests.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No visitor passes requested yet.
            </Text>
          </View>
        ) : (
          requests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.requestTopRow}>
                <Text style={styles.requestName}>{request.name}</Text>
                <Text
                  style={[
                    styles.statusPill,
                    request.status === "Approved"
                      ? styles.approved
                      : styles.pending,
                  ]}
                >
                  {request.status}
                </Text>
              </View>

              <Text style={styles.requestMeta}>{request.phone}</Text>
              <Text style={styles.requestMeta}>{request.purpose}</Text>
              <Text style={styles.requestMeta}>
                {request.date} • {request.time}
              </Text>
            </View>
          ))
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
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 36,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20,
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
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionLabel: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 14,
  },
  label: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 6,
  },
  input: {
    backgroundColor: colors.peach,
    borderRadius: 12,
    color: colors.ink,
    fontSize: 16,
    height: 48,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  rowTwo: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: colors.brown,
    borderRadius: 14,
    flexDirection: "row",
    height: 58,
    justifyContent: "center",
    marginTop: 18,
  },
  submitText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  arrow: {
    color: colors.white,
    fontSize: 24,
    marginLeft: 10,
  },
  listHeader: {
    marginTop: 24,
    marginBottom: 12,
  },
  requestCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    marginBottom: 12,
    padding: 14,
  },
  requestTopRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  requestName: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "600",
  },
  statusPill: {
    borderRadius: 12,
    fontSize: 10,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  approved: {
    backgroundColor: "#DFF3D9",
    color: "#28742D",
  },
  pending: {
    backgroundColor: "#FFF1BE",
    color: "#9A6A00",
  },
  requestMeta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 5,
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 18,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 15,
    textAlign: "center",
  },
});
