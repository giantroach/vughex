<template>
  <link
    rel="preload"
    as="image"
    :href="urlBase + require('@/assets/cardset.png')"
  />

  <div>
    <div id="common_table" class="whiteblock">
      <div class="card-header">
        <h3 id="ontable_header">
          <span>{{ i18n("On Table") }}:</span>
        </h3>
        <div class="round-info">{{ i18n("Round") }}:{{ roundData.round }}</div>
      </div>

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
        :cellOverlay="gridData.cellOverlay"
      >
      </Grid>
    </div>

    <div id="ctrl_buttons">
      <CtrlButton
        type="submit"
        :active="ctrlButtonData.submit.active"
        :display="ctrlButtonData.submit.display"
        auraType="submit"
        @btnClick="submitState()"
      ></CtrlButton>
      <CtrlButton
        type="cancel"
        :active="ctrlButtonData.cancel.active"
        :display="ctrlButtonData.cancel.display"
        auraType="cancel"
        @btnClick="cancelState()"
      ></CtrlButton>
      <CtrlButton
        type="mulligan"
        :active="ctrlButtonData.mulligan.active"
        :display="ctrlButtonData.mulligan.display"
        auraType="submit"
        @btnClick="submitState('submit')"
      ></CtrlButton>
      <CtrlButton
        type="noMulligan"
        :active="ctrlButtonData.noMulligan.active"
        :display="ctrlButtonData.noMulligan.display"
        auraType="cancel"
        @btnClick="submitState()"
      ></CtrlButton>
      <CtrlButton
        type="confirm"
        :active="ctrlButtonData.confirm.active"
        :display="ctrlButtonData.confirm.display"
        auraType="submit"
        @btnClick="submitState()"
      ></CtrlButton>
    </div>

    <div id="player_hand" class="whiteblock">
      <div class="card-header">
        <h3 id="inhand_header">
          <span>{{ i18n("Your Hand") }}:</span>
        </h3>
      </div>

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
import { ReincarnationData } from "./type/Reincarnation.d";
import { RoundData } from "./type/Round.d";
import { auraDefs } from "./def/aura";
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
import { objToArray } from "./util/util";

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
      auraDef: auraDefs,
      cardDef: cardDefs,
      cardMetaDef: cardMetaDefs,
      gridDef: gridDefs,
      handDef: handDefs,
      ctrlButtonDef: ctrlButtonDefs,
    };
  },
  inject: ["urlBase", "i18n", "translation", "animation"],
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public i18n!: Ref<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public translation!: Ref<any>;
  public animation!: Ref<boolean>;
  public gridData: GridData = {
    cardIDs: [],
    ghosts: [],
    selectable: [],
    selected: [],
    selectableCol: [],
    selectedCol: [],
    exclusiveSelect: true,
    overlay: [],
    cellOverlay: [],
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
    mulligan: {
      active: true,
      display: false,
    },
    noMulligan: {
      active: true,
      display: false,
    },
    confirm: {
      active: true,
      display: false,
    },
  };

  public scoreData: ScoreData = {
    centerScore: [],
    oppoScore: [],
    myScore: [],
    result: [],
  };

  public reincarnationData: ReincarnationData = {
    reincarnatedCardID: null,
  };

  public roundData: RoundData = {
    round: 0,
    side: "Day",
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
    round: "0",
    center: {
      left: {
        controller: "",
      },
      center: {
        controller: "",
      },
      right: {
        controller: "",
      },
    },
    reincarnated_card_id: null,
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

    // init grid data
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
        meta: !c.meta
          ? []
          : c.meta.split(",").map((m) => {
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
        meta: !c.meta
          ? []
          : c.meta.split(",").map((m) => {
              return {
                metaID: m,
              };
            }),
      };
    });

    // restore score
    if (this.gamedata.score) {
      const score = this.gamedata.score;
      for (const pID in score) {
        if (pID === "center") {
          this.scoreData.centerScore = objToArray(score[pID]);
        } else if (pID === String(this.playerID)) {
          this.scoreData.myScore = objToArray(score[pID]);
        } else {
          this.scoreData.oppoScore = objToArray(score[pID]);
        }
      }
    }
    if (this.gamedata.winner) {
      this.gamedata.winner.forEach((winner, idx: number) => {
        if (!this.scoreData.result) {
          this.scoreData.result = [];
        }
        if (Number(winner) === 0) {
          this.scoreData.result[idx] = "tie";
        } else if (Number(winner) === Number(this.playerID)) {
          this.scoreData.result[idx] = "win";
        } else {
          this.scoreData.result[idx] = "lose";
        }
      });
    }

    this.roundData = {
      round: Number(this.gamedata.round),
      side: this.gamedata.day_or_night === "day" ? "Day" : "Night",
    };

    this.reincarnationData.reincarnatedCardID =
      this.gamedata.reincarnated_card_id || null;

    this.reincarnationData.reincarnatedCol =
      this.gamedata.reincarnated_col != null
        ? Number(this.gamedata.reincarnated_col)
        : null;

    this.state = new State(
      this.request,
      this.gridData,
      this.handData,
      this.scoreData,
      this.ctrlButtonData,
      this.reincarnationData,
    );
    this.state.refresh();
    this.sub = new Sub(
      this.playerID,
      this.gridData,
      this.handData,
      this.scoreData,
      this.reincarnationData,
      this.roundData,
    );

    // update center controller
    const dayOrNight = this.gamedata.day_or_night;
    const center = this.gamedata.center;
    this.gridData.cardIDs[0][2] = {
      cid:
        "centerCard" +
        this.sub.getCenterIdx("left", dayOrNight, center.left.controller),
    };
    this.gridData.cardIDs[1][2] = {
      cid:
        "centerCard" +
        this.sub.getCenterIdx("center", dayOrNight, center.center.controller),
    };
    this.gridData.cardIDs[2][2] = {
      cid:
        "centerCard" +
        this.sub.getCenterIdx("right", dayOrNight, center.right.controller),
    };
  }

  public cancelState(): void {
    this.state?.cancelState();
  }

  public submitState(mode?: string): void {
    this.state?.submitState(mode);
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

      this.bgaNotifQueue = this.bgaNotifQueue.then(() => {
        return new Promise<void>((resolve) => {
          switch (notif.name) {
            case "score":
              this.sub?.handle(notif);
              // without delay
              resolve();
              break;
            default:
              this.sub?.handle(notif);
              setTimeout(() => {
                // secure the least time gap
                resolve();
              }, 1000);
              break;
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
              }, 1000);
              break;
          }
        });
      });
    });
  }
}
</script>

<style lang="scss">
#preload {
  position: fixed;
  top: -10000px;
  left: -10000px;
}
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
  height: 50px;
  display: flex;
  justify-content: center;
}
#ctrl_buttons > * {
  margin: 10px;
}

.whiteblock {
  margin-bottom: 10px;
  margin-top: 10px;
  padding: 10px;
}

.card-header {
  display: flex;

  > h3 {
    flex: 1 1 auto;
    text-align: left;
    margin: 0;
  }

  > .round-info {
    flex: 1 1 auto;
    text-align: right;
    margin: 5px;
    color: #555;
    font-weight: bold;
  }
}
</style>
