import React, { useRef } from "react";

import { _HIGHT } from "@/utils/utils";
import { ScrollView } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

interface BottomSheetProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

interface UseBottomModalResult {
  open: () => void;
  close: () => void;
  BottomModal: React.FC<BottomSheetProps>;
}

export const useBottomModal = (): UseBottomModalResult => {
  // Keep the reference stable and ensure it's always available
  const ref = useRef<RBSheet>(null);

  const open = () => {
    if (ref.current) {
      ref.current.open();
    }
  };

  const close = () => {
    if (ref.current) {
      ref.current.close();
    }
  };

  const BottomModal: React.FC<BottomSheetProps> = ({
    children,
    scrollable = false,
  }) => (
    <RBSheet
      ref={ref}
      draggable
      height={_HIGHT * 0.6}
      customStyles={{
        container: {
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        },
        draggableIcon: {
          width: 30,
        },
      }}
    >
      {scrollable ? <ScrollView>{children}</ScrollView> : children}
    </RBSheet>
  );

  return { open, close, BottomModal };
};
