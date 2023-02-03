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
    @click="btnClick()"
    >{{ i18n(def.label) }}
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

@Options({
  components: {},
  props: {
    active: Boolean,
    type: String,
    display: Boolean,
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

<style scoped lang="scss"></style>
