import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

import { supabase } from "@/database/supabase"; // Supabase ক্লায়েন্ট
import TButton from "@/lib/buttons/TButton";
import tw from "@/lib/tailwind";
import InputText from "../../components/InputText"; // আপনার ইনপুট কম্পোনেন্ট

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // ম্যানেজারের জন্য একটি গ্রুপের নাম প্রয়োজন
  const [groupName, setGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- রেজিস্ট্রেশন এবং গ্রুপ তৈরির লজিক ---
  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !groupName) {
      Alert.alert("ত্রুটি", "অনুগ্রহ করে সকল ঘর পূরণ করুন।");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("ত্রুটি", "পাসওয়ার্ড নিশ্চিতকরণের সাথে মিলছে না।");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Supabase Auth-এ সাইন আপ (User তৈরি)
      // *** এটি এখন প্রথম স্টেপ ***
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { data: { role: "Manager" } },
      });
      console.log(authData?.session);

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("ব্যবহারকারী আইডি পাওয়া যায়নি।");

      // 2. একটি নতুন গ্রুপ তৈরি করা
      // *** এটি এখন দ্বিতীয় স্টেপ ***
      const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: groupName,
          // (ঐচ্ছিক: যদি groups টেবিলে creator_id থাকে, তবে তা যুক্ত করুন)
          created_by: userId,
        })
        .select("id")
        .single();

      if (groupError) throw groupError;

      const newGroupId = groupData.id;

      // 3. public.users টেবিলে ম্যানেজারকে যুক্ত করা
      const { error: userTableError } = await supabase.from("users").insert({
        id: userId,
        group_id: newGroupId,
        email: email,
        role: "Manager",
      });

      if (userTableError) throw userTableError;
    } catch (error) {
      console.log("রেজিস্ট্রেশন ত্রুটি:", error);
      Alert.alert(
        "রেজিস্ট্রেশন ব্যর্থ",
        error.message || "একটি অজানা ত্রুটি ঘটেছে।"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <Stack.Screen options={{ title: "নতুন অ্যাকাউন্ট" }} />
      <ScrollView contentContainerStyle={tw`flex-grow justify-center p-6`}>
        <Text style={tw`text-[40px] font-bold text-green-600 mb-2`}>
          রেজিস্ট্রেশন
        </Text>
        <Text style={tw`text-lg text-gray-500 mb-6`}>
          নতুন মেস ম্যানেজ করুন। একটি গ্রুপ তৈরি করুন।
        </Text>

        {/* গ্রুপ নাম ইনপুট */}
        <InputText
          label="মেস বা গ্রুপের নাম"
          placeholder="যেমন: টিম ঢাকা মেস"
          value={groupName}
          onChangeText={setGroupName}
        />

        {/* ইমেল ইনপুট */}
        <InputText
          label="ইমেল ঠিকানা"
          placeholder="আপনার.ইমেল ঠিকানা লিখুন"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* পাসওয়ার্ড ইনপুট */}
        <InputText
          label="পাসওয়ার্ড"
          placeholder="একটি নতুন পাসওয়ার্ড লিখুন"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* পাসওয়ার্ড নিশ্চিত করুন ইনপুট */}
        <InputText
          label="পাসওয়ার্ড নিশ্চিত করুন"
          placeholder="পাসওয়ার্ডটি আবার লিখুন"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* রেজিস্ট্রেশন বাটন */}
        <TButton
          title={
            isLoading ? "তৈরি করা হচ্ছে..." : "গ্রুপ ও অ্যাকাউন্ট তৈরি করুন"
          }
          onPress={handleSignUp}
          containerStyle={tw`mt-6 bg-green-600`}
          disabled={isLoading}
        />

        {/* লগইনে ফিরে যাওয়ার বাটন */}
        <TButton
          title="ইতিমধ্যে একটি অ্যাকাউন্ট আছে? লগইন করুন"
          onPress={() => router.replace("/auth/login")}
          containerStyle={tw`mt-4 bg-transparent border border-gray-300`}
          titleStyle={tw`text-gray-700`}
        />
      </ScrollView>
    </View>
  );
}
