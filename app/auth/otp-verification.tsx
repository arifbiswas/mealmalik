import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";

import { supabase } from "@/database/supabase";
import TButton from "@/lib/buttons/TButton";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import InputText from "../../components/InputText"; // Your component

// Your component

export default function OTPVerificationScreen() {
  const { mobileNumber } = useLocalSearchParams<{ mobileNumber: string }>();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);

  // --- 1. OTP Verification Logic ---
  const handleOtpVerification = async () => {
    if (!otp || otp.length !== 6) {
      // Assuming a 6-digit OTP
      Alert.alert(
        "Invalid Code",
        "Please enter the 6-digit code received via SMS."
      );
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: mobileNumber,
        token: otp,
        type: "sms", // Use 'sms' for phone authentication
      });

      if (error) throw error;

      // Verification successful, session is now created in Supabase!
      // Step 2 will handle redirection based on the new session.
      Alert.alert("Success", "Verification successful! Logging you in...");
    } catch (error) {
      console.error("OTP Verification Error:", error);
      Alert.alert(
        "Verification Failed",
        error.message || "Could not verify the code."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. Session Listener and Role-Based Redirection ---
  useEffect(() => {
    // Listen for authentication state changes (e.g., after successful OTP verification)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // User is authenticated, now check their role in the 'users' table
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("role")
            .eq("id", session.user.id)
            .single();

          if (userError && userError.code !== "PGRST116") {
            // PGRST116 is 'no rows found'
            // If user data is missing (e.g., first-time user), prompt role setup/onboarding
            console.error("User data fetch error:", userError);
            // We can assume new users are Members or redirect to an onboarding screen
            router.replace("/app/member/home");
          } else if (userData) {
            // User exists, redirect based on role
            const role = userData.role;
            const homePath =
              role === "Manager" ? "/app/manager/home" : "/app/member/home";
            router.replace(homePath);
          } else {
            // First-time login: create the user entry in the 'users' table
            await createNewUserEntry(session.user.id, mobileNumber);
            router.replace("/app/member/home"); // Default to Member role
          }
        } else {
          setSessionLoading(false);
        }
      }
    );

    // Clean up the listener when the component unmounts
    return () => authListener.subscription.unsubscribe();
  }, [mobileNumber]);

  // Helper function for first-time user creation in the 'users' table
  const createNewUserEntry = async (userId: string, phone: string) => {
    const { error } = await supabase.from("users").insert({
      id: userId,
      mobile_number: phone,
      role: "Member", // Default role for new signups
    });
    if (error) console.error("Error creating new user entry:", error);
  };

  if (sessionLoading && router.canGoBack()) {
    // Show loading while listener determines final redirection
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color={tw.color("blue-600")} />
        <Text style={tw`mt-4 text-gray-500`}>Securing session...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <Stack.Screen options={{ title: "Verify Code" }} />
      <ScrollView contentContainerStyle={tw`flex-grow justify-center p-6`}>
        <Ionicons
          name="shield-checkmark-outline"
          size={60}
          color={tw.color("blue-600")}
          style={tw`mb-4 self-center`}
        />
        <Text style={tw`text-3xl font-bold text-gray-800 mb-2 text-center`}>
          Enter Verification Code
        </Text>
        <Text style={tw`text-lg text-gray-500 mb-8 text-center`}>
          A 6-digit code has been sent to{" "}
          <Text style={tw`font-semibold text-blue-600`}>{mobileNumber}</Text>.
        </Text>

        <InputText
          label="6-Digit Code"
          placeholder="XXXXXX"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
        />

        <TButton
          title={isLoading ? "Verifying..." : "Verify & Login"}
          onPress={handleOtpVerification}
          containerStyle={tw`mt-6`}
          disabled={isLoading || otp.length !== 6}
        />

        <TButton
          title="Resend Code"
          onPress={() => {
            /* Implement Resend Logic here */ Alert.alert(
              "Resend",
              "Code has been resent!"
            );
          }}
          containerStyle={tw`mt-4 bg-gray-200`}
        />
      </ScrollView>
    </View>
  );
}
