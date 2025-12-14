import React, { Dispatch, SetStateAction } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import tw from "../tailwind";

interface IOptionSelectProps {
  setSelectOption: Dispatch<SetStateAction<string>>;
  data: Array<string>;
  selectOption: string;
  containerStyle?: any;
  selectStyle?: any;
  textstyle?: any;
}

const OptionSelect = ({
  data,
  selectOption,
  setSelectOption,
  containerStyle,
  selectStyle,
  textstyle,
}: IOptionSelectProps) => {
  return (
    <View style={[tw`flex-row justify-between gap-2`, containerStyle]}>
      {data.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            tw`p-2  rounded-lg items-center justify-center flex-1`,
            selectStyle,
            selectOption === item && tw`bg-primary40`,
          ]}
          onPress={() => setSelectOption(item)}
        >
          <Text style={[tw`text-white50 text-xs font-RobotoBold`, textstyle]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default OptionSelect;
