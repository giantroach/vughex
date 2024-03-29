<template>
  <ul class="hand">
    <li
      class="aura"
      v-for="(c, idx) in cardIDs"
      :key="c.cid"
      v-bind:style="{
        width: size.width,
        borderRadius: size.radius,
        zIndex: idx,
      }"
      :class="{
        selectable: isSelectable(idx),
        selected: isSelected(idx),
        focued: cardIDs.length > 1 && focused[idx],
      }"
      @click="selectHand(idx)"
    >
      <Aura
        :active="animation.value && (isSelectable(idx) || isSelected(idx))"
        :type="!isSelected(idx) ? 'selectable' : 'selected'"
        :radius="size.radius"
      ></Aura>
      <GameCard
        :id="c.cid"
        :prioritizeMini="true"
        :selectable="isSelectable(idx)"
        :selected="isSelected(idx)"
        :detailPos="'center'"
        :meta="c.meta"
        @selectCard="selectHand(idx)"
        @showDetail="showDetail(idx)"
        @hideDetail="hideDetail()"
        ref="cardRef"
      >
      </GameCard>
    </li>
  </ul>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Ref } from "vue";
import { CardID } from "../type/Hand.d";
import { HandDef, SizeDef } from "../type/HandDef.d";
import { CardDef } from "../type/CardDef.d";
import GameCard from "./GameCard.vue";
import Aura from "./Aura.vue";

@Options({
  components: {
    GameCard,
    Aura,
  },
  props: {
    type: String,
    cardIDs: Array,
    selectable: Array,
    selected: Array,
    exclusiveSelect: Boolean,
    active: Boolean,
  },
  inject: ["cardDef", "handDef", "animation"],
  emits: ["selectHand"],
})
export default class Hand extends Vue {
  public handDef!: { [handType: string]: HandDef };
  public type!: string; // card type
  public cardIDs!: CardID[];
  public selectable!: boolean[];
  public selected!: boolean[];
  public exclusiveSelect = true;
  public focused: boolean[] = [];
  public active!: boolean;
  public size!: SizeDef;
  public cardDef!: { [cardType: string]: CardDef };
  public animation!: Ref<boolean>;

  public created() {
    const def = this.handDef[this.type];
    this.size = def.size;
  }

  public isSelectable(idx: number): boolean {
    if (!this.active) {
      return false;
    }
    return this.selectable && this.selectable[idx] ? true : false;
  }

  public isSelected(idx: number): boolean {
    if (!this.active) {
      return false;
    }
    return this.selected && this.selected[idx] ? true : false;
  }

  public showDetail(idx: number): void {
    this.focused = [];
    this.focused[idx] = true; // focus is always only one.
  }

  public hideDetail(): void {
    this.focused = [];
  }

  public selectExcept(idx: number): void {
    this.selected.forEach((s, i) => {
      if (i === idx) {
        return;
      }
      this.selected[i] = false;
    });
  }

  public selectHand(idx: number): void {
    if (!this.isSelectable(idx)) {
      return;
    }

    this.selected[idx] = !this.selected[idx];
    if (this.selected[idx]) {
      if (this.exclusiveSelect) {
        this.selectExcept(idx);
      }
      this.$emit("selectHand", idx);
    }
  }
}
</script>

<style scoped lang="scss">
ul {
  padding: 0;
}
ul.hand {
  display: flex;
  justify-content: center;
}
li {
  list-style-type: none;
  margin-left: -10px;
  margin-right: -10px;
  transition: margin-left 0.5s;
  transition: margin-right 0.5s;
  border: 2px solid transparent;
}
.selectable {
  border: 2px solid #00e9eb;
  box-shadow: 0 0 5px 5px rgb(0 233 235 / 50%);
}
.selected {
  border: 2px solid #fffc00;
  box-shadow: 0 0 5px 5px rgb(255 252 0 / 50%);
}
.focued {
  margin-left: 30px;
  margin-right: 30px;
  transition: margin-left 0.5s;
  transition: margin-right 0.5s;
}

.aura {
  transition: 0.2s;
  position: relative;
}
</style>
