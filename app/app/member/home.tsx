import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

import TButton from "@/lib/buttons/TButton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import tw from "twrnc";
import InputText from "../../../components/InputText";

// NOTE: এখানে ডেটা Supabase থেকে ফেচ করতে হবে। এখন সিমুলেশন ব্যবহার করা হচ্ছে।

export default function MemberHomeScreen() {
  const [requestedCount, setRequestedCount] = useState("");
  const [isRequestPending, setIsRequestPending] = useState(false); // সিমুলেটেড অবস্থা

  // --- সিমুলেটেড ডেটা (Supabase থেকে আসবে) ---
  const userName = "সদস্য 'ক'";
  const financialData = {
    deposits: 5000,
    expenditure: 1250,
    balance: 3750,
  };
  const todayMealCount = 3; // আজকের ডিফল্ট মিল সংখ্যা

  const handleMealChangeRequest = () => {
    const count = parseInt(requestedCount);
    if (isNaN(count) || count < 0 || count > 3) {
      Alert.alert(
        "ভুল ইনপুট",
        "অনুগ্রহ করে বৈধ মিল সংখ্যা (০, ১, ২, বা ৩) লিখুন।"
      );
      return;
    }

    // *** Supabase লজিক প্লেসহোল্ডার ***
    // 1. Supabase-এর meal_change_requests টেবিলে নতুন এন্ট্রি সেভ করা।
    // 2. স্ট্যাটাস 'Pending' থাকবে।

    setIsRequestPending(true);
    Alert.alert(
      "অনুরোধ পাঠানো হয়েছে",
      `${count} মিলের জন্য ম্যানেজারের অনুমোদনের অপেক্ষা করছে।`
    );
    setRequestedCount("");
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <ScrollView contentContainerStyle={tw`p-4`}>
        <Text style={tw`text-3xl font-bold text-gray-800 mb-6`}>
          👋 স্বাগতম, {userName}
        </Text>

        {/* আর্থিক স্ন্যাপশট কার্ড */}
        <View
          style={tw`bg-white p-5 rounded-xl shadow-md mb-6 border-l-4 border-blue-600`}
        >
          <Text style={tw`text-lg font-semibold text-gray-600 mb-3`}>
            ব্যক্তিগত আর্থিক তথ্য
          </Text>
          <View style={tw`flex-row justify-between py-1`}>
            <Text style={tw`text-base text-gray-700`}>মোট জমা:</Text>
            <Text style={tw`text-base font-bold text-green-600`}>
              ৳{financialData.deposits}
            </Text>
          </View>
          <View style={tw`flex-row justify-between py-1`}>
            <Text style={tw`text-base text-gray-700`}>মোট খরচ:</Text>
            <Text style={tw`text-base font-bold text-red-600`}>
              ৳{financialData.expenditure}
            </Text>
          </View>
          <View
            style={tw`border-t border-gray-200 mt-2 pt-2 flex-row justify-between`}
          >
            <Text style={tw`text-lg font-bold text-gray-800`}>
              বর্তমান ব্যালেন্স:
            </Text>
            <Text style={tw`text-lg font-bold text-blue-600`}>
              ৳{financialData.balance}
            </Text>
          </View>
        </View>

        {/* মিল কাস্টমাইজেশন */}
        <View style={tw`bg-white p-5 rounded-xl shadow-md mb-6`}>
          <Text
            style={tw`text-xl font-bold text-gray-800 mb-4 flex-row items-center`}
          >
            <Ionicons
              name="fast-food"
              size={20}
              color={tw.color("orange-500")}
              style={tw`mr-2`}
            />
            <Text> আজকের মিল সংখ্যা: {todayMealCount}</Text>
          </Text>

          <InputText
            label="আজকের মিল সংখ্যা কাস্টমাইজ করুন"
            placeholder="০, ১, ২, বা ৩ লিখুন"
            value={requestedCount}
            onChangeText={setRequestedCount}
            keyboardType="numeric"
          />

          <TButton
            title={
              isRequestPending
                ? "অনুরোধ অপেক্ষমান..."
                : "মিল পরিবর্তনের অনুরোধ করুন"
            }
            onPress={handleMealChangeRequest}
            containerStyle={tw`mt-2 bg-yellow-600`}
            disabled={isRequestPending}
          />
          {isRequestPending && (
            <Text style={tw`text-sm text-yellow-700 mt-2 text-center`}>
              আপনার অনুরোধ ম্যানেজারের অনুমোদনের অপেক্ষায় রয়েছে।
            </Text>
          )}
        </View>

        {/* অন্যান্য ফিচার */}
        <TButton
          title="খরচ জমা দিন"
          onPress={() => router.push("/app/member/expense-submission")}
          style={tw`mt-4 bg-purple-600`}
        />
        <TButton
          title="আমার ইতিহাস ও ড্যাশবোর্ড"
          onPress={() => router.push("/app/member/dashboard")}
          style={tw`mt-3 bg-teal-600`}
        />
      </ScrollView>
    </View>
  );
}
