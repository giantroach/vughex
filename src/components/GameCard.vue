<template>
  <div class="container">
    <template v-if="!prioritizeMini || !miniDef">
      <div
        :id="'card-' + id"
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
        :id="'card-mini-' + id"
        class="card card-mini"
        :class="{
          ghost: ghost,
        }"
        v-bind:style="{
          width: miniDef.size.width,
          height: miniDef.size.height,
          backgroundImage: 'url(' + urlBase.value + miniDef.image + ')',
          borderRadius: miniDef.size.radius,
          backgroundPosition: bgPosMini,
        }"
        @click="[showDetails($event), selectCard($event)]"
        v-on:mouseenter="showDetails"
        v-on:mouseout="mouseOutFromMini"
        v-on:touchstart="showDetails"
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
      v-on:mouseout="mouseOutFromDetail"
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

    <Modal
      v-if="detailPos === 'center'"
      @hide-modal="mouseOutFromDetail"
      :backdrop="false"
    ></Modal>
  </teleport>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Ref } from "vue";
import { watch } from "vue";
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
    ghost: Boolean,
    detailPos: String,
  },
  inject: ["urlBase", "cardDef"],
  emits: ["selectCard", "showDetail", "hideDetail"],
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
  public ghost!: boolean;
  public detailPos!: "center" | "right";

  public modal = false;
  public modalTop = 0;
  public modalLeft = 0;

  public id!: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public cardDef!: any;
  public urlBase!: Ref<string>;
  public bgPos = "0 0";
  public bgPosMini = "0 0";
  public onlyMini = false;

  // tweaks related to show details
  public disableShowDetailsUntilMouseOut = false;
  public lastTimeHideDetails = 0;

  public created(): void {
    this.updateDef();
    watch(this.getID, () => {
      this.updateDef();
    });
  }

  public getID(): string {
    return this.id;
  }

  public updateDef() {
    const ids = /([^\d]+)(\d+)/.exec(this.id);
    if (!ids) {
      return;
    }

    const cat = ids[1];
    const idx = Number(ids[2]);
    const def = this.cardDef[cat];
    if (!def) {
      throw "no card definition found: " + this.id;
    }
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
    this.onlyMini = def.details?.[idx]?.onlyMini || false;
  }

  public showDetails(evt: MouseEvent) {
    if (this.onlyMini) {
      return;
    }
    if (this.disableShowDetailsUntilMouseOut) {
      return;
    }
    if (
      this.lastTimeHideDetails &&
      Number(new Date()) - this.lastTimeHideDetails < 10
    ) {
      this.disableShowDetailsUntilMouseOut = true;
      return;
    }

    const elm = evt.srcElement as HTMLElement;
    const rect = elm.getBoundingClientRect();

    // find center coordinate
    const centerY = rect.top + rect.height / 2;
    let centerX = 0;
    if (this.detailPos === "right") {
      // *2 because it is center
      centerX = rect.right + window.scrollX + rect.width * 2;
    } else {
      centerX = rect.left + window.scrollX + rect.width / 2;
    }
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

      this.$emit("showDetail", this.id);
    });
  }

  private getBgPos(sprite: string, size: SizeDef, idx: number): string {
    const sm = /^(\d+)x(\d+)/g.exec(sprite);
    const wm = /^([\d.]+)(.*)/g.exec(size.width);
    const hm = /^([\d.]+)(.*)/g.exec(size.height);
    if (!sm || !wm || !hm) {
      return "0 0";
    }
    const colNum = Number(sm[1]);
    const y = Math.floor(idx / colNum);
    const x = idx % colNum;
    return `-${x * Number(wm[1])}${wm[2]} -${y * Number(hm[1])}${hm[2]}`;
  }

  public selectCard(): void {
    this.hideDetails();
    this.lastTimeHideDetails = Number(new Date());
    if (!this.selectable) {
      return;
    }
    this.$emit("selectCard", this.id);
  }

  public unselectCard() {
    this.selected = false;
  }

  public mouseOutFromMini() {
    if (this.detailPos === "right") {
      this.hideDetails();
    }
    this.disableShowDetailsUntilMouseOut = false;
  }

  public mouseOutFromDetail() {
    if (this.detailPos === "right") {
      return; // ignore
    }
    this.hideDetails();
  }

  public hideDetails() {
    this.modal = false;
    this.$emit("hideDetail", this.id);
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
/* those opacity stuff does not work with detailPos: right */
.card-modal {
  /* opacity: 0; */
  transition: opacity 0.4s;
  position: fixed;
  z-index: 1000;
}
/* .card-modal:hover { */
/*   opacity: 1; */
/* } */
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
  border: 2px solid #00e9eb;
  box-shadow: 0 0 5px 2px #05fdff;
}
.selected {
  border: 2px solid #fffc00;
  box-shadow: 0 0 5px 2px #ffb644;
}
.ghost {
  opacity: 0.67;
}
</style>
