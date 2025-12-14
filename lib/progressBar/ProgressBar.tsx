import Svg, { Circle } from "react-native-svg";

import React from "react";
import { View } from "react-native";
// CircularProgressBar.js
import tw from "@/src/lib/tailwind"; // Assuming you use tailwind-react-native-classnames

interface CircularProgressBarProps {
  size?: number;
  strokeWidth?: number;
  progress?: number;
  bgColor?: string;
  progressColor?: string;
  children?: React.ReactNode;
}

const CircularProgressBar = ({
  size = 130,
  strokeWidth = 10,
  progress = 75, // The progress percentage (0-100)
  bgColor = "#AFAFAF",
  progressColor = "#FF6D00",
  children,
}: CircularProgressBarProps) => {
  // 1. Calculations
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <View style={tw`justify-center items-center`}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          stroke={bgColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        {/* Progress Circle */}
        <Circle
          stroke={progressColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} // Start from the top
        />
      </Svg>

      {/* Optional: Render content in the center */}
      <View style={tw`absolute`}>{children}</View>
    </View>
  );
};

export default CircularProgressBar;
