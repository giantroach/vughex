import { Card } from "./gamedata";

interface BgaRequest {
  name: string;
  args: any;
}

interface BgaNotification {
  name: string;
  args: any;
}

interface BgaPlayCardNotif {
  player_id: string; // num string
  player_name: string;
  card: Card;
  cards: string; // number of cards
  gridID: string;
}

export { BgaRequest, BgaNotification, BgaPlayCardNotif };
