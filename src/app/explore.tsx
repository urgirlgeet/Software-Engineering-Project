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

type Amenity = {
  id: string;
  name: string;
  location: string;
  capacity: string;
  price: number;
  availableToday: boolean;
};

type Booking = {
  id: string;
  amenity: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending";
};

export default function Explore() {
  const router = useRouter();

  const amenities: Amenity[] = [
    {
      id: "1",
      name: "Sky Lounge",
      location: "Roof deck",
      capacity: "12 guests",
      price: 1200,
      availableToday: true,
    },
    {
      id: "2",
      name: "Private Pool",
      location: "North wing",
      capacity: "6 guests",
      price: 1500,
      availableToday: false,
    },
    {
      id: "3",
      name: "Clubhouse Hall",
      location: "Ground floor",
      capacity: "20 guests",
      price: 2200,
      availableToday: true,
    },
  ];

  const [selectedAmenityId, setSelectedAmenityId] = useState("1");
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "b-1",
      amenity: "Sky Lounge",
      date: "2026-10-30",
      time: "18:00 - 20:00",
      status: "Confirmed",
    },
  ]);

  const selectedAmenity = useMemo(
    () =>
      amenities.find((item) => item.id === selectedAmenityId) ?? amenities[0],
    [selectedAmenityId],
  );

  const handleBook = () => {
    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      amenity: selectedAmenity.name,
      date: "2026-10-31",
      time: "17:00 - 19:00",
      status: "Confirmed",
    };

    setBookings((prev) => [newBooking, ...prev]);

    Alert.alert(
      "Booking confirmed",
      `${selectedAmenity.name} has been booked for 2026-10-31, 17:00 - 19:00.`,
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
            <Text style={styles.title}>Book Amenity</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.smallLabel}>Available today</Text>
          <Text style={styles.summaryText}>
            {amenities.filter((item) => item.availableToday).length} amenities
          </Text>
        </View>

        {amenities.map((amenity) => {
          const isSelected = amenity.id === selectedAmenityId;

          return (
            <Pressable
              key={amenity.id}
              onPress={() => setSelectedAmenityId(amenity.id)}
              style={[styles.card, isSelected && styles.cardSelected]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconWrap}>
                  <Text style={styles.iconText}>◌</Text>
                </View>

                <View style={styles.cardText}>
                  <Text style={styles.amenityName}>{amenity.name}</Text>
                  <Text style={styles.meta}>{amenity.location}</Text>
                </View>

                <Text style={styles.price}>₹{amenity.price}</Text>
              </View>

              <View style={styles.footerRow}>
                <Text style={styles.meta}>{amenity.capacity}</Text>

                <Text
                  style={[
                    styles.availability,
                    amenity.availableToday
                      ? styles.available
                      : styles.unavailable,
                  ]}
                >
                  {amenity.availableToday ? "Available" : "Booked"}
                </Text>
              </View>
            </Pressable>
          );
        })}

        <View style={styles.bookingBox}>
          <Text style={styles.bookingTitle}>Selected amenity</Text>
          <Text style={styles.selectedAmenity}>{selectedAmenity.name}</Text>
          <Text style={styles.bookingMeta}>
            {selectedAmenity.location} • {selectedAmenity.capacity}
          </Text>

          <Pressable style={styles.bookButton} onPress={handleBook}>
            <Text style={styles.bookText}>Book Now</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your bookings</Text>
        </View>

        {bookings.map((booking) => (
          <View key={booking.id} style={styles.bookingRow}>
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingName}>{booking.amenity}</Text>
              <Text style={styles.bookingMeta}>
                {booking.date} • {booking.time}
              </Text>
            </View>

            <Text
              style={[
                styles.statusPill,
                booking.status === "Confirmed"
                  ? styles.confirmed
                  : styles.pending,
              ]}
            >
              {booking.status}
            </Text>
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
    fontFamily: "Georgia",
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
    borderRadius: 18,
    marginTop: 16,
    padding: 18,
  },
  bookingTitle: {
    color: colors.muted,
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  selectedAmenity: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
  },
  bookingMeta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 6,
  },
  bookButton: {
    alignItems: "center",
    backgroundColor: colors.brown,
    borderRadius: 14,
    flexDirection: "row",
    height: 58,
    justifyContent: "center",
    marginTop: 18,
  },
  bookText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  arrow: {
    color: colors.white,
    fontSize: 24,
    marginLeft: 10,
  },
  sectionHeader: {
    marginTop: 26,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 22,
    fontWeight: "700",
  },
  bookingRow: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 14,
    flexDirection: "row",
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
    fontSize: 10,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  confirmed: {
    backgroundColor: "#DFF3D9",
    color: "#28742D",
  },
  pending: {
    backgroundColor: "#FFF1BE",
    color: "#9A6A00",
  },
});
