import { ButtonType, CtrlButtonDef } from "../type/CtrlButtonDef.d";

const ctrlButtonDefs: { [cardType in ButtonType]: CtrlButtonDef } = {
  cancel: {
    label: "Cancel",
    size: { width: "138px", height: "30px", radius: "15px" },
    textColor: "white",
    background: "darkorange",
    border: "2px solid orange",
  },
};

export { ctrlButtonDefs };
