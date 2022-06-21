interface SizeDef {
  width: string;
  height: string;
  radius: string;
}

interface TextLayoutDef {
  offsetY: string;
  offsetX?: string;
  padding: string;
}

type OnPlay =
  | "TargetSameLane:Silence"
  | "TargetNonStealthSameLane:Reincanate"
  | "TargeAnytStealth:Reveal"
  | "TargetSameLaneToAnother:Maze";
type OnResolution =
  | "IncleaseCenterBy1"
  | "Receive1OnLose"
  | "Becomes15OnCenter0or6"
  | "ChangeCenterTo0"
  | "LowerWins"
  | "TiesOn4+"
  | "Deal1OnWin"
  | "ReducesCenterBy2";

interface CardDetail {
  name: string;
  text: string;
  power: {
    fixed: number;
    center: 0 | 1 | 2 | 3;
  };
  onPlay?: OnPlay;
  onResolution?: OnResolution;
  stealth: boolean;
}

interface CardDef {
  image: string;
  sprite: string;
  size: SizeDef;
  textDef?: TextLayoutDef;
  details?: {
    [id: number]: CardDetail;
  };
  miniDef?: {
    image: string;
    sprite: string;
    size: SizeDef;
  };
}

export { SizeDef, TextLayoutDef, CardDetail, CardDef };
