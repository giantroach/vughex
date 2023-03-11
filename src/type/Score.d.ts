type ScoreResult = "win" | "lose" | "tie";

interface ScoreData {
  centerScore: string[];
  oppoScore: string[];
  myScore: string[];
  result?: ScoreResult[];
}

export { ScoreData, ScoreResult };
