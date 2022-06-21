<template>
  <div class="container">
    <template v-if="!prioritizeMini || !miniDef">
      <div
        class="card"
        v-bind:style="{
          width: size.width,
          height: size.height,
          backgroundImage: 'url(' + urlBase.value + image + ')',
          borderRadius: size.radius,
          backgroundPosition: bgPos,
        }"
        @click="selectCard"
      >
        <div v-if="text" class="container-text">
          <div
            class="text"
            v-if="text"
            v-bind:style="{
              top: textDef.offsetY,
              borderWidth: textDef.padding || 0,
            }"
          >
            {{ text }}
          </div>
        </div>
      </div>
    </template>

    <template v-if="miniDef && prioritizeMini">
      <div
        class="card card-mini"
        v-bind:style="{
          width: miniDef.size.width,
          height: miniDef.size.height,
          backgroundImage: 'url(' + urlBase.value + miniDef.image + ')',
          borderRadius: miniDef.size.radius,
          backgroundPosition: bgPosMini,
        }"
        @click="[showDetails($event), selectCard($event)]"
        v-on:mouseover="showDetails"
      ></div>
    </template>
  </div>

  <teleport to="#modals" v-if="modal">
    <div
      :id="'card-modal-' + id"
      class="card card-modal"
      :class="{
        selectable: !selected && selectable,
        selected: selected,
      }"
      v-bind:style="{
        width: size.width,
        height: size.height,
        top: modalTop + 'px',
        left: modalLeft + 'px',
        backgroundImage: 'url(' + urlBase.value + image + ')',
        borderRadius: size.radius,
        backgroundPosition: bgPos,
      }"
      @click="selectCard"
    >
      <div v-if="text" class="container-text">
        <div
          class="text"
          v-if="text"
          v-bind:style="{
            top: textDef.offsetY,
            borderWidth: textDef.padding || 0,
          }"
        >
          {{ text }}
        </div>
      </div>
    </div>

    <Modal @hide-modal="hideDetails" :backdrop="false"></Modal>
  </teleport>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Ref } from "vue";
import Modal from "./Modal.vue";
import { SizeDef } from "../type/CardDef.d";

export interface Size {
  // xRatio: number;
  // yRatio: number;
  width: string;
  height: string;
}

@Options({
  components: {
    Modal,
  },
  props: {
    id: String,
    prioritizeMini: Boolean,
    selectable: Boolean, // for card detail modal
    selected: Boolean, // for card detail modal
  },
  inject: ["urlBase", "cardDef"],
  emits: ["selectCard"],
})
export default class GameCard extends Vue {
  public name!: string;
  public image!: string;
  public size!: {
    width: number;
    height: number;
  };
  public textDef!: {
    offsetY: number;
    padding: number;
  };
  public text!: string;
  public prioritizeMini!: boolean;
  public miniDef!: {
    image: string;
    size: {
      width: number;
      height: number;
    };
  };
  public selected!: boolean;
  public selectable!: boolean;

  public modal = false;
  public modalTop = 0;
  public modalLeft = 0;

  public id!: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public cardDef!: any;
  public urlBase!: Ref<string>;
  public bgPos = "0 0";
  public bgPosMini = "0 0";

  public created(): void {
    const ids = /(.+)(\d+)/.exec(this.id);
    if (!ids) {
      return;
    }
    const cat = ids[1];
    const idx = Number(ids[2]);
    const def = this.cardDef[cat];
    this.text = def.details?.[idx]?.text || "";
    this.image = def.image;
    this.size = def.size;
    this.textDef = def.textDef;
    this.miniDef = def.miniDef;
    this.bgPos = this.getBgPos(def.sprite, def.size, idx);
    if (!def.miniDef) {
      return;
    }
    this.bgPosMini = this.getBgPos(def.miniDef.sprite, def.miniDef.size, idx);
  }

  public showDetails(evt: MouseEvent) {
    const elm = evt.srcElement as HTMLElement;
    const rect = elm.getBoundingClientRect();

    // find center coordinate
    const centerY = rect.top + rect.height / 2;
    const centerX = rect.left + rect.width / 2;
    this.modal = true;

    setTimeout(() => {
      // wait for render
      const mcElm = document.querySelector("#card-modal-" + this.id);
      const body = document.body;
      if (!mcElm) {
        return;
      }
      const mcRect = mcElm.getBoundingClientRect();
      let mcTop = centerY - mcRect.height / 2;
      let mcLeft = centerX - mcRect.width / 2;
      const bdRect = body.getBoundingClientRect();
      if (mcTop + mcRect.height > bdRect.height) {
        mcTop = bdRect.height - mcRect.height;
      }
      if (mcLeft + mcRect.width > bdRect.width) {
        mcLeft = bdRect.width - mcRect.width;
      }
      this.modalTop = mcTop > 0 ? mcTop : 0;
      this.modalLeft = mcLeft > 0 ? mcLeft : 0;
    });
  }

  private getBgPos(sprite: string, size: SizeDef, idx: number): string {
    const sm = /^(\d+)x(\d+)/g.exec(sprite);
    const wm = /^(\d+)(.*)/g.exec(size.width);
    const hm = /^(\d+)(.*)/g.exec(size.height);
    if (!sm || !wm || !hm) {
      return "0 0";
    }
    const colNum = Number(sm[1]);
    const y = Math.floor(idx / colNum);
    const x = idx % Number(colNum);
    return `-${x * Number(wm[1])}${wm[2]} -${y * Number(hm[1])}${hm[2]}`;
  }

  public selectCard(): void {
    // this.hideDetails();
    if (!this.selectable) {
      return;
    }
    this.$emit("selectCard", this.id);
  }

  public unselectCard() {
    // this.hideDetails();
    this.selected = false;
  }

  public hideDetails() {
    this.modal = false;
  }
}
</script>

<style scoped lang="scss">
.container {
  position: relative;
}
.card {
  position: relative;
  box-shadow: 0 5px 5px 5px rgb(0 0 0 / 30%);
}
.card-modal {
  opacity: 0;
  transition: opacity 0.4s;
  position: absolute;
  z-index: 2;
}
.card-modal:hover {
  opacity: 1;
}
.container-text,
.text {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: 0px solid transparent;
  overflow-y: auto;
  text-align: left;
}
.title {
  position: absolute;
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
