import { Text, View } from "react-native";

import React from "react";
import tw from "../tailwind";

interface IOR {
  containerStyle?: {};
  title?: string;
  titleStyle?: {};
  lineStyle?: {};
}

const Or = ({ containerStyle, title, titleStyle, lineStyle }: IOR) => {
  return (
    <View
      style={[tw`items-center gap-3 justify-center flex-row `, containerStyle]}
    >
      <View style={[tw`border-[.2px] flex-1 border-[#888888]`, lineStyle]} />
      <Text style={[tw`text-xs font-InterRegular text-gray-300`, titleStyle]}>
        {title || "Or"}
      </Text>
      <View style={[tw`border-[.2px] flex-1 border-[#888888]`, lineStyle]} />
    </View>
  );
};

export default Or;
