<template>
  <div>
    {{ num }}
    <button v-on:click="getNum">Get Num</button>
  </div>

  <div>
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
    cardIDs: [
      [],
      ["mainCard1"],
      ["centerCard0", "centerCard1", "centerCard2"],
      [undefined, "mainCard3", undefined],
      [],
    ],
    selectable: [[], [], [], [true, true, false], []],
    selected: [],
    selectableCol: [],
    selectedCol: [],
    exclusiveSelect: true,
    active: false,
  };

  public handData: HandData = {
    cardIDs: ["mainCard0", "mainCard1", "mainCard2"],
    selectable: [true, true, false],
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
    playerorder: [],
    players: {},
    tablespeed: "",
  };

  mounted() {
    this.initBgaNotification();
    const s = new State(this.gridData, this.handData);
    s.current.value = "playerTurn:init";
    s.refresh();
    console.log("state", s);
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
      switch (notif.name) {
        case "getNum":
          this.num = notif.args.num;
          break;
        default:
          break;
      }
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
</style>
