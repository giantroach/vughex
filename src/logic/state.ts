import { GridData } from "../type/Grid.d";
import { HandData } from "../type/Hand.d";
import { watch, ref, Ref } from "vue";
import { cardUtil } from "../def/card";
import { gridUtil } from "../def/grid";
import { handUtil } from "../def/hand";

type CurrentState =
  | "init"
  | "waitingForOtherPlayer"
  | "playerTurn:init"
  | "playerTurn:beforeCardSelect"
  | "playerTurn:afterCardSelect"
  | "playerTurn:beforeGridSelect"
  | "playerTurn:afterGridSelect"
  | "playerTurn:beforeTargetSelect"
  | "playerTurn:afterTargetSelect"
  | "otherPlayerTurn";

export class State {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private request: any,
    private gridData: GridData,
    private handData: HandData,
  ) {
    watch([this.gridData, this.handData, this.current], () => {
      // FIXME: this may cause infinite loop
      this.refresh();
    });
  }

  public current: Ref<CurrentState> = ref("waitingForOtherPlayer");

  public refresh() {
    switch (this.current.value) {
      case "waitingForOtherPlayer":
        this.assign(this.handData, "active", false);
        this.assign(this.handData, "selected", []);
        this.assign(this.gridData, "active", false);
        this.assign(this.gridData, "selected", []);
        break;

      case "playerTurn:init":
        this.assign(this.handData, "active", true);
        this.current.value = "playerTurn:beforeCardSelect";
        break;

      case "playerTurn:beforeCardSelect":
        if (this.handData.selected?.includes(true)) {
          this.current.value = "playerTurn:afterCardSelect";
        }
        break;

      case "playerTurn:afterCardSelect":
        this.current.value = "playerTurn:beforeGridSelect";
        break;

      case "playerTurn:beforeGridSelect":
        if (!this.handData.selected?.includes(true)) {
          this.current.value = "playerTurn:beforeCardSelect";
          this.assign(this.gridData, "active", false);
          this.assign(this.gridData, "selected", []);
          break;
        }
        if (
          this.gridData.selected?.[0]?.find((row) => {
            return row?.includes(true);
          })
        ) {
          this.current.value = "playerTurn:afterGridSelect";
          break;
        }
        this.assign(this.gridData, "active", true);
        this.setPlayerGridSelectable();
        break;

      case "playerTurn:afterGridSelect": {
        const c = handUtil.findFirstSelectedID(this.handData);
        if (!c) {
          this.current.value = "playerTurn:afterCardSelect";
          throw "invalid state";
        }
        const idx = gridUtil.getFirstSelectedIdx(this.gridData, 0);
        const ghosts: Array<Array<boolean>> = [[]];
        ghosts[idx.x] = [];
        ghosts[idx.x][idx.y] = true;
        let cardIDs = this.gridData.cardIDs;
        if (cardIDs === undefined) {
          cardIDs = [[], [], []];
        }
        if (!cardIDs[idx.x] === undefined) {
          cardIDs[idx.x] = [];
        }
        cardIDs[idx.x][idx.y] = c.cid;

        this.assign(this.gridData, "cardIDs", cardIDs);
        this.assign(this.gridData, "ghosts", ghosts);
        this.assign(this.gridData, "selectable", []);
        this.current.value = "playerTurn:beforeTargetSelect";
        break;
      }

      case "playerTurn:beforeTargetSelect": {
        // cardDefs;
        const cardIdx = this.handData.selected?.indexOf(true);
        if (cardIdx === undefined) {
          throw "unexpected state";
        }
        const c = this.handData.cardIDs?.[cardIdx];
        if (!c) {
          throw "unexpected state";
        }

        const def = cardUtil.getCard(c.cid);
        if (!def || !def.onPlay) {
          this.current.value = "playerTurn:beforeGridSelect";
          break;
        }

        const [x, y] = this.getSelectedCoordinate(0);

        switch (def.onPlay) {
          case "TargetSameLane:Silence": {
            this.setTargetSameLane(x);
            break;
          }
          case "TargetNonStealthSameLane:Reincanate": {
            // this.setTargetSelectable(x, y, {
            //   sameLane: true,
            //   nonStealth: true,
            // });
            break;
          }
          case "TargeAnytStealth:Reveal": {
            break;
          }
          case "TargetSameLaneToAnother:Maze": {
            break;
          }
        }
        break;
      }

      case "playerTurn:afterTargetSelect": {
        const cardIdx = this.handData.selected?.indexOf(true);
        if (cardIdx === undefined) {
          throw "unexpected state";
        }
        const c = this.handData.cardIDs?.[cardIdx];
        if (!c) {
          throw "unexpected state";
        }

        let gridID = 0;
        this.gridData.selected?.[1]?.find((row, colIdx) => {
          const rowIdx = row?.indexOf(true);
          if (rowIdx === undefined || rowIdx === -1) {
            return false;
          }
          // 0 - 1 - 2
          // 3 - 4 - 5
          gridID = colIdx + (rowIdx - 3) * 3;
        });

        this.request("playCard", {
          card: c.id,
          gridID: gridID,
        });
        break;
      }
    }

    // console.log("debug", this.current.value, this.gridData, this.handData);
  }

  private setPlayerGridSelectable(): void {
    const selectable: boolean[][][] = [[[], [], []]];
    for (let i = 0; i < 3; i += 1) {
      if (!this.gridData?.cardIDs?.[i][3]) {
        selectable[0][i][3] = true;
      } else if (!this.gridData?.cardIDs[i][4]) {
        selectable[0][i][4] = true;
      }
    }
    this.gridData.selectable = selectable;
  }

  private setTargetSameLane(x: number): void {
    const selectable: boolean[][] = [[], [], []];
    // same lane
    for (let iy = 0; iy < 5; iy += 1) {
      if (iy !== 2) {
        if (this.gridData?.cardIDs?.[x][iy]) {
          selectable[x][iy] = true;
        }
        if (this.gridData?.ghosts?.[x][iy]) {
          selectable[x][iy] = true;
        }
      }
    }
    if (!this.gridData.selectable) {
      this.gridData.selectable = [[], []];
    }
    this.gridData.selectable[1] = selectable;
  }

  // private setTargetSelectable(
  //   x: number,
  //   y: number,
  //   param: {
  //     self?: boolean;
  //     sameLane?: boolean;
  //     nonStealth?: boolean;
  //     stealth?: boolean;
  //   },
  // ): void {
  //   const selectable: boolean[][] = [[], [], []];
  //   if (param.sameLane) {
  //     // same lane
  //     for (let iy = 0; iy < 5; iy += 1) {
  //       if (iy !== 2) {
  //         if (this.gridData?.cardIDs?.[x][iy]) {
  //           selectable[x][iy] = true;
  //         }
  //         if (param.self && this.gridData?.ghosts?.[x][iy]) {
  //           selectable[x][iy] = true;
  //         }
  //       }
  //     }
  //     if (!this.gridData.selectable) {
  //       this.gridData.selectable = [[], []];
  //     }
  //     this.gridData.selectable[1] = selectable;

  //   } else {
  //     // not same lane
  //     for (let ix = 0; ix < 3; ix += 1) {
  //       for (let iy = 0; iy < 5; iy += 1) {
  //         if (iy !== 2) {
  //           if (this.gridData?.cardIDs?.[ix][iy]) {
  //             selectable[ix][iy] = true;
  //           }
  //           if (param.self && this.gridData?.ghosts?.[x][iy]) {
  //             selectable[ix][iy] = true;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  private getSelectedCoordinate(idx: number): [number, number] {
    let y = -1;
    const x = this.gridData.selected?.[idx].findIndex((col) => {
      y = col.findIndex((row) => {
        return row;
      });
      return y !== -1;
    });
    return [x !== undefined ? x : -1, y !== undefined ? y : -1];
  }

  // avoid unnecessary update
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private assign(obj: any, key: string, val: any): void {
    if (obj[key] !== val) {
      obj[key] = val;
    }
  }
}
