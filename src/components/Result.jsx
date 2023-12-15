export default function Result({ score, maxPossiblePoints }) {
  console.log("score,maxPossiblePoints :>> ", score, maxPossiblePoints);
  const percentage = Math.ceil((score / maxPossiblePoints) * 100);
  const emoji = percentage >= 50 ? "🟢" : "🔴";
  return (
    <p className="result">
      <span>{emoji}</span> You scored <strong>{score}</strong> out of{" "}
      {maxPossiblePoints} ({percentage}%)
    </p>
  );
}
