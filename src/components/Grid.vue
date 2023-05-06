<template>
  <ul class="grid">
    <li
      ref="colRef"
      v-for="(gridCol, idx) in grid"
      :key="idx"
      class="grid-col aura"
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
      <Aura
        :active="animation.value && isColSelectable(idx)"
        :type="isColSelected(idx) ? 'colSelected' : 'colSelectable'"
        :radius="size.radius"
      ></Aura>
      <ul>
        <li
          v-for="(gridCell, idy) in gridCol"
          :key="gridCell"
          class="grid-cell aura"
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
              cellOverlay &&
              cellOverlay[idx] &&
              cellOverlay[idx][idy] &&
              cellOverlay[idx][idy].type === 'text'
            "
          >
            <div :class="'cellOverlay ' + cellOverlay[idx][idy].cssClass || ''">
              {{ cellOverlay[idx][idy].data }}
            </div>
          </template>
          <Aura
            :active="
              animation.value &&
              (isSelectable(0, idx, idy) ||
                isSelectable(1, idx, idy) ||
                isSelected(0, idx, idy) ||
                isSelected(1, idx, idy))
            "
            :type="getAuraType(idx, idy)"
            :radius="size.radius"
          ></Aura>
          <template
            v-if="cardIDs && cardIDs[idx] && cardIDs[idx][idy] !== undefined"
          >
            <GameCard
              :id="cardIDs[idx][idy].cid"
              :prioritizeMini="true"
              :ghost="ghosts && ghosts[idx] && ghosts[idx][idy]"
              :detailPos="'right'"
              :selectable="
                isSelectable(0, idx, idy) || isSelectable(1, idx, idy)
              "
              :meta="cardIDs[idx][idy].meta"
              @selectCard="selectGrid(getSelectableIdx(idx, idy), idx, idy)"
            ></GameCard>
          </template>
        </li>
      </ul>
    </li>
  </ul>

  <teleport to="body" v-if="overlay && overlay.length">
    <template v-for="(o, i) in getOverlayPos(overlay)" :key="i">
      <div
        class="overlay"
        :class="o.cssClass || ''"
        v-bind:style="{
          top: o.top,
          left: o.left,
          width: o.width ?? 'initial',
        }"
      >
        {{ i18n(o.data) }}
      </div>
    </template>
  </teleport>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Ref } from "vue";
import { Overlay, CellOverlay } from "../type/Grid.d";
import { SizeDef, MarginDef, GridDef } from "../type/GridDef.d";
import { throttle } from "../util/util";
import { CardDef } from "../type/CardDef.d";
import GameCard from "./GameCard.vue";
import Aura from "./Aura.vue";

interface OverlayWithPos extends Overlay {
  top: string;
  left: string;
  width: null | string;
}

@Options({
  components: {
    GameCard,
    Aura,
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
    cellOverlay: Array,
    overlay: Array,
    active: Boolean,
  },
  inject: ["gridDef", "cardDef", "i18n", "animation"],
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
  public overlay!: Overlay[];
  public overlayPos!: OverlayWithPos[];
  public cellOverlay!: CellOverlay[][];
  public active!: boolean;
  public cardDef!: { [cardType: string]: CardDef };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public i18n!: Ref<any>;
  public animation!: Ref<boolean>;

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

  public getAuraType(x: number, y: number): string {
    if (this.isSelected(0, x, y)) {
      return "gridSelected";
    }

    if (this.isSelected(1, x, y)) {
      return "gridSelected";
    }

    if (this.isSelectable(1, x, y)) {
      return "gridSelectable2";
    }

    if (this.isSelectable(0, x, y)) {
      return "gridSelectable1";
    }

    return "";
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

  public getOverlayPos(overlay: Overlay[]): OverlayWithPos[] {
    return overlay.map((o) => {
      const pos = { top: "0px", left: "0px", width: "" };
      // col mode
      if (/^col\.\d\.\w+$/.test(o.pos)) {
        const m = /^col\.(\d+)\.(\w+)$/.exec(o.pos);
        if (m) {
          const i = Number(m[1]);
          const p = m[2];
          if (this.$refs && this.$refs.colRef) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const colPos = (this.$refs as any).colRef[
              i
            ].getBoundingClientRect();
            if (p === "bottom") {
              pos.top = colPos.bottom + "px";
              pos.left = colPos.left + "px";
              pos.width = colPos.width + "px";
            }
          }
        }
      }
      return Object.assign(pos, o);
    });
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
  border: 3px solid rgba(0, 0, 0, 0.3);
  position: relative;
}
li.aura {
  transition: 0.2s;
  position: relative;
}
ul.grid {
  transform: scale(0.6);
  margin: -120px 0;
}
li.grid-cell.selectable0 {
  border: 3px solid #00e9eb;
  box-shadow: 0 0 5px 5px rgb(0 233 235 / 50%);
}
li.grid-cell.selected0 {
  border: 3px solid #fffc00;
  box-shadow: 0 0 5px 5px rgb(255 252 0 / 50%);
}
li.grid-cell.selectable1 {
  border: 3px solid #00eb7a;
  box-shadow: 0 0 5px 5px rgb(0 235 122 / 50%);
}
li.grid-cell.selected1 {
  border: 3px solid #fffc00;
  box-shadow: 0 0 5px 5px rgb(255 252 0 / 50%);
}
ul.grid > li.grid-col {
  border: 3px solid transparent;
}
ul.grid > li.grid-col.selectable {
  border: 3px solid #00e9eb;
  box-shadow: 0 0 5px 5px rgb(0 233 235 / 50%);
}
ul.grid > li.grid-col.selected {
  border: 3px solid #fffc00;
  box-shadow: 0 0 5px 5px rgb(255 252 0 / 50%);
}
.cellOverlay {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
  text-align: center;
  flex: 1 1 auto;
  justify-content: center;
  position: absolute;
  width: 100%;
  z-index: 1;
}
.cellOverlay.largeCenter {
  color: white;
  font-size: 4em;
  font-weight: bolder;
  text-stroke: 2px #000;
  -webkit-text-stroke: 2px #000;
}

.overlay {
  pointer-events: none;
  position: absolute;
}
.overlay.largeCenter {
  text-align: center;
  color: white;
  font-size: 1.5em;
  font-weight: bolder;
  text-shadow: #666 1px 1px 1px, #666 -1px 1px 1px, #666 1px -1px 1px,
    #666 -1px -1px 1px;
  background: linear-gradient(to bottom, transparent, #e9e9e9, transparent);
}
.overlay.success {
  color: #00cd6a;
  text-shadow: #fff 1px 1px 1px, #fff -1px 1px 1px, #fff 1px -1px 1px,
    #fff -1px -1px 1px;
  background: linear-gradient(to bottom, transparent, #ceffe7, transparent);
}
.overlay.danger {
  color: #eb7a00;
  text-shadow: #fff 1px 1px 1px, #fff -1px 1px 1px, #fff 1px -1px 1px,
    #fff -1px -1px 1px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgb(251 235 213),
    transparent
  );
}
</style>
