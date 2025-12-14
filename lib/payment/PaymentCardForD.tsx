import { Text, TextInput, View } from "react-native";

import { Icon } from "@/assets/Icon";
import React from "react";
import { SvgXml } from "react-native-svg";
import tw from "../tailwind";

const PaymentCardForD = () => {
  return (
    <View style={tw`px-5 mt-5 gap-3`}>
      <Text style={tw`text-white text-xl font-DegularDisplayRegular`}>
        Card information
      </Text>
      <View style={tw``}>
        <View
          style={tw`flex-row items-center px-4 border border-t-secondary border-r-secondary border-l-secondary h-14 rounded-t-lg`}
        >
          <TextInput
            placeholder="Card number"
            placeholderTextColor={"#A9A9A9"}
            style={tw`flex-1 font-DegularDisplayRegular text-white text-lg `}
          />
          <SvgXml xml={Icon?.card} />
        </View>
        <View style={tw`flex-1 flex-row  `}>
          <TextInput
            placeholder="MM/YY"
            placeholderTextColor={"#A9A9A9"}
            style={tw`border w-1/2 rounded-bl-lg border-secondary h-14 px-4 font-DegularDisplayRegular text-white text-lg`}
          />
          <View
            style={tw`flex-row rounded-br-lg items-center border w-1/2 border-secondary h-14 px-4 `}
          >
            <TextInput
              placeholder="CVC"
              placeholderTextColor={"#A9A9A9"}
              style={tw`flex-1 font-DegularDisplayRegular text-white text-lg `}
            />
            <SvgXml xml={Icon?.cvc} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default PaymentCardForD;
