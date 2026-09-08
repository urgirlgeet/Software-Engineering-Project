import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        const { data: profile } = await supabase
          .from("users")
          .select("role, approval_status")
          .eq("id", data.session.user.id)
          .single();

        if (!profile) {
          router.replace("/signin");
          return;
        }

        if (profile.approval_status === "pending") {
          router.replace("/pending-approval");
          return;
        }

        if (profile.approval_status === "rejected") {
          await supabase.auth.signOut();
          router.replace("/signin");
          return;
        }

        if (profile.role === "resident") {
          router.replace("/resident-dashboard");
        } else if (profile.role === "admin") {
          router.replace("/admin-dashboard");
        } else if (profile.role === "maintenance") {
          router.replace("/maintenance-dashboard");
        } else if (profile.role === "security") {
          router.replace("/security-dashboard" as any);
        }
      }

      setLoading(false);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {});

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return null;
  }

  return <Stack />;
}
