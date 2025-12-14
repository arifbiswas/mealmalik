// NOTE: You must also install AsyncStorage package:
// npx expo install @react-native-async-storage/async-storage
import AsyncStorage from "@react-native-async-storage/async-storage";
// import 'react-native-url-polyfill/auto'; // Polyfill required for React Native
import { createClient } from "@supabase/supabase-js";
// project name meelmalik
// pass : sXuh*N0ZW1W%R5R2bKppnWfC^5K3@#*Hz0ya38n*!g@cO1sOVO
// IMPORTANT: Replace these with your actual keys from Supabase Project Settings
const SUPABASE_URL = "https://kwjuzpinhcrmseafqavm.supabase.co"; // e.g., 'https://xyzabcdefg.supabase.co'
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3anV6cGluaGNybXNlYWZxYXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2OTYyMzIsImV4cCI6MjA4MTI3MjIzMn0.S1bnV_t0Vg2ZIkBXmuNL7nglmc5gb0e_jmsxGe0vFLQ";

// Create a single Supabase client for the application
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: {
      // Use Async Storage for persisting user sessions in React Native
      getItem: (key) => AsyncStorage.getItem(key),
      setItem: (key, value) => AsyncStorage.setItem(key, value),
      removeItem: (key) => AsyncStorage.removeItem(key),
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
