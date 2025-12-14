import { Image, View } from "react-native";

import React from "react";
import tw from "../tailwind";

interface IAvatar {
  source: { uri: string };
  name?: string;
  size?: number;
  containerStyle?: any;
  imageStyle?: any;
}

const Avatar = ({
  source,
  size = 30,
  containerStyle,
  imageStyle,
  name,
}: IAvatar) => {
  return (
    <View style={containerStyle}>
      {name && (
        <Image
          style={[
            tw`rounded-full`,
            {
              height: size,
              width: size,
            },
            imageStyle,
          ]}
          source={{
            uri: `https://ui-avatars.com/api/?background=random&name=${name}&bold=true`,
          }}
        />
      )}
      {source && (
        <Image
          style={[
            tw`rounded-full`,
            {
              height: size,
              width: size,
            },
            imageStyle,
          ]}
          source={source}
        />
      )}
    </View>
  );
};

export default Avatar;
