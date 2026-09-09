import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from "react-native";

import { supabase } from "../lib/supabase";
import { dashboardStyles } from "../styles/dashboardStyles";

import QuickActionCard from "../components/resident/QuickActionCard";
import RequestCard, { RequestItem } from "../components/resident/RequestCard";
import ResidentBottomNav from "../components/resident/ResidentBottomNav";
import ResidentHeader from "../components/resident/ResidentHeader";
import SectionHeading from "../components/resident/SectionHeading";

type Profile = {
  name: string | null;
  apartment_number: string | null;
  society_id: string | null;
};

type Booking = {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
};

type Notice = {
  id: string;
  title: string;
  priority: string | null;
  created_at: string;
};

export default function ResidentDashboard() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile>({
    name: null,
    apartment_number: null,
    society_id: null,
  });

  const [societyName, setSocietyName] = useState("");
  const [complaints, setComplaints] = useState<RequestItem[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<RequestItem[]>(
    [],
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/signin");
        return;
      }

      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("id, name, apartment_id, society_id, role")
        .eq("auth_user_id", user.id)
        .single();

      if (profileError || !userProfile) {
        Alert.alert("Error", "Unable to load your profile.");
        router.replace("/signin");
        return;
      }

      if (userProfile.role !== "resident") {
        router.replace("/signin");
        return;
      }

      let apartmentNumber = "";
      if (userProfile.apartment_id) {
        const { data: apartment } = await supabase
          .from("apartments")
          .select("flat_number, block, floor")
          .eq("id", userProfile.apartment_id)
          .single();

        apartmentNumber = apartment?.flat_number || "";
      }

      setProfile({
        name: userProfile.name,
        apartment_number: apartmentNumber,
        society_id: userProfile.society_id,
      });

      if (userProfile.society_id) {
        const { data: society } = await supabase
          .from("societies")
          .select("name")
          .eq("id", userProfile.society_id)
          .single();

        if (society?.name) {
          setSocietyName(society.name);
        }
      }

      const { data: complaintData, error: complaintError } = await supabase
        .from("complaints")
        .select("id, title, category, priority, status, created_at")
        .eq("user_id", userProfile.id)
        .order("created_at", { ascending: false });

      if (complaintError) {
        console.log("Complaint fetch error:", complaintError);
      }

      setComplaints(
        (complaintData || []).filter(
          (item): item is RequestItem =>
            item !== null && typeof item === "object",
        ),
      );

      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from("maintenance_requests")
        .select("id, title, category, priority, status, created_at")
        .eq("user_id", userProfile.id)
        .order("created_at", { ascending: false });

      if (maintenanceError) {
        console.log("Maintenance fetch error:", maintenanceError);
      }

      setMaintenanceRequests(
        (maintenanceData || []).filter(
          (item): item is RequestItem =>
            item !== null && typeof item === "object",
        ),
      );

      const { data: bookingData, error: bookingError } = await supabase
        .from("amenity_bookings")
        .select("id, booking_date, start_time, end_time, status")
        .eq("resident_id", userProfile.id)
        .order("booking_date", { ascending: true })
        .limit(3);

      if (bookingError) {
        console.log("Booking fetch error:", bookingError);
      }
      setBookings(bookingData || []);

      const { data: noticeData, error: noticeError } = await supabase
        .from("notices")
        .select("id, title, priority, created_at")
        .eq("society_id", userProfile.society_id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (noticeError) {
        console.log("Notice fetch error:", noticeError);
      }
      setNotices(noticeData || []);
    } catch (error) {
      console.log("Dashboard error:", error);
      Alert.alert("Error", "Something went wrong while loading the dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (loading) {
    return (
      <View style={dashboardStyles.loadingContainer}>
        <Text style={dashboardStyles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={dashboardStyles.safeArea}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={dashboardStyles.container}
        showsVerticalScrollIndicator={false}
      >
        <ResidentHeader
          name={profile.name || "Resident"}
          apartment={profile.apartment_number || ""}
          society={societyName}
          onLogout={logout}
        />

        <SectionHeading title="Immediate Actions" count="4" />

        <View style={dashboardStyles.actionGrid}>
          <QuickActionCard
            icon="exclamationmark.bubble"
            title="Raise Complaint"
            detail="Report an issue"
            onPress={() =>
              router.push({
                pathname: "/request",
                params: { type: "complaint" },
              })
            }
          />

          <QuickActionCard
            icon="person.badge.plus"
            title="Invite Visitor"
            detail="Create visitor pass"
            onPress={() => router.push("/visitors" as any)}
          />

          <QuickActionCard
            icon="creditcard"
            title="Pay Dues"
            detail="View pending payments"
            onPress={() => router.push("/bills" as any)}
          />

          <QuickActionCard
            icon="leaf"
            title="Book Amenity"
            detail="Private salons & courts"
            onPress={() => router.push("/explore")}
          />
        </View>

        <SectionHeading
          title="Upcoming Bookings"
          count={bookings.length.toString()}
          action="View All"
        />
        {bookings.length === 0 ? (
          <View style={dashboardStyles.requestCard}>
            <Text style={dashboardStyles.statusText}>
              No upcoming bookings.
            </Text>
          </View>
        ) : (
          bookings.map((booking) => (
            <View key={booking.id} style={dashboardStyles.bookingCard}>
              <View style={dashboardStyles.bookingHeader}>
                <Text style={dashboardStyles.bookingTitle}>
                  Amenity reservation
                </Text>
                <Text style={dashboardStyles.confirmedText}>
                  {booking.status}
                </Text>
              </View>
              <Text style={dashboardStyles.bookingMeta}>
                {new Date(booking.booking_date).toLocaleDateString()} ·{" "}
                {booking.start_time} – {booking.end_time}
              </Text>
              <Text style={dashboardStyles.bookingCode}>
                Managed through the society amenity registry
              </Text>
            </View>
          ))
        )}

        <SectionHeading
          title="My Active Complaints"
          count={complaints.length.toString()}
        />

        {complaints.length === 0 ? (
          <View style={dashboardStyles.requestCard}>
            <Text style={dashboardStyles.statusText}>
              No complaints submitted yet.
            </Text>
          </View>
        ) : (
          complaints.map((complaint) => (
            <RequestCard
              key={complaint.id}
              item={complaint}
              onPress={() =>
                router.push({
                  pathname: "/request",
                  params: {
                    type: "complaint",
                    id: complaint.id,
                  },
                })
              }
            />
          ))
        )}

        <SectionHeading
          title="My Maintenance Requests"
          count={maintenanceRequests.length.toString()}
        />

        {maintenanceRequests.length === 0 ? (
          <View style={dashboardStyles.requestCard}>
            <Text style={dashboardStyles.statusText}>
              No maintenance requests submitted yet.
            </Text>
          </View>
        ) : (
          maintenanceRequests.map((request) => (
            <RequestCard
              key={request.id}
              item={request}
              onPress={() =>
                router.push({
                  pathname: "/request",
                  params: {
                    type: "maintenance",
                    id: request.id,
                  },
                })
              }
            />
          ))
        )}

        <Pressable
          style={dashboardStyles.requestShortcut}
          onPress={() =>
            router.push({
              pathname: "/request",
              params: { type: "maintenance" },
            })
          }
        >
          <Text style={dashboardStyles.requestShortcutText}>
            Request Maintenance
          </Text>

          <Text style={dashboardStyles.requestShortcutArrow}>→</Text>
        </Pressable>

        <SectionHeading title="Recent Notices" action="Community Board" />
        <View style={dashboardStyles.noticeCard}>
          {notices.length === 0 ? (
            <Text style={dashboardStyles.statusText}>No recent notices.</Text>
          ) : (
            notices.map((notice) => (
              <View key={notice.id} style={dashboardStyles.noticeRow}>
                <View style={dashboardStyles.noticeIcon}>
                  <Text style={dashboardStyles.noticeIconText}>≡</Text>
                </View>
                <View style={dashboardStyles.noticeCopy}>
                  <Text numberOfLines={1} style={dashboardStyles.noticeTitle}>
                    {notice.title}
                  </Text>
                  <Text style={dashboardStyles.noticeDate}>
                    Posted: {new Date(notice.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={dashboardStyles.noticePriority}>
                  {notice.priority || "General"}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <ResidentBottomNav
        active="Home"
        onNavigate={(route) => router.push(route as any)}
      />
    </SafeAreaView>
  );
}
