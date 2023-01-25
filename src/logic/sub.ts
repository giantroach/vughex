import {
  BgaNotification,
  BgaNewRoundNotif,
  BgaPlayCardNotif,
  BgaUpdateCardNotif,
  BgaEndRoundNotif,
} from "bga_src/client/type/bga-interface.d";
import { objToArray } from "../util/util";

import { GridData } from "../type/Grid.d";
import { HandData } from "../type/Hand.d";
import { ScoreData } from "../type/Score.d";

//
// Sub handles BGA notifications and apply data accordingly.
//

export class Sub {
  constructor(
    public playerID: number, // public for testing purpose
    private gridData: GridData,
    private handData: HandData,
    private scoreData: ScoreData,
  ) {}

  public handle(notif: BgaNotification) {
    switch (notif.name) {
      case "newRound": {
        const arg = notif.args as BgaNewRoundNotif;
        const cards = arg.player_cards;
        const center = arg.center;
        const dayOrNight = arg.day_or_night;

        // reset score
        this.scoreData.centerScore = [];
        this.scoreData.myScore = [];
        this.scoreData.oppoScore = [];
        this.gridData.overlay = [];

        // update table
        if (!this.gridData || !this.gridData.cardIDs) {
          break;
        }
        this.gridData.cardIDs = [[], [], []];
        this.gridData.cardIDs[0][2] = {
          cid:
            "centerCard" +
            this.getCenterIdx("left", dayOrNight, center.left.controller),
        };
        this.gridData.cardIDs[1][2] = {
          cid:
            "centerCard" +
            this.getCenterIdx("center", dayOrNight, center.center.controller),
        };
        this.gridData.cardIDs[2][2] = {
          cid:
            "centerCard" +
            this.getCenterIdx("right", dayOrNight, center.right.controller),
        };

        // update hand
        cards.forEach((c) => {
          this.handData.cardIDs?.push({
            id: c.id,
            cid: `mainCard${c.type_arg}`,
            meta: !c.meta
              ? []
              : c.meta.split(",").map((m) => {
                  return {
                    metaID: m,
                  };
                }),
          });
          this.handData.selectable?.push(true);
        });
        break;
      }

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
            this.gridData.cardIDs[col][row] = {
              cid: `mainCard${arg.card.type_arg}`,
            };
          }
        } else {
          const row = 1 - Math.floor(gridID / 3);
          const col = gridID % 3;
          if (this.gridData.cardIDs) {
            this.gridData.cardIDs[col][row] = {
              cid: `mainCard${arg.card.type_arg}`,
            };
          }
        }
        break;
      }

      case "updateCard": {
        // i.e. oracle, watcher and maze
        const arg = notif.args as BgaUpdateCardNotif;
        const gridID = Number(arg.gridID);
        const c = arg.card;
        let row = 0;
        let col = 0;

        if (Number(arg.player_id) === Number(this.playerID)) {
          row = Math.floor(gridID / 3) + 3;
          col = gridID % 3;
        } else {
          row = 1 - Math.floor(gridID / 3);
          col = gridID % 3;
        }

        if (this.gridData.cardIDs) {
          this.gridData.cardIDs[col][row] = {
            id: c.id,
            cid: `mainCard${arg.card.type_arg}`,
            meta: !c.meta
              ? []
              : c.meta.split(",").map((m) => {
                  return {
                    metaID: m,
                  };
                }),
          };
        }
        break;
      }

      case "endRound": {
        const arg = notif.args as BgaEndRoundNotif;
        const score = arg.score;
        const table = arg.table;
        const center = arg.center;
        const dayOrNight = arg.day_or_night;
        console.log("endRound", arg, this.playerID);
        for (const pID in score) {
          if (pID === "center") {
            this.scoreData.centerScore = objToArray(score[pID]);
          } else if (pID === String(this.playerID)) {
            this.scoreData.myScore = objToArray(score[pID]);
          } else {
            this.scoreData.oppoScore = objToArray(score[pID]);
          }
        }

        // update table (some might have stealth)
        for (const pID in table) {
          if (pID === String(this.playerID)) {
            table[pID].forEach((card) => {
              const gridID = Number(card.location_arg);
              console.log("mine", gridID, card.type_arg);
              const row = Math.floor(gridID / 3) + 3;
              const col = gridID % 3;
              if (this.gridData.cardIDs) {
                this.gridData.cardIDs[col][row] = {
                  cid: `mainCard${card.type_arg}`,
                };
              }
            });
          } else {
            table[pID].forEach((card) => {
              const gridID = Number(card.location_arg);
              console.log("oppo", gridID, card.type_arg);
              const row = 1 - Math.floor(gridID / 3);
              const col = gridID % 3;
              if (this.gridData.cardIDs) {
                this.gridData.cardIDs[col][row] = {
                  cid: `mainCard${card.type_arg}`,
                };
              }
            });
          }
        }

        // update center
        if (!this.gridData || !this.gridData.cardIDs) {
          break;
        }
        this.gridData.cardIDs[0][2] = {
          cid:
            "centerCard" +
            this.getCenterIdx("left", dayOrNight, center.left.controller),
        };
        this.gridData.cardIDs[1][2] = {
          cid:
            "centerCard" +
            this.getCenterIdx("center", dayOrNight, center.center.controller),
        };
        this.gridData.cardIDs[2][2] = {
          cid:
            "centerCard" +
            this.getCenterIdx("right", dayOrNight, center.right.controller),
        };

        break;
      }

      default:
        console.log("unhandled notif", notif);
        break;
    }
  }

  public getCenterIdx(
    pos: "left" | "center" | "right",
    dayOrNight: "day" | "night",
    controller: string,
  ) {
    let idx = 0;
    switch (pos) {
      case "left":
        idx = 0;
        break;
      case "center":
        idx = 1;
        break;
      case "right":
        idx = 2;
        break;
    }
    if (dayOrNight === "night") {
      idx += 3;
    }
    if (Number(controller) === 0) {
      return idx;
    }
    if (Number(controller) === Number(this.playerID)) {
      return idx + 6;
    }
    return (idx += 12);
  }
}
