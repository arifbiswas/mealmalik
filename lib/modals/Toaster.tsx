import React, {
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Modal } from "react-native-ui-lib";
import tw from "../tailwind";

// import LottieView from 'lottie-react-native';

// import { FontSize } from '../../../utils/utils';

// Define the ref object type
export interface PopUpModalRef {
  open: (data: PopUpModalProps) => void;
  close: () => void;
}

// Define the component's props type
export interface PopUpModalProps {
  title?: string;
  titleStyle?: any;
  icon?: JSX.Element;
  lottify?: string;
  containerStyle?: any;
  iconComponent?: JSX.Element;
  multipleBTNStyle?: any;
  multipleButton?: Array<{
    onPress?: () => void;
    text?: string;
    buttonText?: string;
    buttonTextStyle?: any;
    buttonStyle?: any;
  }>;
  onPress?: () => void;
  svgIcon?: any;
  content?: string;
  contentStyle?: any;
  buttonStyle?: any;
  btnDisplay?: boolean;
  buttonTextStyle?: any;
  buttonText?: string;
  fullWidth?: boolean;
  fullHeight?: boolean;
  direction?: "down" | "up" | "left" | "right";
  iconComponentStyle?: any;
}

const { width, height } = Dimensions.get("window");

const PopUpModal = forwardRef<PopUpModalRef, PopUpModalProps>(
  ({ direction }, ref) => {
    const [visible, setVisible] = useState(false);
    const [modalContent, setModalContent] = useState<PopUpModalProps>();

    useImperativeHandle(ref, () => ({
      open(data) {
        setModalContent(data);
        setVisible(true);
      },
      close() {
        setVisible(false);
      },
    }));

    return (
      <Modal
        transparent
        animationType="fade"
        overlayBackgroundColor="rgba(0, 0, 0, 0.5)" // Semi-transparent background
        visible={visible}
        useKeyboardAvoidingView
        // statusBarTranslucent
        onDismiss={() => setVisible(false)}
        onBackgroundPress={() => setVisible(false)} // Close modal on background press
      >
        <Pressable
          onPress={() => {
            setVisible(false);
          }}
          style={tw`flex-1 justify-center items-center`}
        >
          <Pressable
            style={[
              tw`bg-white p-5 rounded-xl gap-2`,
              modalContent?.containerStyle,
            ]}
          >
            {modalContent?.icon && <View>{modalContent?.icon}</View>}
            {/* {modalContent?.lottify && (
              <View>
                <LottieView
                  autoPlay
                  loop={true}
                  source={modalContent?.lottify}
                  style={{
                    height: height * 0.08,
                    aspectRatio: 1,
                  }}
                />
              </View>
            )} */}
            {modalContent?.iconComponent && (
              <View
                style={[
                  tw`justify-center items-center`,
                  modalContent.iconComponentStyle,
                ]}
              >
                {modalContent?.iconComponent}
              </View>
            )}
            {modalContent?.svgIcon && (
              <View style={tw`justify-center items-center`}>
                {modalContent?.svgIcon}
              </View>
            )}
            {modalContent?.title && (
              <Text
                style={[
                  tw`text-center text-black text-lg`,
                  modalContent.titleStyle,
                ]}
              >
                {modalContent.title}
              </Text>
            )}
            {modalContent?.content && (
              <Text
                style={[
                  tw`text-center text-black font-normal text-base `,
                  modalContent.contentStyle,
                ]}
              >
                {modalContent.content}
              </Text>
            )}
            {!modalContent?.multipleButton && !modalContent?.btnDisplay && (
              <View
                style={[
                  tw`bg-cyan-800  justify-center items-center bg-opacity-75  rounded-lg`,
                  modalContent?.buttonStyle,
                ]}
              >
                <TouchableOpacity
                  style={tw` w-full h-10 justify-center items-center`}
                  activeOpacity={0.5}
                  onPress={modalContent?.onPress}
                >
                  <Text
                    style={[
                      tw`text-white font-bold`,
                      modalContent?.buttonTextStyle,
                    ]}
                  >
                    {modalContent?.buttonText || "Okay"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {modalContent?.multipleButton && (
              <View style={[tw`flex-row gap-3`, modalContent.multipleBTNStyle]}>
                {modalContent?.multipleButton.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      tw` bg-black600 justify-center items-center  rounded-xl`,
                      item?.buttonStyle,
                    ]}
                  >
                    <TouchableOpacity
                      style={tw`h-10 w-full justify-center  items-center`}
                      activeOpacity={0.5}
                      onPress={item?.onPress}
                    >
                      <Text
                        style={[
                          tw`text-white font-bold`,
                          item?.buttonTextStyle,
                        ]}
                      >
                        {item?.buttonText || "Okay"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </Pressable>
        </Pressable>
        {/* </BlurView> */}
      </Modal>
    );
  }
);

export default PopUpModal;

interface ToastContextType {
  showToast: (data: PopUpModalProps) => void;
  closeToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Hook to use the toast context.
 * @throws {Error} if called outside of a ToastProvider
 * @returns {ToastContextType} the toast context
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

/**
 * Context provider for managing toast notifications.
 * @param children React node representing the children components.
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const ref = useRef<PopUpModalRef>(null);

  const showToast = (data: PopUpModalProps) => {
    if (ref.current) {
      ref.current.open(data);
    }
  };
  const closeToast = () => {
    if (ref.current) {
      ref.current.close();
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, closeToast }}>
      {children}
      <PopUpModal ref={ref} />
    </ToastContext.Provider>
  );
};
