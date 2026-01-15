import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { io } from "socket.io-client";
import openSocket from 'socket.io-client';
import socket from "../socket";



const wins = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
];



const Game = () => {
    const [player, setPlayer] = useState(1);
    const [winner, setWinner] = useState(null);
    const [turns, setTurns] = useState(0);
    const [pl1, setPl1] = useState(new Set());
    const [pl2, setPl2] = useState(new Set());
    const [board, setBoard] = useState(Array(9).fill(null));
    useEffect(() => {
        socket.connect();

        return () => socket.disconnect();
    }, []);



    useEffect(() => {
        socket.on("connect", () => {
            console.log("user connected frontend");
        });
    }, [])
    const hasWin = (playerSet) => {
        for (const line of wins) {
            if (line.every((pos) => playerSet.has(pos))) return true;
        }
        return false;
    };
    useEffect(() => {
        if (winner === 1 || winner === 2) {
            confetti({
                particleCount: 500,
                spread: 160,
                origin: { y: 0.6 },
            });
        }
    }, [winner]);

    const isSelected = (idx) => {
        return pl1.has(idx) || pl2.has(idx);
    };

    const reset = () => {
        setPlayer(1);
        setWinner(null);
        setTurns(0);
        setPl1(new Set());
        setPl2(new Set());
        setBoard(Array(9).fill(null));
    };

    const handleClick = (idx) => {
        if (winner) return;
        if (board[idx - 1]) return;

        const newBoard = [...board];
        newBoard[idx - 1] = player === 1 ? "X" : "O";
        setBoard(newBoard);

        if (player === 1) {
            const newPl1 = new Set(pl1);
            newPl1.add(idx);
            setPl1(newPl1);
            setTurns((t) => t + 1);

            if (hasWin(newPl1)) {
                setWinner(1);
                return;
            } else {

                if (turns + 1 >= 9) {
                    setWinner("draw");
                    return;
                }
            }

            setPlayer(2);
        } else {
            const newPl2 = new Set(pl2);
            newPl2.add(idx);
            setPl2(newPl2);

            setTurns((t) => t + 1);

            if (hasWin(newPl2)) {
                setWinner(2);
                return;
            } else {
                if (turns + 1 >= 9) {
                    setWinner("draw");
                    return;
                }
            }

            setPlayer(1);
        }
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${player === 1 ? 'bg-green-300' : 'bg-yellow-200'} p-6`}>
            <div className="mb-6 text-lg">
                {winner ? (
                    winner === "draw" ? (
                        <span className="text-yellow-700 font-bold">It's a draw!</span>
                    ) : (
                        <span className="text-green-700 font-bold">Player {winner} wins!</span>
                    )
                ) : (
                    <span className="font-medium">Current: Player {player} ({player === 1 ? "X" : "O"})</span>
                )}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
                {board.map((cell, i) => {
                    const idx = i + 1;
                    const cellBg = isSelected(idx) ? "bg-red-300" : "bg-white";
                    return (
                        <div
                            key={i}
                            onClick={() => handleClick(idx)}
                            className={`${cellBg} w-24 h-24 flex items-center justify-center
                border-2 border-gray-800 text-3xl font-bold cursor-pointer
                hover:bg-gray-200 transition select-none`}>
                            {cell}
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={reset}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Reset
                </button>


            </div>
        </div>
    );
};

export default Game;

