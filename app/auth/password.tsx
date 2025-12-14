import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
// NOTE: Use a real hashing library (like bcrypt) in a production app!
import { fakeCompare, fakeHash } from "@/utils/utils";

import TButton from "@/lib/buttons/TButton";
import tw from "twrnc";
import InputText from "../../components/InputText"; // Your component

// Your component

export default function PasswordScreen() {
  const { mobileNumber, isNewUser } = useLocalSearchParams<{
    mobileNumber: string;
    isNewUser: string;
  }>();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isSettingPassword = isNewUser === "true";

  const title = isSettingPassword ? "Set Your Password" : "Enter Password";
  const buttonTitle = isSettingPassword ? "Set & Login" : "Login";

  const handleAuth = async () => {
    if (!password) {
      Alert.alert("Error", "Please enter a password.");
      return;
    }

    setIsLoading(true);
    try {
      const realm = await getRealm();
      let user = realm
        .objects("User")
        .filtered("mobileNumber = $0", mobileNumber)[0];

      if (!user) {
        Alert.alert(
          "Error",
          "User not found. Please restart the login process."
        );
        return;
      }

      if (isSettingPassword) {
        // 1. Set Password (Onboarding)
        const hashedPassword = fakeHash(password); // Use a proper hash function
        realm.write(() => {
          user.passwordHash = hashedPassword;
        });
        Alert.alert("Success", "Password set successfully!");
      } else {
        // 2. Standard Login
        if (!user.passwordHash || !fakeCompare(password, user.passwordHash)) {
          Alert.alert("Error", "Invalid password.");
          setIsLoading(false);
          return;
        }
      }

      // Successful Auth/Set, redirect based on role
      const homePath =
        user.role === "Manager" ? "/(app)/manager/home" : "/(app)/member/home";
      // Use replace to prevent going back to login screen
      router.replace(homePath);
    } catch (error) {
      console.error("Auth error:", error);
      Alert.alert("System Error", "An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <Stack.Screen options={{ title: title }} />
      <ScrollView contentContainerStyle={tw`flex-grow justify-center p-6`}>
        <Text style={tw`text-3xl font-bold text-gray-800 mb-2`}>{title}</Text>
        <Text style={tw`text-lg text-gray-500 mb-8`}>
          {isSettingPassword
            ? "Choose a strong password."
            : "Welcome back, enter your password."}
        </Text>

        <InputText
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TButton
          title={isLoading ? "Processing..." : buttonTitle}
          onPress={handleAuth}
          containerStyle={tw`mt-4`}
          disabled={isLoading}
        />
      </ScrollView>
    </View>
  );
}
