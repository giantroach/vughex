type GridType = "square";
interface SizeDef {
  width: string;
  height: string;
  radius: string;
}

interface MarginDef {
  row: string;
  column: string;
}

interface GridDef {
  type: GridType;
  layout: string | number[][];
  size: SizeDef;
  margin: MarginDef;
}

export { GridDef, SizeDef, MarginDef };
