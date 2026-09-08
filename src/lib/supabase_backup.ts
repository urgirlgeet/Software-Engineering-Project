import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = "https://sorpdflbajptdojpmotu.supabase.co";
const supabaseKey = "sb_publishable_mC2kRlRfx-u4u87eD4LrYg_F58xQoiG";

const storage = Platform.OS === "web" ? undefined : AsyncStorage;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
