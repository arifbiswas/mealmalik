import { Stack, router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { supabase } from "@/database/supabase"; // Assuming correct path
import TButton from "@/lib/buttons/TButton"; // Assuming correct path
import tw from "@/lib/tailwind";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InputText from "../../components/InputText"; // Your component

// Switch আমদানি করা হলো

export default function LoginScreen() {
  // State for Email and Password
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // নতুন State: "আমাকে মনে রাখুন"
  const [rememberMe, setRememberMe] = useState(true);

  // Function to handle Login and Sign Up
  const handleAuth = async () => {
    // isSignUp প্যারামিটারটি আর দরকার নেই
    if (!email || !password) {
      Alert.alert("ত্রুটি", "অনুগ্রহ করে ইমেল এবং পাসওয়ার্ড উভয়ই লিখুন।");
      return;
    }

    setIsLoading(true);
    try {
      // --- Login Logic (লগইন) ---
      // NOTE: Supabase SDK'র persistSession: true থাকলে এই টগল শুধুমাত্র UI-এর জন্য কাজ করবে।
      // যদি মনে রাখার ব্যবস্থা বন্ধ করতে চান, তবে Supabase ক্লায়েন্ট তৈরি করার সময় persistSession: false সেট করতে হবে
      // এবং প্রয়োজনে ম্যানুয়ালি সেশন সেভ করতে হবে।

      //   rememberMe logic
      if (rememberMe) {
        AsyncStorage.setItem("email", email);
        AsyncStorage.setItem("password", password);
        AsyncStorage.setItem("rememberMe", "true");
      } else {
        AsyncStorage.removeItem("email");
        AsyncStorage.removeItem("password");
        AsyncStorage.removeItem("rememberMe");
      }

      const authResponse = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authResponse.error) throw authResponse.error;

      // NOTE: user_metadata থেকে ভূমিকা যাচাই করার এই পদ্ধতিটি কাজ করে,
      // তবে public.users টেবিল থেকে যাচাই করা আরও নিরাপদ।
      // আপাতত এই লজিক ব্যবহার করা হচ্ছে:

      if (authResponse?.data?.user?.user_metadata?.role === "Manager") {
        router.replace("/app/manager/home"); // সম্পূর্ণ পাথ ব্যবহার করা হলো
      } else {
        router.replace("/app/member/home"); // সম্পূর্ণ পাথ ব্যবহার করা হলো
      }
    } catch (error: any) {
      Alert.alert(
        "প্রমাণীকরণ ব্যর্থ",
        error.message || "একটি অজানা ত্রুটি ঘটেছে।"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Remember Me Logic
  React.useEffect(() => {
    const fetchRememberMe = async () => {
      const rememberMe = await AsyncStorage.getItem("rememberMe");
      if (rememberMe === "true") {
        setEmail((await AsyncStorage.getItem("email")) || "");
        setPassword((await AsyncStorage.getItem("password")) || "");
        setRememberMe(true);
      }
    };
    fetchRememberMe();
  }, []);

  return (
    <View style={tw`flex-1 bg-white`}>
      <Stack.Screen options={{ title: "লগইন/রেজিস্ট্রেশন" }} />
      <ScrollView contentContainerStyle={tw`flex-grow justify-center p-6`}>
        <Text style={tw`text-4xl font-bold text-blue-600 mb-2`}>স্বাগতম</Text>
        <Text style={tw`text-lg text-gray-500 mb-8`}>
          আপনার ইমেল ব্যবহার করে লগইন করুন অথবা নতুন অ্যাকাউন্ট তৈরি করুন।
        </Text>

        {/* Email Input */}
        <InputText
          label="ইমেল ঠিকানা"
          placeholder="আপনার.ইমেল"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Password Input */}
        <View>
          <InputText
            label="পাসওয়ার্ড"
            placeholder="আপনার পাসওয়ার্ড লিখুন"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isShowPassword}
          />
          <TouchableOpacity
            onPress={() => setIsShowPassword(!isShowPassword)}
            style={tw`absolute right-0 top-8 p-3`}
          >
            <Ionicons
              name={isShowPassword ? "eye-off" : "eye"}
              size={24}
              color={tw.color("gray-500")}
            />
          </TouchableOpacity>
        </View>

        {/* 'আমাকে মনে রাখুন' অপশন */}
        <View style={tw`flex-row justify-between items-center mt-3`}>
          <Text style={tw`text-base text-gray-700`}>আমাকে মনে রাখুন</Text>
          <Switch
            trackColor={{
              false: tw.color("gray-300"),
              true: tw.color("blue-400"),
            }}
            thumbColor={
              rememberMe ? tw.color("blue-600") : tw.color("gray-500")
            }
            onValueChange={setRememberMe}
            value={rememberMe}
          />
        </View>

        {/* Login Button */}
        <TButton
          title={isLoading ? "লগইন করা হচ্ছে..." : "লগইন করুন"}
          onPress={handleAuth}
          containerStyle={tw`mt-6 bg-blue-600`}
          disabled={isLoading}
        />

        {/* Signup Button */}
        <TButton
          title={"নতুন অ্যাকাউন্ট তৈরি করুন"}
          onPress={() => router.push("/auth/register")}
          containerStyle={tw`mt-3 bg-gray-400`}
        />
      </ScrollView>
    </View>
  );
}
