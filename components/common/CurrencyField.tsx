import { DollarSign } from "lucide-react-native";
import { Keyboard } from "react-native";
import { Input, InputSlot, InputIcon, InputField } from "../ui/input";

interface ICurrencyField {
  setBillAmount: (arg0: number) => void;
  billAmount: number;
}

export function CurrencyField({ setBillAmount, billAmount }: ICurrencyField) {
  return (
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
  );
}
