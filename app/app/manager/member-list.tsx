import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";

import { supabase } from "@/database/supabase"; // Supabase ক্লায়েন্ট
import TButton from "@/lib/buttons/TButton";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

// টাইপ সংজ্ঞা (Type Definition)
type RequestItem = {
  id: string;
  type: "Expense" | "Meal Change";
  member_name: string; // এটি সদস্যের ইমেল বা নাম ধারণ করবে
  details: string;
  amount: number;
  created_at: string;
};

export default function ApprovalScreen() {
  const [pendingRequests, setPendingRequests] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  console.log(pendingRequests);

  // --- ডেটা ফেচিং লজিক ---
  const fetchPendingRequests = async () => {
    setIsLoading(true);
    try {
      // 1. Expense (খরচ) অনুরোধ ফেচ করা
      const { data: expenses, error: expenseError } = await supabase
        .from("expenses")
        .select(
          `
            id, title, amount, created_at,
            owner_id ( 
              email
            ) 
          `
        )
        .eq("status", "Pending");

      if (expenseError) throw expenseError;

      const expenseRequests = expenses.map((e) => ({
        id: e.id,
        type: "Expense" as const,
        member_name: e.owner_id?.email || "অজানা সদস্য",
        details: `${e.title} (পরিমাণ: ৳${e.amount.toFixed(2)})`,
        amount: e.amount,
        created_at: new Date(e.created_at).toLocaleDateString("bn-BD"),
      }));

      // 2. Meal Change (মিল পরিবর্তন) অনুরোধ ফেচ করা
      const { data: mealChanges, error: mealError } = await supabase
        .from("meal_change_requests")
        .select(
          `
            id, requested_count, created_at,
            owner_id (
                email
            )
          `
        )
        .eq("status", "Pending");

      if (mealError) throw mealError;

      const mealRequests = mealChanges.map((m) => ({
        id: m.id,
        type: "Meal Change" as const,
        member_name: m.owner_id?.email || "অজানা সদস্য",
        details: `মিল পরিবর্তন অনুরোধ: ${m.requested_count} টি`,
        amount: 0,
        created_at: new Date(m.created_at).toLocaleDateString("bn-BD"),
      }));

      // *** ফিক্স করা হলো: শুধুমাত্র রিয়েল ডেটা (expenseRequests ও mealRequests) যুক্ত করা হচ্ছে ***
      setPendingRequests([...expenseRequests, ...mealRequests]);
    } catch (error) {
      console.log("অনুরোধ ফেচ ত্রুটি:", error);
      Alert.alert("ত্রুটি", "অনুমোদনের জন্য অনুরোধ আনতে ব্যর্থ।");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  // --- অনুমোদন/প্রত্যাখ্যান লজিক (ঠিক আছে) ---
  const handleAction = async (
    item: RequestItem,
    action: "Approved" | "Rejected"
  ) => {
    setIsProcessing(true);
    try {
      let table = "";
      let updateData = {
        status: action,
      };

      if (item.type === "Expense") {
        table = "expenses";
      } else if (item.type === "Meal Change") {
        table = "meal_change_requests";
      } else {
        return;
      }

      const { error } = await supabase
        .from(table)
        .update(updateData)
        .eq("id", item.id);

      if (error) throw error;

      // সফল হলে তালিকা থেকে আইটেমটি সরিয়ে দিন
      setPendingRequests((prev) => prev.filter((req) => req.id !== item.id));
      Alert.alert(
        "সফল",
        `${item.type} অনুরোধটি সফলভাবে ${
          action === "Approved" ? "অনুমোদিত" : "প্রত্যাখ্যাত"
        } হয়েছে।`
      );
    } catch (error) {
      console.error("অনুমোদন ত্রুটি:", error);
      Alert.alert("ত্রুটি", `${item.type} অনুমোদন দিতে ব্যর্থ হয়েছে।`);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- রেন্ডার কম্পোনেন্ট (ঠিক আছে) ---
  const RequestItemComponent = ({ item }: { item: RequestItem }) => (
    <View
      style={tw`bg-white p-4 rounded-lg shadow-sm mb-4 border-l-4 ${
        item.type === "Expense" ? "border-red-500" : "border-blue-500"
      }`}
    >
      <View style={tw`flex-row justify-between items-start mb-2`}>
        <Text style={tw`text-lg font-bold text-gray-800`}>
          {item.member_name}
        </Text>
        <Text style={tw`text-sm text-gray-500`}>{item.created_at}</Text>
      </View>

      <Text style={tw`text-base font-semibold text-gray-700 mb-3`}>
        {item.type === "Expense" ? "খরচ:" : "মিল পরিবর্তন:"} {item.details}
      </Text>

      <View style={tw`flex-row justify-between mt-2`}>
        <TButton
          title="অনুমোদন করুন"
          onPress={() => handleAction(item, "Approved")}
          containerStyle={tw`flex-1 mr-2 bg-green-600`}
          disabled={isProcessing}
        />
        <TButton
          title="প্রত্যাখ্যান করুন"
          onPress={() => handleAction(item, "Rejected")}
          containerStyle={tw`flex-1 ml-2 bg-red-600`}
          disabled={isProcessing}
        />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color={tw.color("blue-600")} />
        <Text style={tw`mt-4 text-gray-500`}>অনুরোধ লোড হচ্ছে...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <Text style={tw`text-xl font-bold text-gray-800 p-4 pb-2`}>
        ⭐ অনুমোদনের জন্য অনুরোধ
      </Text>
      <Text style={tw`text-lg text-gray-500 p-4 pt-0`}>
        সদস্যদের খরচ ও মিল পরিবর্তনের অনুরোধগুলো পর্যালোচনা করুন।
      </Text>

      <FlatList
        data={pendingRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RequestItemComponent item={item} />}
        contentContainerStyle={tw`p-4`}
        ListEmptyComponent={
          <View style={tw`p-10 items-center justify-center`}>
            <Ionicons
              name="checkmark-circle-outline"
              size={50}
              color={tw.color("green-400")}
            />
            <Text style={tw`text-gray-500 mt-3`}>
              বর্তমানে কোনো অপেক্ষমান অনুরোধ নেই।
            </Text>
          </View>
        }
      />
    </View>
  );
}
