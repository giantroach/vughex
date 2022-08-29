type OverlayType = "text";

interface Overlay {
  type: OverlayType;
  data: string;
}

interface GridData {
  cardIDs?: Array<Array<string | undefined>>;
  selectable?: boolean[][][];
  selected?: boolean[][][];
  selectableCol?: boolean[];
  selectedCol?: boolean[];
  overlay?: Overlay[][];
  exclusiveSelect?: boolean;
  ghosts?: Array<Array<boolean | undefined>>;
  active?: boolean;
}

export { GridData, Overlay };
