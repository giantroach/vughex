<template>
  <ul class="hand">
    <li
      v-for="(cid, idx) in cardIDs"
      :key="cid"
      v-bind:style="{
        width: size.width,
        borderRadius: size.radius,
        margin: margin,
      }"
      :class="{
        selectable: isSelectable(idx),
        selected: isSelected(idx),
      }"
      @click="selectHand(idx)"
    >
      <GameCard
        :id="cid"
        :prioritizeMini="true"
        :selectable="isSelectable(idx)"
        :selected="isSelected(idx)"
        @selectCard="selectHand(idx)"
        ref="cardRef"
      >
      </GameCard>
    </li>
  </ul>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { HandDef, SizeDef } from "../type/HandDef.d";
import { CardDef } from "../type/CardDef.d";
import GameCard from "./GameCard.vue";

@Options({
  components: {
    GameCard,
  },
  props: {
    type: String,
    cardIDs: Array,
    selectable: Array,
    selected: Array,
    exclusiveSelect: Boolean,
    active: Boolean,
  },
  inject: ["cardDef", "handDef"],
  emits: ["selectHand"],
})
export default class Hand extends Vue {
  public handDef!: { [handType: string]: HandDef };
  public type!: string; // card type
  public cardIDs!: number[];
  public selectable!: boolean[];
  public selected!: boolean[];
  public exclusiveSelect = true;
  public active!: boolean;
  public size!: SizeDef;
  public cardDef!: { [cardType: string]: CardDef };

  public created() {
    const def = this.handDef[this.type];
    this.size = def.size;
    console.log("def", def);
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

  // public selectCard(cid: string) {
  //   if (!this.exclusiveSelect) {
  //     return;
  //   }
  //   console.log("this.$refs", this.$refs);
  //   // deselect all the other
  //   (this.$refs.cardRef as GameCard[]).forEach((cr: GameCard) => {
  //     if (cr.id === cid) {
  //       return;
  //     }
  //     cr.unselectCard();
  //   });
  // }

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
}
.selectable {
  border: 2px solid #05fdff;
  box-shadow: 0 0 5px 2px #05fdff;
}
.selected {
  border: 2px solid #fefb05;
  box-shadow: 0 0 5px 2px #fefb05;
}
</style>
