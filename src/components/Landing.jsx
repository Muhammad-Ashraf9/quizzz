import Button from "./Button";

export default function Landing({ dispatch, numOfQuestions }) {
  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numOfQuestions} questions to test your React mastery</h3>
      <Button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let&rsquo;s start
      </Button>
    </div>
  );
}
