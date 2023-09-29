export default function Button({ children, onClick }) {
  return (
    <button className="btn btn-ui" onClick={onClick}>
      {children}
    </button>
  );
}
