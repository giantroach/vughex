import { GridData } from "../type/Grid.d";
import { HandData } from "../type/Hand.d";
import { CtrlButtonData } from "../type/CtrlButton.d";
import { watch } from "vue";
import { cardUtil } from "../def/card";
import { gridUtil } from "../def/grid";
import { handUtil } from "../def/hand";
import { throttle } from "../util/util";

type CurrentState =
  | "init"
  | "waitingForOtherPlayer"
  | "playerTurn:init"
  | "playerTurn:beforeCardSelect"
  | "playerTurn:afterCardSelect"
  | "playerTurn:beforeGridSelect"
  | "playerTurn:afterGridSelect"
  | "playerTurn:beforeTargetSelect"
  | "playerTurn:beforeTargetSelect2"
  | "playerTurn:afterTargetSelect"
  | "otherPlayerTurn";

export class State {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private request: any,
    private gridData: GridData,
    private handData: HandData,
    private ctrlButtonData: CtrlButtonData,
  ) {
    watch(
      [this.gridData, this.handData, this.current, this.ctrlButtonData],
      throttle(
        () => {
          // FIXME: this may cause infinite loop
          this.refresh();
        },
        100,
        this,
      ),
    );
  }

  public current: CurrentState = "waitingForOtherPlayer";

  public refresh() {
    console.log("this.current", this.current);
    switch (this.current) {
      case "waitingForOtherPlayer":
        this.assign(this.handData, "active", false);
        this.assign(this.handData, "selected", []);
        this.assign(this.gridData, "active", false);
        this.assign(this.gridData, "selected", []);
        this.assign(this.gridData, "ghosts", []);
        break;

      case "playerTurn:init":
        this.assign(this.handData, "active", true);
        this.assign(this.handData, "selected", []);
        this.assign(
          this.handData,
          "selectable",
          new Array(this.handData.cardIDs?.length || 0).fill(true),
        );
        this.assign(this.gridData, "selected", []);
        this.assign(this.gridData, "selectable", []);
        this.assign(this.gridData, "selectedCol", []);
        this.assign(this.gridData, "selectableCol", []);
        this.assign(this.gridData, "ghosts", []);
        this.current = "playerTurn:beforeCardSelect";
        this.refresh();
        break;

      case "playerTurn:beforeCardSelect":
        if (this.handData.selected?.includes(true)) {
          this.current = "playerTurn:afterCardSelect";
          this.refresh();
          break;
        }
        break;

      case "playerTurn:afterCardSelect":
        this.current = "playerTurn:beforeGridSelect";
        this.ctrlButtonData.cancel.display = true;
        this.refresh();
        break;

      case "playerTurn:beforeGridSelect":
        if (!this.handData.selected?.includes(true)) {
          this.current = "playerTurn:beforeCardSelect";
          this.assign(this.gridData, "active", false);
          this.assign(this.gridData, "selected", []);
          break;
        }
        if (
          this.gridData.selected?.[0]?.find((row) => {
            return row?.includes(true);
          })
        ) {
          this.current = "playerTurn:afterGridSelect";
          this.refresh();
          break;
        }
        this.assign(this.gridData, "active", true);
        this.setPlayerGridSelectable();
        break;

      case "playerTurn:afterGridSelect": {
        const c = handUtil.findFirstSelectedID(this.handData);
        if (!c) {
          this.current = "playerTurn:afterCardSelect";
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
        // this.assign(this.gridData, "selectable", []);
        this.assign(this.handData, "selectable", []);
        this.current = "playerTurn:beforeTargetSelect";
        this.refresh();
        break;
      }

      case "playerTurn:beforeTargetSelect": {
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
          this.current = "playerTurn:beforeGridSelect";
          this.refresh();
          break;
        }

        const selected: boolean[][] = this.gridData.selected?.[1] || [];
        const targetSelected = selected.some((s: boolean[]) => {
          return (s || []).includes(true);
        });
        if (targetSelected) {
          if (def.onPlay === "TargetSameLaneToAnother:Maze") {
            this.current = "playerTurn:beforeTargetSelect2";
            this.refresh();
            break;
          } else {
            this.current = "playerTurn:afterTargetSelect";
            this.refresh();
            break;
          }
        }

        const [x, y] = this.getSelectedCoordinate(0);

        switch (def.onPlay) {
          case "TargetSameLane:Silence": {
            if (!this.setTargetSameLane(x)) {
              this.current = "playerTurn:afterTargetSelect";
              this.refresh();
              break;
            }
            break;
          }
          case "TargetNonStealthSameLane:Reincanate": {
            if (!this.setTargetSameLaneNonStealth(x, y)) {
              this.current = "playerTurn:afterTargetSelect";
              this.refresh();
              break;
            }
            break;
          }
          case "TargeAnytStealth:Reveal": {
            if (!this.setTargetAnyStealth()) {
              this.current = "playerTurn:afterTargetSelect";
              this.refresh();
              break;
            }
            break;
          }
          case "TargetSameLaneToAnother:Maze": {
            if (!this.setTargetSameLaneStealth(x)) {
              this.current = "playerTurn:afterTargetSelect";
              this.refresh();
              break;
            }
            break;
          }
          default: {
            this.current = "playerTurn:afterTargetSelect";
            break;
          }
        }
        break;
      }

      case "playerTurn:beforeTargetSelect2": {
        const [x, y] = this.getSelectedCoordinate(1);
        const laneSelectable = this.setTargetAnotherLane(x, y);
        this.gridData.selectable = [];
        if (!laneSelectable) {
          this.current = "playerTurn:afterTargetSelect";
          break;
        }
        if (this.gridData.selectedCol?.includes(true)) {
          this.current = "playerTurn:afterTargetSelect";
          break;
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

    // console.log("debug", this.current, this.gridData, this.handData);
  }

  public cancelState(): void {
    if (/^playerTurn/.test(this.current)) {
      this.current = "playerTurn:init";
      this.ctrlButtonData.cancel.display = false;
      this.undoPlayedCard();
      this.refresh();
    }
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

  private setTargetSameLane(x: number): boolean {
    const selectable: boolean[][] = [[], [], []];
    let result = false;
    for (let iy = 0; iy < 5; iy += 1) {
      if (iy !== 2) {
        if (this.gridData?.cardIDs?.[x][iy]) {
          selectable[x][iy] = true;
          result = true;
        }
        if (this.gridData?.ghosts?.[x][iy]) {
          selectable[x][iy] = true;
          result = true;
        }
      }
    }
    if (!this.gridData.selectable) {
      this.gridData.selectable = [[], []];
    }
    this.gridData.selectable[1] = selectable;
    return result;
  }

  private setTargetSameLaneNonStealth(x: number, y: number): boolean {
    const selectable: boolean[][] = [[], [], []];
    let result = false;
    for (let iy = 0; iy < 5; iy += 1) {
      if (iy !== 2) {
        const cid = this.gridData?.cardIDs?.[x][iy];
        if (cid) {
          const cDetail = cardUtil.getCard(cid);
          if (!cDetail.stealth) {
            selectable[x][iy] = true;
            result = true;
          }
        }
        if (this.gridData?.ghosts?.[x][y]) {
          selectable[x][y] = true;
          result = true;
        }
      }
    }
    if (!this.gridData.selectable) {
      this.gridData.selectable = [[], []];
    }
    this.gridData.selectable[1] = selectable;
    return result;
  }

  private setTargetAnyStealth(): boolean {
    const selectable: boolean[][] = [[], [], []];
    let result = false;
    for (let ix = 0; ix < 3; ix += 1) {
      for (let iy = 0; iy < 5; iy += 1) {
        if (iy !== 2) {
          const cid = this.gridData?.cardIDs?.[ix][iy];
          if (cid) {
            const cDetail = cardUtil.getCard(cid);
            if (cDetail.stealth) {
              selectable[ix][iy] = true;
              result = true;
            }
          }
        }
      }
    }
    if (!this.gridData.selectable) {
      this.gridData.selectable = [[], []];
    }
    this.gridData.selectable[1] = selectable;
    return result;
  }

  private setTargetSameLaneStealth(x: number): boolean {
    const selectable: boolean[][] = [[], [], []];
    let result = false;
    for (let iy = 0; iy < 5; iy += 1) {
      if (iy !== 2) {
        const cid = this.gridData?.cardIDs?.[x][iy];
        if (cid) {
          const cDetail = cardUtil.getCard(cid);
          if (cDetail.stealth) {
            selectable[x][iy] = true;
            result = true;
          }
        }
      }
    }
    if (!this.gridData.selectable) {
      this.gridData.selectable = [[], []];
    }
    this.gridData.selectable[1] = selectable;
    return result;
  }

  private setTargetAnotherLane(x: number, y: number): boolean {
    if (x === -1) {
      // this.gridData.selectableCol = [false, false, false];
      return false;
    }
    const selectableCol = [true, true, true];
    selectableCol[x] = false;

    for (let ix = 0; ix < 3; ix += 1) {
      if (ix === x) {
        continue;
      }
      let ymax = 5;
      if (y < 2) {
        ymax = 1;
      }
      if (this.gridData.cardIDs?.[ix]?.[ymax]) {
        selectableCol[ix] = false;
      }
    }

    this.gridData.selectableCol = selectableCol;
    return selectableCol.includes(true);
  }

  private undoPlayedCard(): void {
    const id = handUtil.findFirstSelectedID(this.handData);
    if (!id) {
      return;
    }
    const idx = gridUtil.getIdxFromCid(this.gridData, id.cid);
    if (idx.x === -1 || idx.y === -1) {
      return;
    }
    const ghosts: Array<Array<boolean>> = [[]];
    ghosts[idx.x] = [];
    ghosts[idx.x][idx.y] = true;
    this.assign(this.gridData, "ghosts", ghosts);
    if (this.gridData.cardIDs) {
      this.gridData.cardIDs[idx.x][idx.y] = undefined;
    }
  }

  private getSelectedCoordinate(idx: number): [number, number] {
    let y = -1;
    const x = this.gridData.selected?.[idx]?.findIndex((col) => {
      y = (col || []).findIndex((row) => {
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
