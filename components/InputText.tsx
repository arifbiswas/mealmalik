import { Text, TextInput, View } from "react-native";

import tw from "@/lib/tailwind";
import React from "react";

interface InputTextProps extends React.ComponentProps<typeof TextInput> {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "numeric" | "email-address";
}

const InputText: React.FC<InputTextProps> = ({ label, ...props }) => {
  return (
    <View style={tw`mb-4`}>
      <Text style={tw`text-lg font-semibold text-gray-700 mb-1`}>{label}</Text>
      <TextInput
        style={tw`border border-gray-300 p-3 rounded-lg text-base`}
        placeholderTextColor={tw.color("text-gray-400")}
        {...props}
      />
    </View>
  );
};

export default InputText;
