import { Card, Score, Center } from "./gamedata";
import { Player } from "./framework.d";

type BgaNotifyName = "newRound" | "playCard" | "endRound";

interface BgaRequest {
  name: string;
  args: any;
}

interface BgaNotification {
  name: BgaNotifyName;
  args: BgaNewRoundNotif | BgaPlayCardNotif | BgaEndRoundNotif;
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
  BgaEndRoundNotif,
};
