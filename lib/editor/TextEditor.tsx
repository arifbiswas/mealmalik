import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
} from "react-native";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";

import { _HIGHT } from "@/src/utils/utils";
import React from "react";
import tw from "../tailwind";

const handleHead = ({ tintColor }: any) => (
  <Text style={{ color: tintColor }}>H1</Text>
);

const handleLink = ({ tintColor }: any) => (
  <Text style={{ color: tintColor }}>Link</Text>
);

interface TextEditorProps {
  onChange?: (descriptionText: string) => void;
  onFocus?: (isEditing: boolean) => void;
  value?: string;
}

const TextEditor = ({ onChange, onFocus, value }: TextEditorProps) => {
  const richText = React.useRef<null>(null);
  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <RichToolbar
            style={tw`bg-transparent border border-secondary  rounded-t-md`}
            editor={richText}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.heading1,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.insertLink,
            ]}
            iconMap={{
              [actions.heading1]: handleHead,
              [actions.insertLink]: handleLink,
            }}
          />
          <RichEditor
            initialHeight={_HIGHT * 0.3}
            initialContentHTML={value}
            placeholder="Write your caption"
            style={tw`bg-transparent border border-t-0 border-secondary rounded-b-md p-2 text-white`}
            editorStyle={tw`bg-transparent border border-secondary rounded-md p-2 text-white`}
            ref={richText}
            onChange={(text) => {
              onChange && onChange(text);
            }}
            onFocus={() => {
              onFocus && onFocus(true);
            }}
            onBlur={() => {
              onFocus && onFocus(false);
            }}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TextEditor;
