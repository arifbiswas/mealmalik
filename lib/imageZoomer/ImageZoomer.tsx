import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { Dimensions } from "react-native";
import React from "react";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ZoomableImageProps {
  uri: string;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({ uri }) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const imageWidth = SCREEN_WIDTH;
  const imageHeight = SCREEN_HEIGHT * 0.8;

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = clamp(savedScale.value * event.scale, 1, 5);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (scale.value > 1) {
        // Limit pan to image bounds
        const scaledWidth = imageWidth * scale.value;
        const scaledHeight = imageHeight * scale.value;

        const maxX = (scaledWidth - imageWidth) / 2;
        const maxY = (scaledHeight - imageHeight) / 6;

        translateX.value = clamp(
          savedTranslateX.value + event.translationX,
          -maxX,
          maxX
        );
        translateY.value = clamp(
          savedTranslateY.value + event.translationY,
          -maxY,
          maxY
        );
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      const newScale = scale.value > 1 ? 1 : 2;
      scale.value = withTiming(newScale);
      savedScale.value = newScale;

      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
    });

  const composedGesture = Gesture.Simultaneous(
    doubleTapGesture,
    Gesture.Simultaneous(pinchGesture, panGesture)
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.Image
        source={{ uri }}
        style={[{ width: imageWidth, height: imageHeight }, animatedStyle]}
        resizeMode="contain"
      />
    </GestureDetector>
  );
};

export default ZoomableImage;
