import { useRouter, type Href } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { supabase } from "../lib/supabase";
import { colors } from "../styles/theme";

type Props = {
  role?: string;
  active: string;
};

type NavItem = {
  label: string;
  href: Href;
};

const homeRoutes: Record<string, Href> = {
  admin: "/admin-dashboard",
  resident: "/resident-dashboard",
  maintenance: "/maintenance-dashboard",
  security: "/security-dashboard",
};

export default function AppNavigation({ role: providedRole, active }: Props) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [role, setRole] = useState(providedRole || "");

  useEffect(() => {
    if (providedRole) {
      setRole(providedRole);
      return;
    }

    const loadRole = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        Alert.alert("Unable to load navigation", authError.message);
        return;
      }

      if (!user) {
        router.replace("/signin");
        return;
      }

      const { data: profile, error } = await supabase
        .from("users")
        .select("role")
        .eq("auth_user_id", user.id)
        .single();

      if (error || !profile) {
        Alert.alert(
          "Unable to load navigation",
          error?.message || "Your account profile was not found.",
        );
        return;
      }

      setRole(profile.role);
    };

    void loadRole();
  }, [providedRole, router]);

  const complaintHref: Href =
    role === "resident"
      ? {
          pathname: "/request",
          params: { type: "complaint" },
        }
      : role === "maintenance"
        ? "/maintenance-dashboard"
        : "/complaints";

  const items: NavItem[] = [
    { label: "Home", href: homeRoutes[role] || "/signin" },
    ...(role === "security"
      ? []
      : [{ label: "Complaints", href: complaintHref }]),
    { label: "Notice board", href: "/notices" },
    ...(role === "resident" || role === "admin"
      ? [
          { label: "Facility booking", href: "/explore" as Href },
          { label: "Maintenance bills", href: "/bills" as Href },
        ]
      : role === "maintenance"
        ? [
            {
              label: "My maintenance team",
              href: "/maintenance-dashboard" as Href,
            },
          ]
        : []),
    { label: "My profile", href: "/profile" as Href },
  ];

  const navigate = (item: NavItem) => {
    if (item.label === active) return;
    router.push(item.href);
  };

  const signOut = async () => {
    if (signingOut) return;
    setSigningOut(true);

    const { error } = await supabase.auth.signOut();
    setSigningOut(false);

    if (error) {
      Alert.alert("Unable to sign out", error.message);
      return;
    }

    router.replace("/signin");
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.brandRow}>
        <Pressable
          accessibilityRole="link"
          onPress={() => router.replace((homeRoutes[role] || "/signin") as Href)}
        >
          <Text style={styles.brand}>Apartment Tracker</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={signingOut}
          onPress={() => void signOut()}
          style={({ pressed }) => [
            styles.signOut,
            pressed && styles.pressed,
            signingOut && styles.disabled,
          ]}
        >
          <Text style={styles.signOutText}>
            {signingOut ? "Signing out..." : "Sign out"}
          </Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.links}
      >
        {items.map((item) => {
          const selected = item.label === active;
          return (
            <Pressable
              key={item.label}
              accessibilityRole="link"
              accessibilityState={{ selected }}
              onPress={() => navigate(item)}
              style={({ pressed }) => [
                styles.link,
                selected && styles.selectedLink,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[styles.linkText, selected && styles.selectedLinkText]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "center",
    backgroundColor: colors.white,
    borderBottomColor: colors.softCopper,
    borderBottomWidth: 1,
    maxWidth: 1120,
    paddingHorizontal: 24,
    paddingTop: 13,
    width: "100%",
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 34,
  },
  brand: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "800",
  },
  signOut: {
    backgroundColor: "#EDF2F3",
    borderRadius: 8,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  signOutText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "700",
  },
  links: {
    alignItems: "center",
    gap: 20,
    minHeight: 46,
  },
  link: {
    justifyContent: "center",
    minHeight: 38,
  },
  selectedLink: {
    borderBottomColor: colors.brown,
    borderBottomWidth: 2,
  },
  linkText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  selectedLinkText: {
    color: colors.brown,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.72,
  },
  disabled: {
    opacity: 0.55,
  },
});
