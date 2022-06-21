import { GridData } from "../type/Grid.d";
import { HandData } from "../type/Hand.d";
import { watch, ref, Ref } from "vue";

type CurrentState =
  | "init"
  | "playerTurn:init"
  | "playerTurn:beforeCardSelect"
  | "playerTurn:afterCardSelect"
  | "playerTurn:beforeGridSelect"
  | "playerTurn:afterGridSelect"
  | "playerTurn:beforeTargetSelect"
  | "playerTurn:afterTargetSelect"
  | "otherPlayerTurn";

export class State {
  constructor(private gridData: GridData, private handData: HandData) {
    watch([this.gridData, this.handData, this.current], () => {
      // FIXME: this may cause infinite loop
      this.refresh();
    });
  }

  public current: Ref<CurrentState> = ref("init");

  public refresh() {
    switch (this.current.value) {
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
        this.assign(this.gridData, "active", true);
        this.setPlayerGridSelectable();
        break;

      case "playerTurn:afterGridSelect":
        if (!this.handData.selected?.includes(true)) {
          this.current.value = "playerTurn:beforeCardSelect";
          this.assign(this.gridData, "active", false);
          this.assign(this.gridData, "selected", []);
          break;
        }

        if (
          this.gridData.selected?.find((row) => {
            return row?.includes(true);
          })
        ) {
          this.assign(this.gridData, "active", false);
          this.assign(this.gridData, "selected", []);
        }

        this.assign(this.gridData, "active", true);
        break;

      case "playerTurn:beforeTargetSelect":
        break;

      case "playerTurn:afterTargetSelect":
        break;
    }

    console.log("debug", this.current.value, this.gridData, this.handData);
  }

  private setPlayerGridSelectable(): void {
    const selectable: boolean[][] = [[], [], [], [], []];
    for (let i = 0; i < 3; i += 1) {
      if (!this.gridData?.cardIDs?.[3][i]) {
        selectable[3][i] = true;
      } else if (!this.gridData?.cardIDs[4][i]) {
        selectable[4][i] = true;
      }
    }
    this.gridData.selectable = selectable;
  }

  // avoid unnecessary update
  private assign(obj: any, key: string, val: any): void {
    if (obj[key] !== val) {
      obj[key] = val;
    }
  }
}
