import { useState } from "react";

export default function Board() {
  // déclaration d'une variable d'état nommée squares qui contient par défaut un tableau de 9 null correspondant aux neuf cases. Array(9).fill(null) crée un tableau de neuf éléments puis les définit tous à null. L'appel useState() qui l'enrobe déclare une variable d'état squares qui vaut initialement ce tableau.
  const [squares, setSquares] = useState(Array(9).fill(null));

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]}/>
        <Square value={squares[1]}/>
        <Square value={squares[2]}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]}/>
        <Square value={squares[4]}/>
        <Square value={squares[5]}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]}/>
        <Square value={squares[7]}/>
        <Square value={squares[8]}/>
      </div>
    </>
  );
}

function Square({value}) {
  // value stock la valeur et setValue est une fonction qu'on peut utiliser pour modifier la valeur. Le null passé à useState est utilisé comme valeur initiale de la variable d'état, de sorte que value démarre ici à null.
  // const [value, setValue] = useState(null);

  // function handleClick() {
  //   setValue("X");
  // }

  return <button className="square">{value}</button>;
}