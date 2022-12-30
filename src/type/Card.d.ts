interface CardID {
  id?: string; // bga card ID
  cid: string; // client ID
  meta?: CardMeta[];
}

interface CardMeta {
  metaID?: string; // ref card def
}

export { CardID, CardMeta };
