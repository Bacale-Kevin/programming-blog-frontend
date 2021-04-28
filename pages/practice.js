import { useState } from "react";

const practice = () => {
  const [message, setMessage] = useState("");

  const handleClick = () => {
      setMessage("You clicked me! : )")
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };
  return (
    <div>
      <button onClick={handleClick}>Click Me</button>
      {message}
    </div>
  );
};

export default practice;
