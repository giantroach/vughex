import { ButtonType } from "./CtrlButtonDef.d";

interface CtrlButtonData {
  [cardType: string]: {
    active?: boolean;
    display?: boolean;
  };
}

export { CtrlButtonData };
