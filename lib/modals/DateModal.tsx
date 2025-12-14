import React, { useState } from "react";

import { Calendar } from "react-native-calendars";
import NormalModal from "./NormalModal";
import TButton from "../buttons/TButton";
import dayjs from "dayjs";
import tw from "../tailwind";

interface DateModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDate: (dates: string[]) => void;
  item?: any;
  range?: boolean;
}

const formatDate = (date: any) => dayjs(date).format("YYYY-MM-DD");

const DateModal = ({
  setVisible,
  visible,
  item,
  range,
  selectedDate,
}: DateModalProps) => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const bookedDates = new Set(item?.booked || []);

  const handleDateSelect = (day: any) => {
    const selectedDay = day.dateString;

    if (!range) {
      // Single date selection
      setSelectedDates([selectedDay]);
      selectedDate([selectedDay]);
      setVisible(false);
    } else {
      // Multiple date selection (array)
      setSelectedDates((prevDates) => {
        if (prevDates.includes(selectedDay)) {
          return prevDates.filter((date) => date !== selectedDay); // Deselect if already selected
        } else if (!bookedDates.has(selectedDay)) {
          return [...prevDates, selectedDay]; // Add new date if not booked
        }
        selectedDate(prevDates);
        setVisible(false);
        return prevDates;
      });
    }
  };

  const getMarkedDates = () => {
    let marked: Record<string, any> = {};

    // Mark booked dates as disabled
    if (item?.booked) {
      item.booked.forEach((date: string) => {
        marked[date] = {
          disabled: true,
          disableTouchEvent: true,
          customStyles: {
            container: tw`bg-red-500 rounded-full`,
            text: tw`text-white font-bold`,
          },
        };
      });
    }

    // Mark selected dates
    selectedDates.forEach((date) => {
      marked[date] = {
        customStyles: {
          container: tw`bg-sky-600 rounded-full`,
          text: tw`text-white font-bold`,
        },
      };
    });

    // Highlight today's date
    const today = formatDate(new Date());
    if (!marked[today]) {
      marked[today] = {
        customStyles: {
          container: tw`bg-primary rounded-full`,
          text: {
            color: "white",
            fontWeight: "bold",
          },
        },
      };
    }

    return marked;
  };

  return (
    <NormalModal
      animationType="fade"
      visible={visible}
      setVisible={setVisible}
      layerContainerStyle={tw`justify-center items-center flex-1 px-[4%] `}
      containerStyle={tw`rounded-2xl bg-white`}
    >
      <Calendar
        theme={theme}
        markingType="custom"
        markedDates={getMarkedDates()}
        onDayPress={handleDateSelect}
      />
      {range && (
        <TButton
          disabled={selectedDates.length === 0}
          title="Done"
          containerStyle={tw`mt-4`}
          onPress={() => {
            selectedDate(selectedDates);
            setVisible(false);
          }}
        />
      )}
    </NormalModal>
  );
};

export default DateModal;

const theme = {
  stylesheet: {
    calendar: {
      header: {
        dayHeader: {
          fontWeight: "600",
          color: "#48BFE3",
        },
        monthText: {
          textAlign: "left",
          fontWeight: "bold",
          fontSize: 18,
          marginLeft: 10,
        },
      },
    },
  },
  "stylesheet.day.basic": {
    today: tw`bg-primary rounded-full`,
    todayText: tw`text-white`,
  },
  "stylesheet.day.single": {
    base: tw`border border-red-500`,
    text: tw`text-red-500 font-bold`,
  },
};
