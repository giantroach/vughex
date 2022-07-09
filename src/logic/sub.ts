import {
  BgaNotification,
  BgaPlayCardNotif,
} from "bga_src/client/type/bga-interface.d";

import { GridData } from "../type/Grid.d";
import { HandData } from "../type/Hand.d";

export class Sub {
  constructor(
    private playerID: string,
    private gridData: GridData,
    private handData: HandData,
  ) {}

  public handle(notif: BgaNotification) {
    switch (notif.name) {
      case "playCard": {
        const arg = notif.args as BgaPlayCardNotif;
        const gridID = Number(arg.gridID);
        if (Number(arg.player_id) === Number(this.playerID)) {
          this.handData.cardIDs = this.handData.cardIDs?.filter((ids) => {
            return ids.id !== arg.card.id;
          });
          const row = Math.floor(gridID / 3) + 3;
          const col = gridID % 3;
          if (this.gridData.cardIDs) {
            this.gridData.cardIDs[col][row] = `mainCard${
              Number(arg.card.type_arg) - 1
            }`;
          }
        } else {
          const row = 1 - Math.floor(gridID / 3);
          const col = gridID % 3;
          if (this.gridData.cardIDs) {
            this.gridData.cardIDs[col][row] = `mainCard${
              Number(arg.card.type_arg) - 1
            }`;
          }
        }
        break;
      }

      default:
        console.log("unhandled notif", notif);
        break;
    }
  }
}
