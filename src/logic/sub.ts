import {
  BgaNotification,
  BgaNewRoundNotif,
  BgaPlayCardNotif,
  BgaMoveCardNotif,
  BgaUpdateCardNotif,
  BgaMulliganNotif,
  BgaReincarnateCardNotif,
  BgaScoreNotif,
  BgaEndRoundNotif,
} from "bga_src/client/type/bga-interface.d";
import { objToArray } from "../util/util";

import { GridData } from "../type/Grid.d";
import { HandData } from "../type/Hand.d";
import { ScoreData } from "../type/Score.d";
import { ReincarnationData } from "../type/Reincarnation.d";

//
// Sub handles BGA notifications and apply data accordingly.
//

export class Sub {
  constructor(
    public playerID: number, // public for testing purpose
    private gridData: GridData,
    private handData: HandData,
    private scoreData: ScoreData,
    private reincarnationData: ReincarnationData,
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
        this.gridData.cellOverlay = [];

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
        // i.e. oracle or watcher
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

      case "moveCard": {
        // i.e. maze
        const arg = notif.args as BgaMoveCardNotif;
        const fromGridID = Number(arg.fromGridID);
        const toGridID = Number(arg.toGridID);
        let fromRow = 0;
        let fromCol = 0;
        let toRow = 0;
        let toCol = 0;

        if (Number(arg.player_id) === Number(this.playerID)) {
          fromRow = Math.floor(fromGridID / 3) + 3;
          fromCol = fromGridID % 3;
          toRow = Math.floor(toGridID / 3) + 3;
          toCol = toGridID % 3;
        } else {
          fromRow = 1 - Math.floor(fromGridID / 3);
          fromCol = fromGridID % 3;
          toRow = 1 - Math.floor(toGridID / 3);
          toCol = toGridID % 3;
        }

        if (this.gridData.cardIDs) {
          // if same id exists, remove it
          const c = this.gridData.cardIDs[fromCol][fromRow];
          this.gridData.cardIDs[fromCol][fromRow] = undefined;
          this.gridData.cardIDs[toCol][toRow] = c;
        }
        break;
      }

      case "mulligan": {
        // i.e. mulligan
        const arg = notif.args as BgaMulliganNotif;
        const c = arg.card;
        const discardedCardID = arg.discardedCardID;

        if (discardedCardID) {
          this.handData.cardIDs = this.handData.cardIDs?.filter((ids) => {
            return ids.id !== discardedCardID;
          });
        }

        if (c) {
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
        }
        break;
      }

      case "reincarnateCard": {
        // i.e. reincarnation
        const arg = notif.args as BgaReincarnateCardNotif;
        const gridID = Number(arg.gridID);
        const playerID = Number(arg.player_id);
        const c = arg.card;
        const reincarnatedCol = arg.col;
        let row = 0;
        let col = 0;

        if (playerID === Number(this.playerID)) {
          row = Math.floor(gridID / 3) + 3;
          col = gridID % 3;
        } else {
          row = 1 - Math.floor(gridID / 3);
          col = gridID % 3;
        }

        if (this.gridData.cardIDs) {
          this.gridData.cardIDs[col][row] = undefined;
        }

        if (playerID === Number(this.playerID) && c) {
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
        }

        this.reincarnationData.reincarnatedCardID = c?.id || null;
        this.reincarnationData.reincarnatedCol =
          reincarnatedCol != null ? Number(reincarnatedCol) : null;

        break;
      }

      case "score": {
        const arg = notif.args as BgaScoreNotif;
        const wPlayerID = arg.w_player_id;
        const lane = arg.lane;
        if (!this.gridData || !wPlayerID || !lane) {
          break;
        }
        let idx = 0;
        let delay = 0;
        let result = "tie";
        if (lane === "left") {
          idx = 0;
          delay = 1000;
        }
        if (lane === "center") {
          idx = 1;
          delay = 2000;
        }
        if (lane === "right") {
          idx = 2;
          delay = 3000;
        }
        if (Number(wPlayerID) === Number(this.playerID)) {
          result = "win";
        }
        if (
          wPlayerID !== "tie" &&
          Number(wPlayerID) !== Number(this.playerID)
        ) {
          result = "lose";
        }
        setTimeout(() => {
          if (!this.gridData.overlay) {
            this.gridData.overlay = [];
          }
          if (result === "win") {
            this.gridData.overlay[idx] = {
              type: "text",
              data: "Win!",
              pos: `col.${idx}.bottom`,
              cssClass: "largeCenter success",
            };
          }
          if (result === "lose") {
            this.gridData.overlay[idx] = {
              type: "text",
              data: "Lose..",
              pos: `col.${idx}.bottom`,
              cssClass: "largeCenter danger",
            };
          }
          if (result === "tie") {
            this.gridData.overlay[idx] = {
              type: "text",
              data: "Tie",
              pos: `col.${idx}.bottom`,
              cssClass: "largeCenter",
            };
          }
        }, delay);
        break;
      }

      case "endRound": {
        const arg = notif.args as BgaEndRoundNotif;
        const score = arg.score;
        const table = arg.table;
        const center = arg.center;
        const dayOrNight = arg.day_or_night;
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
        // FIXME: give some delay
        if (!this.gridData || !this.gridData.cardIDs) {
          break;
        }
        setTimeout(() => {
          if (!this.gridData.cardIDs) {
            this.gridData.cardIDs = [[], [], []];
          }
          this.gridData.cardIDs[0][2] = {
            cid:
              "centerCard" +
              this.getCenterIdx("left", dayOrNight, center.left.controller),
          };
        }, 1000);
        setTimeout(() => {
          if (!this.gridData.cardIDs) {
            this.gridData.cardIDs = [[], [], []];
          }
          this.gridData.cardIDs[1][2] = {
            cid:
              "centerCard" +
              this.getCenterIdx("center", dayOrNight, center.center.controller),
          };
        }, 2000);
        setTimeout(() => {
          if (!this.gridData.cardIDs) {
            this.gridData.cardIDs = [[], [], []];
          }
          this.gridData.cardIDs[2][2] = {
            cid:
              "centerCard" +
              this.getCenterIdx("right", dayOrNight, center.right.controller),
          };
        }, 3000);

        break;
      }

      default:
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
