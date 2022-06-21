<template>
  <div
    class="overlay"
    v-on:mouseover="hideModal"
    :class="{ backdrop: backdrop }"
  ></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    backdrop: Boolean,
  },
  emits: ["hideModal"],
})
export default class Modal extends Vue {
  public backdrop!: boolean;
  public hideModal(): void {
    this.$emit("hideModal", { aaa: "bbb" });
  }
}
</script>

<style scoped lang="scss">
.overlay {
  z-index: 1;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}
.backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
