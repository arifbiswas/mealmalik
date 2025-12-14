import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

// import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import tw from "../tailwind";

interface IButton {
  containerStyle?: {};
  titleStyle?: {};
  title?: string;
  isLoading?: boolean;
  onPress?: () => void;
  loadingColor?: string;
  disabled?: boolean;
  offGradient?: boolean;
  gradinLayoutStyle?: {};
}

const TButton = ({
  containerStyle,
  title,
  titleStyle,
  isLoading,
  onPress,
  loadingColor,
  disabled,
  offGradient,
  gradinLayoutStyle,
}: IButton) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading || disabled}
      // activeOpacity={0.5}
      style={[
        tw` h-14 flex-row justify-center items-center gap-3 rounded-full   ${
          disabled ? "opacity-60" : "opacity-100"
        }`,
        containerStyle,
      ]}
    >
      {/* <LinearGradient
        // Background Linear Gradient
        colors={
          offGradient ? ["transparent", "transparent"] : ["#FF8787", "#8578B4"]
        }
        style={[
          tw`w-full h-full flex-row justify-center items-center gap-3 rounded-full`,
          gradinLayoutStyle,
        ]}
      > */}
      {isLoading && (
        <ActivityIndicator color={loadingColor ? loadingColor : "white"} />
      )}
      {title && (
        <Text
          style={[
            tw`text-white font-InterSemiBold text-base text-center `,
            titleStyle,
          ]}
        >
          {title}
        </Text>
      )}
      {/* </LinearGradient> */}
    </TouchableOpacity>
  );
};

export default TButton;
