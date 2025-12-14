import { Text, TouchableOpacity, View } from "react-native";

import React from "react";
import tw from "../tailwind";

export default class GlobalErrorBoundary extends React.Component {
  constructor(props = {}) {
    super(props);
    this.state = { hasError: false, error: null } as any;
  }

  static getDerivedStateFromError(error = null) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.log("GLOBAL ERROR:", error, info);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
            backgroundColor: tw.color("base"),
          }}
        >
          {/* Error Illustration */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "#FFE5E0",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 25,
            }}
          >
            <Text style={{ fontSize: 55 }}>⚠️</Text>
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              color: "#333",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Something went wrong
          </Text>

          {/* Subtitle */}
          <Text
            style={{
              fontSize: 15,
              color: "#666",
              textAlign: "center",
              marginBottom: 30,
              lineHeight: 20,
              width: "85%",
            }}
          >
            An unexpected error occurred. Please try again or restart the app.
          </Text>

          {/* Button */}
          <TouchableOpacity
            onPress={this.resetError}
            style={{
              backgroundColor: "#ED6237",
              paddingVertical: 12,
              paddingHorizontal: 28,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export const GlobalErrorBoundaryProvider = ({ children }: any) => {
  return <GlobalErrorBoundary>{children}</GlobalErrorBoundary>;
};
