import "./GameStats.less";

interface GameStatsProps {
  level: number;
  score: number;
  lines: number;
}

export function GameStats({ level, score, lines }: GameStatsProps) {
  return (
    <div className="game-stats">
      <div className="stats-value">
        <b>{score}</b>
        <span>Score</span>
      </div>
      <div className="stats-value">
        <b>{level}</b>
        <span>Level</span>
      </div>
      <div className="stats-value">
        <b>{lines}</b>
        <span>Lines</span>
      </div>
    </div>
  );
}
