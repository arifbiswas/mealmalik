import { Pressable, Text, View } from "react-native";

import IwtButton from "../buttons/IwtButton";
import { Modal } from "react-native-ui-lib";
import React from "react";
import TButton from "../buttons/TButton";
import tw from "../tailwind";

interface NormalModalProps {
  visible?: boolean;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  layerContainerStyle?: any;
  containerStyle?: any;
  animationType?: "none" | "slide" | "fade";
  confirmationPress?: () => void;
  title?: string;
  subTitle?: string;
  titleStyle?: any;
  subTitleStyle?: any;
  icon?: React.ReactNode;
  svg?: string;
  buttonStyle?: any;
  buttonTextStyle?: any;
  buttonText?: string;
  onButtonPress?: () => void;
}

const NormalModal = ({
  setVisible,
  visible,
  containerStyle,
  layerContainerStyle,
  animationType,
  confirmationPress,
  buttonStyle,
  buttonText,
  buttonTextStyle,
  icon,
  onButtonPress,
  subTitle,
  subTitleStyle,
  svg,
  title,
  titleStyle,
}: NormalModalProps) => {
  return (
    <Modal
      transparent
      // useKeyboardAvoidingView={false}
      animationType={"fade"}
      overlayBackgroundColor={"rgba(0, 0, 0, 0.2)"}
      visible={visible}
      onBackgroundPress={() => setVisible && setVisible(!visible)}
    >
      <View
        style={[tw` justify-center items-center h-full`, layerContainerStyle]}
      >
        <Pressable
          style={[
            tw`bg-white w-[90%] p-4 rounded-lg`,
            containerStyle,
            tw`tablet:w-[35%]`,
          ]}
        >
          <View>
            <View style={tw`self-center py-[10%] w-[80%]`}>
              <Text
                style={[
                  tw`text-center text-black500 text-lg font-RobotoMedium`,
                  titleStyle,
                ]}
              >
                {title}
              </Text>
            </View>
            <View style={tw`flex-row justify-between px-2 pb-2`}>
              <TButton
                containerStyle={tw`w-[45%] h-12 p-0 m-0 bg-white border-gray-100 border    items-center`}
                titleStyle={tw`text-black600 text-sm font-NunitoSansMedium`}
                title={"Cancel"}
                onPress={() => setVisible && setVisible(false)}
              />
              {svg ? (
                <IwtButton
                  containerStyle={[
                    tw`w-[45%] h-12 p-0 m-0 bg-danger600    items-center`,
                    buttonStyle,
                  ]}
                  titleStyle={[
                    tw`text-white text-sm font-NunitoSansMedium`,
                    buttonTextStyle,
                  ]}
                  svg={svg}
                  title={buttonText}
                  onPress={confirmationPress}
                />
              ) : (
                <TButton
                  containerStyle={tw`w-[45%] h-12 p-0 m-0 bg-danger600    items-center`}
                  titleStyle={[
                    tw`text-white text-sm font-NunitoSansMedium`,
                    buttonTextStyle,
                  ]}
                  title={buttonText}
                  onPress={confirmationPress}
                />
              )}
            </View>
          </View>
        </Pressable>
      </View>
    </Modal>
  );
};

export default React.memo(NormalModal);
