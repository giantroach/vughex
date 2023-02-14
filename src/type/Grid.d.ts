import { CardID } from "./Card.d";

type OverlayType = "text";
type OverlayClass = "largeCenter";

interface CellOverlay {
  type: OverlayType;
  data: string;
  cssClass?: OverlayClass;
}

interface Overlay {
  type: OverlayType;
  data: string;
  pos: string;
  cssClass?: string;
}

interface GridData {
  cardIDs?: Array<Array<CardID | undefined>>;
  selectable?: boolean[][][];
  selected?: boolean[][][];
  selectableCol?: boolean[];
  selectedCol?: boolean[];
  overlay?: Overlay[];
  cellOverlay?: CellOverlay[][];
  exclusiveSelect?: boolean;
  ghosts?: Array<Array<boolean | undefined>>;
  active?: boolean;
}

export { GridData, Overlay, CellOverlay };
