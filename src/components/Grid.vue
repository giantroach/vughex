<template>
  <ul class="grid">
    <li
      v-for="(gridCol, idx) in grid"
      :key="idx"
      class="grid-col"
      :class="{
        selectable: isColSelectable(idx),
        selected: isColSelected(idx),
      }"
      v-bind:style="{
        width: size.width,
        borderRadius: size.radius,
        marginRight: idx === grid.length - 1 ? 0 : marginCol,
        marginLeft: idx === 0 ? 0 : marginCol,
      }"
      @click="selectCol(idx)"
    >
      <ul>
        <li
          v-for="(gridCell, idy) in gridCol"
          :key="gridCell"
          class="grid-cell"
          :class="{
            selectable0: isSelectable(0, idx, idy),
            selected0: isSelected(0, idx, idy),
            selectable1: isSelectable(1, idx, idy),
            selected1: isSelected(1, idx, idy),
          }"
          v-bind:style="{
            width: size.width,
            height: size.height,
            borderRadius: size.radius,
            marginTop: idy === 0 ? 0 : marginRow,
            marginBottom: idy === gridCol.length - 1 ? 0 : marginRow,
          }"
          @click="selectGrid(getSelectableIdx(idx, idy), idx, idy)"
        >
          <template
            v-if="
              overlay &&
              overlay[idx] &&
              overlay[idx][idy] &&
              overlay[idx][idy].type === 'text'
            "
          >
            <div class="">{{ overlay[idx][idy].data }}</div>
          </template>
          <template
            v-if="cardIDs && cardIDs[idx] && cardIDs[idx][idy] !== undefined"
          >
            <GameCard
              :id="cardIDs[idx][idy]"
              :prioritizeMini="true"
              :ghost="ghosts && ghosts[idx] && ghosts[idx][idy]"
              :detailPos="'right'"
              :selectable="
                isSelectable(0, idx, idy) || isSelectable(1, idx, idy)
              "
              @selectCard="selectGrid(getSelectableIdx(idx, idy), idx, idy)"
            ></GameCard>
          </template>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Overlay } from "../type/Grid.d";
import { SizeDef, MarginDef, GridDef } from "../type/GridDef.d";
import { throttle } from "../util/util";
import { CardDef } from "../type/CardDef.d";
import GameCard from "./GameCard.vue";

@Options({
  components: {
    GameCard,
  },
  props: {
    type: String,
    cardIDs: Array,
    ghosts: Array,
    selectable: Array,
    selected: Array,
    selectableCol: Array,
    selectedCol: Array,
    exclusiveSelect: Boolean,
    overlay: Array,
    active: Boolean,
  },
  inject: ["gridDef", "cardDef"],
  emits: ["selectGrid", "selectCol"],
})
export default class Grid extends Vue {
  public gridDef!: { [cardType: string]: GridDef };
  public grid!: number[][];
  public type!: string; // card type
  public size!: SizeDef;
  public marginRow!: string;
  public marginCol!: string;
  public cardIDs!: string[][];
  public ghosts!: string[][];
  public selectable!: boolean[][][];
  public selected!: boolean[][][];
  public selectableCol!: boolean[];
  public selectedCol!: boolean[];
  public exclusiveSelect = true;
  public overlay!: Overlay[][];
  public active!: boolean;
  public cardDef!: { [cardType: string]: CardDef };

  public created() {
    const def = this.gridDef[this.type];
    if (typeof def.layout === "string") {
      this.grid = this.parseLayoutStr(def.layout);
    } else {
      this.grid = def.layout;
    }
    this.size = def.size;
    this.marginCol = this.formatMarginCol(def.margin);
    this.marginRow = this.formatMarginRow(def.margin);
    this.setSelectGrid();
  }

  private parseLayoutStr(layoutStr: string): number[][] {
    const match = /(\d+)x(\d+)/g.exec(layoutStr);
    if (match === null) {
      throw "invalid grid layout";
    }
    const x = Number(match[1]);
    const y = Number(match[2]);
    return new Array(x).fill(new Array(y).fill(null));
  }

  private formatMarginRow(margin: MarginDef): string {
    const r = /^(\d+)(.+)/;
    const rm = r.exec(margin.row) || [null, "0", ""];
    return `${Number(rm[1]) / 2}${rm[2]}`;
  }

  private formatMarginCol(margin: MarginDef): string {
    const r = /^(\d+)(.+)/;
    const cm = r.exec(margin.column) || [null, "0", ""];
    return `${Number(cm[1]) / 2}${cm[2]}`;
  }

  public isSelectable(idx: number, x: number, y: number): boolean {
    if (!this.active) {
      return false;
    }
    return this.selectable &&
      this.selectable[idx] &&
      this.selectable[idx][x] &&
      this.selectable[idx][x][y]
      ? true
      : false;
  }

  public getSelectableIdx(x: number, y: number): number {
    for (let i = this.selectable.length; i >= 0; i -= 1) {
      if (this.isSelectable(i, x, y)) {
        return i;
      }
    }
    return -1;
  }

  public isSelected(idx: number, x: number, y: number): boolean {
    if (!this.active) {
      return false;
    }
    const selected =
      this.selected &&
      this.selected[idx] &&
      this.selected[idx][x] &&
      this.selected[idx][x][y]
        ? true
        : false;
    return selected;
  }

  public isColSelectable(x: number): boolean {
    if (!this.active) {
      return false;
    }
    return this.selectableCol && this.selectableCol[x] ? true : false;
  }

  public isColSelected(x: number): boolean {
    if (!this.active) {
      return false;
    }
    return this.selectedCol && this.selectedCol[x] ? true : false;
  }

  public selectExcept(idx: number, x: number, y: number): void {
    this.selected[idx].forEach((s, ix) => {
      if (!s) {
        return;
      }
      s.forEach((t, iy) => {
        if (y === iy && x === ix) {
          return;
        }
        this.selected[idx][ix][iy] = false;
      });
    });
  }

  public selectColExcept(x: number): void {
    this.selectedCol.forEach((s, i) => {
      if (!s) {
        return;
      }
      if (x === i) {
        return;
      }
      this.selectedCol[i] = false;
    });
  }

  public selectGrid(idx: number, x: number, y: number): void {
    this.throttledSelectGrid(idx, x, y);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public throttledSelectGrid: any;
  public setSelectGrid(): void {
    // FIXME: this is triggered twice when you click
    this.throttledSelectGrid = throttle(
      (idx: number, x: number, y: number) => {
        if (!this.isSelectable(idx, x, y)) {
          return;
        }

        if (!this.selected[idx]) {
          this.selected[idx] = [];
        }

        if (this.selected[idx][x] === void 0) {
          this.selected[idx][x] = [];
        }

        this.selected[idx][x][y] = !this.selected[idx][x][y];
        if (this.selected[idx][x][y]) {
          if (this.exclusiveSelect) {
            this.selectExcept(idx, x, y);
          }
          this.$emit("selectGrid", { idx, x, y });
        }
      },
      100,
      this,
    );
  }

  public selectCol(x: number): void {
    if (!this.isColSelectable(x)) {
      return;
    }
    this.selectedCol[x] = !this.selectedCol[x];
    if (this.selectedCol[x]) {
      if (this.exclusiveSelect) {
        this.selectColExcept(x);
      }
      this.$emit("selectCol", x);
    }
  }
}
</script>

<style scoped lang="scss">
ul {
  padding: 0;
}
ul.grid {
  display: flex;
  justify-content: center;
}
li {
  list-style-type: none;
}
li.grid-cell {
  border: 2px solid rgba(0, 0, 0, 0.5);
}
ul.grid {
  transform: scale(0.6);
  margin: -120px 0;
}
li.grid-cell.selectable0 {
  border: 2px solid #00e9eb;
  box-shadow: 0 0 5px 5px #05fdff;
}
li.grid-cell.selected0 {
  border: 2px solid #fffc00;
  box-shadow: 0 0 5px 5px #ffb644;
}
li.grid-cell.selectable1 {
  border: 2px solid #00eb7a;
  box-shadow: 0 0 5px 5px #05ff92;
}
li.grid-cell.selected1 {
  border: 2px solid #fffc00;
  box-shadow: 0 0 5px 5px #ffb644;
}
ul.grid > li.grid-col {
  border: 2px solid transparent;
  box-shadow: 0 0 5px 5px transparent;
}
ul.grid > li.grid-col.selectable {
  border: 2px solid #00e9eb;
  box-shadow: 0 0 5px 5px #05fdff;
}
ul.grid > li.grid-col.selected {
  border: 2px solid #fffc00;
  box-shadow: 0 0 5px 5px #ffb644;
}
</style>
