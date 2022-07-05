interface CardID {
  id: string; // bga card ID
  cid: string; // client ID
}

interface HandData {
  cardIDs?: CardID[];
  selectable?: boolean[];
  selected?: boolean[];
  exclusiveSelect?: boolean;
  active?: boolean;
}

export { HandData, CardID };
