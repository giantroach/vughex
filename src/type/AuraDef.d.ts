type AuraType = "selectable1" | "selectable2" | "selected";

interface AuraDef {
  background: string;
  border: string;
  anime?: string;
  zIndex?: number,
}

export { AuraType, AuraDef };
