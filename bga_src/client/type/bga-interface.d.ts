import { Card } from "./gamedata";

type BgaNotifyName = "playCard";

interface BgaRequest {
  name: string;
  args: any;
}

interface BgaNotification {
  name: BgaNotifyName;
  args: BgaPlayCardNotif;
}

interface BgaPlayCardNotif {
  player_id: string; // num string
  player_name: string;
  card: Card;
  cards: string; // number of cards
  gridID: string;
}

export { BgaRequest, BgaNotification, BgaPlayCardNotif };
