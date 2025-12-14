import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { AnimatedImage } from "react-native-ui-lib";
import React from "react";
import { SvgXml } from "react-native-svg";
import tw from "../tailwind";

export interface ICardProps {
  children?: React.ReactNode;
  containerStyle?: any;
  cardStyle?: any;
  component?: React.ReactNode;
  OuterComponent?: React.ReactNode;
  onPress?: () => void;

  layoutStyle?: any;
}

const Card = ({
  children,
  cardStyle,
  component,
  containerStyle,
  OuterComponent,
  layoutStyle,
  onPress,
}: ICardProps) => {
  return (
    <View style={[tw`flex-row items-center justify-between`, layoutStyle]}>
      <TouchableOpacity
        activeOpacity={0.6}
        disabled={!onPress}
        onPress={onPress}
        style={[
          tw`bg-primary600 p-2 rounded-md flex-row justify-between items-center flex-1`,
          cardStyle,
        ]}
      >
        <View style={[tw``, containerStyle]}>{children}</View>
        {component && <View>{component}</View>}
      </TouchableOpacity>
      {OuterComponent && <View>{OuterComponent}</View>}
    </View>
  );
};

export interface ICardImageProps {
  source: { uri: string };
  containerStyle?: any;
  imageStyle?: any;
  children?: React.ReactNode;
}

Card.Image = ({
  source,
  containerStyle,
  imageStyle,
  children,
}: ICardImageProps) => {
  return (
    <>
      {children ? (
        children
      ) : (
        <>
          <AnimatedImage
            containerStyle={[
              tw`aspect-square   items-center rounded-md`,
              containerStyle,
            ]}
            errorSource={source}
            // onError={e => console.log(e)}
            animationDuration={500}
            style={[tw`aspect-square  rounded-md`, imageStyle]}
            loader={<ActivityIndicator color="white" size={"small"} />}
            source={
              source?.uri
                ? source
                : require("../../assets/images/icons/no_image.png")
            }
          />
        </>
      )}
    </>
  );
};

export interface ICardDetailsProps {
  children?: React.ReactNode;
  containerStyle?: any;
  detailsContainerStyle?: any;
  svgStyle?: any;
  textStyle?: any;
  data?: Array<{
    title?: string;
    icons?: React.ReactNode;
    titleStyle?: any;
  }>;
}

Card.Details = ({
  children,
  data,
  containerStyle,
  detailsContainerStyle,
  svgStyle,
  textStyle,
}: ICardDetailsProps) => {
  return (
    <>
      {children ? (
        children
      ) : (
        <View style={[tw`justify-start  gap-1 `, containerStyle]}>
          {data?.map((item, index) => {
            return (
              <View
                key={index}
                style={[
                  tw`flex-row items-center gap-1.5`,
                  detailsContainerStyle,
                ]}
              >
                {item?.icons && <SvgXml xml={item.icons} {...svgStyle} />}
                {item?.title && (
                  <Text
                    numberOfLines={1}
                    style={[
                      tw`text-white font-DegularDisplayRegular text-sm `,
                      item.titleStyle,
                    ]}
                  >
                    {item.title}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      )}
    </>
  );
};

interface CardButtonProps {
  total: number;
  checkedIn: number;
  onPress?: () => void;
}

Card.Button = ({ checkedIn, total, onPress }: CardButtonProps) => {
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.6}
        disabled={total == 0}
        onPress={onPress}
        style={tw`px-2  ${
          total == 0 ? "bg-green-900" : "bg-green-600"
        } rounded-lg h-10 items-center justify-center`}
      >
        <Text
          style={tw` ${
            // checkedIn === total ? 'text-white400' : 'text-white50'
            "text-white50"
          }  font-RobotoBlack`}
        >
          Checked in {checkedIn}/{total}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default Card;
