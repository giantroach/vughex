type ButtonType = "cancel" | "submit";

interface ButtonSizeDef {
  width: string;
  height: string;
  radius: string;
}

interface CtrlButtonDef {
  size: ButtonSizeDef;
  label: string;
  textColor: string;
  background: string;
  border: string;
}

export { ButtonType, ButtonSizeDef, CtrlButtonDef };
