import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { supabase } from "@/database/supabase";
import TButton from "@/lib/buttons/TButton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import tw from "twrnc";
import InputText from "../../../components/InputText";

// টাইপ সংজ্ঞা
type Member = {
  id: string;
  email: string; // users টেবিল থেকে
  name: string; // আমরা email কেই নাম হিসেবে ব্যবহার করব
  currentMealCount: number;
};

// --- ডেটা ফেচিং কাস্টম হুক ---
const useManagerData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [budget, setBudget] = useState({
    initial: 0,
    expenditure: 0,
    remaining: 0,
  });
  const [totalPendingRequests, setTotalPendingRequests] = useState(0);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // --- 1. বাজেট এবং সেটিংস ফেচ করা (app_settings প্রয়োজন) ---
      const { data: settingData, error: settingError } = await supabase
        .from("app_settings")
        .select("initial_budget, current_expenditure") // এই কলাম দুটি app_settings এ থাকতে হবে
        .eq("id", 1)
        .single();

      if (settingError && settingError.code !== "PGRST116") throw settingError;

      const initial = settingData?.initial_budget || 0;
      const expenditure = settingData?.current_expenditure || 0;
      setBudget({
        initial: initial,
        expenditure: expenditure,
        remaining: initial - expenditure,
      });

      // --- 2. সদস্যদের তালিকা এবং আজকের মিল ফেচ করা ---
      const { data: membersData, error: membersError } = await supabase
        .from("users")
        .select(
          `
                    id, email, 
                    daily_meals: daily_meals(count)
                    `
        )
        .neq("role", "Manager"); // ম্যানেজার বাদে সবাই সদস্য

      if (membersError) throw membersError;

      const today = new Date().toISOString().split("T")[0];

      const memberList: Member[] = membersData.map((m: any) => ({
        id: m.id,
        email: m.email,
        name: m.email.split("@")[0], // ইমেলের প্রথম অংশকে নাম হিসেবে ব্যবহার করা
        currentMealCount: m.daily_meals[0]?.count || 0, // আজ তারিখ অনুযায়ী ফিল্টার করতে RPC ব্যবহার করা ভালো
      }));
      setMembers(memberList);

      // --- 3. মোট অপেক্ষমান অনুরোধের সংখ্যা গণনা (RPC বা Count Query ব্যবহার করা ভালো) ---
      const { count: expenseCount } = await supabase
        .from("expenses")
        .select("id", { count: "exact", head: true })
        .eq("status", "Pending");

      const { count: mealChangeCount } = await supabase
        .from("meal_change_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "Pending");

      setTotalPendingRequests((expenseCount || 0) + (mealChangeCount || 0));
    } catch (error) {
      console.error("ডেটা ফেচ ত্রুটি:", error);
      Alert.alert("ত্রুটি", "ড্যাশবোর্ড ডেটা লোড করতে ব্যর্থ।");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ডেটা রিফ্রেশ করার জন্য একটি ফাংশন
  const refreshData = () => fetchAllData();

  return { isLoading, members, budget, totalPendingRequests, refreshData };
};

export default function ManagerHomeScreen() {
  const { isLoading, members, budget, totalPendingRequests, refreshData } =
    useManagerData();

  // --- বাজেট ম্যানেজমেন্ট State ---
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
  const [newInitialBudget, setNewInitialBudget] = useState(
    String(budget.initial)
  );
  const [isUpdatingBudget, setIsUpdatingBudget] = useState(false);

  // --- নতুন Meal Update State ---
  const [isMealModalVisible, setIsMealModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null as Member | null);
  const [newMealCount, setNewMealCount] = useState("");
  const [isUpdatingMeal, setIsUpdatingMeal] = useState(false);

  // ডেটা লোড না হলে লোডিং স্ক্রিন
  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color={tw.color("blue-600")} />
        <Text style={tw`mt-4 text-gray-500`}>ড্যাশবোর্ড ডেটা লোড হচ্ছে...</Text>
      </View>
    );
  }

  // *** বাজেট আপডেট লজিক ***
  const handleBudgetUpdate = async () => {
    const amount = parseFloat(newInitialBudget);
    if (isNaN(amount) || amount < 0) {
      Alert.alert(
        "ভুল ইনপুট",
        "অনুগ্রহ করে একটি বৈধ ধনাত্মক বাজেট পরিমাণ দিন।"
      );
      return;
    }

    setIsUpdatingBudget(true);
    try {
      // app_settings টেবিলে বাজেট আপডেট করা
      const { error } = await supabase
        .from("app_settings")
        .upsert({ id: 1, initial_budget: amount }, { onConflict: "id" });

      if (error) throw error;

      Alert.alert(
        "সফল",
        `প্রাথমিক বাজেট সফলভাবে ৳${amount} এ আপডেট করা হয়েছে।`
      );
      refreshData(); // ডেটা রিফ্রেশ করা
    } catch (e) {
      Alert.alert("ত্রুটি", "বাজেট আপডেট করতে ব্যর্থ।");
    } finally {
      setIsUpdatingBudget(false);
      setIsBudgetModalVisible(false);
    }
  };

  // *** নতুন মিল আপডেট লজিক ***
  const handleMealCountUpdate = async () => {
    const count = parseInt(newMealCount);
    const today = new Date().toISOString().split("T")[0];

    if (!selectedMember || isNaN(count) || count < 0 || count > 3) {
      Alert.alert("ভুল ইনপুট", "অনুগ্রহ করে একটি বৈধ মিল সংখ্যা (০-৩) দিন।");
      return;
    }

    setIsUpdatingMeal(true);
    try {
      // daily_meals টেবিলে আজকের জন্য মিল সংখ্যা আপডেট করা
      const { error } = await supabase.from("daily_meals").upsert(
        {
          user_id: selectedMember.id,
          meal_date: today, // কলামের নাম আপনার স্কিমা অনুযায়ী দিতে হবে
          count: count,
        },
        { onConflict: "user_id, meal_date" }
      ); // কম্পোজিট কী প্রয়োজন

      if (error) throw error;

      Alert.alert(
        "সফল",
        `${selectedMember.name}-এর জন্য আজকের মিল সংখ্যা ${count} এ আপডেট করা হয়েছে।`
      );
      refreshData(); // ডেটা রিফ্রেশ করা
    } catch (e) {
      Alert.alert("ত্রুটি", "মিল সংখ্যা আপডেট করতে ব্যর্থ।");
    } finally {
      setIsUpdatingMeal(false);
      setIsMealModalVisible(false);
    }
  };

  // Meal Update Modal ওপেন করার ফাংশন
  const openMealUpdateModal = (member: Member) => {
    setSelectedMember(member);
    setNewMealCount(String(member.currentMealCount));
    setIsMealModalVisible(true);
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <ScrollView contentContainerStyle={tw`p-4`}>
        <View style={tw`flex-row flex-1 items-center mb-4`}>
          <Text style={tw`text-3xl font-bold text-gray-800 flex-1`}>
            ম্যানেজার ড্যাশবোর্ড
          </Text>
          {/* logout button */}
          <TouchableOpacity
            style={tw``}
            onPress={async () => {
              await supabase.auth.signOut();
              router.replace("/");
            }}
          >
            <Ionicons name="log-out-outline" size={30} color="red" />
          </TouchableOpacity>
        </View>

        {/* বাজেট ওভারভিউ কার্ড */}
        <View
          style={tw`bg-white p-5 rounded-xl shadow-md mb-4 border-l-4 border-red-600`}
        >
          <Text style={tw`text-lg font-semibold text-gray-600 mb-3`}>
            বাজেট সংক্ষিপ্ত বিবরণ
          </Text>
          <View style={tw`flex-row justify-between py-1`}>
            <Text style={tw`text-base text-gray-700`}>প্রাথমিক বাজেট:</Text>
            <Text style={tw`text-base font-bold text-gray-800`}>
              ৳{budget.initial}
            </Text>
          </View>
          <View style={tw`flex-row justify-between py-1`}>
            <Text style={tw`text-base text-gray-700`}>বর্তমান খরচ:</Text>
            <Text style={tw`text-base font-bold text-red-600`}>
              ৳{budget.expenditure}
            </Text>
          </View>
          <View
            style={tw`border-t border-gray-200 mt-2 pt-2 flex-row justify-between`}
          >
            <Text style={tw`text-lg font-bold text-gray-800`}>
              অবশিষ্ট ব্যালেন্স:
            </Text>
            <Text style={tw`text-lg font-bold text-green-600`}>
              ৳{budget.remaining}
            </Text>
          </View>

          {/* বাজেট আপডেট বাটন */}
          <TButton
            title="প্রাথমিক বাজেট আপডেট করুন"
            onPress={() => {
              setNewInitialBudget(String(budget.initial));
              setIsBudgetModalVisible(true);
            }}
            containerStyle={tw`mt-4 bg-gray-500`}
            titleStyle={tw`text-sm`}
          />
        </View>

        {/* অনুমোদন ও নিয়ন্ত্রণসমূহ */}
        <TButton
          title={`অনুমোদনের জন্য অনুরোধ (${totalPendingRequests}টি)`}
          onPress={() => router.push("/app/manager/member-list")} // অনুমোদন স্ক্রিন
          containerStyle={tw`mb-4 bg-orange-600`}
        />

        <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
          সদস্যদের দৈনিক মিল নিয়ন্ত্রণ
        </Text>
        {members.map((member) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/app/manager/member-details",
                params: { memberId: member.id, memberName: member.name },
              })
            }
            key={member.id}
            style={tw`bg-white p-4 rounded-lg shadow-sm mb-3 flex-row justify-between items-center`}
          >
            {/* সদস্যের নাম */}
            <Text style={tw`text-lg font-medium text-gray-800`}>
              {member.name}
            </Text>

            {/* মিল আপডেট বাটন যা Modal ওপেন করবে */}
            <TouchableOpacity
              onPress={() => openMealUpdateModal(member)} // নতুন ফাংশন কল
              style={tw`flex-row items-center bg-blue-100 p-2 rounded-full`}
            >
              <Text style={tw`text-base font-bold text-blue-600 mr-2`}>
                আজকের মিল: {member.currentMealCount}
              </Text>
              <Ionicons
                name="create-outline"
                size={20}
                color={tw.color("blue-600")}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* নেভিগেশন বাটন */}
        <View style={tw`mt-8 border-t border-gray-200 pt-6`}>
          <TButton
            title="সদস্যদের জমা/লেনদেন যোগ করুন"
            onPress={() => router.push("/app/manager/deposit-manager")} // নতুন স্ক্রিনের পাথ
            containerStyle={tw`mb-4 bg-purple-600`} // নতুন বাটন
          />
          <TButton
            title="মাসিক সেটেলমেন্ট রিপোর্ট"
            onPress={() => router.push("/app/manager/settlement")}
            containerStyle={tw`bg-teal-700`}
          />
        </View>
      </ScrollView>

      {/* ------------------------------------- */}
      {/* 1. বাজেট আপডেট Modal */}
      {/* ------------------------------------- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isBudgetModalVisible}
        onRequestClose={() => setIsBudgetModalVisible(false)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`bg-white p-6 rounded-xl w-11/12 shadow-xl`}>
            <Text style={tw`text-2xl font-bold mb-4 text-gray-800`}>
              প্রাথমিক বাজেট আপডেট
            </Text>

            <InputText
              label="নতুন প্রাথমিক বাজেট (টাকা)"
              placeholder="যেমন: ১,৫০,০০০"
              value={newInitialBudget}
              onChangeText={setNewInitialBudget}
              keyboardType="numeric"
            />

            <TButton
              title={isUpdatingBudget ? "আপডেট করা হচ্ছে..." : "বাজেট সেভ করুন"}
              onPress={handleBudgetUpdate}
              containerStyle={tw`mt-4 bg-green-600`}
              disabled={isUpdatingBudget}
            />
            <TButton
              title="বাতিল করুন"
              onPress={() => setIsBudgetModalVisible(false)}
              containerStyle={tw`mt-2 bg-gray-300`}
              titleStyle={tw`text-gray-700`}
            />
          </View>
        </View>
      </Modal>

      {/* ------------------------------------- */}
      {/* 2. মিল সংখ্যা আপডেট Modal */}
      {/* ------------------------------------- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isMealModalVisible}
        onRequestClose={() => setIsMealModalVisible(false)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`bg-white p-6 rounded-xl w-11/12 shadow-xl`}>
            <Text style={tw`text-2xl font-bold mb-4 text-gray-800`}>
              মিল সংখ্যা আপডেট
            </Text>
            <Text style={tw`text-lg text-gray-600 mb-4`}>
              {selectedMember?.name}-এর আজকের মিল সংখ্যা পরিবর্তন করুন।
            </Text>

            <InputText
              label="আজকের নতুন মিল সংখ্যা"
              placeholder="০, ১, ২, বা ৩"
              value={newMealCount}
              onChangeText={setNewMealCount}
              keyboardType="numeric"
            />

            <TButton
              title={
                isUpdatingMeal ? "আপডেট করা হচ্ছে..." : "মিল সংখ্যা সেভ করুন"
              }
              onPress={handleMealCountUpdate}
              containerStyle={tw`mt-4 bg-blue-600`}
              disabled={isUpdatingMeal}
            />
            <TButton
              title="বাতিল করুন"
              onPress={() => setIsMealModalVisible(false)}
              containerStyle={tw`mt-2 bg-gray-300`}
              titleStyle={tw`text-gray-700`}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
