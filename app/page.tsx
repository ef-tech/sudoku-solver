'use client';

import React, { useState, useEffect, useRef } from 'react';
import SudokuGrid from '../components/SudokuGrid';
import { 
  SudokuGrid as SudokuGridType, 
  SolverStep, 
  solveSudoku, 
  isValidSudoku, 
  createEmptyGrid, 
  createEmptyBooleanGrid 
} from '../utils/solver';

export default function Home() {
  // State for the Sudoku grid
  const [grid, setGrid] = useState<SudokuGridType>(createEmptyGrid());
  // Track which cells are part of the initial puzzle
  const [initialGrid, setInitialGrid] = useState<boolean[][]>(createEmptyBooleanGrid());
  // Track the currently highlighted cell during animation
  const [highlightedCell, setHighlightedCell] = useState<[number, number] | null>(null);
  // Track if the solver is currently running
  const [isSolving, setIsSolving] = useState<boolean>(false);
  // Track if there's an error in the puzzle
  const [hasError, setHasError] = useState<boolean>(false);
  // Store the solution steps
  const [solutionSteps, setSolutionSteps] = useState<SolverStep[]>([]);
  // Track the current step in the animation
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  // Animation speed in milliseconds
  const [animationSpeed, setAnimationSpeed] = useState<number>(300);
  
  // Ref to store the animation interval ID
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle cell value changes
  const handleCellChange = (rowIndex: number, colIndex: number, value: number | null) => {
    if (isSolving) return; // Prevent changes during solving
    
    // Update the grid
    const newGrid = [...grid];
    newGrid[rowIndex] = [...newGrid[rowIndex]];
    newGrid[rowIndex][colIndex] = value;
    setGrid(newGrid);
    
    // Update the initial grid to mark this cell as part of the initial puzzle
    if (value !== null) {
      const newInitialGrid = [...initialGrid];
      newInitialGrid[rowIndex] = [...newInitialGrid[rowIndex]];
      newInitialGrid[rowIndex][colIndex] = true;
      setInitialGrid(newInitialGrid);
    } else {
      // If the cell is cleared, it's no longer part of the initial puzzle
      const newInitialGrid = [...initialGrid];
      newInitialGrid[rowIndex] = [...newInitialGrid[rowIndex]];
      newInitialGrid[rowIndex][colIndex] = false;
      setInitialGrid(newInitialGrid);
    }
    
    // Clear any error state
    setHasError(false);
  };

  // Start solving the puzzle
  const handleSolve = () => {
    // Validate the current grid
    if (!isValidSudoku(grid)) {
      setHasError(true);
      return;
    }
    
    // Clear any previous error
    setHasError(false);
    
    // Get the solution steps
    const steps = solveSudoku(grid);
    
    if (steps.length === 0) {
      setHasError(true); // No solution found
      return;
    }
    
    // Store the solution steps
    setSolutionSteps(steps);
    setCurrentStepIndex(0);
    
    // Start the animation
    setIsSolving(true);
  };

  // Reset the puzzle
  const handleReset = () => {
    // Stop any ongoing animation
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
    
    // Reset all state
    setGrid(createEmptyGrid());
    setInitialGrid(createEmptyBooleanGrid());
    setHighlightedCell(null);
    setIsSolving(false);
    setHasError(false);
    setSolutionSteps([]);
    setCurrentStepIndex(0);
  };

  // Handle animation speed change
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseInt(e.target.value, 10);
    setAnimationSpeed(speed);
  };

  // Animation effect
  useEffect(() => {
    if (isSolving && solutionSteps.length > 0) {
      // Clear any existing interval
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
      
      // Start a new interval for the animation
      animationIntervalRef.current = setInterval(() => {
        setCurrentStepIndex((prevIndex) => {
          // If we've reached the end of the steps, stop the animation
          if (prevIndex >= solutionSteps.length) {
            setIsSolving(false);
            setHighlightedCell(null);
            if (animationIntervalRef.current) {
              clearInterval(animationIntervalRef.current);
              animationIntervalRef.current = null;
            }
            return prevIndex;
          }
          
          // Get the current step
          const step = solutionSteps[prevIndex];
          
          // Update the grid with this step
          setGrid((prevGrid) => {
            const newGrid = [...prevGrid];
            newGrid[step.row] = [...newGrid[step.row]];
            newGrid[step.row][step.col] = step.value;
            return newGrid;
          });
          
          // Highlight the current cell
          setHighlightedCell([step.row, step.col]);
          
          // Move to the next step
          return prevIndex + 1;
        });
      }, animationSpeed);
      
      // Cleanup function to clear the interval when the component unmounts
      return () => {
        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current);
        }
      };
    }
  }, [isSolving, solutionSteps, animationSpeed]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h1 className="text-3xl font-bold text-primary">数独ソルバー</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <SudokuGrid
          grid={grid}
          initialGrid={initialGrid}
          highlightedCell={highlightedCell}
          onCellChange={handleCellChange}
        />
      </div>
      
      {hasError && (
        <div className="text-red-500 font-medium">
          エラー: 有効な数独ではないか、解答が見つかりません。
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleSolve}
          disabled={isSolving}
          className={`btn btn-primary ${isSolving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSolving ? '解答中...' : '解答'}
        </button>
        
        <button
          onClick={handleReset}
          className="btn bg-gray-500 hover:bg-gray-600"
        >
          リセット
        </button>
      </div>
      
      <div className="w-full max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          アニメーション速度: {animationSpeed}ms
        </label>
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={animationSpeed}
          onChange={handleSpeedChange}
          disabled={isSolving}
          className="w-full"
        />
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>使い方:</p>
        <ol className="list-decimal list-inside">
          <li>空のマスに1〜9の数字を入力して問題を作成します</li>
          <li>「解答」ボタンをクリックすると、バックトラッキングアルゴリズムで解答します</li>
          <li>解答過程がアニメーションで表示されます</li>
          <li>「リセット」ボタンで問題をクリアできます</li>
        </ol>
      </div>
    </div>
  );
}