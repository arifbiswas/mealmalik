import { Platform, Text, TouchableOpacity, View } from "react-native";

import { IconRightArrayGray } from "../../icons/icons";
import { NavigProps } from "../../interfaces/NaviProps";
import React from "react";
import { SvgXml } from "react-native-svg";
import tw from "../tailwind";

interface IBackWithHeader extends NavigProps<null> {
  svgIcon?: any;
  title?: string;
  titleStyle?: any;
  containerStyle?: any;
  offBack?: boolean;
}
const BackWithHeader = ({
  navigation,
  svgIcon,
  title,
  titleStyle,
  containerStyle,
  offBack,
}: IBackWithHeader) => {
  return (
    <View
      style={[
        tw`px-[4%] ${
          Platform.OS === "android" ? "pt-5" : "pt-0"
        }  pb-4 flex-row gap-3 items-center`,
        containerStyle,
      ]}
    >
      {!offBack && (
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <SvgXml xml={svgIcon || IconRightArrayGray} />
        </TouchableOpacity>
      )}

      <Text style={[tw`text-base text-white200 font-RobotoBlack `, titleStyle]}>
        {title}
      </Text>
    </View>
  );
};

export default React.memo(BackWithHeader);
