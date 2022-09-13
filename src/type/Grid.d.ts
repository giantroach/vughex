type OverlayType = "text";
type OverlayClass = "largeCenter";

interface Overlay {
  type: OverlayType;
  data: string;
  cssClass?: OverlayClass;
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
