<template>
  <template v-if="active">
    <div
      class="before"
      :class="{
        holizontal: auraDef[type].anime === 'holizontal',
        verticalMini: auraDef[type].anime === 'verticalMini',
      }"
      v-bind:style="{
        borderRadius: radius,
        background: auraDef[type].background,
        border: auraDef[type].border,
      }"
    ></div>
    <div
      class="after"
      :class="{
        holizontal: auraDef[type].anime === 'holizontal',
        verticalMini: auraDef[type].anime === 'verticalMini',
      }"
      v-bind:style="{
        borderRadius: radius,
        background: auraDef[type].background,
        border: auraDef[type].border,
        zIndex: auraDef[type].zIndex || -10,
      }"
    ></div>
    <template v-if="auraDef[type].base">
      <div
        class="base"
        v-bind:style="{
          borderRadius: radius,
          background: auraDef[type].base,
          border: auraDef[type].border,
          zIndex: auraDef[type].zIndex || -10,
        }"
      ></div>
    </template>
  </template>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { AuraDef } from "../type/AuraDef.d";

@Options({
  props: {
    type: String,
    radius: String,
    active: Boolean,
  },
  inject: ["auraDef"],
})
export default class Hand extends Vue {
  public auraDef!: { [auraType: string]: AuraDef };
  public type!: string; // card type
  public radius!: string;
  public active!: boolean;
}
</script>

<style scoped lang="scss">
@keyframes anime {
  0% {
    transform: scale(0.95);
    opacity: 1;
  }
  90% {
    opacity: 0.3;
  }
  to {
    transform: scale(1.2);
    opacity: 0;
  }
}
@keyframes animeHolizontal {
  0% {
    transform: scale(0.95);
    opacity: 1;
  }
  90% {
    opacity: 0.3;
  }
  to {
    transform: scale(1.2, 1.8);
    opacity: 0;
  }
}
@keyframes animeVerticalMini {
  0% {
    transform: scale(0.95);
    opacity: 1;
  }
  90% {
    opacity: 0.3;
  }
  to {
    transform: scale(1.3, 1.1);
    opacity: 0;
  }
}
.before,
.after {
  position: absolute;
  z-index: -10;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transform: translate3d(0, 0, 0);
  box-sizing: border-box;
}
.base {
  position: absolute;
  z-index: -9;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  box-sizing: border-box;
  border-width: 4px;
}
.before {
  animation: anime 2s ease-out infinite;
}
.after {
  animation: anime 2s ease-out 1s infinite;
}
.before.holizontal {
  animation: animeHolizontal 2s ease-out infinite;
}
.after.holizontal {
  animation: animeHolizontal 2s ease-out 1s infinite;
}
.before.verticalMini {
  animation: animeVerticalMini 2s ease-out infinite;
}
.after.verticalMini {
  animation: animeVerticalMini 2s ease-out 1s infinite;
}
</style>
