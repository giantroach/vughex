import { Card, Score, Center } from "./gamedata";
import { Player } from "./framework.d";

type BgaNotifyName =
  | "newRound"
  | "playCard"
  | "moveCard"
  | "updateCard"
  | "reincarnateCard"
  | "endRound";

interface BgaRequest {
  name: string;
  args: any;
}

interface BgaNotification {
  name: BgaNotifyName;
  args:
    | BgaNewRoundNotif
    | BgaPlayCardNotif
    | BgaMoveCardNotif
    | BgaUpdateCardNotif
    | BgaReincarnateCardNotif
    | BgaEndRoundNotif;
}

interface BgaNewRoundNotif {
  player_cards: Card[];
  // players: {
  //   { [playerId: number]: Player };
  // };
  center: {
    left: Center;
    center: Center;
    right: Center;
  };
  day_or_night: "day" | "night";
}

interface BgaPlayCardNotif {
  player_id: string; // num string
  player_name: string;
  card: Card;
  cards: string; // number of cards
  gridID: string;
}

interface BgaMoveCardNotif {
  player_id: string; // num string
  player_name: string;
  fromGridID: string;
  toGridID: string;
}

interface BgaUpdateCardNotif {
  player_id: string; // num string
  player_name: string;
  card: Card;
  gridID: string;
}

interface BgaReincarnateCardNotif {
  player_id: string; // num string
  player_name: string;
  card?: Card;
  col?: string;
  gridID: string;
}

interface BgaEndRoundNotif {
  score: Score;
  table: {
    [playerId: string]: Card[];
  };
  center: {
    left: Center;
    center: Center;
    right: Center;
  };
  day_or_night: "day" | "night";
}

export {
  BgaRequest,
  BgaConfirm,
  BgaNotification,
  BgaNewRoundNotif,
  BgaPlayCardNotif,
  BgaMoveCardNotif,
  BgaUpdateCardNotif,
  BgaReincarnateCardNotif,
  BgaEndRoundNotif,
};
