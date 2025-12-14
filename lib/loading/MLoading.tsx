import { ActivityIndicator, View } from "react-native";

import React from "react";
import tw from "../tailwind";

const MLoading = () => {
  return (
    <View style={tw`flex-1 justify-center items-center bg-base `}>
      <ActivityIndicator size={"large"} color={"#fff"} />
    </View>
  );
};

export default MLoading;
