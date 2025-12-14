import { Text, TouchableOpacity, View } from "react-native";

import React from "react";
import { SvgXml } from "react-native-svg";
import tw from "../tailwind";

interface BackWithTitleProps {
  onPress?: () => void;
  title: string;
  titleStyle?: any;
  containerStyle?: any;
  backOff?: boolean;
}

const BackWithTitle = ({
  onPress,
  title,
  containerStyle,
  titleStyle,
  backOff,
}: BackWithTitleProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={[tw`flex-row items-center gap-3 p-[4%]`, containerStyle]}
    >
      <View
        style={tw`bg-[#3D3D3D] w-12 h-12 justify-center items-center rounded-full`}
      >
        <SvgXml
          xml={`<svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.477124 9.99984L9.69575 18L12 16.0003L3.9335 9L12 1.99969L9.69575 0L0.477124 8.00016C0.171621 8.26536 0 8.625 0 9C0 9.375 0.171621 9.73464 0.477124 9.99984Z" fill="white"/>
</svg>



`}
        />
      </View>
      <Text
        style={[
          tw`text-white50 font-DegularDisplaySemibold text-xl `,
          titleStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(BackWithTitle);
