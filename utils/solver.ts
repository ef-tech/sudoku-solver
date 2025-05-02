// Types for the solver
export type SudokuGrid = (number | null)[][];
export type SolverStep = {
  row: number;
  col: number;
  value: number;
};

/**
 * Check if a number can be placed at the given position in the grid
 */
const isValid = (grid: SudokuGrid, row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) {
      return false;
    }
  }

  // Check column
  for (let y = 0; y < 9; y++) {
    if (grid[y][col] === num) {
      return false;
    }
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (grid[boxRow + y][boxCol + x] === num) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Find an empty cell in the grid
 * Returns [row, col] if found, null if no empty cell exists
 */
const findEmptyCell = (grid: SudokuGrid): [number, number] | null => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        return [row, col];
      }
    }
  }
  return null; // No empty cell found
};

/**
 * Solve the Sudoku puzzle using backtracking
 * Returns an array of steps taken to solve the puzzle
 */
export const solveSudoku = (grid: SudokuGrid): SolverStep[] => {
  const steps: SolverStep[] = [];
  const workingGrid: SudokuGrid = JSON.parse(JSON.stringify(grid)); // Deep copy
  
  const solve = (): boolean => {
    const emptyCell = findEmptyCell(workingGrid);
    
    // If no empty cell is found, the puzzle is solved
    if (!emptyCell) {
      return true;
    }
    
    const [row, col] = emptyCell;
    
    // Try digits 1-9
    for (let num = 1; num <= 9; num++) {
      if (isValid(workingGrid, row, col, num)) {
        // Place the number
        workingGrid[row][col] = num;
        
        // Record this step
        steps.push({ row, col, value: num });
        
        // Recursively try to solve the rest of the puzzle
        if (solve()) {
          return true;
        }
        
        // If we get here, this number didn't work, so backtrack
        workingGrid[row][col] = null;
        
        // Remove the last step since it didn't work
        steps.pop();
      }
    }
    
    // No solution found with current configuration
    return false;
  };
  
  // Start solving
  const solvable = solve();
  
  // Return the steps if the puzzle is solvable, otherwise empty array
  return solvable ? steps : [];
};

/**
 * Check if a Sudoku grid is valid (no conflicts)
 */
export const isValidSudoku = (grid: SudokuGrid): boolean => {
  // Check each cell
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = grid[row][col];
      
      // Skip empty cells
      if (value === null) continue;
      
      // Temporarily clear the cell to check if the value is valid
      grid[row][col] = null;
      const valid = isValid(grid, row, col, value);
      grid[row][col] = value; // Restore the value
      
      if (!valid) return false;
    }
  }
  
  return true;
};

/**
 * Create an empty 9x9 Sudoku grid
 */
export const createEmptyGrid = (): SudokuGrid => {
  return Array(9).fill(null).map(() => Array(9).fill(null));
};

/**
 * Create an empty 9x9 boolean grid to track initial cells
 */
export const createEmptyBooleanGrid = (): boolean[][] => {
  return Array(9).fill(false).map(() => Array(9).fill(false));
};