import { HandDef } from "../type/HandDef.d";

const handDefs: { [cardType: string]: HandDef } = {
  card: {
    size: { width: "138px", height: "120px", radius: "10px" },
  },
};

export { handDefs };
