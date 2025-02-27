import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import GorhomBottomSheet, {
  BottomSheetBackdrop as GorhomBottomSheetBackdrop,
  BottomSheetView as GorhomBottomSheetView,
  BottomSheetHandle,
  BottomSheetTextInput as GorhomBottomSheetInput,
  BottomSheetScrollView as GorhomBottomSheetScrollView,
  BottomSheetFlatList as GorhomBottomSheetFlatList,
  BottomSheetSectionList as GorhomBottomSheetSectionList,
} from "@gorhom/bottom-sheet";
import { Platform } from "react-native";
import type { PressableProps, TextProps } from "react-native";
import { FocusScope } from "@react-native-aria/focus";
import { Pressable, Text } from "react-native";
import { cssInterop } from "nativewind";
import { tva } from "@gluestack-ui/nativewind-utils/tva";

const bottomSheetBackdropStyle = tva({
  base: "absolute inset-0 flex-1 touch-none select-none bg-black opacity-0",
});

const bottomSheetContentStyle = tva({
  base: "mt-2",
});
const bottomSheetTriggerStyle = tva({
  base: "",
});

const bottomSheetIndicatorStyle = tva({
  base: "py-1 w-full items-center rounded-t-lg hidden",
});

const bottomSheetItemStyle = tva({
  base: "p-3 flex-row items-center rounded-sm w-full disabled:opacity-0.4 web:pointer-events-auto disabled:cursor-not-allowed hover:bg-background-50 active:bg-background-100 focus:bg-background-100 web:focus-visible:bg-background-100",
});

// Enhanced context type with global control methods
type BottomSheetContextType = {
  visible: boolean;
  bottomSheetRef: React.RefObject<GorhomBottomSheet>;
  handleClose: () => void;
  handleOpen: () => void;
  // New global control methods
  openById: (id: string, snapIndex?: number) => void;
  closeById: (id: string) => void;
  registerSheet: (id: string, ref: React.RefObject<GorhomBottomSheet>) => void;
  unregisterSheet: (id: string) => void;
  onVisibilityChange: (callback: (isVisible: boolean) => void) => () => void; // Add this line
};

// Global context for managing all bottom sheets
const GlobalBottomSheetContext = createContext<BottomSheetContextType>({
  visible: false,
  bottomSheetRef: { current: null },
  handleClose: () => {},
  handleOpen: () => {},
  openById: () => {},
  closeById: () => {},
  registerSheet: () => {},
  unregisterSheet: () => {},
  onVisibilityChange: () => () => {}, // Add this line
});

// Original context for backwards compatibility
const BottomSheetContext = createContext<{
  visible: boolean;
  bottomSheetRef: React.RefObject<GorhomBottomSheet>;
  handleClose: () => void;
  handleOpen: () => void;
  onVisibilityChange: (callback: (isVisible: boolean) => void) => () => void; // Add this line
}>({
  visible: false,
  bottomSheetRef: { current: null },
  handleClose: () => {},
  handleOpen: () => {},
  onVisibilityChange: () => () => {}, // Add this line
});

// New provider component for global control
export const BottomSheetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const sheetsRef = useRef(
    new Map<string, React.RefObject<GorhomBottomSheet>>()
  );
  const [visible, setVisible] = useState(false);
  const bottomSheetRef = useRef<GorhomBottomSheet>(null);

  const visibilityChangeCallbacks = useRef<Set<(isVisible: boolean) => void>>(
    new Set()
  );

  const onVisibilityChange = useCallback(
    (callback: (isVisible: boolean) => void) => {
      visibilityChangeCallbacks.current.add(callback);
      return () => {
        visibilityChangeCallbacks.current.delete(callback);
      };
    },
    []
  );

  const notifyVisibilityChange = useCallback((isVisible: boolean) => {
    visibilityChangeCallbacks.current.forEach((callback) => {
      callback(isVisible);
    });
  }, []);

  const registerSheet = useCallback(
    (id: string, ref: React.RefObject<GorhomBottomSheet>) => {
      sheetsRef.current.set(id, ref);
    },
    []
  );

  const unregisterSheet = useCallback((id: string) => {
    sheetsRef.current.delete(id);
  }, []);

  const openById = useCallback(
    (id: string, snapIndex: number = 1) => {
      const sheet = sheetsRef.current.get(id);
      if (sheet?.current) {
        sheet.current.snapToIndex(snapIndex);
        setVisible(true);
        notifyVisibilityChange(true);
      }
    },
    [notifyVisibilityChange]
  );

  const closeById = useCallback(
    (id: string) => {
      const sheet = sheetsRef.current.get(id);
      if (sheet?.current) {
        sheet.current.close();
        setVisible(false);
        notifyVisibilityChange(false);
      }
    },
    [notifyVisibilityChange]
  );

  const handleOpen = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1);
    setVisible(true);
    notifyVisibilityChange(true);
  }, [notifyVisibilityChange]);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
    setVisible(false);
    notifyVisibilityChange(false);
  }, [notifyVisibilityChange]);

  return (
    <GlobalBottomSheetContext.Provider
      value={{
        visible,
        bottomSheetRef,
        handleClose,
        handleOpen,
        openById,
        closeById,
        registerSheet,
        unregisterSheet,
        onVisibilityChange, // Add this line
      }}
    >
      {children}
    </GlobalBottomSheetContext.Provider>
  );
};

// Hook for using bottom sheet functionality
export const useBottomSheet = () => useContext(GlobalBottomSheetContext);

// Modified BottomSheet component with ID support
type IBottomSheetProps = React.ComponentProps<typeof GorhomBottomSheet>;
export const BottomSheet = ({
  id,
  snapToIndex = 1,
  onOpen,
  onClose,
  ...props
}: {
  id?: string; // Optional to maintain backwards compatibility
  snapToIndex?: number;
  children?: React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
}) => {
  const { registerSheet, unregisterSheet, onVisibilityChange } =
    useBottomSheet();
  const bottomSheetRef = useRef<GorhomBottomSheet>(null);

  // Register sheet if ID is provided
  React.useEffect(() => {
    if (id) {
      registerSheet(id, bottomSheetRef);
      return () => unregisterSheet(id);
    }
  }, [id, registerSheet, unregisterSheet]);

  const [visible, setVisible] = useState(false);

  const handleOpen = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(snapToIndex);
    setVisible(true);
    onOpen?.();
  }, [onOpen, snapToIndex]);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
    setVisible(false);
    onClose?.();
  }, [onClose]);

  const notifyVisibilityChange = useCallback(
    (isVisible: boolean) => {
      onVisibilityChange((visible) => visible === isVisible);
    },
    [onVisibilityChange]
  );

  React.useEffect(() => {
    notifyVisibilityChange(visible);
  }, [visible, notifyVisibilityChange]);

  return (
    <BottomSheetContext.Provider
      value={{
        visible,
        bottomSheetRef,
        handleClose,
        handleOpen,
        onVisibilityChange, // Add this line
      }}
    >
      {props.children}
    </BottomSheetContext.Provider>
  );
};

// New component for global control
export const GlobalBottomSheetTrigger = ({
  sheetId,
  snapIndex,
  className,
  ...props
}: PressableProps & {
  sheetId: string;
  snapIndex?: number;
  className?: string;
}) => {
  const { openById } = useBottomSheet();

  return (
    <Pressable
      onPress={(e) => {
        props.onPress?.(e);
        openById(sheetId, snapIndex);
      }}
      className={bottomSheetTriggerStyle({
        className,
      })}
      {...props}
    >
      {props.children}
    </Pressable>
  );
};

export const BottomSheetPortal = ({
  snapPoints,
  handleComponent: DragIndicator,
  backdropComponent: BackDrop,
  ...props
}: Partial<IBottomSheetProps> & {
  defaultIsOpen?: boolean;
  snapToIndex?: number;
  snapPoints: string[];
}) => {
  const { bottomSheetRef, handleClose } = useContext(BottomSheetContext);

  const handleSheetChanges = useCallback((index: number) => {}, [handleClose]);

  return (
    <GorhomBottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={0}
      backdropComponent={BackDrop}
      onChange={handleSheetChanges}
      handleComponent={DragIndicator}
      enablePanDownToClose={false}
      {...props}
    >
      {props.children}
    </GorhomBottomSheet>
  );
};

export const BottomSheetTrigger = ({
  className,
  ...props
}: PressableProps & { className?: string }) => {
  const { handleOpen } = useContext(BottomSheetContext);
  return (
    <Pressable
      onPress={(e) => {
        props.onPress && props.onPress(e);
        handleOpen();
      }}
      {...props}
      className={bottomSheetTriggerStyle({
        className: className,
      })}
    >
      {props.children}
    </Pressable>
  );
};
type IBottomSheetBackdrop = React.ComponentProps<
  typeof GorhomBottomSheetBackdrop
>;

export const BottomSheetBackdrop = ({
  disappearsOnIndex = -1,
  appearsOnIndex = 1,
  className,
  ...props
}: Partial<IBottomSheetBackdrop> & { className?: string }) => {
  const { handleClose, onVisibilityChange, visible } =
    useContext(BottomSheetContext);

  const notifyVisibilityChange = useCallback(
    (isVisible: boolean) => {
      onVisibilityChange((visible) => visible === isVisible);
    },
    [onVisibilityChange]
  );

  React.useEffect(() => {
    notifyVisibilityChange(visible);
  }, [visible, notifyVisibilityChange]);

  return (
    <GorhomBottomSheetBackdrop
      // @ts-ignore
      className={bottomSheetBackdropStyle({
        className: className,
      })}
      disappearsOnIndex={disappearsOnIndex}
      appearsOnIndex={appearsOnIndex}
      onPress={handleClose} // Add this line
      {...props}
    />
  );
};

cssInterop(GorhomBottomSheetBackdrop, { className: "style" });

type IBottomSheetDragIndicator = React.ComponentProps<typeof BottomSheetHandle>;

export const BottomSheetDragIndicator = ({
  children,
  className,
  ...props
}: Partial<IBottomSheetDragIndicator> & { className?: string }) => {
  return (
    <BottomSheetHandle
      {...props}
      // @ts-ignore
      className={bottomSheetIndicatorStyle({
        className: className,
      })}
    >
      {children}
    </BottomSheetHandle>
  );
};

cssInterop(BottomSheetHandle, { className: "style" });

type IBottomSheetContent = React.ComponentProps<typeof GorhomBottomSheetView>;

export const BottomSheetContent = ({ ...props }: IBottomSheetContent) => {
  const { handleClose, visible } = useContext(BottomSheetContext);
  const keyDownHandlers = useMemo(() => {
    return Platform.OS === "web"
      ? {
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === "Escape") {
              e.preventDefault();
              handleClose();
              return;
            }
          },
        }
      : {};
  }, [handleClose]);

  if (Platform.OS === "web")
    return (
      <GorhomBottomSheetView
        {...props}
        // @ts-ignore
        {...keyDownHandlers}
        className={bottomSheetContentStyle({
          className: props.className,
        })}
      >
        {visible && (
          <FocusScope contain={visible} autoFocus={true} restoreFocus={true}>
            {props.children}
          </FocusScope>
        )}
      </GorhomBottomSheetView>
    );

  return (
    <GorhomBottomSheetView
      {...props}
      // @ts-ignore
      {...keyDownHandlers}
      className={bottomSheetContentStyle({
        className: props.className,
      })}
    >
      {props.children}
    </GorhomBottomSheetView>
  );
};

cssInterop(GorhomBottomSheetView, { className: "style" });

export const BottomSheetItem = ({
  children,
  className,
  closeOnSelect = true,
  ...props
}: PressableProps & {
  closeOnSelect?: boolean;
}) => {
  const { handleClose } = useContext(BottomSheetContext);
  return (
    <Pressable
      {...props}
      className={bottomSheetItemStyle({
        className: className,
      })}
      onPress={(e) => {
        if (closeOnSelect) {
          handleClose();
        }
        props.onPress && props.onPress(e);
      }}
      role="button"
    >
      {children}
    </Pressable>
  );
};

export const BottomSheetItemText = ({ ...props }: TextProps) => {
  return <Text {...props} />;
};

export const BottomSheetScrollView = GorhomBottomSheetScrollView;
export const BottomSheetFlatList = GorhomBottomSheetFlatList;
export const BottomSheetSectionList = GorhomBottomSheetSectionList;
export const BottomSheetTextInput = GorhomBottomSheetInput;

cssInterop(GorhomBottomSheetInput, { className: "style" });
cssInterop(GorhomBottomSheetScrollView, { className: "style" });
cssInterop(GorhomBottomSheetFlatList, { className: "style" });
cssInterop(GorhomBottomSheetSectionList, { className: "style" });
