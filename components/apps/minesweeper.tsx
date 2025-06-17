"use client"

import { useState, useEffect, useCallback } from "react"

type Cell = {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    neighborMines: number;
};

export class Minefield {
    private rows: number;
    private cols: number;
    private numMines: number;
    private board: Cell[][];

    constructor(rows: number, cols: number, numMines: number) {
        this.rows = rows;
        this.cols = cols;
        this.numMines = numMines;
        this.board = this.initBoard();
        this.placeMines();
        this.calculateNumbers();
    }

    private initBoard(): Cell[][] {
        return Array.from({ length: this.rows }, () =>
            Array.from({ length: this.cols }, () => ({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0,
            }))
        );
    }

    private placeMines() {
        let placed = 0;
        while (placed < this.numMines) {
            const r = Math.floor(Math.random() * this.rows);
            const c = Math.floor(Math.random() * this.cols);
            const cell = this.board[r][c];
            if (!cell.isMine) {
                cell.isMine = true;
                placed++;
            }
        }
    }

    private calculateNumbers() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.board[r][c].isMine) continue;
                this.board[r][c].neighborMines = this.countNeighborMines(r, c);
            }
        }
    }

    private countNeighborMines(r: number, c: number): number {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr;
                const nc = c + dc;
                if (
                    nr >= 0 &&
                    nr < this.rows &&
                    nc >= 0 &&
                    nc < this.cols &&
                    this.board[nr][nc].isMine
                ) {
                    count++;
                }
            }
        }
        return count;
    }

    public reveal(r: number, c: number): 'mine' | 'clear' | 'flagged' {
        const cell = this.board[r][c];
        if (cell.isRevealed || cell.isFlagged) return cell.isFlagged ? 'flagged' : 'clear';

        cell.isRevealed = true;

        if (cell.isMine) {
            return 'mine';
        }

        if (cell.neighborMines === 0) {
            // flood fill
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (
                        nr >= 0 &&
                        nr < this.rows &&
                        nc >= 0 &&
                        nc < this.cols &&
                        !(dr === 0 && dc === 0)
                    ) {
                        this.reveal(nr, nc);
                    }
                }
            }
        }

        return 'clear';
    }

    public toggleFlag(r: number, c: number): boolean {
        const cell = this.board[r][c];
        if (cell.isRevealed) return false;

        cell.isFlagged = !cell.isFlagged;
        return cell.isFlagged;
    }

    public getBoard(): Readonly<Cell[][]> {
        return this.board;
    }

    public isWin(): boolean {
        for (let row of this.board) {
            for (let cell of row) {
                if (!cell.isMine && !cell.isRevealed) return false;
            }
        }
        return true;
    }

    public revealAll() {
        for (let row of this.board) {
            for (let cell of row) {
                cell.isRevealed = true;
            }
        }
    }

    public getFlagCount(): number {
        let count = 0;
        for (let row of this.board) {
            for (let cell of row) {
                if (cell.isFlagged) count++;
            }
        }
        return count;
    }
}

type GameState = 'playing' | 'won' | 'lost' | 'new';
type Difficulty = 'beginner' | 'intermediate' | 'expert';

const DIFFICULTIES = {
    beginner: { rows: 12, cols: 12, mines: 10 },
    intermediate: { rows: 12, cols: 12, mines: 20 },
    expert: { rows: 12, cols: 12, mines: 35 }
};

export default function MinesweeperApp() {
    const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
    const [game, setGame] = useState<Minefield | null>(null);
    const [gameState, setGameState] = useState<GameState>('new');
    const [board, setBoard] = useState<Cell[][]>([]);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [explodedMine, setExplodedMine] = useState<{ r: number, c: number } | null>(null);

    // Initialize game
    const initGame = useCallback((diff: Difficulty = difficulty) => {
        const config = DIFFICULTIES[diff];
        const newGame = new Minefield(config.rows, config.cols, config.mines);
        setGame(newGame);
        setBoard(JSON.parse(JSON.stringify(newGame.getBoard())));
        setGameState('playing');
        setTimer(0);
        setIsTimerRunning(true);
        setExplodedMine(null);
    }, [difficulty]);

    // Start new game
    useEffect(() => {
        initGame();
    }, [initGame]);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning && gameState === 'playing') {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, gameState]);

    const handleCellClick = (r: number, c: number) => {
        if (!game || gameState !== 'playing') return;

        const result = game.reveal(r, c);
        setBoard(JSON.parse(JSON.stringify(game.getBoard())));

        if (result === 'mine') {
            setGameState('lost');
            setIsTimerRunning(false);
            setExplodedMine({ r, c }); // Track which mine exploded
            game.revealAll();
            setBoard(JSON.parse(JSON.stringify(game.getBoard())));
        } else if (game.isWin()) {
            setGameState('won');
            setIsTimerRunning(false);
        }
    };

    const handleCellRightClick = (e: React.MouseEvent, r: number, c: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (!game || gameState !== 'playing') return;

        game.toggleFlag(r, c);
        setBoard(JSON.parse(JSON.stringify(game.getBoard())));
    };

    const handleNewGame = () => {
        initGame();
    };

    const handleDifficultyChange = (newDiff: Difficulty) => {
        setDifficulty(newDiff);
        initGame(newDiff);
    };

    const getCellContent = (cell: Cell, r: number, c: number) => {
        // During game over, show flags on mines if they were correctly flagged
        if (gameState === 'lost' && cell.isFlagged && cell.isMine) {
            return '🚩';
        }

        // During game over, show wrong flags (flagged but not a mine) with X
        if (gameState === 'lost' && cell.isFlagged && !cell.isMine) {
            return '❌';
        }

        // Normal flag display during play
        if (cell.isFlagged && !cell.isRevealed) {
            return '🚩';
        }

        if (!cell.isRevealed) {
            return '';
        }

        if (cell.isMine) {
            return '💣';
        }

        if (cell.neighborMines === 0) {
            return '';
        }

        return cell.neighborMines.toString();
    };

    const getCellClassName = (cell: Cell, r: number, c: number) => {
        let baseClass = "w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm font-bold flex items-center justify-center border select-none cursor-pointer";

        // Game over state - exploded mine gets dark red background
        if (gameState === 'lost' && explodedMine && explodedMine.r === r && explodedMine.c === c) {
            baseClass += " bg-red-800 border-gray-500 border-t border-l border-gray-400 border-r border-b";
            return baseClass;
        }

        // Game over state - correctly flagged mines get green background
        if (gameState === 'lost' && cell.isFlagged && cell.isMine) {
            baseClass += " bg-green-500 border-gray-500 border-t border-l border-gray-400 border-r border-b";
            return baseClass;
        }

        // Game over state - incorrectly flagged cells get yellow background
        if (gameState === 'lost' && cell.isFlagged && !cell.isMine) {
            baseClass += " bg-yellow-400 border-gray-500 border-t border-l border-gray-400 border-r border-b";
            return baseClass;
        }

        if (!cell.isRevealed) {
            baseClass += " bg-gray-400 border-white border-t-2 border-l-2 border-gray-600 border-r border-b hover:bg-gray-300";
        } else {
            baseClass += " bg-gray-300 border-gray-500 border-t border-l border-gray-400 border-r border-b";

            if (cell.isMine) {
                baseClass += " bg-red-500";
            } else if (cell.neighborMines > 0) {
                // Color code the numbers
                const colors = [
                    '', 'text-blue-600', 'text-green-600', 'text-red-600',
                    'text-purple-600', 'text-yellow-600', 'text-pink-600',
                    'text-black', 'text-gray-600'
                ];
                baseClass += ` ${colors[cell.neighborMines] || 'text-black'}`;
            }
        }

        return baseClass;
    };

    const flagsRemaining = game ? DIFFICULTIES[difficulty].mines - game.getFlagCount() : 0;

    return (
        <div className="p-2 bg-gray-300 h-full flex flex-col">
            {/* Menu Bar */}
            <div className="bg-gray-300 border-b border-gray-400 px-2 py-1 mb-2">
                <div className="flex space-x-4 text-xs">
                    <div className="relative group">
                        <button className="hover:bg-blue-600 hover:text-white px-2 py-1">Game</button>
                        <div className="absolute top-full left-0 bg-gray-200 border border-gray-400 hidden group-hover:block min-w-32 z-10">
                            <button
                                onClick={handleNewGame}
                                className="w-full text-left px-2 py-1 hover:bg-blue-600 hover:text-white"
                            >
                                New Game
                            </button>
                            <div className="border-t border-gray-400 my-1"></div>
                            <button
                                onClick={() => handleDifficultyChange('beginner')}
                                className="w-full text-left px-2 py-1 hover:bg-blue-600 hover:text-white"
                            >
                                Beginner
                            </button>
                            <button
                                onClick={() => handleDifficultyChange('intermediate')}
                                className="w-full text-left px-2 py-1 hover:bg-blue-600 hover:text-white"
                            >
                                Intermediate
                            </button>
                            <button
                                onClick={() => handleDifficultyChange('expert')}
                                className="w-full text-left px-2 py-1 hover:bg-blue-600 hover:text-white"
                            >
                                Expert
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="flex justify-between items-center mb-2 p-2 bg-gray-400 border border-gray-600">
                <div className="bg-black text-red-500 px-2 py-1 font-mono text-sm border-2 border-gray-500">
                    {flagsRemaining.toString().padStart(3, '0')}
                </div>

                <button
                    onClick={handleNewGame}
                    className="bg-gray-400 border-2 border-white border-r-gray-600 border-b-gray-600 hover:bg-gray-300 active:border-gray-600 active:border-r-white active:border-b-white px-2 py-1 text-lg"
                >
                    {gameState === 'won' ? '😎' : gameState === 'lost' ? '😵' : '🙂'}
                </button>

                <div className="bg-black text-red-500 px-2 py-1 font-mono text-sm border-2 border-gray-500">
                    {timer.toString().padStart(3, '0')}
                </div>
            </div>

            {/* Game Board */}
            <div className="flex-1 overflow-auto" style={{ scrollbarWidth: 'auto' }}>
                <div className="flex items-center justify-center min-h-full p-1">
                    <div className="inline-block border-4 border-gray-600 border-r-white border-b-white p-1 bg-gray-400">
                        <div
                            className="grid gap-0"
                            style={{
                                gridTemplateColumns: `repeat(${DIFFICULTIES[difficulty].cols}, 1fr)`,
                                gridTemplateRows: `repeat(${DIFFICULTIES[difficulty].rows}, 1fr)`
                            }}
                        >
                            {board.map((row, r) =>
                                row.map((cell, c) => (
                                    <div
                                        key={`${r}-${c}`}
                                        className={getCellClassName(cell, r, c)}
                                        onClick={() => handleCellClick(r, c)}
                                        onContextMenu={(e) => handleCellRightClick(e, r, c)}
                                    >
                                        {getCellContent(cell, r, c)}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status */}
            {gameState === 'won' && (
                <div className="mt-2 text-center text-sm font-bold text-green-600">
                    🎉 You Won! 🎉
                </div>
            )}
            {gameState === 'lost' && (
                <div className="mt-2 text-center text-sm font-bold text-red-600">
                    💥 Game Over! 💥
                </div>
            )}
        </div>
    );
} 