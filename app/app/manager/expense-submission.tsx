import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

import { supabase } from "@/database/supabase"; // Supabase ক্লায়েন্ট
import TButton from "@/lib/buttons/TButton";
import { router } from "expo-router";
import tw from "twrnc";
import InputText from "../../../components/InputText";

export default function ExpenseSubmissionScreen() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !amount) {
      Alert.alert("তথ্য নেই", "অনুগ্রহ করে খরচের নাম এবং পরিমাণ উভয়ই দিন।");
      return;
    }
    const expenseAmount = parseFloat(amount);
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      Alert.alert("ভুল পরিমাণ", "অনুগ্রহ করে একটি বৈধ ধনাত্মক সংখ্যা দিন।");
      return;
    }

    setIsLoading(true);
    try {
      // 1. বর্তমান ব্যবহারকারীর সেশন আইডি ফেচ করা
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("ব্যবহারকারী সেশন পাওয়া যায়নি।");

      // 2. Supabase-এর 'expenses' টেবিলে ডেটা ইনসার্ট করা
      const { error } = await supabase.from("expenses").insert({
        owner_id: user.id,
        title: title,
        amount: expenseAmount,
        description: description,
        status: "Pending", // ডিফল্ট স্ট্যাটাস
      });

      if (error) throw error;

      // সফলতার বার্তা
      Alert.alert(
        "সফল",
        "আপনার খরচ ম্যানেজারের অনুমোদনের জন্য জমা দেওয়া হয়েছে।"
      );

      // ফিল্ড পরিষ্কার করে ড্যাশবোর্ডে ফিরে যাওয়া
      setTitle("");
      setAmount("");
      setDescription("");
      router.replace("/app/member/dashboard");
    } catch (error) {
      console.error("খরচ জমা ত্রুটি:", error);
      Alert.alert("ত্রুটি", error.message || "খরচ জমা দিতে ব্যর্থ হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <ScrollView contentContainerStyle={tw`p-6`}>
        <Text style={tw`text-3xl font-bold text-gray-800 mb-6`}>
          💰 ব্যক্তিগত খরচ জমা দিন
        </Text>

        <InputText
          label="খরচের নাম"
          placeholder="যেমন: ওষুধের বিল, যাতায়াত খরচ"
          value={title}
          onChangeText={setTitle}
        />

        <InputText
          label="পরিমাণ (টাকা)"
          placeholder="যেমন: ৫৫০.০০"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <InputText
          label="বিবরণ (ঐচ্ছিক)"
          placeholder="খরচের বিস্তারিত কারণ"
          value={description}
          onChangeText={setDescription}
        />

        <TButton
          title={isLoading ? "জমা দেওয়া হচ্ছে..." : "অনুমোদনের জন্য জমা দিন"}
          onPress={handleSubmit}
          containerStyle={tw`mt-6 bg-purple-600`}
          disabled={isLoading}
        />
      </ScrollView>
    </View>
  );
}
