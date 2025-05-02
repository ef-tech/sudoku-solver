import React from 'react';
import SudokuCell from './SudokuCell';

interface SudokuGridProps {
  grid: (number | null)[][];
  initialGrid: boolean[][];
  highlightedCell: [number, number] | null;
  onCellChange: (rowIndex: number, colIndex: number, value: number | null) => void;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({
  grid,
  initialGrid,
  highlightedCell,
  onCellChange,
}) => {
  return (
    <div className="sudoku-grid">
      {grid.map((row, rowIndex) => (
        <React.Fragment key={`row-${rowIndex}`}>
          {row.map((cell, colIndex) => (
            <SudokuCell
              key={`cell-${rowIndex}-${colIndex}`}
              value={cell}
              isInitial={initialGrid[rowIndex][colIndex]}
              isHighlighted={
                highlightedCell !== null &&
                highlightedCell[0] === rowIndex &&
                highlightedCell[1] === colIndex
              }
              onChange={(value) => onCellChange(rowIndex, colIndex, value)}
              rowIndex={rowIndex}
              colIndex={colIndex}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SudokuGrid;