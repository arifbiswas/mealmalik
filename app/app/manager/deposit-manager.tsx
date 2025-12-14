import { Stack, router } from "expo-router"; // router আমদানি করা হলো
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import TButton from "@/lib/buttons/TButton";
import { Ionicons } from "@expo/vector-icons"; // আইকন আমদানি করা হলো
import tw from "twrnc";
import InputText from "../../../components/InputText";

// টাইপ সংজ্ঞা
type MemberDeposit = {
  id: string;
  name: string;
  email: string;
  total_deposit: number;
  last_deposit_date: string;
};

// সিমুলেটেড ডেটা
const membersDepositsSimulated: MemberDeposit[] = [
  {
    id: "u1",
    name: "সদস্য A",
    email: "memberA@mail.com",
    total_deposit: 8000,
    last_deposit_date: "১২/১০/২০২৫",
  },
  {
    id: "u2",
    name: "সদস্য B",
    email: "memberB@mail.com",
    total_deposit: 5000,
    last_deposit_date: "০৫/১০/২০২৫",
  },
  {
    id: "u3",
    name: "সদস্য C",
    email: "memberC@mail.com",
    total_deposit: 0,
    last_deposit_date: "জমা নেই",
  },
];

export default function DepositManagerScreen() {
  const [membersData, setMembersData] = useState<MemberDeposit[]>(
    membersDepositsSimulated
  );
  const [isFetching, setIsFetching] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // নতুন লেনদেন স্টেট
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [isAddingDeposit, setIsAddingDeposit] = useState(false);

  // --- ডেটা ফেচিং লজিক (Supabase) ---
  const fetchMemberDeposits = async () => {
    setIsFetching(true);
    // NOTE: রিয়েল অ্যাপে, আপনাকে একটি Supabase RPC/View তৈরি করতে হবে
    // যা expenses এবং deposits থেকে প্রতিটি ব্যবহারকারীর মোট জমা গণনা করবে।
    setTimeout(() => {
      setMembersData(membersDepositsSimulated);
      setIsFetching(false);
    }, 1000);
  };

  useEffect(() => {
    fetchMemberDeposits();
  }, []);

  // --- নতুন সদস্য যোগ করার ফাংশন ---
  const handleAddNewMember = () => {
    // Modal বন্ধ করুন
    setIsModalVisible(false);
    // রেজিস্ট্রেশন স্ক্রিনে নেভিগেট করুন যাতে নতুন সদস্য তৈরি করা যায়
    Alert.alert(
      "নতুন সদস্য",
      "নতুন সদস্য যোগ করতে রেজিস্ট্রেশন স্ক্রিনে নিয়ে যাওয়া হচ্ছে। মনে রাখবেন: রেজিস্টার করার সময় ম্যানুয়ালি মেম্বার রোল সেট করুন।"
    );
    router.push("/(auth)/register");
  };

  // --- নতুন জমা যোগ করার লজিক ---
  const handleAddDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (!selectedMemberId || isNaN(amount) || amount <= 0) {
      Alert.alert("ত্রুটি", "অনুগ্রহ করে সদস্য এবং বৈধ পরিমাণ নির্বাচন করুন।");
      return;
    }

    setIsAddingDeposit(true);
    try {
      // Supabase ইনসার্ট লজিক এখানে বসবে...

      Alert.alert(
        "সফল",
        `৳${amount} টাকা সফলভাবে ${
          membersData.find((m) => m.id === selectedMemberId)?.name
        }-এর অ্যাকাউন্টে জমা করা হয়েছে।`
      );

      // ডেটা রিফ্রেশ করা
      fetchMemberDeposits();

      // স্টেট রিসেট
      setSelectedMemberId(null);
      setDepositAmount("");
      setIsModalVisible(false);
    } catch (e) {
      Alert.alert("ত্রুটি", "জমা যোগ করতে ব্যর্থ হয়েছে।");
    } finally {
      setIsAddingDeposit(false);
    }
  };

  const MemberItem = ({ member }: { member: MemberDeposit }) => (
    <View
      style={tw`bg-white p-4 rounded-lg shadow-sm mb-3 flex-row justify-between items-center`}
    >
      <View>
        <Text style={tw`text-lg font-bold text-gray-800`}>{member.name}</Text>
        <Text style={tw`text-sm text-gray-500`}>{member.email}</Text>
      </View>
      <View style={tw`items-end`}>
        <Text
          style={tw`text-xl font-bold ${
            member.total_deposit > 0 ? "text-green-600" : "text-gray-500"
          }`}
        >
          ৳{member.total_deposit}
        </Text>
        <Text style={tw`text-xs text-gray-400`}>
          শেষ জমা: {member.last_deposit_date}
        </Text>
      </View>
    </View>
  );

  if (isFetching) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color={tw.color("blue-600")} />
        <Text style={tw`mt-4 text-gray-500`}>জমা তথ্য লোড হচ্ছে...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <Stack.Screen options={{ title: "সদস্যদের জমা ব্যবস্থাপনা" }} />
      <View style={tw`p-4 pb-0`}>
        <Text style={tw`text-3xl font-bold text-gray-800 mb-2`}>
          💵 জমা ও লেনদেন
        </Text>
        <Text style={tw`text-lg text-gray-500 mb-4`}>
          সদস্যদের মোট জমা এবং সর্বশেষ লেনদেন দেখুন।
        </Text>

        <TButton
          title="নতুন জমা যোগ করুন"
          onPress={() => setIsModalVisible(true)}
          containerStyle={tw`bg-teal-600 mb-4`}
        />
      </View>

      <FlatList
        data={membersData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MemberItem member={item} />}
        contentContainerStyle={tw`p-4 pt-0`}
      />

      {/* নতুন জমা যোগ করার Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`bg-white p-6 rounded-xl w-11/12 shadow-xl`}>
            <Text style={tw`text-2xl font-bold mb-4 text-gray-800`}>
              নতুন জমা যোগ করুন
            </Text>

            {/* সদস্য নির্বাচন */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-lg font-semibold text-gray-700 mb-1`}>
                সদস্য নির্বাচন করুন
              </Text>

              {/* নতুন সদস্য যোগ করার বাটন */}
              <TouchableOpacity
                onPress={handleAddNewMember}
                style={tw`flex-row items-center justify-center p-2 mb-2 bg-blue-50 border border-blue-200 rounded-lg`}
              >
                <Ionicons
                  name="person-add-outline"
                  size={20}
                  color={tw.color("blue-600")}
                />
                <Text style={tw`ml-2 text-base font-semibold text-blue-600`}>
                  নতুন সদস্য যোগ করুন
                </Text>
              </TouchableOpacity>

              {/* বিদ্যমান সদস্যদের তালিকা */}
              <ScrollView
                style={tw`max-h-32 border border-gray-300 rounded-lg`}
              >
                {membersData.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    onPress={() => setSelectedMemberId(member.id)}
                    style={tw`p-3 ${
                      selectedMemberId === member.id
                        ? "bg-blue-100 border-l-4 border-blue-600"
                        : "bg-white"
                    }`}
                  >
                    <Text style={tw`text-base text-gray-800`}>
                      {member.name} (৳{member.total_deposit})
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <InputText
              label="জমার পরিমাণ (টাকা)"
              placeholder="যেমন: ১০০০"
              value={depositAmount}
              onChangeText={setDepositAmount}
              keyboardType="numeric"
            />

            <TButton
              title={isAddingDeposit ? "জমা করা হচ্ছে..." : "জমা নিশ্চিত করুন"}
              onPress={handleAddDeposit}
              containerStyle={tw`mt-4 bg-teal-600`}
              disabled={isAddingDeposit || !selectedMemberId || !depositAmount}
            />
            <TButton
              title="বাতিল করুন"
              onPress={() => setIsModalVisible(false)}
              containerStyle={tw`mt-2 bg-gray-300`}
              titleStyle={tw`text-gray-700`}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
