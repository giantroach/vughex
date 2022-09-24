import {
  BgaNotification,
  BgaPlayCardNotif,
  BgaEndRoundNotif,
} from "bga_src/client/type/bga-interface.d";

import { GridData } from "../type/Grid.d";
import { HandData } from "../type/Hand.d";
import { ScoreData } from "../type/Score.d";

export class Sub {
  constructor(
    private playerID: string,
    private gridData: GridData,
    private handData: HandData,
    private scoreData: ScoreData,
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
            this.gridData.cardIDs[col][row] = `mainCard${arg.card.type_arg}`;
          }
        } else {
          const row = 1 - Math.floor(gridID / 3);
          const col = gridID % 3;
          if (this.gridData.cardIDs) {
            this.gridData.cardIDs[col][row] = `mainCard${arg.card.type_arg}`;
          }
        }
        break;
      }

      case "endRound": {
        const arg = notif.args as BgaEndRoundNotif;
        const score = arg.score;
        for (const pID in score) {
          if (pID === "center") {
            this.scoreData.centerScore = score[pID];
          } else if (pID === this.playerID) {
            this.scoreData.myScore = score[pID];
          } else {
            this.scoreData.oppoScore = score[pID];
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
