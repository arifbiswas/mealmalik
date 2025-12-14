import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import React from "react";
import { SvgXml } from "react-native-svg";
import tw from "../tailwind";

interface NoFoundCardProps {
  title?: string;
  description?: string;
  hight?: number;
  isLoading?: boolean;
  reload?: () => void;
}

const EmptyCard = ({
  description,
  title,
  hight = 200,
  isLoading,
  reload,
}: NoFoundCardProps) => {
  return (
    <View>
      <View
        style={[
          tw`flex-1 justify-center items-center gap-3  opacity-15`,
          {
            height: hight && hight,
          },
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color={"white"} size={"large"} />
        ) : (
          <>
            <SvgXml
              height={60}
              width={60}
              // opacity={0.2}
              xml={`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 512.784 512.784" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M256.49 512.611c-39.223 0-76.087-8.051-109.57-23.929-9.98-4.733-14.234-16.66-9.501-26.641s16.661-14.234 26.641-9.501c182.603 84.249 373.961-104.925 287.358-288.361-10.496-24.22 23.859-40.738 36.143-17.138 81.565 167.692-45.06 367.114-231.071 365.57zM52.124 376.652c9.964-4.768 14.175-16.71 9.407-26.674C-25.292 167.823 166.08-25.438 348.923 61.684c9.98 4.732 21.906.477 26.638-9.503s.479-21.908-9.501-26.641C147.806-76.935-76.809 149.894 25.452 367.246c4.782 10.061 16.93 14.133 26.672 9.406zM34.632 506.753l472-472c7.811-7.811 7.811-20.474 0-28.284s-20.474-7.811-28.284 0l-472 472c-7.811 7.811-7.811 20.474 0 28.284 7.811 7.811 20.474 7.811 28.284 0z" fill="#FFF" opacity="1" data-original="#FFF" class=""></path></g></svg>
`}
            />
            <Text
              style={tw`text-white font-InterRegular text-base text-center`}
            >
              {title ? title : "Data not exists"}
            </Text>
          </>
        )}
      </View>
      {reload && (
        <TouchableOpacity
          onPress={reload}
          style={tw`absolute bottom-0 right-0 left-0`}
        >
          <Text
            style={tw`text-primary font-InterRegular text-base text-center`}
          >
            Reload
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyCard;
