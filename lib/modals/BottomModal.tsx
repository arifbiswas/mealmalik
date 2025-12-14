import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
// Importing necessary packages and components
import React, { useRef } from "react";

// Defining the props for RBSheet
interface RBSheetProps {
  height?: number;
  openDuration?: number;
  closeDuration?: number;
  closeOnPressMask?: boolean;
  closeOnPressBack?: boolean;
  draggable?: boolean;
  dragOnContent?: boolean;
  useNativeDriver?: boolean;
  customStyles?: any;
  customModalProps?: any;
  customAvoidingViewProps?: any;
  visible?: boolean;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  headerComponent?: React.ReactNode;
  children?: React.ReactNode;
}

const BottomModal = React.forwardRef(
  (
    {
      height = 100,
      openDuration = 300,
      closeDuration = 200,
      closeOnPressMask = true,
      closeOnPressBack = false,
      draggable = false,
      dragOnContent = false,
      useNativeDriver = false,
      customStyles = {},
      customModalProps = {},
      customAvoidingViewProps = {},
      setVisible,
      visible,
      title = "Modal Title",
      children = <View />,
      headerComponent,
    }: RBSheetProps,
    ref
  ) => {
    // Animated height and pan values
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const pan = useRef(new Animated.ValueXY()).current;

    // Function to handle modal visibility
    const handleSetVisible = (isVisible: boolean) => {
      if (isVisible) {
        // Open animation
        Animated.timing(animatedHeight, {
          useNativeDriver,
          toValue: height,
          duration: openDuration,
        }).start();
      } else {
        // Close animation
        Animated.timing(animatedHeight, {
          useNativeDriver,
          toValue: 0,
          duration: closeDuration,
        }).start(() => {
          setVisible && setVisible(false);
          pan.setValue({ x: 0, y: 0 }); // Reset pan values
        });
      }
    };

    // Creating PanResponder for drag functionality
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => draggable,
        onMoveShouldSetPanResponder: (e, gestureState) =>
          draggable && dragOnContent && gestureState.dy > 0,
        onPanResponderMove: (e, gestureState) => {
          if (gestureState.dy > 0) {
            Animated.event([null, { dy: pan.y }], { useNativeDriver })(
              e,
              gestureState
            );
          }
        },
        onPanResponderRelease: (e, gestureState) => {
          if (gestureState.dy > 100) {
            handleSetVisible(false);
          } else {
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              useNativeDriver,
            }).start();
          }
        },
      })
    ).current;

    React.useEffect(() => {
      if (visible) {
        handleSetVisible(visible);
      } else {
        handleSetVisible(false);
      }
    }, [visible]);

    // React Native modal render

    return (
      <Modal
        transparent
        visible={visible}
        onRequestClose={closeOnPressBack ? () => handleSetVisible(false) : null}
        {...customModalProps}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[styles.wrapper, customStyles]}
          {...customAvoidingViewProps}
        >
          <TouchableOpacity
            style={styles.mask}
            activeOpacity={1}
            onPress={
              closeOnPressMask ? () => handleSetVisible(false) : () => {}
            }
          />
          <ModalContent>
            <Animated.View
              style={[
                styles.container,
                { transform: pan.getTranslateTransform() },
                { height: animatedHeight },
                customStyles,
              ]}
              {...(dragOnContent && panResponder.panHandlers)}
            >
              {draggable && (
                <View
                  style={styles.draggableContainer}
                  {...(!dragOnContent && panResponder.panHandlers)}
                >
                  {headerComponent ? (
                    headerComponent
                  ) : (
                    <View
                      style={[styles.draggableIcon, customStyles.draggableIcon]}
                    />
                  )}
                </View>
              )}
              {children}
            </Animated.View>
          </ModalContent>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
);

export default BottomModal;

export const ModalContent = ({ children }: any): React.ReactElement => {
  if (Platform.OS === "ios") {
    return children;
  } else {
    return <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>;
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "flex-end", // Ensures the modal content starts at the bottom
  },
  wrapper: {
    flex: 1,
    backgroundColor: "#00000077",
  },
  mask: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    backgroundColor: "transparent",
    width: "100%",
    height: 0,
    overflow: "hidden",
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  draggableContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  draggableIcon: {
    width: 35,
    height: 5,
    borderRadius: 5,
    margin: 10,
    backgroundColor: "#ccc",
  },
});
