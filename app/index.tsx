import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useEffect, useRef, useState } from "react";
import { Keyboard, ScrollView } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { TotalInfo } from "@/components/TotalInfo";
import { TipButton } from "@/components/common/TipButtons";
import { CurrencyField } from "@/components/common/CurrencyField";

export default function Home() {
  const [billAmount, setBillAmount] = useState<number>(0);
  const [tipPercent, setTipPercent] = useState<number>(0);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [isPressedPeople, setIsPressedPeople] = useState<boolean>(false);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(0);
  const [tipAmountPerPerson, setTipPerPerson] = useState<number>(0);
  const [totalPerPerson, setTotalPerPerson] = useState<number>(0);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    bottomSheetModalRef.current?.present();
    bottomSheetModalRef.current?.snapToIndex(1);
  }, []);

  useEffect(() => {
    if (!billAmount || !tipPercent || !numberOfPeople) return;
    calculateTipPerPerson();
  }, [billAmount, tipPercent, numberOfPeople]);

  useEffect(() => {
    if (!billAmount || !numberOfPeople) return;
    calculateTotalPerPerson();
  }, [billAmount, numberOfPeople]);

  function resetValues() {
    setBillAmount(0);
    setTipPercent(0);
    setNumberOfPeople(0);
    setTipPerPerson(0);
    setTotalPerPerson(0);
  }
  function calculateTipPerPerson() {
    let tip = (billAmount * tipPercent) / numberOfPeople;
    setTipPerPerson(tip);
  }
  function calculateTotalPerPerson() {
    let total = billAmount / numberOfPeople;
    setTotalPerPerson(total);
  }

  return (
    <Box className="flex-1 ">
      <ScrollView className={"px-8 h-full"}>
        <Box className={"flex flex-col gap-10 mt-20"}>
          <Box className={"flex flex-col gap-2"}>
            <Text className={"font-space font-bold text-slate-500 text-lg"}>
              Bill
            </Text>
            <CurrencyField
              setBillAmount={setBillAmount}
              billAmount={billAmount}
            />
          </Box>
          <Box className={"flex flex-col gap-4"}>
            <Text className={"font-space font-bold text-slate-500 text-lg"}>
              Select Tip %
            </Text>
            <Box className={"flex flex-row flex-wrap gap-4 justify-between"}>
              <TipButton
                tipPercent={tipPercent}
                tipValue={0.05}
                tipText="5%"
                isPressed={isPressed}
                setIsPressed={() => setIsPressed(true)}
                setTipPercent={() => setTipPercent(0.05)}
              />
              <TipButton
                tipPercent={tipPercent}
                tipValue={0.1}
                tipText="10%"
                isPressed={isPressed}
                setIsPressed={() => setIsPressed(true)}
                setTipPercent={() => setTipPercent(0.1)}
              />
              <TipButton
                tipPercent={tipPercent}
                tipValue={0.15}
                tipText="15%"
                isPressed={isPressed}
                setIsPressed={() => setIsPressed(true)}
                setTipPercent={() => setTipPercent(0.15)}
              />
              <TipButton
                tipPercent={tipPercent}
                tipValue={0.25}
                tipText="25%"
                isPressed={isPressed}
                setIsPressed={() => setIsPressed(true)}
                setTipPercent={() => setTipPercent(0.25)}
              />
              <TipButton
                tipPercent={tipPercent}
                tipValue={0.5}
                tipText="50%"
                isPressed={isPressed}
                setIsPressed={() => setIsPressed(true)}
                setTipPercent={() => setTipPercent(0.5)}
              />

              <Input
                className={
                  "w-[47%] border-0 bg-slate-100 text-right h-[48px] rounded-md"
                }
              >
                <InputField
                  returnKeyLabel="Done"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                  onChangeText={(value) =>
                    setTipPercent(parseFloat("0." + value))
                  }
                  value={tipPercent}
                  keyboardType={"decimal-pad"}
                  className={
                    "text-right text-xl text-teal-900 font-space font-bold"
                  }
                  placeholder={"Custom"}
                />
              </Input>
            </Box>
          </Box>
          <Box className={"flex gap-2"}>
            <Text className={"font-space font-bold text-slate-500 text-lg"}>
              Number of People
            </Text>
            <Box className={"flex flex-row items-center gap-2 "}>
              <Button
                onPress={() => {
                  setIsPressedPeople(true);
                  setNumberOfPeople(2);
                }}
                className={`${
                  isPressedPeople && numberOfPeople === 2
                    ? "bg-teal-400"
                    : "bg-teal-900"
                }  rounded-md`}
              >
                <ButtonText className={"font-space text-lg"}>2</ButtonText>
              </Button>
              <Button
                onPress={() => {
                  setIsPressedPeople(true);
                  setNumberOfPeople(3);
                }}
                className={`${
                  isPressedPeople && numberOfPeople === 3
                    ? "bg-teal-400"
                    : "bg-teal-900"
                } rounded-md`}
              >
                <ButtonText className={"font-space text-lg"}>3</ButtonText>
              </Button>
              <Button
                onPress={() => {
                  setIsPressedPeople(true);
                  setNumberOfPeople(4);
                }}
                className={`${
                  isPressedPeople && numberOfPeople === 4
                    ? "bg-teal-400"
                    : "bg-teal-900"
                } rounded-md`}
              >
                <ButtonText className={"font-space text-lg"}>4</ButtonText>
              </Button>
              <Button
                onPress={() => {
                  setIsPressedPeople(true);
                  setNumberOfPeople(5);
                }}
                className={`${
                  isPressedPeople && numberOfPeople === 5
                    ? "bg-teal-400"
                    : "bg-teal-900"
                } rounded-md`}
              >
                <ButtonText className={"font-space text-lg"}>5</ButtonText>
              </Button>
              <Input
                size="xl"
                className={"flex-1 rounded-lg border-0 bg-slate-50 pl-2"}
              >
                <InputField
                  returnKeyLabel="Done"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                  keyboardType={"number-pad"}
                  onChangeText={(value) => setNumberOfPeople(value)}
                  value={numberOfPeople}
                  className={"font-space font-bold text-right text-teal-900"}
                  placeholder="0"
                />
              </Input>
            </Box>
          </Box>
        </Box>
      </ScrollView>
      <TotalInfo
        ref={bottomSheetModalRef}
        resetValues={resetValues}
        billAmount={billAmount}
        tipAmount={tipPercent}
        tipAmountPerPerson={tipAmountPerPerson}
        totalPerPerson={totalPerPerson}
      />
    </Box>
  );
}
