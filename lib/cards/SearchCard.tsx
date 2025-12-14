import { IconSearchGray } from "@/icons/icons";
import React from "react";
import { View } from "react-native";
import InputText from "../inputs/InputText";
import tw from "../tailwind";

interface SearchCardProps {
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
  search?: string;
  placeholder?: string;
  containerStyle?: any;
  fieldStyle?: any;
  focusSTyle?: any;
  Component?: React.ReactNode;
  ref?: any;
  label?: string;
  onPress?: () => void;
}

const SearchCard = ({ search, setSearch }: SearchCardProps) => {
  return (
    <View style={tw`h-12 px-2`}>
      <InputText
        svgFirstIcon={IconSearchGray}
        value={search}
        onChangeText={(text) => setSearch && setSearch(text)}
        placeholder="Search"
        style={tw`text-black`}
        containerStyle={tw` border border-gray-500 rounded-full h-12 flex-1`}
      />
    </View>
  );
};

export default SearchCard;
