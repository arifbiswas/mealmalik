import { ScrollView, TouchableWithoutFeedback, View } from "react-native";

import React from "react";
import { Modal } from "react-native-ui-lib";
import tw from "../tailwind";

interface NormalModalProps {
  visible?: boolean;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  layerContainerStyle?: any;
  containerStyle?: any;
  children?: React.ReactNode;
  animationType?: "none" | "slide" | "fade";
  scrollable?: boolean;
}

const NormalModal = ({
  setVisible,
  visible,
  containerStyle,
  children,
  layerContainerStyle,
  scrollable,
  animationType,
}: NormalModalProps) => {
  return (
    <Modal
      transparent
      useGestureHandlerRootView
      presentationStyle="overFullScreen"
      shouldRasterizeIOS
      enableModalBlur={false}
      useKeyboardAvoidingView
      animationType={"fade"}
      overlayBackgroundColor={"rgba(0, 0, 0, 0.5)"}
      visible={visible}
      onBackgroundPress={() => setVisible && setVisible(false)} // Ensure it toggles correctly
    >
      <TouchableWithoutFeedback onPress={() => setVisible && setVisible(false)}>
        <View
          style={[
            tw`flex-1  justify-center items-center `,
            layerContainerStyle,
          ]}
        >
          <TouchableWithoutFeedback>
            <View
              style={[
                tw`bg-secondary bg-opacity-10  w-full p-4 rounded-xl`,
                containerStyle,
                tw`tablet:w-[35%]`,
              ]}
            >
              {scrollable ? (
                <ScrollView
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                >
                  {children}
                </ScrollView>
              ) : (
                children
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default React.memo(NormalModal);
