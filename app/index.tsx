import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useEffect, useRef, useState } from "react";
import { Keyboard, ScrollView } from "react-native";
import { DollarSign, User } from "lucide-react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { TotalInfo } from "@/components/TotalInfo";

export default function Home() {
  const [billAmount, setBillAmount] = useState<number>(0);
  const [tipPercent, setTipPercent] = useState<number>(0);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(0);
  const [tipAmountPerPerson, setTipPerPerson] = useState<number>(0);
  const [totalPerPerson, setTotalPerPerson] = useState<number>(0);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

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
  function handleCustomTipAmount(value: number) {
    setTipPercent(value);
  }

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

  return (
    <Box className="flex-1 ">
      <ScrollView className={"px-8 h-full"}>
        <Box className={"flex flex-col gap-10 mt-20"}>
          <Box className={"flex flex-col gap-2"}>
            <Text className={"font-space font-bold text-slate-500 text-lg"}>
              Bill
            </Text>
            <Input size="xl" className={"rounded-lg border-0 bg-slate-50 pl-2"}>
              <InputSlot>
                <InputIcon color="grey" as={DollarSign} size="lg" />
              </InputSlot>
              <InputField
                returnKeyLabel="Done"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                keyboardType={"numeric"}
                onChangeText={(value: string) => {
                  if (value === "") {
                    return;
                  }
                  setBillAmount(parseFloat(value));
                }}
                value={billAmount ? billAmount.toString() : ""}
                className={"font-space font-bold text-right text-teal-900"}
                placeholder="0"
              />
            </Input>
          </Box>
          <Box className={"flex flex-col gap-4"}>
            <Text className={"font-space font-bold text-slate-500 text-lg"}>
              Select Tip %
            </Text>
            <Box className={"flex flex-row flex-wrap gap-4 justify-between"}>
              <Button
                onPress={() => {
                  setIsPressed(true);
                  setTipPercent(0.05);
                }}
                className={`${
                  tipPercent === 0.05 ? "bg-teal-400" : "bg-teal-900"
                } w-[47%] h-[48px] rounded-md`}
              >
                <ButtonText className={"font-space text-lg"}>5%</ButtonText>
              </Button>
              <Button
                onPress={() => {
                  setIsPressed(true);
                  setTipPercent(0.1);
                }}
                className={`${
                  tipPercent === 0.1 ? "bg-teal-400" : "bg-teal-900"
                } w-[47%] h-[48px] rounded-md`}
              >
                <ButtonText className={"font-space text-lg"}>10%</ButtonText>
              </Button>
              <Button
                onPress={() => {
                  setIsPressed(true);
                  setTipPercent(0.15);
                }}
                className={`${
                  tipPercent === 0.15 ? "bg-teal-400" : "bg-teal-900"
                } w-[47%] h-[48px] rounded-md`}
              >
                <ButtonText className={"font-space text-lg"}>15%</ButtonText>
              </Button>
              <Button
                onPress={() => {
                  setIsPressed(true);
                  setTipPercent(0.25);
                }}
                className={`${
                  tipPercent === 0.25 && isPressed
                    ? "bg-teal-400"
                    : "bg-teal-900"
                } w-[47%] h-[48px] rounded-md`}
              >
                <ButtonText className={"font-space text-lg"}>25%</ButtonText>
              </Button>
              <Button
                onPress={() => {
                  setIsPressed(true);
                  setTipPercent(0.5);
                }}
                className={`${
                  tipPercent === 0.5 ? "bg-teal-400" : "bg-teal-900"
                } w-[47%] h-[48px] rounded-md`}
              >
                <ButtonText className={"font-space text-lg"}>50%</ButtonText>
              </Button>
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
            <Input size="xl" className={"rounded-lg border-0 bg-slate-50 pl-2"}>
              <InputSlot>
                <InputIcon as={User} size="lg" color="gray" />
              </InputSlot>
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
