import { GridData } from "../type/Grid.d";
import { HandData } from "../type/Hand.d";
import { watch, ref, Ref } from "vue";
import { cardDefs } from "../def/card";

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

        // FIXME: make a parser
        const ids = /([^\d]+)(\d+)/.exec(c.cid);
        if (!ids) {
          return;
        }
        const cat = ids[1];
        const idx = Number(ids[2]);

        const def = cardDefs[cat]?.details?.[idx];
        if (!def || !def.onPlay) {
          this.current.value = "playerTurn:beforeGridSelect";
          break;
        }

        const [x, y] = this.getSelectedCoordinate(0);

        switch (def.onPlay) {
          case "TargetSameLane:Silence": {
            this.setTargetSelectable(x, y, {
              sameLane: true,
            });
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

    console.log("debug", this.current.value, this.gridData, this.handData);
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

  private setTargetSelectable(
    x: number,
    y: number,
    param: {
      sameLane?: boolean;
    },
  ): void {
    const selectable: boolean[][] = [[], [], []];
    if (param.sameLane) {
      for (let iy = 0; iy < 5; iy += 1) {
        if (iy !== 2 && this.gridData?.cardIDs?.[x][iy]) {
          selectable[x][iy] = true;
        }
      }
      if (!this.gridData.selectable) {
        this.gridData.selectable = [[], []];
      }
      this.gridData.selectable[1] = selectable;
    }
  }

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
