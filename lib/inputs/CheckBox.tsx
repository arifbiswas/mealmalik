import { Text, TouchableOpacity, View } from "react-native";

import React from "react";
import { SvgXml } from "react-native-svg";
import tw from "../tailwind";

interface CheckBoxProps {
  onPress?: (version: boolean) => void;
  color?: string;
  iconColor?: string;
  size?: number;
  style?: any;
  icon?: string;
  title?: string;
  titleStyle?: any;
  containerStyle?: any;
  checked?: boolean;
  titleComponent?: React.ReactNode;
}

const defaultIcon = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="12" height="12" x="0" y="0" viewBox="0 0 520 520" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M239.987 460.841a10 10 0 0 1-7.343-3.213L34.657 243.463A10 10 0 0 1 42 226.675h95.3a10.006 10.006 0 0 1 7.548 3.439l66.168 76.124c7.151-15.286 20.994-40.738 45.286-71.752 35.912-45.85 102.71-113.281 216.994-174.153a10 10 0 0 1 10.85 16.712c-.436.341-44.5 35.041-95.212 98.6-46.672 58.49-108.714 154.13-139.243 277.6a10 10 0 0 1-9.707 7.6z" data-name="6-Check" fill="white" opacity="1"  class=""></path></g></svg>`;

const CheckBox = ({
  color,
  iconColor,
  size,
  style,
  icon,
  checked = false,
  onPress,
  title,
  titleStyle,
  containerStyle,
  titleComponent,
}: CheckBoxProps) => {
  // This component renders a simple checkbox style

  return (
    <TouchableOpacity
      style={[tw` flex-row items-center gap-2 `, containerStyle]}
      onPress={() => {
        onPress && onPress(!checked);
      }}
    >
      <View
        style={[
          tw`w-5 h-5 border border-white rounded-md`,
          {
            backgroundColor: checked
              ? color || tw.color("primary")
              : "transparent",
            justifyContent: "center",
            alignItems: "center",
          },
          style,
        ]}
      >
        {checked && icon ? (
          <SvgXml xml={icon} width={size || 12} height={size || 12} />
        ) : (
          checked && (
            <SvgXml xml={defaultIcon} width={size || 12} height={size || 12} />
          )
        )}
      </View>

      {
        // Render title component if provided
        titleComponent ? titleComponent : null
      }

      {title && !titleComponent ? (
        <Text
          style={[
            tw`text-white  text-sm leading-5 font-InterRegular `,
            titleStyle,
          ]}
        >
          {title}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

export default CheckBox;
