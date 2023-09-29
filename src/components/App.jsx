import { useEffect } from "react";
import { useReducer } from "react";
import Button from "./Button";
import Loader from "./Loader";
import Error from "./Error";
import Header from "./Header";
import Question from "./Question";
import Progress from "./Progress";
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, status: "loading" };
    case "error":
      return { ...state, error: action.payload, status: "error" };
    case "questionsFetched":
      return { ...state, questions: action.payload, status: "ready" };
    case "start":
      return { ...state, status: "start" };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "answer":
      if (state.questions[state.index].correctOption !== action.payload)
        return { ...state, answer: action.payload };
      return {
        ...state,
        answer: action.payload,
        score: state.score + state.questions[state.index].points,
      };
    default:
      throw new Error("Error occured.");
  }
}
const initialState = {
  questions: [],
  index: 0,
  error: null,
  answer: null,
  score: 0,
  highScore: 0,
  status: "ready",
  //start - ready - loading - error -start- finished
};
const url = "http://localhost:3000/questions";
export default function App() {
  const [
    { questions, index, status, error, answer, score, highScore },
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
      {status === "ready" && (
        <Button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "start" })}
        >
          start
        </Button>
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
          {index < numOfQuestions - 1 ? (
            <Button onClick={() => dispatch({ type: "nextQuestion" })}>
              Next
            </Button>
          ) : (
            <Button>Finish</Button>
          )}
        </>
      )}
      {status === "loading" && <Loader />}
      {status === "error" && <Error error={error} />}
    </div>
  );
}
