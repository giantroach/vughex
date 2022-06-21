import { CardDef } from "../type/CardDef.d";

export const cardDefs: { [cardType: string]: CardDef } = {
  mainCard: {
    image: require("@/assets/cardset.png"),
    sprite: "8x2",
    size: { width: "276px", height: "390px", radius: "20px" },
    textDef: {
      offsetY: "50%",
      padding: "24px",
    },
    details: {
      0: {
        name: "the Oracle",
        text: "[Placement] Choose a unit already placed in this lane. Disable stealth and [Combat] ability from the unit.",
        power: {
          fixed: 2,
          center: 1,
        },
        onPlay: "TargetSameLane:Silence",
        stealth: false,
      },
      1: {
        name: "the Reincarnation",
        text: "[Placement] Discard a non-stealth unit in this lane. The owner draws a unit card from the pile and immediately places it on the same lane.",
        power: {
          fixed: 1,
          center: 1,
        },
        onPlay: "TargetNonStealthSameLane:Reincanate",
        stealth: false,
      },
      2: {
        name: "the Justice",
        text: "[Combat] Increases ◆ in this lane by 1.",
        power: {
          fixed: 0,
          center: 2,
        },
        onResolution: "IncleaseCenterBy1",
        stealth: false,
      },
      3: {
        name: "the Evil",
        text: "[Combat] Receive 1 damage if you lose in this lane.",
        power: {
          fixed: 0,
          center: 3,
        },
        onResolution: "Receive1OnLose",
        stealth: false,
      },
      4: {
        name: "the Unstable",
        text: "[Combat] Power of this unit becomes 15 if ◆ in this lane is either 6+ or 0-.",
        power: {
          fixed: 0,
          center: 1,
        },
        onResolution: "Becomes15OnCenter0or6",
        stealth: false,
      },
      5: {
        name: "the Watcher",
        text: "[Placement] Choose and disable stealth from a unit (regardless of the lane).",
        power: {
          fixed: 3,
          center: 1,
        },
        onPlay: "TargeAnytStealth:Reveal",
        stealth: false,
      },
      6: {
        name: "the Crowd",
        text: "None.",
        power: {
          fixed: 4,
          center: 1,
        },
        stealth: false,
      },
      7: {
        name: "the Maze",
        text: "[Placement] Choose a stealth unit in this lane. Move it to another lane.",
        power: {
          fixed: 4,
          center: 0,
        },
        onPlay: "TargetSameLaneToAnother:Maze",
        stealth: false,
      },
      8: {
        name: "the Plague",
        text: "[Combat] Change ◆ in this lane to 0. (Apply this before any other abilities)",
        power: {
          fixed: 3,
          center: 0,
        },
        stealth: true,
      },
      9: {
        name: "the Titan",
        text: "[Combat] The lower power wins in this lane. (Unless the combat is tied by the Eclipseʼs ability).",
        power: {
          fixed: 7,
          center: 0,
        },
        stealth: true,
      },
      10: {
        name: "the Eclipse",
        text: "[Combat] Ties the Combat in this lane if the power gap is 4+. (Prior to the Titan).",
        power: {
          fixed: 0,
          center: 1,
        },
        stealth: true,
      },
      11: {
        name: "the Agent",
        text: "[Combat] Deals 1 damage to the opponent if you win this lane.",
        power: {
          fixed: 2,
          center: 0,
        },
        stealth: true,
      },
      12: {
        name: "the Shadow",
        text: "[Combat] Reduces ◆ in this lane by 2.",
        power: {
          fixed: 5,
          center: 0,
        },
        stealth: true,
      },
      13: {
        name: "the Creeps",
        text: "None",
        power: {
          fixed: 1,
          center: 0,
        },
        stealth: true,
      },
      14: {
        name: "the Creeps",
        text: "None",
        power: {
          fixed: 1,
          center: 0,
        },
        stealth: true,
      },
    },
    miniDef: {
      image: require("@/assets/cardset-mini.png"),
      sprite: "8x3",
      size: { width: "138px", height: "120px", radius: "10px" },
    },
  },
  centerCard: {
    image: require("@/assets/centerset.png"),
    sprite: "6x3",
    size: { width: "138px", height: "120px", radius: "10px" },
  },
};
