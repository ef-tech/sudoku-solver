import React, { ChangeEvent, KeyboardEvent } from 'react';

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
  
  // 数字入力時に自動的に次のセルへ移動する処理
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // 数字の1-9が入力された場合
    if (/^[1-9]$/.test(e.key)) {
      // 入力されている数字を更新
      onChange(parseInt(e.key, 10));
      
      // 次のセルにフォーカスを移動
      // Tab キーをシミュレートする
      const nextInput = e.currentTarget.closest('.sudoku-cell')?.nextElementSibling?.querySelector('input');
      if (nextInput) {
        setTimeout(() => {
          (nextInput as HTMLInputElement).focus();
        }, 0);
      }
      
      // デフォルトの入力を防止（すでにonChangeで処理したため）
      e.preventDefault();
    }
    
    // Tabキーの場合は標準の動作を許可（自動的に次のセルに移動）
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
        onKeyDown={handleKeyDown}
        className="sudoku-cell-input"
        maxLength={1}
        disabled={isInitial && value !== null}
      />
    </div>
  );
};

export default SudokuCell;