import { useEffect, useMemo, useState } from "react";
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
import { useRouter } from "expo-router";

import AppNavigation from "../components/AppNavigation";
import { supabase } from "../lib/supabase";
import { colors } from "../styles/theme";

type Amenity = {
  id: string;
  name: string;
  description: string;
};

type Booking = {
  id: string;
  facility: string;
  start_at: string;
  end_at: string;
  status: "BOOKED" | "CANCELLED";
};

type UserProfile = {
  id: string;
  society_id: string;
  role: string;
};

function parseLocalDateTime(value: string) {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;

  const [, yearText, monthText, dayText, hourText, minuteText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const date = new Date(year, month - 1, day, hour, minute);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute
  ) {
    return null;
  }

  return date;
}

export default function Explore() {
  const router = useRouter();
  const amenities: Amenity[] = [
    {
      id: "1",
      name: "Gym",
      description: "Fitness and exercise equipment",
    },
    {
      id: "2",
      name: "Clubhouse",
      description: "Shared lounge and gathering space",
    },
    {
      id: "3",
      name: "Swimming Pool",
      description: "Outdoor community pool",
    },
    {
      id: "4",
      name: "Community Hall",
      description: "Hall for community events",
    },
    {
      id: "5",
      name: "Tennis Court",
      description: "Outdoor tennis court",
    },
  ];

  const [selectedAmenityId, setSelectedAmenityId] = useState("1");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState("");
  const [loadError, setLoadError] = useState("");
  const role = profile?.role || "loading";

  useEffect(() => {
    const loadBookings = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        Alert.alert("Unable to load facility bookings", authError.message);
        setLoadError(authError.message);
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
        .select("id, society_id, role")
        .eq("auth_user_id", user.id)
        .single();

      if (profileError || !userProfile) {
        Alert.alert(
          "Unable to load facility bookings",
          profileError?.message || "Your account profile was not found.",
        );
        setLoadError(profileError?.message || "Your account profile was not found.");
        setLoading(false);
        return;
      }

      setProfile(userProfile);

      if (userProfile.role !== "resident" && userProfile.role !== "admin") {
        setLoadError("Your account cannot access facility bookings.");
        setLoading(false);
        return;
      }

      let query = supabase
        .from("facility_reservations")
        .select("id, facility, start_at, end_at, status")
        .eq("society_id", userProfile.society_id)
        .order("start_at", { ascending: false });

      if (userProfile.role === "resident") {
        query = query.eq("resident_id", userProfile.id);
      }

      const { data, error } = await query;
      if (error) {
        Alert.alert("Unable to load facility bookings", error.message);
        setLoadError(error.message);
        setLoading(false);
        return;
      }

      setBookings(data);
      setLoading(false);
    };

    void loadBookings().catch((error: unknown) => {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred.";
      setLoadError(message);
      setLoading(false);
      Alert.alert("Unable to load facility bookings", message);
    });
  }, [router]);

  const selectedAmenity = useMemo(
    () =>
      amenities.find((item) => item.id === selectedAmenityId) ?? amenities[0],
    [selectedAmenityId],
  );

  const handleBook = async () => {
    if (!profile || profile.role !== "resident") {
      Alert.alert("Not allowed", "Only residents can book facilities.");
      return;
    }

    const start = parseLocalDateTime(startAt);
    const end = parseLocalDateTime(endAt);
    const now = new Date();

    if (!start || !end) {
      Alert.alert(
        "Booking times required",
        "Enter both times in YYYY-MM-DDTHH:mm format.",
      );
      return;
    }

    if (start <= now || end <= start) {
      Alert.alert(
        "Invalid booking time",
        "Choose a future start time and an end time after it.",
      );
      return;
    }

    const overlaps = bookings.some((booking) => {
      if (
        booking.status !== "BOOKED" ||
        booking.facility !== selectedAmenity.name
      ) {
        return false;
      }
      const existingStart = new Date(booking.start_at);
      const existingEnd = new Date(booking.end_at);
      return start < existingEnd && end > existingStart;
    });

    if (overlaps) {
      Alert.alert(
        "Time unavailable",
        "This facility already has a booking during that time.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("facility_reservations")
        .insert({
          society_id: profile.society_id,
          resident_id: profile.id,
          facility: selectedAmenity.name,
          start_at: start.toISOString(),
          end_at: end.toISOString(),
        })
        .select("id, facility, start_at, end_at, status")
        .single();

      if (error) {
        Alert.alert("Unable to book facility", error.message);
        return;
      }

      setBookings((current) => [data, ...current]);
      setStartAt("");
      setEndAt("");
      Alert.alert("Booking confirmed", `${selectedAmenity.name} has been booked.`);
    } catch (error) {
      Alert.alert(
        "Unable to book facility",
        error instanceof Error ? error.message : "An unexpected error occurred.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      const { error } = await supabase.rpc("cancel_facility_reservation", {
        p_reservation_id: bookingId,
      });

      if (error) {
        Alert.alert("Unable to cancel reservation", error.message);
        return;
      }

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "CANCELLED" }
            : booking,
        ),
      );
    } catch (error) {
      Alert.alert(
        "Unable to cancel reservation",
        error instanceof Error ? error.message : "An unexpected error occurred.",
      );
    } finally {
      setCancellingId("");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <AppNavigation
          role={role === "loading" ? undefined : role}
          active="Facility booking"
        />

        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>SHARED SOCIETY SPACES</Text>
            <Text style={styles.title}>Facility booking</Text>
            <Text style={styles.description}>
              Choose a future time for a facility. Times use your local time.
            </Text>
          </View>
        </View>

        {role !== "admin" && role !== "loading" && (
          <View style={styles.bookingBox}>
            <Text style={styles.bookingTitle}>Reserve a facility</Text>
            <Text style={styles.fieldLabel}>Facility</Text>
            {amenities.map((amenity) => {
              const isSelected = amenity.id === selectedAmenityId;
              return (
                <Pressable
                  key={amenity.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => setSelectedAmenityId(amenity.id)}
                  style={[
                    styles.facilityOption,
                    isSelected && styles.facilityOptionSelected,
                  ]}
                >
                  <View style={styles.facilityCopy}>
                    <Text style={styles.amenityName}>{amenity.name}</Text>
                    <Text style={styles.meta}>{amenity.description}</Text>
                  </View>
                  {isSelected && <Text style={styles.selectedMark}>Selected</Text>}
                </Pressable>
              );
            })}
            <Text style={styles.fieldLabel}>Start</Text>
            <TextInput
              style={styles.input}
              value={startAt}
              onChangeText={setStartAt}
              placeholder="YYYY-MM-DDTHH:mm"
              placeholderTextColor={colors.placeholder}
              keyboardType="numbers-and-punctuation"
              accessibilityLabel="Booking start time"
            />
            <Text style={styles.fieldLabel}>End</Text>
            <TextInput
              style={styles.input}
              value={endAt}
              onChangeText={setEndAt}
              placeholder="YYYY-MM-DDTHH:mm"
              placeholderTextColor={colors.placeholder}
              keyboardType="numbers-and-punctuation"
              accessibilityLabel="Booking end time"
            />
            <Pressable
              accessibilityRole="button"
              disabled={submitting}
              style={({ pressed }) => [
                styles.bookButton,
                pressed && styles.pressed,
                submitting && styles.disabled,
              ]}
              onPress={() => void handleBook()}
            >
              <Text style={styles.bookText}>
                {submitting ? "Booking..." : "Book facility"}
              </Text>
            </Pressable>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {role === "admin" ? "All facility bookings" : "My bookings"}
          </Text>
        </View>

        {!loading && !loadError && bookings.map((booking) => (
          <View key={booking.id} style={styles.bookingRow}>
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingName}>{booking.facility}</Text>
              <Text style={styles.bookingMeta}>
                {new Date(booking.start_at).toLocaleString()} –{" "}
                {new Date(booking.end_at).toLocaleTimeString()}
              </Text>
            </View>

            <Text
              style={[
                styles.statusPill,
                booking.status === "BOOKED"
                  ? styles.confirmed
                  : styles.cancelled,
              ]}
            >
              {booking.status}
            </Text>
            {booking.status === "BOOKED" && (
              <Pressable
                accessibilityRole="button"
                disabled={cancellingId === booking.id}
                onPress={() => void cancelBooking(booking.id)}
                style={[
                  styles.cancelButton,
                  cancellingId === booking.id && styles.disabled,
                ]}
              >
                <Text style={styles.cancelText}>
                  {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
                </Text>
              </Pressable>
            )}
          </View>
        ))}
        {!loading && !loadError && bookings.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.meta}>No bookings yet.</Text>
          </View>
        )}
        {loading && (
          <View style={styles.emptyState}>
            <Text style={styles.meta}>Loading bookings...</Text>
          </View>
        )}
        {!!loadError && (
          <View style={styles.emptyState}>
            <Text style={styles.meta}>{loadError}</Text>
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
  description: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    maxWidth: 680,
  },
  eyebrow: {
    color: colors.brown,
    fontSize: 12,
    letterSpacing: 1.5,
    fontWeight: "700",
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: "800",
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  smallLabel: {
    color: colors.muted,
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  summaryText: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    marginBottom: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cardSelected: {
    borderColor: colors.brown,
    borderWidth: 1.5,
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: "#F9E2D8",
    borderRadius: 20,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  iconText: {
    color: colors.brown,
    fontSize: 20,
  },
  cardText: {
    flex: 1,
    marginLeft: 12,
  },
  amenityName: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "600",
  },
  meta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  price: {
    color: colors.brown,
    fontSize: 18,
    fontWeight: "700",
  },
  footerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  availability: {
    borderRadius: 12,
    fontSize: 10,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  available: {
    backgroundColor: "#DFF3D9",
    color: "#28742D",
  },
  unavailable: {
    backgroundColor: "#FCE5D6",
    color: "#91441F",
  },
  bookingBox: {
    backgroundColor: colors.white,
    borderColor: colors.softCopper,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
    padding: 20,
  },
  bookingTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  fieldLabel: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  facilityOption: {
    alignItems: "center",
    borderColor: colors.softCopper,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    padding: 12,
  },
  facilityOptionSelected: {
    backgroundColor: colors.selected,
    borderColor: colors.brown,
  },
  facilityCopy: {
    flex: 1,
  },
  selectedMark: {
    color: colors.brown,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 12,
  },
  bookingMeta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 6,
  },
  input: {
    borderColor: colors.softCopper,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 15,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  bookButton: {
    alignItems: "center",
    backgroundColor: colors.brown,
    borderRadius: 10,
    minHeight: 50,
    justifyContent: "center",
    marginTop: 18,
    paddingHorizontal: 16,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.55,
  },
  bookText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  sectionHeader: {
    marginTop: 26,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "700",
  },
  bookingRow: {
    alignItems: "flex-start",
    backgroundColor: colors.white,
    borderColor: colors.softCopper,
    borderRadius: 12,
    borderWidth: 1,
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
    padding: 14,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingName: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "600",
  },
  statusPill: {
    borderRadius: 12,
    fontSize: 11,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  confirmed: {
    backgroundColor: colors.selected,
    color: colors.brown,
  },
  cancelled: {
    backgroundColor: colors.background,
    color: colors.muted,
  },
  cancelButton: {
    marginLeft: 10,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  cancelText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.softCopper,
    borderRadius: 12,
    borderWidth: 1,
    padding: 22,
  },
});
