import { useState } from "react";

// conventions : onSomething pour les props qui représentent des événements et handleSomething pour les fonctions qui gèrent ces événements. 

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]); // [...history, nextSquares] crée un nouveau tableau qui contient tous les éléments existants de history, suivis de nextSquares.
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  )
}

function Board({ xIsNext, squares, onPlay }) {
  // déclaration d'une variable d'état nommée squares qui contient par défaut un tableau de 9 null correspondant aux neuf cases. Array(9).fill(null) crée un tableau de neuf éléments puis les définit tous à null. L'appel useState() qui l'enrobe déclare une variable d'état squares qui vaut initialement ce tableau.
  // const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    // Pour ne pas qu'un O puisse écraser un X ou inversement, on vérifie que la valeur de la cellule ne soit pas égale à null. Si elle est remplit alors on arrête la fonction en avance.
    // S'il y a un gagnant, on arrête la fonction également.
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice(); // Crée une copie du tableau squares (nextSquares) grâce à slice()

    // nextSquares[i] = "X"; --- met à jour le tableau nextSquares pour ajouter un X à la première case (index [i])

    // Si c'est au tour de X, la cellule se remplira d'un X, sinon d'un O.
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    // setSquares(nextSquares); --- On appelle alors la fonction setSquares pour avertir React que l'état du composant a changé. Cela déclenchera un nouvel affichage des composants qui utilisent l'état squares (donc Board), ainsi que de tous leurs comportants enfants (les composants Square qui consituent le plateau);

    // Pourquoi créer une copie du tableau avec slice() ? Car l'immutabilité a plusieurs avantages. Elle facilite l'implémentation de fonctionnalités complexes. Par exemple, en évitant de modifier les données directement, il est aisé de conserver leurs versions précédents intactes pour les réutiliser ultérieurement ou pour revenir en arrière.
    // De plus, par défaut, tous les composants enfants refont automatiquement leur rendu lorsque l'état du composant parent change. Cela inclut les composants enfants qui ne sont en pratique pas concernés par le changement. Même si le changement n'est pas forcément perceptible par l'utilisateur, on peut vouloir éviter le changement de parties qui ne changent pas pour des raisons de performances. L'immutabilité permet aux composants de comparer leurs données à un coût quasiment nul, pour détecter un changement.

    // setXIsNext(!xIsNext); --- On inverse la valeur de xIsNext pour alterner X et O.

    onPlay(nextSquares); // On remplace ici les appels à setSquares et setXIsNext par un appel unique à onPlay pour que le composant Game puisse mettre à jour le Board lorsque l'utilisateur clique sur une case.
  }

  // Remarque : JavaScript utilise des fermetures lexicales, ce qui signifie qu'une fonction imbriquée (ex. handleClick) a accès aux variables et fonctions définies dans une fonction englobante (ex. Board). La fonction handleClick peut lire l'état squares et appeler la fonction setSquares parce que les deux sont définis dans la fonction Board.

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = winner + "a gagné";
  } else {
    status = "Prochain tour : " + (xIsNext ? "X" : "O");
  }

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

  // Quand je clique sur le bouton : cela active onSquareClick qui active lui même handleClick(i) dans chaque Square défini dans Board. Voir commentaires dans la fonction handleClick pour les détails. Puis l'état squares du composant Board est mis à jour, du coup Board et tous ses enfants refont leur rendu. Cela modifie la prop value du composant Square d'index i pour la passer de null à X. 
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [0, 4, 8]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}