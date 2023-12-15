import { useEffect } from "react";
const SEC_PER_MIN = 60;
export default function Timer({ dispatch, time }) {
  const minutes = Math.floor(time / SEC_PER_MIN);
  const seconds = time % SEC_PER_MIN;
  function formatTime(unFormedTime) {
    return unFormedTime < 10 ? `0${unFormedTime}` : unFormedTime;
  }

  useEffect(
    function () {
      const intervalId = setInterval(() => {
        dispatch({ type: "tick" });
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    },
    [dispatch]
  );
  return (
    <div className="timer">
      {formatTime(minutes)}:{formatTime(seconds)}
    </div>
  );
}
