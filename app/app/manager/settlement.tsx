import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Text,
  View,
} from "react-native";

import TButton from "@/lib/buttons/TButton";
import { Stack } from "expo-router";
import tw from "twrnc";

// সিমুলেটেড সেটেলমেন্ট ডেটা
// NOTE: এই ডেটা Supabase থেকে জটিল SQL Query/RPC Function (Stored Procedure) দ্বারা আসবে।
const settlementDataSimulated = [
  { id: "s1", name: "সদস্য A (owes)", netBalance: -1500.5, status: "পাওনা" },
  { id: "s2", name: "সদস্য B (due)", netBalance: 250.0, status: "দেয়" },
  { id: "s3", name: "সদস্য C (settled)", netBalance: 0, status: "নিষ্পত্তি" },
];

const BalanceRow = ({
  name,
  balance,
  status,
}: {
  name: string;
  balance: number;
  status: string;
}) => {
  const isOwed = balance < 0; // যদি ব্যালেন্স নেগেটিভ হয়, তবে সদস্যের কাছে পাওনা
  const balanceColor = isOwed ? "text-red-600" : "text-green-600";
  const absBalance = Math.abs(balance);

  return (
    <View style={tw`flex-row justify-between py-3 border-b border-gray-100`}>
      <Text style={tw`text-base font-medium text-gray-700 w-1/3`}>{name}</Text>
      <Text style={tw`text-base font-bold w-1/3 text-center ${balanceColor}`}>
        ৳{absBalance.toFixed(2)}
      </Text>
      <Text
        style={tw`text-base font-bold w-1/3 text-right ${
          isOwed ? "text-red-700" : "text-green-700"
        }`}
      >
        {status}
      </Text>
    </View>
  );
};

export default function SettlementScreen() {
  const [settlementData, setSettlementData] = useState<
    typeof settlementDataSimulated
  >([]);
  const [isSettled, setIsSettled] = useState(false); // চলতি মাসের জন্য নিষ্পত্তি হয়েছে কিনা
  const [isLoading, setIsLoading] = useState(false);

  // --- সেটেলমেন্ট ডেটা ফেচ ও গণনা ---
  useEffect(() => {
    // NOTE: রিয়েল অ্যাপে, এখানে Supabase RPC কল করা হবে যা ডেটাবেসে গণনার কাজ করবে।
    setIsLoading(true);
    setTimeout(() => {
      setSettlementData(settlementDataSimulated);
      setIsLoading(false);
      // এখানে সেটেলমেন্ট স্ট্যাটাসও ফেচ করতে হবে (যেমন: 'is_settled' ফ্লাগ)
    }, 1500);
  }, []);

  const handleFinalizeSettlement = () => {
    Alert.alert(
      "চূড়ান্তকরণের নিশ্চয়তা",
      "আপনি কি মাসিক সেটেলমেন্ট চূড়ান্ত করতে চান? এই পদক্ষেপটি পূর্বাবস্থায় ফেরানো যাবে না এবং পরবর্তী মাসের জন্য বাজেট রিসেট করবে।",
      [
        { text: "বাতিল", style: "cancel" },
        {
          text: "চূড়ান্ত করুন",
          onPress: async () => {
            // *** Supabase RPC (Stored Procedure) কল করা হবে ***
            // 1. সকল ডেটা আর্কাইভ করা
            // 2. ব্যালেন্স আপডেট করা
            // 3. নতুন মাসের জন্য সিস্টেম রিসেট করা
            setIsLoading(true);
            try {
              // const { error } = await supabase.rpc('finalize_monthly_settlement');
              // if (error) throw error;

              setIsSettled(true);
              Alert.alert(
                "সফল",
                "মাসিক সেটেলমেন্ট সফলভাবে চূড়ান্ত করা হয়েছে!"
              );
            } catch (e) {
              Alert.alert("ত্রুটি", "সেটেলমেন্ট চূড়ান্তকরণে ব্যর্থ হয়েছে।");
            } finally {
              setIsLoading(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color={tw.color("blue-600")} />
        <Text style={tw`mt-4 text-gray-500`}>
          রিপোর্ট প্রস্তুত করা হচ্ছে...
        </Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <Stack.Screen options={{ title: "মাসিক সেটেলমেন্ট" }} />
      <ScrollView contentContainerStyle={tw`p-6`}>
        <Text style={tw`text-3xl font-bold text-gray-800 mb-2`}>
          💵 মাসিক সেটেলমেন্ট
        </Text>
        <Text style={tw`text-lg text-gray-500 mb-6`}>
          চূড়ান্ত পাওনা গণনা করুন এবং মাসিক চক্রটি সম্পূর্ণ করুন।
        </Text>

        {/* রিপোর্ট সেকশন */}
        <View style={tw`bg-white p-4 rounded-xl shadow-md mb-6`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
            চূড়ান্ত ব্যালেন্স (চলতি মাস)
          </Text>

          {/* Header Row */}
          <View
            style={tw`flex-row justify-between py-2 border-b-2 border-gray-200`}
          >
            <Text style={tw`text-base font-bold text-gray-600 w-1/3`}>
              সদস্য
            </Text>
            <Text
              style={tw`text-base font-bold text-gray-600 w-1/3 text-center`}
            >
              পরিমাণ
            </Text>
            <Text
              style={tw`text-base font-bold text-gray-600 w-1/3 text-right`}
            >
              স্ট্যাটাস
            </Text>
          </View>

          <FlatList
            data={settlementData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BalanceRow
                name={item.name}
                balance={item.netBalance}
                status={item.status}
              />
            )}
            scrollEnabled={false}
          />
        </View>

        {/* চূড়ান্ত বাটন */}
        <TButton
          title={
            isSettled
              ? "নিষ্পত্তি সম্পূর্ণ হয়েছে"
              : "মাসিক সেটেলমেন্ট চূড়ান্ত করুন"
          }
          onPress={handleFinalizeSettlement}
          style={tw`mt-8 ${isSettled ? "bg-green-600" : "bg-red-600"}`}
          disabled={isSettled || isLoading}
        />

        {isSettled && (
          <Text style={tw`text-center text-green-700 font-semibold mt-3`}>
            মাসিক চক্রটি বন্ধ করা হয়েছে এবং অ্যাকাউন্টগুলি রিসেট করা হয়েছে।
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
