import "./GameStats.less";

interface GameStatsProps {
  level: number;
  score: number;
}

export function GameStats({ level, score }: GameStatsProps) {
  return (
    <div className="game-stats">
      <div className="stats-value">
        <b>{level}</b>
        <span>Level</span>
      </div>
      <div className="stats-value">
        <b>{score}</b>
        <span>Score</span>
      </div>
    </div>
  );
}
