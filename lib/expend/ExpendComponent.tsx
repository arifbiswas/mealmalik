import { Text, View } from "react-native";

import { ExpandableSection } from "react-native-ui-lib";
import { IFaq } from "../../redux/interface/additional";
import { IconDownArrow } from "../../icons/icons";
import React from "react";
import { SvgXml } from "react-native-svg";
import tw from "../tailwind";

const ExpendComponent = ({ item }: { item: IFaq }) => {
  const [expend, setExpended] = React.useState(false);
  return (
    <View style={tw`mx-[4%] gap-2 py-5 border-b border-b-black100`}>
      <ExpandableSection
        expanded={expend}
        sectionHeader={
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-black900 font-RobotoBold text-base`}>
              {item.question}
            </Text>
            <SvgXml xml={IconDownArrow} />
          </View>
        }
        onPress={() => setExpended(!expend)}
      >
        <View style={tw`my-2`}>
          <Text style={tw`text-black600 font-DegularDisplayRegular text-sm`}>
            {item.answer}
          </Text>
        </View>
      </ExpandableSection>
    </View>
  );
};

export default ExpendComponent;
