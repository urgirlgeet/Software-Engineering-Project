import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

export default function RootLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("auth_user_id", data.session.user.id)
          .single();

        if (!profile) {
          await supabase.auth.signOut();
          router.replace("/signin");
          setLoading(false);
          return;
        }

        if (profile.role === "resident") {
          router.replace("/resident-dashboard");
        } else if (profile.role === "admin") {
          router.replace("/admin-dashboard");
        } else if (profile.role === "maintenance") {
          router.replace("/maintenance-dashboard");
        } else if (profile.role === "security") {
          router.replace("/security-dashboard");
        }
      }

      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return null;
  }

  return <Stack />;
}
