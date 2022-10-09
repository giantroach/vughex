import { Card, Score } from "./gamedata";

type BgaNotifyName = "playCard" | "endRound";

interface BgaRequest {
  name: string;
  args: any;
}

interface BgaNotification {
  name: BgaNotifyName;
  args: BgaPlayCardNotif | BgaEndRoundNotif;
}

interface BgaPlayCardNotif {
  player_id: string; // num string
  player_name: string;
  card: Card;
  cards: string; // number of cards
  gridID: string;
}

interface BgaEndRoundNotif {
  score: Score;
  table: {
    [playerId: string]: Card[];
  };
}

export {
  BgaRequest,
  BgaNotification,
  BgaPlayCardNotif,
  BgaEndRoundNotif,
};
