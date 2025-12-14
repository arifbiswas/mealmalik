import { Redirect, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { supabase } from "@/database/supabase"; // Supabase ক্লায়েন্ট
import tw from "twrnc";

// কাস্টম হুক: সেশন এবং ভূমিকা যাচাই করার জন্য
const useUserSession = () => {
  const [role, setRole] = useState<"Manager" | "Member" | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkSessionAndRole = async (session: any) => {
      if (!session || !session.user || !isMounted) {
        setRole(null);
        setIsChecking(false);
        return;
      }

      try {
        // 1. কাস্টম 'users' টেবিল থেকে ভূমিকা ফেচ করা
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (userError && userError.code !== "PGRST116") {
          // যদি ডেটাবেস থেকে ভূমিকা আনতে ব্যর্থ হয়
          console.error("ভূমিকা যাচাইকরণ ত্রুটি:", userError);
          setRole(null);
        } else if (userData) {
          // ভূমিকা পাওয়া গেলে সেট করা
          setRole(userData.role as "Manager" | "Member");
        } else {
          // যদি public.users টেবিলে এন্ট্রি না থাকে (নতুন ব্যবহারকারী)
          // ডিফল্ট ভূমিকা 'Member' সেট করা এবং টেবিলে এন্ট্রি তৈরি করা
          await supabase.from("users").insert({
            id: session.user.id,
            email: session.user.email, // Supabase Auth থেকে ইমেল নেওয়া
            role: "Member",
          });
          setRole("Member");
        }
      } catch (e) {
        console.error("সেশন চেক ত্রুটি:", e);
        setRole(null);
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    // Auth Listener: সেশন পরিবর্তন পর্যবেক্ষণ করা
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          checkSessionAndRole(session);
        } else {
          setRole(null);
          setIsChecking(false);
        }
      }
    );

    // প্রথম লোডে বর্তমান সেশন যাচাই করা
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        checkSessionAndRole(session);
      } else {
        setIsChecking(false);
        setRole(null);
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { role, isChecking };
};

export default function AppLayout() {
  const { role, isChecking } = useUserSession();

  if (isChecking) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color={tw.color("blue-600")} />
        <Text style={tw`mt-4 text-gray-500`}>তথ্য যাচাই করা হচ্ছে...</Text>
      </View>
    );
  }

  // লগইন না থাকলে, লগইন স্ক্রিনে পাঠিয়ে দেওয়া
  if (!role) {
    return <Redirect href="/(auth)/login" />;
  }

  // ভূমিকা অনুযায়ী সঠিক নেভিগেশন গ্রুপ লোড করা
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {role === "Manager" && <Stack.Screen name="manager" />}
      {role === "Member" && <Stack.Screen name="member" />}
    </Stack>
  );
}
