import React from "react";

export default function Progress({
  numOfQuestions,
  index,
  score,
  maxPossiblePoints,
}) {
  return (
    <header className="progress">
      <progress max={numOfQuestions} value={index} />
      <p>
        Question <strong>{index + 1}</strong> / {numOfQuestions}
      </p>

      <p>
        <strong>{score}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
}
