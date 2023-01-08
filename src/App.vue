<template>
  <div>
    {{ num }}
    <button v-on:click="getNum">Get Num</button>
  </div>

  <div>
    <div id="common_table" class="whiteblock">
      <h3 id="ontable_header">
        <span>{ON_TABLE}:</span>
      </h3>
      <Grid
        ref="grid"
        type="table"
        :cardIDs="gridData.cardIDs"
        :ghosts="gridData.ghosts"
        :selectable="gridData.selectable"
        :selected="gridData.selected"
        :selectableCol="gridData.selectableCol"
        :selectedCol="gridData.selectedCol"
        :active="gridData.active"
        :overlay="gridData.overlay"
      >
      </Grid>
    </div>

    <div id="ctrl_buttons">
      <CtrlButton
        type="submit"
        :active="ctrlButtonData.submit.active"
        :display="ctrlButtonData.submit.display"
        @btnClick="submitState()"
      ></CtrlButton>
      <CtrlButton
        type="cancel"
        :active="ctrlButtonData.cancel.active"
        :display="ctrlButtonData.cancel.display"
        @btnClick="cancelState()"
      ></CtrlButton>
    </div>

    <div id="player_hand" class="whiteblock">
      <h3 id="inhand_header">
        <span>{IN_HAND}:</span>
      </h3>

      <Hand
        ref="hand"
        type="card"
        :cardIDs="handData.cardIDs"
        :selectable="handData.selectable"
        :selected="handData.selected"
        :active="handData.active"
      >
      </Hand>
    </div>
  </div>
  <div id="modals"></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Ref } from "vue";
// from: https://stackoverflow.com/a/69367607
// import { computed } from "@vue/reactivity";
import { watch } from "vue";
import { Gamedata } from "bga_src/client/type/gamedata.d";
import {
  BgaRequest,
  BgaNotification,
} from "bga_src/client/type/bga-interface.d";
import { GridData } from "./type/Grid.d";
import { HandData } from "./type/Hand.d";
import { CtrlButtonData } from "./type/CtrlButton.d";
import { ScoreData } from "./type/Score.d";
import { cardDefs, cardMetaDefs } from "./def/card";
import { gridDefs } from "./def/grid";
import { handDefs } from "./def/hand";
import { ctrlButtonDefs } from "./def/ctrlButton";
import { State, CurrentState } from "./logic/state";
import { Sub } from "./logic/sub";
import GameCard from "./components/GameCard.vue";
import Hand from "./components/Hand.vue";
import Grid from "./components/Grid.vue";
import CtrlButton from "./components/CtrlButton.vue";

@Options({
  components: {
    GameCard,
    Hand,
    Grid,
    CtrlButton,
  },
  provide: () => {
    return {
      // provided through main.ts so that it can inject itself
      // urlBase: ref(""),
      cardDef: cardDefs,
      cardMetaDef: cardMetaDefs,
      gridDef: gridDefs,
      handDef: handDefs,
      ctrlButtonDef: ctrlButtonDefs,
    };
  },
  inject: ["urlBase"],
})
export default class App extends Vue {
  public bgaRequest: BgaRequest | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public bgaRequestPromise: Promise<any> = Promise.resolve();
  public bgaNotifications: BgaNotification[] = [];
  public bgaStates: CurrentState[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public bgaNotifQueue: Promise<any> = Promise.resolve();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public bgaStateQueue: Promise<any> = Promise.resolve();
  public num = 0;
  public urlBase!: Ref<string>;
  public gridData: GridData = {
    cardIDs: [],
    ghosts: [],
    selectable: [],
    selected: [],
    selectableCol: [],
    selectedCol: [],
    exclusiveSelect: true,
    overlay: [],
    active: false,
  };

  public handData: HandData = {
    cardIDs: [],
    selectable: [],
    selected: [],
    active: false,
  };

  public ctrlButtonData: CtrlButtonData = {
    submit: {
      active: true,
      display: false,
    },
    cancel: {
      active: true,
      display: false,
    },
  };

  public scoreData: ScoreData = {
    centerScore: [],
    oppoScore: [],
    myScore: [],
  };

  public gamedata: Gamedata = {
    current_player_id: "",
    decision: { decision_type: "" },
    game_result_neutralized: "",
    gamestate: null,
    gamestates: {},
    neutralized_player_id: "",
    notifications: { last_packet_id: "", move_nbr: "" },
    player_cards: [],
    playerorder: [],
    players: {},
    player_table: [],
    oppo_table: [],
    tablespeed: "",
    day_or_night: "day",
  };

  public playerID = -1;
  public state: null | State = null;
  public sub: null | Sub = null;

  mounted() {
    this.initBgaNotification();
    this.initBgaState();
    const unwatch = watch(this.gamedata, () => {
      this.init();
      unwatch();
    });
  }

  public init() {
    // init: hand
    this.handData.cardIDs = [];
    this.handData.selectable = [];
    this.gamedata.player_cards.forEach((c) => {
      this.handData.cardIDs?.push({
        id: c.id,
        cid: `mainCard${c.type_arg}`,
        meta: (c.meta || []).map((m) => {
          return {
            metaID: m,
          };
        }),
      });
      this.handData.selectable?.push(true);
    });

    // init grid data
    // FIXME: this should apply who controls
    if (this.gamedata.day_or_night === "night") {
      this.gridData.cardIDs = [
        [undefined, undefined, { cid: "centerCard3" }],
        [undefined, undefined, { cid: "centerCard4" }],
        [undefined, undefined, { cid: "centerCard5" }],
      ];
    } else {
      this.gridData.cardIDs = [
        [undefined, undefined, { cid: "centerCard0" }],
        [undefined, undefined, { cid: "centerCard1" }],
        [undefined, undefined, { cid: "centerCard2" }],
      ];
    }
    this.gamedata.player_table.forEach((c) => {
      const gridID = Number(c.location_arg);
      const row = Math.floor(gridID / 3) + 3;
      const col = gridID % 3;
      if (!this.gridData.cardIDs) {
        throw "invalid state";
      }
      this.gridData.cardIDs[col][row] = {
        id: c.id,
        cid: `mainCard${c.type_arg}`,
        meta: (c.meta || []).map((m) => {
          return {
            metaID: m,
          };
        }),
      };
    });
    this.gamedata.oppo_table.forEach((c) => {
      const gridID = Number(c.location_arg);
      const row = 1 - Math.floor(gridID / 3);
      const col = gridID % 3;
      if (!this.gridData.cardIDs) {
        throw "invalid state";
      }
      this.gridData.cardIDs[col][row] = {
        id: c.id,
        cid: `mainCard${c.type_arg}`,
        meta: (c.meta || []).map((m) => {
          return {
            metaID: m,
          };
        }),
      };
    });

    this.state = new State(
      this.request,
      this.gridData,
      this.handData,
      this.scoreData,
      this.ctrlButtonData,
    );
    this.state.refresh();
    this.sub = new Sub(
      this.playerID,
      this.gridData,
      this.handData,
      this.scoreData,
    );
  }

  public cancelState(): void {
    this.state?.cancelState();
  }

  public submitState(): void {
    this.state?.submitState();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public request(name: string, args: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.bgaRequest = {
        name: name,
        args: args,
      };
      setTimeout(() => {
        this.bgaRequestPromise
          .then((reply) => {
            resolve(reply);
          })
          .catch((e) => {
            reject(e);
          });
      });
    });
  }

  private initBgaNotification(): void {
    watch(this.bgaNotifications, (notifs: BgaNotification[]) => {
      // TODO: make this suspendable
      const notif = notifs.shift();
      if (!notif) {
        return;
      }
      console.log("notif", notif);

      this.bgaNotifQueue = this.bgaNotifQueue.then(() => {
        return new Promise<void>((resolve) => {
          switch (notif.name) {
            case "endRound":
              this.sub?.handle(notif);
              // FIXME: this should be configurable
              setTimeout(() => {
                resolve();
              }, 10000);
              break;
            default:
              this.sub?.handle(notif);
              resolve();
          }
        });
      });
    });
  }

  private initBgaState(): void {
    watch(this.bgaStates, (states: CurrentState[]) => {
      const state = states.shift();
      if (!state) {
        return;
      }
      this.bgaStateQueue = this.bgaStateQueue.then(() => {
        return new Promise<void>((resolve) => {
          switch (state) {
            default:
              this.state?.setState(state);
              setTimeout(() => {
                // secure the least time gap
                resolve();
              }, 100);
              break;
          }
        });
      });
    });
  }

  public getNum(): void {
    this.request("getNum", {
      num: this.num,
    });
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#player_hand > h3,
#common_table > h3 {
  text-align: left;
}
#ctrl_buttons {
  height: 30px;
}
#ctrl_buttons :not(:last-child) {
  margin-right: 5px;
}
</style>
