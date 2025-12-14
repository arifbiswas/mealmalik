import {
  Alert,
  Dimensions,
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import React, {useRef, useState} from 'react';

import RNFS from 'react-native-fs';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
interface ImageViewProps {
  source: {uri: string}; // Image source (required)
  style?: any; // Custom styles for the thumbnail
  modalBackgroundStyle?: any; // Style for the modal background
  headerStyle?: any; // Style for the header container
  closeButtonStyle?: any; // Style for the close button text
  onClose?: () => void; // Optional callback for the close button
  onModalOpen?: () => void; // Optional callback for when the modal opens
  animationConfig?: {
    openDuration?: number;
    closeDuration?: number;
  }; // Customize animation durations
  gesturesEnabled?: boolean; // Toggle gestures
  aspectRatio?: number; // Allow customizable aspect ratio
  doubleTapScale?: number; // Customize double-tap zoom scale
}

const ImageView: React.FC<ImageViewProps> = ({
  source,
  style,
  modalBackgroundStyle,
  headerStyle,
  closeButtonStyle,
  onClose,
  onModalOpen,
  animationConfig = {openDuration: 500, closeDuration: 300},
  gesturesEnabled = true,
  aspectRatio = 1,
  doubleTapScale = 2,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [origin, setOrigin] = useState({x: 0, y: 0, width: 0, height: 0});

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const animatedOpacity = useSharedValue(1);
  const animatedPosition = useSharedValue(0);

  const ref = useRef<Image>(null);

  const cumulativeTranslateX = useSharedValue(0);
  const cumulativeTranslateY = useSharedValue(0);

  const initialImageWidth = SCREEN_WIDTH;
  const initialImageHeight = SCREEN_WIDTH / aspectRatio;

  const calculateBounds = (scaleFactor: number) => {
    'worklet';
    const scaledWidth = initialImageWidth * scaleFactor;
    const scaledHeight = initialImageHeight * scaleFactor;

    const maxTranslateX = Math.max((scaledWidth - SCREEN_WIDTH) / 2, 0);
    const maxTranslateY = Math.max((scaledHeight - SCREEN_HEIGHT) / 2, 0);

    return {maxTranslateX, maxTranslateY};
  };

  const clamp = (value: number, min: number, max: number) => {
    'worklet';
    return Math.min(Math.max(value, min), max);
  };

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        cumulativeTranslateX.value = 0;
        cumulativeTranslateY.value = 0;
      } else {
        scale.value = withSpring(doubleTapScale);
      }
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      scale.value = Math.max(1, e.scale);
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1);
      }
    });

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      if (scale.value > 1) {
        const {maxTranslateX, maxTranslateY} = calculateBounds(scale.value);

        translateX.value = clamp(
          e.translationX + cumulativeTranslateX.value,
          -maxTranslateX,
          maxTranslateX,
        );
        translateY.value = clamp(
          e.translationY + cumulativeTranslateY.value,
          -maxTranslateY,
          maxTranslateY,
        );
      }
    })
    .onEnd(() => {
      if (scale.value > 1) {
        cumulativeTranslateX.value = translateX.value;
        cumulativeTranslateY.value = translateY.value;
      }
    });

  const combinedGesture = gesturesEnabled
    ? Gesture.Simultaneous(
        Gesture.Simultaneous(pinchGesture, panGesture),
        doubleTapGesture,
      )
    : undefined;

  const animatedImageStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: animatedOpacity.value,
      width: interpolate(
        animatedPosition.value,
        [0, 1],
        [origin.width, initialImageWidth],
      ),
      height: interpolate(
        animatedPosition.value,
        [0, 1],
        [origin.height, initialImageHeight],
      ),
      transform: [
        {
          translateX: interpolate(
            animatedPosition.value,
            [0, 1],
            [origin.x + origin.width / 2 - SCREEN_WIDTH / 2, translateX.value],
          ),
        },
        {
          translateY: interpolate(
            animatedPosition.value,
            [0, 1],
            [
              origin.y + origin.height / 2 - SCREEN_HEIGHT / 2,
              translateY.value,
            ],
          ),
        },
        {scale: scale.value},
      ],
    };
  });

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: animatedOpacity.value,
      backgroundColor: 'black',
      ...modalBackgroundStyle,
    };
  });

  const handleOpenModal = () => {
    ref.current?.measure((x, y, width, height, pageX, pageY) => {
      setOrigin({x: pageX, y: pageY, width, height});
      animatedPosition.value = 0;
      animatedOpacity.value = 0;

      setIsModalVisible(true);
      onModalOpen?.();

      animatedPosition.value = withTiming(1, {
        duration: animationConfig.openDuration,
      });
      animatedOpacity.value = withTiming(1, {
        duration: animationConfig.openDuration,
      });
    });
  };

  const handleCloseModal = () => {
    'worklet';
    animatedOpacity.value = withTiming(
      0,
      {duration: animationConfig.closeDuration},
      () => {
        // Use runOnJS to call non-worklet functions
        runOnJS(setIsModalVisible)(false);
        if (onClose) {
          runOnJS(onClose)();
        }
      },
    );
  };

  const handleDownload = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'The app needs access to your storage to download images.',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission Denied',
          'Cannot download image without storage permission.',
        );
        return;
      }
    }

    const fileName = source.uri.split('/').pop();
    const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;
    try {
      await RNFS.downloadFile({
        fromUrl: source.uri,
        toFile: path,
      }).promise;
      Alert.alert('Download Successful', 'Image downloaded successfully.');
    } catch (error) {
      Alert.alert(
        'Download Failed',
        'An error occurred while downloading the image.',
      );
    }
  };

  return (
    <>
      <Pressable onPress={handleOpenModal}>
        <Image ref={ref} source={source} style={[style]} />
      </Pressable>

      <Modal
        statusBarTranslucent
        animationType="fade"
        transparent
        visible={isModalVisible}
        onRequestClose={handleCloseModal}>
        <GestureHandlerRootView style={styles.modalContainer}>
          <Animated.View
            style={[styles.modalBackground, animatedBackgroundStyle]}>
            <View style={[styles.header, headerStyle]}>
              <TouchableOpacity onPress={handleCloseModal}>
                <Text style={[styles.closeButton, closeButtonStyle]}>
                  Close
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDownload()}>
                <Text style={styles.downloadButton}>Download</Text>
              </TouchableOpacity>
            </View>
            <GestureDetector gesture={combinedGesture}>
              <Animated.Image
                source={source}
                style={[animatedImageStyle]}
                resizeMode="cover"
              />
            </GestureDetector>
          </Animated.View>
        </GestureHandlerRootView>
      </Modal>
    </>
  );
};

export default ImageView;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    flexDirection: 'row-reverse',
    gap: 15,
  },
  closeButton: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  downloadButton: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
});
