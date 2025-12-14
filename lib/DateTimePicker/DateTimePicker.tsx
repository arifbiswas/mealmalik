import DatePicker, { DatePickerProps } from "react-native-date-picker";
import { Text, TouchableOpacity, View } from "react-native";

import { IconCalendar } from "@/icons/icons";
import { PrimaryColor } from "../../utils/utils";
import React from "react";
import { SvgXml } from "react-native-svg";
import tw from "../tailwind";

interface DateTimePickerProps {
  getCurrentDate?: (value: string) => any;
  dateProps?: DatePickerProps;
  title: string;
}

const DateTimePicker = ({
  dateProps,
  getCurrentDate,
  title,
}: DateTimePickerProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <View>
      <View>
        <TouchableOpacity
          onPress={() => {
            setOpen(true);
          }}
        >
          <View
            style={tw`bg-white h-12 px-2 rounded-md flex-row items-center justify-between`}
          >
            <Text style={tw`text-sm text-gray-500 font-DegularDisplayRegular`}>
              {title}
            </Text>
            <SvgXml xml={IconCalendar} />
          </View>
        </TouchableOpacity>
      </View>
      <DatePicker
        style={tw`border-0 h-12 rounded-lg bg-transparent`}
        mode="time"
        modal
        theme="dark"
        dividerColor={PrimaryColor}
        buttonColor={PrimaryColor}
        open={open}
        date={new Date()}
        onConfirm={(currentData: any) => {
          if (currentData) {
            getCurrentDate && getCurrentDate(currentData?.toISOString());
          }
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
        {...dateProps}
      />
    </View>
  );
};

export default DateTimePicker;
