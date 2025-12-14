import { Stack, router } from "expo-router"; // Stack দরকার নেই, তবে রাখা যেতে পারে
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { supabase } from "@/database/supabase"; // আপনার Supabase ক্লায়েন্ট
import tw from "twrnc";

// সেশন এবং ভূমিকা যাচাই করে সঠিক হোম স্ক্রিনে রিডাইরেক্ট করার ফাংশন
const checkUserRoleAndRedirect = async (session: any) => {
  console.log(session);
  if (!session?.user) {
    // যদি কোনো কারণে সেশন থাকে কিন্তু ইউজার না থাকে
    router.replace("/auth/login");
    return;
  }

  try {
    const role = session.user.user_metadata?.role || "Member";

    // 2. ভূমিকা অনুযায়ী রিডাইরেক্ট করা
    let homePath = "/app/member/home"; // ডিফল্ট

    if (role === "Manager") {
      homePath = "/app/manager/home";
    } else {
      homePath = "/app/member/home";
    }

    // replace ব্যবহার করা হয়েছে যাতে ব্যবহারকারী Back বাটন চেপে লোডিং স্ক্রিনে ফিরে না আসে
    router.replace(homePath);
  } catch (error) {
    console.error("ভূমিকা যাচাইকরণ ত্রুটি:", error);
    // যদি ডেটাবেস থেকে ভূমিকা আনতে ব্যর্থ হয়, তবে লগইন পেজে পাঠিয়ে দেওয়া
    router.replace("/auth/login");
  }
};

export default function Index() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Supabase Auth State Change Listener সেট আপ করা
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // টোকেন সংক্রান্ত কাজ শেষ হলে লোডিং বন্ধ করা
        setIsInitialLoad(false);

        // 'session' অবজেক্টটি টোকেনগুলির বৈধতা নির্দেশ করে
        if (session) {
          // সেশন বৈধ: ভূমিকা যাচাই করে সঠিক স্ক্রিনে রিডাইরেক্ট করুন
          checkUserRoleAndRedirect(session);
        } else {
          // সেশন অবৈধ বা নেই: লগইন স্ক্রিনে রিডাইরেক্ট করুন
          // Expo Router এর ফাইল সিস্টেম রাউটিং অনুযায়ী পাথ সেট করা হয়েছে
          router.replace("/auth/login");
        }
      }
    );

    // Cleanup the listener
    return () => authListener.subscription.unsubscribe();
  }, []);

  // যতক্ষণ না সেশন চেক করা শেষ হচ্ছে, ততক্ষণ এই লোডিং স্ক্রিনটি দেখাবে
  return (
    <View style={tw`flex-1 justify-center items-center bg-white`}>
      <Stack.Screen options={{ headerShown: false }} />

      <ActivityIndicator size="large" color={tw.color("blue-600")} />

      <Text style={tw`text-xl font-semibold mt-4 text-gray-700`}>
        🍽️ মিল মালিক
      </Text>

      <Text style={tw`mt-2 text-sm text-gray-500`}>
        সেশন যাচাই করা হচ্ছে...
      </Text>
    </View>
  );
}
