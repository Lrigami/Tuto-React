import { useState } from "react";

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}

function Square() {
  // value stock la valeur et setValue est une fonction qu'on peut utiliser pour modifier la valeur. Le null passé à useState est utilisé comme valeur initiale de la variable d'état, de sorte que value démarre ici à null.
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue("X");
  }

  return <button className="square" onClick={handleClick}>{value}</button>;
}