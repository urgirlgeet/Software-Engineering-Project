import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { supabase } from "../lib/supabase";

type RequestItem = {
  category: string;
  created_at: string;
  priority: string;
  status: string;
  title: string;
};

// Temporary display data mirrors the complaints and maintenance_requests tables.
const complaintData: RequestItem[] = [
  {
    category: "ELECTRICAL",
    created_at: "Oct 23, 2024",
    priority: "High Priority",
    status: "In Progress",
    title: "Elevator B Making Grinding Sound",
  },
  {
    category: "PLUMBING",
    created_at: "Oct 24, 2024",
    priority: "Medium Priority",
    status: "Submitted",
    title: "Water Pressure Low in Master Bath",
  },
];

const maintenanceData: RequestItem[] = [
  {
    category: "HVAC",
    created_at: "Oct 21, 2024",
    priority: "Low Priority",
    status: "In Progress",
    title: "HVAC Seasonal Filter Replacement",
  },
];

const noticeData = [
  {
    title: "Annual General Body Meeting",
    priority: "High",
    date: "Oct 22, 2024",
    icon: "gavel",
  },
  {
    title: "Swimming Pool Maintenance",
    priority: "Medium",
    date: "Oct 20, 2024",
    icon: "pool",
  },
];

export default function ResidentDashboard() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      router.replace("/signin");
      return;
    }
    const { data: profile, error } = await supabase
      .from("users")
      .select("role")
      .eq("auth_user_id", data.user.id)
      .single();
    if (error || !profile || profile.role !== "resident") {
      Alert.alert("Access Denied", "You do not have access to this dashboard.");
      router.replace("/signin");
      return;
    }
    setChecking(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/signin");
  };

  if (checking)
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your residence...</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.pageTitle}>Resident Home</Text>
            <Text style={styles.pageSubtitle}>THE GRAND RESIDENCE</Text>
          </View>
          <View style={styles.topActions}>
            <SymbolView
              name={{
                ios: "bell",
                android: "notifications_none",
                web: "notifications_none",
              }}
              tintColor={colors.ink}
              size={21}
            />
            <Pressable style={styles.homeMark} onPress={handleSignOut}>
              <SymbolView
                name={{
                  ios: "building.2",
                  android: "business",
                  web: "business",
                }}
                tintColor={colors.white}
                size={20}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.profileBanner}>
          <View style={styles.profileCopy}>
            <Text style={styles.bannerEyebrow}>SANCTUARY PORTFOLIO</Text>
            <Text numberOfLines={1} style={styles.greeting}>
              Good morning, Alexandra
            </Text>
            <View style={styles.addressLine}>
              <SymbolView
                name={{
                  ios: "building.2",
                  android: "business",
                  web: "business",
                }}
                tintColor={colors.brown}
                size={15}
              />
              <Text style={styles.address}>
                Block B · Flat 402 — The Belclaire Residences
              </Text>
            </View>
          </View>
          <View style={styles.avatarWrap}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80",
              }}
              style={styles.avatar}
            />
            <View style={styles.onlineDot} />
          </View>
        </View>

        <SectionHeading title="Immediate Actions" action="CONCIERGE DESK" />
        <View style={styles.actionGrid}>
          <ActionCard
            icon="warning"
            title="Raise Complaint"
            detail="Escalate an incident"
          />
          <ActionCard
            icon="spa"
            title="Book Amenity"
            detail="Private salons & courts"
          />
          <ActionCard
            icon="key"
            title="Invite Visitor"
            detail="Issue secure digital pass"
          />
          <ActionCard
            icon="account_balance_wallet"
            title="Pay Dues"
            detail="Estate assessments"
          />
        </View>

        <SectionHeading title="Upcoming Bookings" count="1" action="View All" />
        <View style={styles.bookingCard}>
          <View style={styles.bookingImageWrap}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=700&q=80",
              }}
              style={styles.bookingImage}
            />
            <View style={styles.reservationPill}>
              <Text style={styles.reservationText}>Private Reservation</Text>
            </View>
            <Text style={styles.bookingTitle}>
              Rooftop Terrace &{`\n`}Lounge
            </Text>
            <View style={styles.confirmedPill}>
              <Text style={styles.confirmedText}>Confirmed</Text>
            </View>
          </View>
          <View style={styles.bookingMeta}>
            <Text style={styles.metaText}>▣ Tomorrow, Oct 26</Text>
            <Text style={styles.metaText}>◷ 6:00 PM – 9:00 PM</Text>
          </View>
          <View style={styles.bookingCode}>
            <Text style={styles.codeText}>Access Code: #7044</Text>
            <Text style={styles.codeLink}>Pass Details →</Text>
          </View>
        </View>

        <SectionHeading
          title="My Active Complaints"
          count="2"
          action="History"
        />
        {complaintData.map((item) => (
          <RequestCard key={item.title} item={item} />
        ))}
        <SectionHeading
          title="My Maintenance Requests"
          count="1"
          action="Request New"
        />
        {maintenanceData.map((item) => (
          <RequestCard key={item.title} item={item} />
        ))}

        <SectionHeading title="Recent Notices" action="Community Board" />
        <View style={styles.noticeCard}>
          {noticeData.map((notice, index) => (
            <View
              key={notice.title}
              style={[styles.noticeRow, index > 0 && styles.noticeBorder]}
            >
              <View style={styles.noticeIcon}>
                <SymbolView
                  name={{
                    ios: notice.icon as any,
                    android: notice.icon,
                    web: notice.icon,
                  }}
                  tintColor={colors.brown}
                  size={17}
                />
              </View>
              <View style={styles.noticeCopy}>
                <Text numberOfLines={1} style={styles.noticeTitle}>
                  {notice.title}
                </Text>
                <Text style={styles.noticeDate}>Posted: {notice.date}</Text>
              </View>
              <View
                style={[
                  styles.priorityPill,
                  notice.priority === "Medium" && styles.mediumPill,
                ]}
              >
                <Text style={styles.priorityText}>{notice.priority}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomNav}>
          <NavItem icon="home" label="Home" active />
          <NavItem icon="door_open" label="Visitors" />
          <NavItem icon="campaign" label="Notices" />
          <NavItem icon="receipt_long" label="Bills" />
          <NavItem icon="person" label="Profile" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeading({
  title,
  count,
  action,
}: {
  title: string;
  count?: string;
  action: string;
}) {
  return (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionTitleWrap}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {count && <Text style={styles.count}>{count}</Text>}
      </View>
      <Text style={styles.sectionAction}>{action}</Text>
    </View>
  );
}
function ActionCard({
  icon,
  title,
  detail,
}: {
  icon: string;
  title: string;
  detail: string;
}) {
  return (
    <Pressable style={styles.actionCard}>
      <View style={styles.actionIcon}>
        <SymbolView
          name={{ ios: icon as any, android: icon, web: icon }}
          tintColor={colors.brown}
          size={20}
        />
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionDetail}>{detail}</Text>
    </Pressable>
  );
}
function RequestCard({ item }: { item: RequestItem }) {
  return (
    <View style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.separator}>•</Text>
        <Text style={styles.requestDate}>{item.created_at}</Text>
        <Text
          style={[
            styles.priority,
            item.priority === "Medium Priority" && styles.mediumPriority,
            item.priority === "Low Priority" && styles.lowPriority,
          ]}
        >
          {item.priority}
        </Text>
      </View>
      <Text style={styles.requestTitle}>{item.title}</Text>
      <View style={styles.requestFooter}>
        <Text style={styles.statusText}>● Status: {item.status}</Text>
        <Text style={styles.requestAction}>
          {item.status === "Submitted"
            ? "Awaiting Review"
            : "Scheduled for Inspection"}
        </Text>
      </View>
    </View>
  );
}
function NavItem({
  icon,
  label,
  active,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <View style={styles.navItem}>
      <SymbolView
        name={{ ios: icon as any, android: icon, web: icon }}
        tintColor={active ? colors.brown : colors.ink}
        size={19}
      />
      <Text style={[styles.navLabel, active && styles.activeNavLabel]}>
        {label}
      </Text>
    </View>
  );
}

const colors = {
  background: "#FFF9F7",
  brown: "#91441F",
  ink: "#24100A",
  muted: "#705E58",
  peach: "#FFF0EB",
  peachStrong: "#FFE1D7",
  white: "#FFFFFF",
};
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  loadingContainer: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
  },
  loadingText: { color: colors.brown, fontSize: 17 },
  container: { paddingHorizontal: 15, paddingTop: 12, paddingBottom: 84 },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  pageTitle: { color: colors.ink, fontFamily: "Georgia", fontSize: 20 },
  pageSubtitle: {
    color: colors.brown,
    fontSize: 10,
    letterSpacing: 1.1,
    marginTop: 3,
  },
  topActions: { alignItems: "center", flexDirection: "row", gap: 20 },
  homeMark: {
    alignItems: "center",
    backgroundColor: colors.brown,
    borderRadius: 20,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  profileBanner: {
    backgroundColor: colors.peach,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 113,
    padding: 19,
  },
  profileCopy: { flex: 1 },
  bannerEyebrow: { color: colors.brown, fontSize: 10, letterSpacing: 1.2 },
  greeting: {
    color: colors.ink,
    fontFamily: "Georgia",
    fontSize: 22,
    marginTop: 8,
  },
  addressLine: { alignItems: "center", flexDirection: "row", marginTop: 12 },
  address: { color: colors.muted, flex: 1, fontSize: 13, marginLeft: 7 },
  avatarWrap: { height: 49, position: "relative", width: 49 },
  avatar: { borderRadius: 25, height: 49, width: 49 },
  onlineDot: {
    backgroundColor: colors.brown,
    borderColor: colors.peach,
    borderRadius: 7,
    borderWidth: 2,
    bottom: 0,
    height: 14,
    position: "absolute",
    right: -1,
    width: 14,
  },
  sectionHeading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 11,
    marginTop: 25,
  },
  sectionTitleWrap: { alignItems: "center", flexDirection: "row" },
  sectionTitle: { color: colors.ink, fontFamily: "Georgia", fontSize: 20 },
  count: {
    backgroundColor: colors.peachStrong,
    borderRadius: 12,
    color: colors.brown,
    fontSize: 11,
    marginLeft: 8,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  sectionAction: { color: colors.brown, fontSize: 11 },
  actionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  actionCard: {
    backgroundColor: colors.white,
    borderRadius: 11,
    minHeight: 116,
    padding: 14,
    width: "48.5%",
    shadowColor: colors.brown,
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  actionIcon: {
    alignItems: "center",
    backgroundColor: colors.peachStrong,
    borderRadius: 22,
    height: 39,
    justifyContent: "center",
    width: 39,
  },
  actionTitle: { color: colors.ink, fontSize: 16, marginTop: 12 },
  actionDetail: { color: colors.muted, fontSize: 11, marginTop: 4 },
  bookingCard: { backgroundColor: colors.white, borderRadius: 12, padding: 14 },
  bookingImageWrap: {
    borderRadius: 8,
    height: 132,
    overflow: "hidden",
    position: "relative",
  },
  bookingImage: { height: "100%", width: "100%" },
  reservationPill: {
    backgroundColor: colors.white,
    borderRadius: 12,
    left: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
    position: "absolute",
    top: 10,
  },
  reservationText: { color: colors.ink, fontSize: 10 },
  bookingTitle: {
    bottom: 10,
    color: colors.white,
    fontFamily: "Georgia",
    fontSize: 19,
    fontWeight: "700",
    left: 10,
    position: "absolute",
  },
  confirmedPill: {
    backgroundColor: "#DFF3D9",
    borderRadius: 12,
    bottom: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    position: "absolute",
    right: 10,
  },
  confirmedText: { color: "#28742D", fontSize: 10 },
  bookingMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  metaText: { color: colors.muted, fontSize: 12 },
  bookingCode: {
    backgroundColor: colors.peach,
    borderRadius: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    padding: 10,
  },
  codeText: { color: colors.muted, fontSize: 11 },
  codeLink: { color: colors.brown, fontSize: 11 },
  requestCard: {
    backgroundColor: colors.white,
    borderRadius: 11,
    marginBottom: 11,
    padding: 14,
  },
  requestHeader: { alignItems: "center", flexDirection: "row" },
  category: { color: colors.brown, fontSize: 10, letterSpacing: 1 },
  separator: { color: colors.muted, marginHorizontal: 6 },
  requestDate: { color: colors.muted, fontSize: 11 },
  priority: {
    backgroundColor: "#FFE1E0",
    borderRadius: 12,
    color: "#C53B3B",
    fontSize: 10,
    marginLeft: "auto",
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  mediumPriority: { backgroundColor: "#FFF1BE", color: "#9A6A00" },
  lowPriority: { backgroundColor: colors.peach, color: colors.ink },
  requestTitle: { color: colors.ink, fontSize: 17, marginTop: 9 },
  requestFooter: {
    backgroundColor: colors.peach,
    borderRadius: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    padding: 9,
  },
  statusText: { color: colors.muted, fontSize: 10 },
  requestAction: { color: colors.brown, fontSize: 10 },
  noticeCard: {
    backgroundColor: colors.white,
    borderRadius: 11,
    overflow: "hidden",
  },
  noticeRow: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 67,
    paddingHorizontal: 14,
  },
  noticeBorder: { borderTopColor: "#F3E4DF", borderTopWidth: 1 },
  noticeIcon: {
    alignItems: "center",
    backgroundColor: colors.peachStrong,
    borderRadius: 20,
    height: 37,
    justifyContent: "center",
    width: 37,
  },
  noticeCopy: { flex: 1, marginLeft: 12 },
  noticeTitle: { color: colors.ink, fontSize: 15 },
  noticeDate: { color: colors.muted, fontSize: 11, marginTop: 4 },
  priorityPill: {
    backgroundColor: "#FFE1E0",
    borderRadius: 11,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  mediumPill: { backgroundColor: "#FFF1BE" },
  priorityText: { color: colors.brown, fontSize: 10 },
  bottomNav: {
    backgroundColor: colors.white,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    left: 0,
    paddingBottom: 11,
    paddingTop: 12,
    position: "absolute",
    right: 0,
  },
  navItem: { alignItems: "center", gap: 4 },
  navLabel: { color: colors.ink, fontSize: 10 },
  activeNavLabel: { color: colors.brown },
});
