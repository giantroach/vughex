import { GridDef } from "../type/GridDef.d";

// const isGridSelectable = (
//   x: number,
//   y: number,
//   cardIDs: string[][],
// ): boolean => {
//   if (y < 3) {
//     return false;
//   }
//   if (cardIDs[y][x]) {
//     return false;
//   }
//   if (!cardIDs[y - 1][x]) {
//     return false;
//   }
//   return true;
// };

const gridDefs: { [cardType: string]: GridDef } = {
  table: {
    type: "square",
    layout: "3x5",
    size: { width: "138px", height: "120px", radius: "10px" },
    margin: { row: "10px", column: "10px" },
  },
};

export { gridDefs };
