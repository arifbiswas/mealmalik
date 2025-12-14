import { Stack } from "expo-router";
import { View } from "react-native";
import tw from "twrnc";

// NOTE: In a real app, this layout would contain the logic to check
// if the user is logged in, and redirect between (auth) and (app).
// For now, we'll just show the structure.

export default function RootLayout() {
  return (
    <View style={tw`flex-1 py-6`}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* Auth Group: Hides header, no back button on login */}
        <Stack.Screen name="auth" options={{ headerShown: false }} />

        {/* App Group: Shows main app content */}
        {/* The actual role-based navigation is handled inside (app)/_layout.tsx */}
        <Stack.Screen name="app" options={{ headerShown: false }} />

        {/* Index: Redirects users or shows initial loading */}
        {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
      </Stack>
      {/* <StatusBar style="auto" /> */}
    </View>
  );
}
