import { useState } from "react";
import "./App.css";
// JSX

const header = <h1>I'm Header!!</h1>;

interface TitleProps {
  title: string;
  body?: string;
}

function Title({ title, body = "I'm body" }: TitleProps) {
  return (
    <>
      <p>{title}</p>
      <div>{body}</div>
    </>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {header}
      <Title title="Fullstack Developer" />
      <Title title="Node JS Developer" body="Still learning" />
      <h1 style={{ color: "white", backgroundColor: "blue" }}>
        Hello FutureLink
      </h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
