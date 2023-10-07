import { useEffect } from "react";
import { useReducer } from "react";
import Button from "./Button";
import Loader from "./Loader";
import Error from "./Error";
import Header from "./Header";
import Question from "./Question";
import Progress from "./Progress";
import Main from "./Main";
import Landing from "./Landing";
import Result from "./Result";
import HighScore from "./HighScore";
import Timer from "./Timer";

const initialState = {
  questions: [],
  index: 0,
  error: null,
  answer: null,
  score: 0,
  highScore: 0,
  time: null,
  status: "ready",
  //start - ready - loading - error - finished
};
const url = "http://localhost:3000/questions";
const SEC_PER_QUESTION = 30;
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        highScore: JSON.parse(localStorage.getItem("highScore")),
        status: "loading",
      };
    case "error":
      return { ...state, error: action.payload, status: "error" };
    case "questionsFetched":
      return { ...state, questions: action.payload, status: "ready" };
    case "start":
      return {
        ...state,
        status: "start",
        time: SEC_PER_QUESTION * state.questions.length,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "answer": {
      const question = state.questions[state.index];

      return {
        ...state,
        answer: action.payload,
        score:
          question.correctOption === action.payload
            ? state.score + question.points
            : state.score,
      };
    }
    case "finish":
      localStorage.setItem(
        "highScore",
        JSON.stringify(Math.max(state.highScore, state.score))
      );
      return {
        ...state,
        highScore: Math.max(state.highScore, state.score),
        status: "finished",
      };
    case "tick":
      return {
        ...state,
        time: state.time - 1,
        status: state.time > 0 ? state.status : "finished",
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        highScore: state.highScore,

        status: "ready",
      };
    default:
      throw new Error("Error occured.");
  }
}

export default function App() {
  const [
    { questions, index, status, error, answer, score, highScore, time },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numOfQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (acc, curQuestion) => acc + curQuestion.points,
    0
  );
  console.log(maxPossiblePoints);

  useEffect(function () {
    async function getQuestions() {
      try {
        dispatch({ type: "loading" });
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("cant fetch questions.");

        const data = await resp.json();
        if (!data || data.length < 1) throw new Error("No questions found.");

        dispatch({ type: "questionsFetched", payload: data });
      } catch (error) {
        console.error("error❌❌ :>> ", error);
        dispatch({ type: "error", payload: error });
      }
    }
    getQuestions();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "ready" && (
          <Landing dispatch={dispatch} numOfQuestions={numOfQuestions} />
        )}

        {status === "start" && (
          <>
            <Progress
              numOfQuestions={numOfQuestions}
              index={index}
              score={score}
              maxPossiblePoints={maxPossiblePoints}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Timer dispatch={dispatch} time={time} />
            {index < numOfQuestions - 1 ? (
              <Button onClick={() => dispatch({ type: "nextQuestion" })}>
                Next
              </Button>
            ) : (
              <Button
                onClick={() => {
                  dispatch({ type: "finish" });
                }}
              >
                Finish
              </Button>
            )}
          </>
        )}
        {status === "finished" && (
          <>
            <Result maxPossiblePoints={maxPossiblePoints} score={score} />
            <HighScore highscore={highScore} />
            <Button onClick={() => dispatch({ type: "restart" })}>Retry</Button>
          </>
        )}
        {status === "loading" && <Loader />}
        {status === "error" && <Error error={error} />}
      </Main>
    </div>
  );
}
