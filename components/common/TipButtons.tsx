import { Button, ButtonText } from "../ui/button";

interface ITipButton {
  tipPercent: number;
  tipText: string;
  tipValue: number;
  isPressed: boolean;
  setIsPressed: (arg0: boolean) => void;
  setTipPercent: (arg0: number) => void;
}

export function TipButton({
  tipPercent,
  tipText,
  tipValue,
  isPressed,
  setIsPressed,
  setTipPercent,
}: ITipButton) {
  return (
    <Button
      onPress={() => {
        setIsPressed(true);
        setTipPercent(0.5);
      }}
      className={`${
        tipPercent === tipValue && isPressed ? "bg-teal-400" : "bg-teal-900"
      } w-[47%] h-[48px] rounded-md`}
    >
      <ButtonText className={"font-space text-lg"}>{tipText}</ButtonText>
    </Button>
  );
}
