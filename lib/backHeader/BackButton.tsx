import { Text, TouchableOpacity, View } from "react-native";

import React from "react";
import { SvgXml } from "react-native-svg";
import tw from "../tailwind";

interface BackButtonProps {
  onPress?: () => void;
  titleStyle?: any;
  title?: any;
  containerStyle?: any;
  buttonStyle?: any;
}

const BackButton = ({
  onPress,
  containerStyle,
  titleStyle,
  title,
  buttonStyle,
}: BackButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={[
        tw` flex-row px-4 pt-4 pb-3  items-center gap-2 `,
        containerStyle,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        style={tw`flex-row items-center gap-3 `}
      >
        <View
          style={[
            tw`bg-[#3D3D3D] w-12 h-12 justify-center items-center rounded-full `,
            buttonStyle,
          ]}
        >
          <SvgXml
            xml={`<svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.477124 9.99984L9.69575 18L12 16.0003L3.9335 9L12 1.99969L9.69575 0L0.477124 8.00016C0.171621 8.26536 0 8.625 0 9C0 9.375 0.171621 9.73464 0.477124 9.99984Z" fill="white"/>
</svg>



`}
          />
        </View>
        <Text
          numberOfLines={1}
          style={[tw`text-white  font-InterSemiBold text-base`, titleStyle]}
        >
          {title ? title : null}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default BackButton;
