import { AuraDef } from "../type/AuraDef.d";

const auraDefs: { [AuraType: string]: AuraDef } = {
  selectable: {
    background: "#00e9eb",
    border: "2px solid #05fdff",
  },
  selected: {
    background: "#fffc00",
    border: "2px solid #ffb644",
  },
  gridSelectable1: {
    background: "transparent",
    border: "5px solid #05fdff",
    zIndex: 10000,
  },
  gridSelectable2: {
    background: "transparent",
    border: "5px solid #05ff92",
    zIndex: 10000,
  },
  gridSelected: {
    background: "transparent",
    border: "5px solid #ffb644",
    zIndex: 10000,
  },
  colSelectable: {
    background: "transparent",
    border: "5px solid #05fdff",
    zIndex: 10000,
    anime: "verticalMini",
  },
  colSelected: {
    background: "transparent",
    border: "5px solid #ffb644",
    zIndex: 10000,
    anime: "verticalMini",
  },
  cancel: {
    background: "#3d50ff",
    border: "2px solid #adc1ff",
    anime: "holizontal",
  },
  submit: {
    background: "#ff621f",
    border: "2px solid #ffb571",
    anime: "holizontal",
  },
  "": {
    background: "#fff",
    border: "0px solid #fff",
  },
};

export { auraDefs };
