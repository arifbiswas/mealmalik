import { ActivityIndicator, View } from "react-native";

import { PrimaryColor } from "../../utils/utils";
import React from "react";
import tw from "../tailwind";

interface IGLoadingProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const GLoading = ({ loading, setLoading }: IGLoadingProps) => {
  return (
    <>
      {loading && (
        <View
          style={tw` bg-base z-50 w-full  bg-opacity-40 h-full  absolute justify-center items-center`}
        >
          <ActivityIndicator size={"large"} color={PrimaryColor} />
        </View>
      )}
    </>
  );
};

export default GLoading;
