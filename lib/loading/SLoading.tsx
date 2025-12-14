import { ActivityIndicator, View } from "react-native";

import React from "react";
import tw from "../tailwind";

const SLoading = () => {
  return (
    <View style={tw`flex-1 bg-[#121212] justify-center items-center`}>
      <ActivityIndicator size={"large"} color={"#fff"} />
    </View>
  );
};

export default SLoading;
