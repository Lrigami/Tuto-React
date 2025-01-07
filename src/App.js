import { useState } from "react";

export default function Board() {
  // déclaration d'une variable d'état nommée squares qui contient par défaut un tableau de 9 null correspondant aux neuf cases. Array(9).fill(null) crée un tableau de neuf éléments puis les définit tous à null. L'appel useState() qui l'enrobe déclare une variable d'état squares qui vaut initialement ce tableau.
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice(); // Crée une copie du tableau squares (nextSquares) grâce à slice()
    nextSquares[i] = "X"; // met à jour le tableau nextSquares pour ajouter un X à la première case (index [0])
    setSquares(nextSquares); // On appelle alors la fonction setSquares pour avertir React que l'état du composant a changé. Cela déclenchera un nouvel affichage des composants qui utilisent l'état squares (donc Board), ainsi que de tous leurs comportants enfants (les composants Square qui consituent le plateau);
  }

  // Remarque : JavaScript utilise des fermetures lexicales, ce qui signifie qu'une fonction imbriquée (ex. handleClick) a accès aux variables et fonctions définies dans une fonction englobante (ex. Board). La fonction handleClick peut lire l'état squares et appeler la fonction setSquares parce que les deux sont définis dans la fonction Board.

  return (
    <>
      <div className="board-row">
        {/* Ici, () => handleClick(0) est une fonction fléchée, une syntaxe plus concise de définition de fonction. Quand on cliquera sur la case, le code après la flèchhe sera exécuté, appelant alors handleClick(0) */}
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
    </>
  );
}

function Square({value, onSquareClick}) {
  // value stock la valeur et setValue est une fonction qu'on peut utiliser pour modifier la valeur. Le null passé à useState est utilisé comme valeur initiale de la variable d'état, de sorte que value démarre ici à null.
  // const [value, setValue] = useState(null);

  // function handleClick() {
  //   setValue("X");
  // }

  return <button className="square" onClick={onSquareClick}>{value}</button>;
}