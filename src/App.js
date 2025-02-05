import { useState, useEffect } from "react";

// conventions : onSomething pour les props qui représentent des événements et handleSomething pour les fonctions qui gèrent ces événements. 

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), index: null, value: null}]); // Permet de récupérer l'index et la valeur des cases;
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [sorting, setSorting] = useState(false);

  function handlePlay(nextSquares, clickedIndex, clickedValue) {
    const moveData = {squares: nextSquares, index: clickedIndex, value: clickedValue}; // Stocke l'état du plateau, l'index et la valeur au moment où le coup a été joué.
    const nextHistory = [...history.slice(0, currentMove + 1), moveData];
    setHistory(nextHistory);
    // setHistory([...history, nextSquares]); --- [...history, nextSquares] crée un nouveau tableau qui contient tous les éléments existants de history, suivis de nextSquares.
    setCurrentMove(nextHistory.length - 1);
    setDisplayedMoves(moves);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // transformer history en éléments React représentant des boutons à l'écran et afficher une liste de boutons pour "revenir" à des coups passés. 
  const moves = history.map((entry, move) => {
    const {squares, index, value} = entry; 
    let description;
    // Lorque l'on itère sur le tableau history au sein de la fonction que l'on a passé à map, l'argument squares vaut tour à tour chaque élément de history, et l'argument move vaut tour à tour chaque index de l'historique : 0, 1, 2...
    if (move > 0) {
      description = "Aller au coup #" + move;
    } else {
      description = "Revenir au début";
    }

    // Afficher simplement "Vous êtes au coup X" plutôt qu'un bouton lors du coup à jouer.
    if (move == currentMove) {
      return <li key={move}>Vous êtes au coup #{move}</li>;
    } else {
      return (
          // Pour chaque coup de l'historique de la partie, on crée un élément de liste <li> qui contient un bouton <button> qui a un gestionnaire onClick qui appelle la fonction jumpTo.
          <li key={move}>
            <button onClick={() => jumpTo(move)}>{description}</button>
            <span>{index+1} - {value}</span> {/* Affiche l'index de la cellule (de 1 à 9) où le coup a été joué et sa valeur (X ou O) */}
          </li>
          // Quand la liste est ré-affichée, React prend la clé de chaque élément de liste et recherche l'élément de la liste précédente avec la même clé. S'il ne la trouve pas, React crée un composant. Si la liste à jour n'a pas une clé qui existait auparavant, React détruit l'ancien composant correspondant. Si deux clés correspondent, le composant correspondant est déplacé si besoin.
          // Les clés informent React sur l'identité de chaque composant, ce qui lui permet de maintenir l'état d'un rendu à l'autre. Si la clé d'un composant change, il sera détruit puis recréé avec un état réinitialisé. 
          // key est une propriété spéciale réservée par React. Lorsqu'un élément est créé, React extrait la propriété key et la stocke directement dans l'élément renvoyé. Même si key semble être passé comme une prop, React l'utilise automatiquement pour déterminer quel composant mettre à jour. Un composant n'a aucun moyen de demander la key que son parent a spécifié. 
          // Si aucune clé n'est spécifiée, React signalera une erreur et utilisera par défaut l'index dans le tableau comme clé. Recourir à l'index en tant que clé pose problème dès que l'on essaye de réordonner la liste ou d'y insérer ou retirer des éléments. Passer explicitement key={i} réduit certes l'erreur au silence, mais ne résout en rien le problème sous-jacent, et est donc une apporche généralement déconseillée. 
          // Les clés n'ont pas besoi d'être uniques au global ; elles doivent juste être uniques au sein de la liste concernée.
          // Ici les coups ne peuvent pas être réordonnés, retirés ou insérés, donc il est possible d'utiliser l'index du coup comme key : <li key={move}>...</li>
      )
    }
  });

  const [displayedMoves, setDisplayedMoves] = useState(moves);

  // Permet de faire en sorte que ce soit toujours synchronisé avec moves.
  useEffect(() => {
    setDisplayedMoves(moves);
  }, [history, currentMove]);

  function clearMoves() {
    setDisplayedMoves(null);
  }

  function sort() {
    if (sorting === false) {
      moves.sort((a, b) => a.key - b.key);
    } else {
      moves.sort((a, b) => b.key - a.key);
    }
    setSorting(!sorting);
    setDisplayedMoves(moves);
  }

  const winningSquares = calculateWinner(currentSquares) || [];

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares.squares} onPlay={handlePlay} winningSquares={winningSquares}/>
      </div>
      <div className="game-info">
        <SortMoves onSortClick={sort}/>
        <ClearMoves onClearClick={clearMoves}/>
        <ol>{displayedMoves}</ol>
      </div>
    </div>
  )
}

function Board({ xIsNext, squares, onPlay, winningSquares }) {
  const [count, setCount] = useState(0);
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
    let value;
    if (xIsNext) {
      value = "X";
    } else {
      value = "O";
    }

    // setSquares(nextSquares); --- On appelle alors la fonction setSquares pour avertir React que l'état du composant a changé. Cela déclenchera un nouvel affichage des composants qui utilisent l'état squares (donc Board), ainsi que de tous leurs comportants enfants (les composants Square qui consituent le plateau);

    // Pourquoi créer une copie du tableau avec slice() ? Car l'immutabilité a plusieurs avantages. Elle facilite l'implémentation de fonctionnalités complexes. Par exemple, en évitant de modifier les données directement, il est aisé de conserver leurs versions précédents intactes pour les réutiliser ultérieurement ou pour revenir en arrière.
    // De plus, par défaut, tous les composants enfants refont automatiquement leur rendu lorsque l'état du composant parent change. Cela inclut les composants enfants qui ne sont en pratique pas concernés par le changement. Même si le changement n'est pas forcément perceptible par l'utilisateur, on peut vouloir éviter le changement de parties qui ne changent pas pour des raisons de performances. L'immutabilité permet aux composants de comparer leurs données à un coût quasiment nul, pour détecter un changement.

    // setXIsNext(!xIsNext); --- On inverse la valeur de xIsNext pour alterner X et O.

    nextSquares[i] = value;
    onPlay(nextSquares, i, value); // On remplace ici les appels à setSquares et setXIsNext par un appel unique à onPlay pour que le composant Game puisse mettre à jour le Board lorsque l'utilisateur clique sur une case.
    setCount(count + 1);
  }

  // Remarque : JavaScript utilise des fermetures lexicales, ce qui signifie qu'une fonction imbriquée (ex. handleClick) a accès aux variables et fonctions définies dans une fonction englobante (ex. Board). La fonction handleClick peut lire l'état squares et appeler la fonction setSquares parce que les deux sont définis dans la fonction Board.

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = winner + " a gagné";
  } else if (!winner && count == 9) { // Announce si c'est un match nul
    status = "Match nul !";
  } else {
    status = "Prochain tour : " + (xIsNext ? "X" : "O");
  }

  // Remanier Board pour qu'il utilise deux boucles au lieu de coder les rangées et cases du plateau en dur. Dans React, on ne manipule pas directement le DOM avec des fonctions comme document.createElement ou appendChild. A la place, on utilise JSX pour décrire la structure des composants de manière déclarative. Si on veut générer dynamiquement les lignes et les cases du plateau de jeu avec des boucles, on doit utiliser des tableaux et la méthode .map()
  const board = [];
  for (let i = 0; i < 3; i++) {
    const row = (
      <div key={i} className="board-row">
        {Array(3)
          .fill(null)
          .map((_, j) => {
            const index = i * 3 + j;
            const isWinner = winningSquares.includes(index);
            return (
              <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} isWinner={isWinner}/>
            );
          })}
      </div>
    );
    board.push(row);
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );

  // return (
  //   <>
  //     <div className="status">{status}</div>
  //     <div className="board-row">
  //       {/* Ici, () => handleClick(0) est une fonction fléchée, une syntaxe plus concise de définition de fonction. Quand on cliquera sur la case, le code après la flèchhe sera exécuté, appelant alors handleClick(0) */}
  //       <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
  //       <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
  //       <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
  //     </div>
  //     <div className="board-row">
  //       <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
  //       <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
  //       <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
  //     </div>
  //     <div className="board-row">
  //       <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
  //       <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
  //       <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
  //     </div>
  //   </>
  // );
}

function Square({value, onSquareClick, isWinner}) {
  // value stock la valeur et setValue est une fonction qu'on peut utiliser pour modifier la valeur. Le null passé à useState est utilisé comme valeur initiale de la variable d'état, de sorte que value démarre ici à null.
  // const [value, setValue] = useState(null);

  // function handleClick() {
  //   setValue("X");
  // }

  // Quand je clique sur le bouton : cela active onSquareClick qui active lui même handleClick(i) dans chaque Square défini dans Board. Voir commentaires dans la fonction handleClick pour les détails. Puis l'état squares du composant Board est mis à jour, du coup Board et tous ses enfants refont leur rendu. Cela modifie la prop value du composant Square d'index i pour la passer de null à X. 
  return <button className={`square ${isWinner ? "winner" : ""}`} onClick={onSquareClick}>{value}</button>;
}

function SortMoves({ onSortClick }) {
  return <button onClick={onSortClick}>Sort Moves</button>
}

function ClearMoves({ onClearClick }) {
  return <button onClick={onClearClick}>Clear Moves</button>
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
      return [a, b, c];
    }
  }
  return null;
}