interface GridData {
  cardIDs?: Array<Array<string | undefined>>;
  selectable?: boolean[][];
  selected?: boolean[][];
  selectableCol?: boolean[];
  selectedCol?: boolean[];
  exclusiveSelect?: boolean;
  active?: boolean;
}

export { GridData };
