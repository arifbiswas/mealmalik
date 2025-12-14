import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { useLocalSearchParams } from "expo-router"; // প্যারামিটার নিতে
import tw from "twrnc";

export default function MemberDetailsScreen() {
  const params = useLocalSearchParams();
  const memberId = params.memberId as string;
  const memberName = params.memberName as string;

  const [memberDetails, setMemberDetails] = useState({
    totalMeals: 0,
    totalDeposit: 0,
    totalCost: 0,
    currentBalance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // --- Supabase থেকে ডেটা ফেচ করার লজিক ---
  useEffect(() => {
    const fetchMemberData = async () => {
      // NOTE: রিয়েল অ্যাপে, আপনাকে একটি Supabase RPC/View তৈরি করতে হবে
      // যা একটি সদস্যের ID (memberId) নিয়ে তার মোট মিল, মোট খরচ এবং ব্যালেন্স গণনা করবে।

      setIsLoading(true);
      try {
        // 1. RPC কল যা সমস্ত গণনা করবে:
        // const { data, error } = await supabase.rpc('calculate_member_summary', { user_id: memberId });
        // if (error) throw error;

        // আপাতত সিমুলেশন
        const simulatedData = {
          totalMeals: 45,
          totalDeposit: 15000,
          totalCost: 12500,
          currentBalance: 2500,
        };

        setMemberDetails(simulatedData);
      } catch (error) {
        console.error("সদস্যের ডেটা ফেচ ত্রুটি:", error);
        // Alert.alert("ত্রুটি", "সদস্যের ডেটা লোড করা সম্ভব হয়নি।");
      } finally {
        setIsLoading(false);
      }
    };

    if (memberId) {
      fetchMemberData();
    }
  }, [memberId]);

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color={tw.color("blue-600")} />
        <Text style={tw`mt-4 text-gray-500`}>সদস্যের তথ্য লোড হচ্ছে...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-50 p-4`}>
      <ScrollView>
        <Text style={tw`text-3xl font-bold text-gray-800 mb-6`}>
          {memberName}-এর ড্যাশবোর্ড
        </Text>

        {/* কার্ড: মোট জমা */}
        <View
          style={tw`bg-white p-5 rounded-xl shadow-md mb-4 border-l-4 border-green-600`}
        >
          <Text style={tw`text-lg font-semibold text-gray-600`}>মোট জমা</Text>
          <Text style={tw`text-3xl font-extrabold text-green-700 mt-2`}>
            ৳{memberDetails.totalDeposit}
          </Text>
        </View>

        {/* কার্ড: মোট মিল */}
        <View
          style={tw`bg-white p-5 rounded-xl shadow-md mb-4 border-l-4 border-blue-600`}
        >
          <Text style={tw`text-lg font-semibold text-gray-600`}>
            মোট মিল সংখ্যা
          </Text>
          <Text style={tw`text-3xl font-extrabold text-blue-700 mt-2`}>
            {memberDetails.totalMeals} টি
          </Text>
        </View>

        {/* কার্ড: মোট খরচ */}
        <View
          style={tw`bg-white p-5 rounded-xl shadow-md mb-4 border-l-4 border-red-600`}
        >
          <Text style={tw`text-lg font-semibold text-gray-600`}>
            মোট বাজার খরচ
          </Text>
          <Text style={tw`text-3xl font-extrabold text-red-700 mt-2`}>
            ৳{memberDetails.totalCost}
          </Text>
        </View>

        <Text style={tw`mt-8 text-sm text-gray-500`}>
          সদস্য আইডি: {memberId}
        </Text>
      </ScrollView>
    </View>
  );
}
