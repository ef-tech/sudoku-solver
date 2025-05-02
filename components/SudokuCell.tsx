import React, { ChangeEvent } from 'react';

interface SudokuCellProps {
  value: number | null;
  isInitial: boolean;
  isHighlighted: boolean;
  onChange: (value: number | null) => void;
  rowIndex: number;
  colIndex: number;
}

const SudokuCell: React.FC<SudokuCellProps> = ({
  value,
  isInitial,
  isHighlighted,
  onChange,
  rowIndex,
  colIndex,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Clear the cell if input is empty
    if (inputValue === '') {
      onChange(null);
      return;
    }
    
    // Only allow single digits 1-9
    const lastChar = inputValue.charAt(inputValue.length - 1);
    if (/^[1-9]$/.test(lastChar)) {
      onChange(parseInt(lastChar, 10));
    }
  };

  // Determine cell classes based on position and state
  const borderClasses = [];
  
  // Add right border for every third column (except the last)
  if ((colIndex + 1) % 3 === 0 && colIndex < 8) {
    borderClasses.push('border-r-2 border-r-gray-800');
  }
  
  // Add bottom border for every third row (except the last)
  if ((rowIndex + 1) % 3 === 0 && rowIndex < 8) {
    borderClasses.push('border-b-2 border-b-gray-800');
  }

  // Combine all classes
  const cellClasses = [
    'sudoku-cell',
    isInitial ? 'font-bold text-blue-800' : '',
    isHighlighted ? 'sudoku-cell-highlight' : '',
    ...borderClasses,
  ].filter(Boolean).join(' ');

  return (
    <div className={cellClasses}>
      <input
        type="text"
        value={value || ''}
        onChange={handleChange}
        className="sudoku-cell-input"
        maxLength={1}
        disabled={isInitial && value !== null}
      />
    </div>
  );
};

export default SudokuCell;