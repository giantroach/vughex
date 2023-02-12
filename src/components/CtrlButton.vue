<template>
  <Button
    v-bind:style="{
      width: size.width,
      height: size.height,
      borderRadius: size.radius,
      color: def.textColor,
      background: def.background,
      border: def.border,
      cursor: active ? 'pointer' : '',
      display: display ? 'initial' : 'none',
    }"
    :class="{
      selectable: active,
    }"
    class="aura"
    @click="btnClick()"
  >
    <Aura :active="true" :type="auraType" :radius="size.radius"></Aura>
    {{ i18n(def.label) }}
  </Button>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Ref } from "vue";
import {
  ButtonType,
  ButtonSizeDef,
  CtrlButtonDef,
} from "../type/CtrlButtonDef.d";
import Aura from "./Aura.vue";

@Options({
  components: {
    Aura,
  },
  props: {
    active: Boolean,
    type: String,
    display: Boolean,
    auraType: String,
  },
  inject: ["ctrlButtonDef", "i18n"],
  emits: ["btnClick"],
})
export default class CtrlButton extends Vue {
  // injected
  public ctrlButtonDef!: { [buttonType in ButtonType]: CtrlButtonDef };
  // props
  public active!: boolean;
  public display!: boolean;
  public type!: ButtonType;
  public auraType!: string;
  // etc
  public def!: CtrlButtonDef;
  public size!: ButtonSizeDef;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public i18n!: Ref<any>;

  public created() {
    this.def = this.ctrlButtonDef[this.type];
    this.size = this.def.size;
  }

  public btnClick(): void {
    if (!this.active) {
      return;
    }

    this.$emit("btnClick");
  }
}
</script>

<style scoped lang="scss">
.aura {
  transition: 0.2s;
  position: relative;
}
</style>
