import { useState } from "react";
import { CircleFadingPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

function App() {
  const [count, setCount] = useState(0);
  const title = "Hello World";

  return (
    <>
      <h1>Counter App : {title}</h1>
      <h3>Count: {count}</h3>
      <Button
        className="bg-blue-500 hover:bg-amber-500"
        onClick={() => {
          setCount((prev) => prev + 1);
        }}
      >
        Increase <CircleFadingPlus />
      </Button>
      <Button
        onClick={() => {
          setCount(count - 1);
        }}
      >
        Decrease -
      </Button>
    </>
  );
}

export default App;
