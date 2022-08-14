import { ButtonType, CtrlButtonDef } from "../type/CtrlButtonDef.d";

const ctrlButtonDefs: { [cardType in ButtonType]: CtrlButtonDef } = {
  cancel: {
    label: "Cancel",
    size: { width: "138px", height: "30px", radius: "15px" },
    textColor: "white",
    background: "#3d50ff",
    border: "2px solid #adc1ff",
  },
  submit: {
    label: "Submit",
    size: { width: "138px", height: "30px", radius: "15px" },
    textColor: "white",
    background: "#ff621f",
    border: "2px solid #ffb571",
  },
};

export { ctrlButtonDefs };
