// App.js

import './App.css';
import { useState } from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
    // Composant pour une case individuelle
    return (
        <button
            className={`square ${isWinningSquare ? 'winning-line' : ''}`}
            onClick={onSquareClick}
        >
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    // Composant pour le plateau de jeu

    function handleClick(i) {
        // Gestionnaire de clic pour les cases du plateau
        if (calculateWinner(squares) || squares[i]) {
            // Si quelqu'un a gagné ou si la case est déjà remplie, ne rien faire
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares); // Met à jour l'état avec les nouvelles cases
    }

    const winner = calculateWinner(squares);
    let status;
    let winningLine = [];

    if (winner) {
        // Si quelqu'un a gagné
        status = 'Winner: ' + winner;
        // Obtenez la ligne gagnante
        winningLine = calculateWinningLine(squares);
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    function renderSquare(i, winningLine) {
        // Fonction pour afficher une case individuelle
        // Vérifiez si la case courante fait partie de la ligne gagnante
        const isWinningSquare = winningLine && winningLine.includes(i);
        return (
            <Square
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
                isWinningSquare={isWinningSquare} // Propriété indiquant si c'est une case gagnante
            />
        );
    }

    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                {renderSquare(0, winningLine)}
                {renderSquare(1, winningLine)}
                {renderSquare(2, winningLine)}
            </div>
            <div className="board-row">
                {renderSquare(3, winningLine)}
                {renderSquare(4, winningLine)}
                {renderSquare(5, winningLine)}
            </div>
            <div className="board-row">
                {renderSquare(6, winningLine)}
                {renderSquare(7, winningLine)}
                {renderSquare(8, winningLine)}
            </div>
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        // Gestionnaire pour mettre à jour l'historique et l'état actuel du plateau
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        // Gestionnaire pour sauter à un mouvement précédent
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        // Liste des mouvements précédents
        let description;
        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    // Fonction pour déterminer le gagnant
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function calculateWinningLine(squares) {
    // Fonction pour déterminer la ligne gagnante
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [a, b, c]; // Renvoie la ligne gagnante
        }
    }
    return null;
}
