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
        :selectable="gridData.selectable"
        :selected="gridData.selected"
        :selectableCol="gridData.selectableCol"
        :selectedCol="gridData.selectedCol"
        :active="gridData.active"
      >
      </Grid>
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
import { cardDefs } from "./def/card";
import { gridDefs } from "./def/grid";
import { handDefs } from "./def/hand";
import { State } from "./logic/state";
import { Sub } from "./logic/sub";
import GameCard from "./components/GameCard.vue";
import Hand from "./components/Hand.vue";
import Grid from "./components/Grid.vue";

@Options({
  components: {
    GameCard,
    Hand,
    Grid,
  },
  provide: () => {
    return {
      // provided through main.ts so that it can inject itself
      // urlBase: ref(""),
      cardDef: cardDefs,
      gridDef: gridDefs,
      handDef: handDefs,
    };
  },
  inject: ["urlBase"],
})
export default class App extends Vue {
  public bgaRequest: BgaRequest | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public bgaRequestPromise: Promise<any> = Promise.resolve();
  public bgaNotifications: BgaNotification[] = [];
  public num = 0;
  public urlBase!: Ref<string>;
  public gridData: GridData = {
    cardIDs: [],
    selectable: [[], [], []],
    selected: [],
    selectableCol: [],
    selectedCol: [],
    exclusiveSelect: true,
    active: false,
  };

  public handData: HandData = {
    cardIDs: [],
    selectable: [],
    selected: [],
    active: false,
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
  };
  public playerID = "";
  public state: null | State = null;
  public sub: null | Sub = null;

  mounted() {
    this.initBgaNotification();
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
        cid: `mainCard${Number(c.type_arg) - 1}`,
      });
      this.handData.selectable?.push(true);
    });

    // init grid data
    this.gridData.cardIDs = [
      [undefined, undefined, "centerCard0"],
      [undefined, undefined, "centerCard1"],
      [undefined, undefined, "centerCard2"],
    ];
    this.gamedata.player_table.forEach((c) => {
      const gridID = Number(c.location_arg);
      const row = Math.floor(gridID / 3) + 3;
      const col = gridID % 3;
      if (!this.gridData.cardIDs) {
        throw "invalid state";
      }
      this.gridData.cardIDs[col][row] = `mainCard${Number(c.type_arg) - 1}`;
    });
    this.gamedata.oppo_table.forEach((c) => {
      const gridID = Number(c.location_arg);
      const row = 1 - Math.floor(gridID / 3);
      const col = gridID % 3;
      if (!this.gridData.cardIDs) {
        throw "invalid state";
      }
      this.gridData.cardIDs[col][row] = `mainCard${Number(c.type_arg) - 1}`;
    });

    this.state = new State(this.request, this.gridData, this.handData);
    this.state.refresh();
    this.sub = new Sub(this.playerID, this.gridData, this.handData);
  }

  public loadTestData() {
    //FIXME: remove this
    this.gamedata = {
      current_player_id: "",
      decision: { decision_type: "" },
      game_result_neutralized: "0",
      gamestate: {
        id: "3",
        active_player: "2348342",
        args: null,
        reflexion: {
          total: { "2348342": 155, "2348343": "180" },
          initial: { "2348342": 179 },
          initial_ts: { "2348342": 1656683906819 },
        },
        updateGameProgression: 0,
        name: "playerTurn",
        description: "${actplayer} must play a card",
        descriptionmyturn: "${you} must play a card",
        type: "activeplayer",
        possibleactions: ["playCard"],
        transitions: { nextPlayer: 4, zombiePass: 4 },
      },
      gamestates: {
        "1": {
          name: "gameSetup",
          description: "",
          type: "manager",
          action: "stGameSetup",
          transitions: { roundSetup: 2 },
        },
        "2": {
          name: "roundSetup",
          type: "game",
          action: "stRoundSetup",
          updateGameProgression: true,
          transitions: { playerTurn: 3 },
        },
        "3": {
          name: "playerTurn",
          description: "${actplayer} must play a card",
          descriptionmyturn: "${you} must play a card",
          type: "activeplayer",
          possibleactions: ["playCard"],
          transitions: { nextPlayer: 4, zombiePass: 4 },
        },
        "4": {
          name: "nextPlayer",
          type: "game",
          action: "stNextPlayer",
          updateGameProgression: true,
          transitions: { playerTurn: 3, endRound: 10 },
        },
        "10": {
          name: "endRound",
          type: "game",
          action: "stEndRound",
          updateGameProgression: true,
          transitions: { roundSetup: 2, endGame: 99 },
        },
        "99": {
          name: "gameEnd",
          description: "End of game",
          type: "manager",
          action: "stGameEnd",
          args: "argGameEnd",
        },
      },
      neutralized_player_id: "0",
      notifications: { last_packet_id: "3", move_nbr: "1" },
      playerorder: ["2348342", 2348343],
      player_cards: [
        {
          id: "1",
          type: "standard",
          type_arg: "4",
          location: "hand",
          location_arg: "2348342",
        },
        {
          id: "5",
          type: "standard",
          type_arg: "13",
          location: "hand",
          location_arg: "2348342",
        },
        {
          id: "11",
          type: "standard",
          type_arg: "2",
          location: "hand",
          location_arg: "2348342",
        },
        {
          id: "12",
          type: "standard",
          type_arg: "3",
          location: "hand",
          location_arg: "2348342",
        },
        {
          id: "13",
          type: "standard",
          type_arg: "6",
          location: "hand",
          location_arg: "2348342",
        },
        {
          id: "14",
          type: "creep",
          type_arg: "14",
          location: "hand",
          location_arg: "2348342",
        },
      ],
      players: {
        "2348342": {
          id: "2348342",
          score: "0",
          cards: 6,
          color: "ff0000",
          color_back: null,
          name: "giantroach0",
          avatar: "000000",
          zombie: 0,
          eliminated: 0,
          is_ai: "0",
          beginner: true,
          ack: "ack",
        },
        "2348343": {
          id: "2348343",
          score: "0",
          cards: 6,
          color: "008000",
          color_back: null,
          name: "giantroach1",
          avatar: "000000",
          zombie: 0,
          eliminated: 0,
          is_ai: "0",
          beginner: true,
          ack: "ack",
        },
      },
      player_table: [],
      oppo_table: [],
      tablespeed: "1",
    };
    this.init();
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
      const notif = notifs.shift();
      if (!notif) {
        return;
      }
      console.log("notif", notif);
      this.sub?.handle(notif);
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
</style>
