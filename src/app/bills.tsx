import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
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

type UserProfile = {
  id: string;
  society_id: string;
  apartment_id: string | null;
  role: string;
};

type Bill = {
  id: string;
  title: string;
  apartment_number: string;
  billing_month: string;
  due_date: string;
  amount: number;
  status: "PENDING" | "PAID";
};

function currentBillingMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(month: string) {
  return new Date(`${month}T00:00:00`).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString();
}

function isCalendarDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export default function Bills() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [billingMonth, setBillingMonth] = useState(currentBillingMonth);
  const [dueDate, setDueDate] = useState("");
  const [amount, setAmount] = useState("");
  const [creating, setCreating] = useState(false);
  const [payingId, setPayingId] = useState("");

  useEffect(() => {
    const loadBills = async () => {
      setLoading(true);
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        setLoadError(authError.message);
        Alert.alert("Unable to load bills", authError.message);
        setLoading(false);
        return;
      }

      if (!user) {
        router.replace("/signin");
        setLoading(false);
        return;
      }

      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("id, society_id, apartment_id, role")
        .eq("auth_user_id", user.id)
        .single();

      if (profileError || !userProfile) {
        const message = profileError?.message || "Your account profile was not found.";
        setLoadError(message);
        Alert.alert("Unable to load bills", message);
        setLoading(false);
        return;
      }

      if (
        (userProfile.role !== "admin" && userProfile.role !== "resident") ||
        !userProfile.society_id ||
        (userProfile.role === "resident" && !userProfile.apartment_id)
      ) {
        const message = "Your account is not set up to view these bills.";
        setLoadError(message);
        Alert.alert("Unable to load bills", message);
        setLoading(false);
        return;
      }

      setProfile(userProfile);

      let query = supabase
        .from("maintenance_bills")
        .select(
          "id, title, apartment_number, billing_month, due_date, amount, status",
        )
        .eq("society_id", userProfile.society_id)
        .order("billing_month", { ascending: false })
        .order("created_at", { ascending: false });

      if (userProfile.role === "resident" && userProfile.apartment_id) {
        query = query.eq("apartment_id", userProfile.apartment_id);
      }

      const { data, error } = await query;
      if (error) {
        setLoadError(error.message);
        Alert.alert("Unable to load bills", error.message);
        setLoading(false);
        return;
      }

      setBills(data);
      setLoading(false);
    };

    void loadBills().catch((error: unknown) => {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred.";
      setLoadError(message);
      setLoading(false);
      Alert.alert("Unable to load bills", message);
    });
  }, [router]);

  const pendingBills = useMemo(
    () => bills.filter((bill) => bill.status === "PENDING"),
    [bills],
  );
  const outstandingTotal = useMemo(
    () => pendingBills.reduce((sum, bill) => sum + Number(bill.amount), 0),
    [pendingBills],
  );
  const collectedTotal = useMemo(
    () =>
      bills
        .filter((bill) => bill.status === "PAID")
        .reduce((sum, bill) => sum + Number(bill.amount), 0),
    [bills],
  );
  const billedTotal = outstandingTotal + collectedTotal;

  const createBill = async () => {
    if (!profile || profile.role !== "admin") {
      Alert.alert("Not allowed", "Only an administrator can create bills.");
      return;
    }

    const monthIsValid = /^\d{4}-(0[1-9]|1[0-2])$/.test(billingMonth);
    const dueDateIsValid = isCalendarDate(dueDate);
    const numericAmount = Number(amount);

    if (!flatNumber.trim() || !monthIsValid || !dueDateIsValid) {
      Alert.alert(
        "Bill details required",
        "Enter a flat number, billing month, and valid due date.",
      );
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert("Invalid amount", "Enter an amount greater than zero.");
      return;
    }

    setCreating(true);
    try {
      const { error } = await supabase.rpc("create_maintenance_bill", {
        p_flat_number: flatNumber.trim(),
        p_billing_month: `${billingMonth}-01`,
        p_due_date: dueDate,
        p_amount: numericAmount,
      });

      if (error) {
        Alert.alert("Unable to create bill", error.message);
        return;
      }

      const { data, error: refreshError } = await supabase
        .from("maintenance_bills")
        .select(
          "id, title, apartment_number, billing_month, due_date, amount, status",
        )
        .eq("society_id", profile.society_id)
        .order("billing_month", { ascending: false })
        .order("created_at", { ascending: false });

      if (refreshError) {
        Alert.alert(
          "Bill created, but the list could not refresh",
          refreshError.message,
        );
        return;
      }

      setBills(data);
      setFlatNumber("");
      setAmount("");
      Alert.alert("Bill created", `The bill for flat ${flatNumber.trim()} was saved.`);
    } catch (error) {
      Alert.alert(
        "Unable to create bill",
        error instanceof Error ? error.message : "An unexpected error occurred.",
      );
    } finally {
      setCreating(false);
    }
  };

  const recordPayment = async (billId: string) => {
    setPayingId(billId);
    try {
      const { error } = await supabase.rpc(
        "record_maintenance_bill_payment",
        { p_bill_id: billId },
      );

      if (error) {
        Alert.alert("Unable to record payment", error.message);
        return;
      }

      setBills((current) =>
        current.map((bill) =>
          bill.id === billId ? { ...bill, status: "PAID" } : bill,
        ),
      );
      Alert.alert(
        "Demo payment recorded",
        "The bill was marked paid in the app. No money was transferred.",
      );
    } catch (error) {
      Alert.alert(
        "Unable to record payment",
        error instanceof Error ? error.message : "An unexpected error occurred.",
      );
    } finally {
      setPayingId("");
    }
  };

  const isAdmin = profile?.role === "admin";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <AppNavigation
          role={profile?.role}
          active="Maintenance bills"
        />

        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>SOCIETY BILLING</Text>
            <Text style={styles.title}>
              {isAdmin ? "Billing overview" : "Maintenance bills"}
            </Text>
          </View>
        </View>

        {isAdmin ? (
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.smallLabel}>Amount billed</Text>
              <Text style={styles.summaryAmount}>
                ₹{billedTotal.toLocaleString("en-IN")}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.smallLabel}>Collected</Text>
              <Text style={styles.summaryAmount}>
                ₹{collectedTotal.toLocaleString("en-IN")}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.smallLabel}>Outstanding</Text>
              <Text style={styles.summaryAmount}>
                ₹{outstandingTotal.toLocaleString("en-IN")}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.summaryCard}>
            <Text style={styles.smallLabel}>Outstanding total</Text>
            <Text style={styles.totalAmount}>
              ₹{outstandingTotal.toLocaleString("en-IN")}
            </Text>
            <Text style={styles.summarySub}>
              {pendingBills.length} pending dues
            </Text>
          </View>
        )}

        {isAdmin && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Create a monthly bill</Text>
            <Text style={styles.label}>Flat number</Text>
            <TextInput
              style={styles.input}
              value={flatNumber}
              onChangeText={setFlatNumber}
              placeholder="e.g. A-101"
              placeholderTextColor={colors.placeholder}
              autoCapitalize="characters"
            />
            <Text style={styles.label}>Billing month</Text>
            <TextInput
              style={styles.input}
              value={billingMonth}
              onChangeText={setBillingMonth}
              placeholder="YYYY-MM"
              placeholderTextColor={colors.placeholder}
              keyboardType="numbers-and-punctuation"
            />
            <Text style={styles.label}>Due date</Text>
            <TextInput
              style={styles.input}
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.placeholder}
              keyboardType="numbers-and-punctuation"
            />
            <Text style={styles.label}>Amount (₹)</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.placeholder}
              keyboardType="decimal-pad"
            />
            <Pressable
              accessibilityRole="button"
              disabled={creating}
              onPress={() => void createBill()}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
                creating && styles.disabled,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {creating ? "Creating..." : "Create bill"}
              </Text>
            </Pressable>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {isAdmin ? "All bills" : "My bills"}
          </Text>
        </View>

        {!loading &&
          !loadError &&
          bills.map((bill) => {
            const isPending = bill.status === "PENDING";
            return (
              <View key={bill.id} style={styles.billCard}>
                <View style={styles.billTopRow}>
                  <View style={styles.billInfo}>
                    <Text style={styles.billLabel}>{bill.title}</Text>
                    <Text style={styles.billDate}>
                      {formatMonth(bill.billing_month)} · Due {formatDate(bill.due_date)}
                    </Text>
                    {isAdmin && (
                      <Text style={styles.apartmentLabel}>
                        Flat {bill.apartment_number}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.billAmount,
                      !isPending && styles.billAmountPaid,
                    ]}
                  >
                    ₹{Number(bill.amount).toLocaleString("en-IN")}
                  </Text>
                </View>

                <View style={styles.billFooter}>
                  <Text
                    style={[
                      styles.statusPill,
                      isPending ? styles.pending : styles.paid,
                    ]}
                  >
                    {isPending ? "Pending" : "Paid"}
                  </Text>
                  {!isAdmin && isPending && (
                    <Pressable
                      accessibilityRole="button"
                      disabled={payingId === bill.id}
                      onPress={() => void recordPayment(bill.id)}
                      style={[
                        styles.paymentButton,
                        payingId === bill.id && styles.disabled,
                      ]}
                    >
                      <Text style={styles.paymentButtonText}>
                        {payingId === bill.id
                          ? "Recording..."
                          : "Record simulated payment"}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}

        {!loading && !loadError && bills.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {isAdmin ? "No bills have been created yet." : "There are no bills for your flat yet."}
            </Text>
          </View>
        )}
        {loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Loading bills...</Text>
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
    paddingBottom: 36,
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 24,
    marginTop: 38,
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    color: colors.brown,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: "800",
    marginTop: 4,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderColor: colors.softCopper,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    marginBottom: 18,
    minWidth: 0,
    padding: 14,
  },
  smallLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  summaryAmount: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 8,
  },
  totalAmount: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: "800",
    marginTop: 8,
  },
  summarySub: {
    color: colors.brown,
    fontSize: 14,
    marginTop: 6,
  },
  formCard: {
    backgroundColor: colors.white,
    borderColor: colors.softCopper,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    padding: 20,
  },
  formTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  label: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 7,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.softCopper,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 15,
    minHeight: 46,
    paddingHorizontal: 12,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.brown,
    borderRadius: 9,
    justifyContent: "center",
    marginTop: 18,
    minHeight: 48,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 22,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "800",
  },
  billCard: {
    backgroundColor: colors.white,
    borderColor: colors.softCopper,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  billTopRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  billInfo: {
    flex: 1,
    marginRight: 10,
  },
  billLabel: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "600",
  },
  billDate: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 6,
  },
  apartmentLabel: {
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
    color: "#3D7A4A",
  },
  billFooter: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 14,
  },
  statusPill: {
    borderRadius: 20,
    fontSize: 11,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pending: {
    backgroundColor: colors.warningSurface,
    color: "#9A6A00",
  },
  paid: {
    backgroundColor: colors.selected,
    color: colors.brown,
  },
  paymentButton: {
    backgroundColor: colors.brown,
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  paymentButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
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
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.55,
  },
});
