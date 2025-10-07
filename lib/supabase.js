import "react-native-url-polyfill/auto";
import "react-native-get-random-values";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra || {};
const supabaseUrl = extra.SUPABASE_URL;
const supabaseAnonKey = extra.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase config missing: set expo.extra.SUPABASE_URL and SUPABASE_ANON_KEY in app.json");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});


