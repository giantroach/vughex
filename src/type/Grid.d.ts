interface GridData {
  cardIDs?: Array<Array<string | undefined>>;
  selectable?: boolean[][][];
  selected?: boolean[][][];
  selectableCol?: boolean[];
  selectedCol?: boolean[];
  exclusiveSelect?: boolean;
  ghosts?: Array<Array<boolean | undefined>>;
  active?: boolean;
}

export { GridData };
