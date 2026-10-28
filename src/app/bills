import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    Alert,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { colors } from "../styles/theme";

type Bill = {
  id: string;
  label: string;
  dueDate: string;
  amount: number;
  status: "Pending" | "Paid";
};

export default function Bills() {
  const router = useRouter();

  const [bills, setBills] = useState<Bill[]>([
    {
      id: "dues-1",
      label: "Maintenance Dues",
      dueDate: "Due on 15 Oct 2026",
      amount: 4200,
      status: "Pending",
    },
    {
      id: "dues-2",
      label: "Security Services",
      dueDate: "Due on 22 Oct 2026",
      amount: 1800,
      status: "Pending",
    },
    {
      id: "dues-3",
      label: "Water & Power",
      dueDate: "Paid on 04 Oct 2026",
      amount: 1250,
      status: "Paid",
    },
  ]);

  const [selectedId, setSelectedId] = useState<string>("dues-1");

  const pendingBills = useMemo(
    () => bills.filter((bill) => bill.status === "Pending"),
    [bills],
  );

  const selectedBill = useMemo(
    () => bills.find((bill) => bill.id === selectedId) ?? pendingBills[0],
    [bills, selectedId, pendingBills],
  );

  const totalDue = useMemo(
    () => pendingBills.reduce((sum, bill) => sum + bill.amount, 0),
    [pendingBills],
  );

  const paySelectedBill = () => {
    if (!selectedBill) {
      Alert.alert("No bill selected", "Please select a due item.");
      return;
    }

    setBills((prev) =>
      prev.map((bill) =>
        bill.id === selectedBill.id
          ? { ...bill, status: "Paid", dueDate: "Paid now" }
          : bill,
      ),
    );

    Alert.alert(
      "Payment successful",
      `₹${selectedBill.amount.toLocaleString("en-IN")} has been paid for ${selectedBill.label}.`,
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
            <Text style={styles.title}>Pay Dues</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.smallLabel}>Outstanding total</Text>
          <Text style={styles.totalAmount}>
            ₹{totalDue.toLocaleString("en-IN")}
          </Text>
          <Text style={styles.summarySub}>
            {pendingBills.length} pending dues
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bills</Text>
        </View>

        {bills.map((bill) => {
          const isSelected = bill.id === selectedId;
          const isPending = bill.status === "Pending";

          return (
            <Pressable
              key={bill.id}
              onPress={() => setSelectedId(bill.id)}
              style={[
                styles.billCard,
                isSelected && styles.billCardSelected,
                !isPending && styles.billCardPaid,
              ]}
            >
              <View style={styles.billTopRow}>
                <View>
                  <Text style={styles.billLabel}>{bill.label}</Text>
                  <Text style={styles.billDate}>{bill.dueDate}</Text>
                </View>

                <Text
                  style={[
                    styles.billAmount,
                    !isPending && styles.billAmountPaid,
                  ]}
                >
                  ₹{bill.amount.toLocaleString("en-IN")}
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Text
                  style={[
                    styles.statusPill,
                    isPending ? styles.pending : styles.paid,
                  ]}
                >
                  {bill.status}
                </Text>

                {isSelected && isPending ? (
                  <Text style={styles.selectedText}>Selected</Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}

        <View style={styles.paymentBox}>
          <Text style={styles.paymentHeading}>Payment method</Text>
          <Text style={styles.paymentMethod}>UPI / Card / Net Banking</Text>

          <Pressable style={styles.payButton} onPress={paySelectedBill}>
            <Text style={styles.payText}>Pay Selected Bill</Text>
            <Text style={styles.payArrow}>→</Text>
          </Pressable>
        </View>
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
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  smallLabel: {
    color: colors.muted,
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  totalAmount: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 34,
    fontWeight: "700",
    marginTop: 8,
  },
  summarySub: {
    color: colors.brown,
    fontSize: 14,
    marginTop: 6,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 22,
    fontWeight: "700",
  },
  billCard: {
    backgroundColor: colors.white,
    borderColor: "#E9D8D1",
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  billCardSelected: {
    borderColor: colors.brown,
    backgroundColor: "#FFF8F4",
  },
  billCardPaid: {
    opacity: 0.8,
  },
  billTopRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  billLabel: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "600",
  },
  billDate: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 5,
  },
  billAmount: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "700",
  },
  billAmountPaid: {
    color: "#2A7A3A",
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  statusPill: {
    borderRadius: 20,
    fontSize: 10,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  pending: {
    backgroundColor: "#FFF1BE",
    color: "#9A6A00",
  },
  paid: {
    backgroundColor: "#DFF3D9",
    color: "#28742D",
  },
  selectedText: {
    color: colors.brown,
    fontSize: 12,
    fontWeight: "700",
  },
  paymentBox: {
    backgroundColor: colors.white,
    borderRadius: 18,
    marginTop: 20,
    padding: 18,
  },
  paymentHeading: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "600",
  },
  paymentMethod: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 8,
  },
  payButton: {
    alignItems: "center",
    backgroundColor: colors.brown,
    borderRadius: 14,
    flexDirection: "row",
    height: 58,
    justifyContent: "center",
    marginTop: 18,
  },
  payText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  payArrow: {
    color: colors.white,
    fontSize: 24,
    marginLeft: 10,
  },
});
