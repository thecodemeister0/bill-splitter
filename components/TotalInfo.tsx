import { Box } from "./ui/box";
import { Text } from "./ui/text";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button, ButtonText } from "./ui/button";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback } from "react";
import dayjs from "dayjs";
import { Divider } from "./ui/divider";
import { Animated, useAnimatedValue } from "react-native";

export const TotalInfo = forwardRef((props: any, ref: any) => {
  const {
    resetValues,
    tipAmountPerPerson,
    totalPerPerson,
    billAmount,
    tipAmount,
  } = props;

  const handleSheetChanges = useCallback((index: number) => {
    if (index === 0 || index === 1) ref?.current?.snapToIndex(1);
    if (index === 2) ref?.current?.snapToIndex(3);
    if (index === 0 || index === 1) {
      fadeOut();
    }
    if (index === 3) {
      fadeIn();
    }
  }, []);

  const animatedValue = useAnimatedValue(0);

  const translate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const fadeIn = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <BottomSheetModal
      snapPoints={["35%", "35%", "90%"]}
      enableDismissOnClose={false}
      enablePanDownToClose={false}
      backgroundStyle={{ backgroundColor: "#F3F9FA" }}
      ref={ref}
      onChange={handleSheetChanges}
    >
      <BottomSheetView className={"flex-1 bg-slate-50 px-4 gap-6"}>
        <Box className={"bg-teal-900 rounded-xl px-6 py-6 gap-8"}>
          <Box className={"flex flex-row justify-between items-center"}>
            <Box>
              <Text className={"text-white font-space font-bold text-lg"}>
                Tip Amount
              </Text>
              <Text className={"text-white font-space"}>/ person</Text>
            </Box>
            <Box>
              <Text
                className={"text-teal-400 font-space font-bold text-3xl mr-1"}
              >
                {formatCurrency(tipAmountPerPerson)}
              </Text>
            </Box>
          </Box>
          <Box className={"flex flex-row justify-between"}>
            <Box>
              <Text className={"text-white font-space font-bold text-lg"}>
                Total
              </Text>
              <Text className={"text-white font-space"}>/ person</Text>
            </Box>
            <Box>
              <Text className={"text-teal-400 font-space font-bold text-3xl"}>
                {formatCurrency(totalPerPerson)}
              </Text>
              <Text
                className={
                  "text-teal-400 text-right font-space font-bold text-sm mr-1"
                }
              >
                +{formatCurrency(tipAmountPerPerson)} tip
              </Text>
            </Box>
          </Box>
          <Button onPress={resetValues} className={"bg-teal-400"}>
            <ButtonText className={"text-teal-900 font-space text-xl"}>
              Reset
            </ButtonText>
          </Button>
        </Box>
        <Animated.View
          className={"flex flex-col gap-4"}
          style={[
            {
              transform: [{ translateY: translate }],
            },
            {
              opacity: animatedValue,
            },
          ]}
        >
          <Box className={`bg-slate-200 rounded-xl px-3 py-4`}>
            <Box className={"flex flex-col justify-center items-center"}>
              <Text className={"font-bold text-lg font-space"}>Receipt</Text>
              <Text className={"text-md font-space"}>
                {dayjs().format("MMMM D, YYYY")}
              </Text>
            </Box>
            <Box className={"flex flex-col gap-2"}>
              <Box className={"flex flex-row justify-between"}>
                <Text className={"text-md font-space"}>Amount</Text>
                <Text className={"font-bold text-lg font-space"}>
                  {formatCurrency(billAmount)}
                </Text>
              </Box>
              <Box className={"flex flex-row justify-between"}>
                <Text className={"text-md font-space"}>Tip Total</Text>
                <Text className={"font-bold text-lg font-space"}>
                  {formatCurrency(billAmount * tipAmount)}
                </Text>
              </Box>
            </Box>
            <Divider className={"bg-slate-300 my-4"} />
            <Box className={"flex flex-col gap-2"}>
              <Box className={"flex flex-row justify-between"}>
                <Text className={"text-md font-space"}>Total</Text>
                <Text className={"font-bold text-lg font-space"}>
                  {formatCurrency(billAmount + billAmount * tipAmount)}
                </Text>
              </Box>
              <Box className={"flex flex-row justify-between"}>
                <Text className={"text-md font-space"}>Per Person</Text>
                <Text className={"font-bold text-lg font-space"}>
                  {formatCurrency(totalPerPerson + tipAmountPerPerson)}
                </Text>
              </Box>
            </Box>
          </Box>
          <Button size="xl" className={`bg-teal-900 rounded-md `}>
            <ButtonText className={"text-teal-400 font-space text-xl"}>
              Share
            </ButtonText>
          </Button>
        </Animated.View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
