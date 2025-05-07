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
  
  // 数字入力時のキーボード操作を処理する関数
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const currentInput = e.currentTarget;
    const currentCell = currentInput.closest('.sudoku-cell');
    
    // 数字の1-9が入力された場合
    if (/^[1-9]$/.test(e.key)) {
      // 入力されている数字を更新
      onChange(parseInt(e.key, 10));
      
      // 次のセルにフォーカスを移動（入力後に自動的に次へ）
      const nextInput = currentCell?.nextElementSibling?.querySelector('input');
      if (nextInput) {
        setTimeout(() => {
          (nextInput as HTMLInputElement).focus();
        }, 0);
      }
      
      // デフォルトの入力を防止（すでにonChangeで処理したため）
      e.preventDefault();
    } 
    // Backspaceキーが押された場合
    else if (e.key === 'Backspace') {
      // 現在の値が空でない場合は、まず現在のセルの値をクリア
      if (value !== null) {
        onChange(null);
      } 
      // 現在の値が既に空の場合は、前のセルに移動
      else {
        const prevInput = currentCell?.previousElementSibling?.querySelector('input');
        if (prevInput && !(prevInput as HTMLInputElement).readOnly) {
          setTimeout(() => {
            (prevInput as HTMLInputElement).focus();
          }, 0);
        }
      }
    }
    // 矢印キーでの移動
    else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault(); // デフォルトのスクロール動作を防止
      
      const grid = currentCell?.parentElement;
      if (!grid) return;
      
      const cells = Array.from(grid.querySelectorAll('.sudoku-cell'));
      const currentIndex = cells.indexOf(currentCell as Element);
      if (currentIndex === -1) return;
      
      let targetIndex = currentIndex;
      const gridSize = 9;  // 数独グリッドは9x9
      
      switch (e.key) {
        case 'ArrowLeft':
          targetIndex = Math.max(0, currentIndex - 1);
          break;
        case 'ArrowRight':
          targetIndex = Math.min(cells.length - 1, currentIndex + 1);
          break;
        case 'ArrowUp':
          targetIndex = Math.max(0, currentIndex - gridSize);
          break;
        case 'ArrowDown':
          targetIndex = Math.min(cells.length - 1, currentIndex + gridSize);
          break;
      }
      
      if (targetIndex !== currentIndex) {
        const targetInput = cells[targetIndex].querySelector('input');
        if (targetInput && !(targetInput as HTMLInputElement).readOnly) {
          setTimeout(() => {
            (targetInput as HTMLInputElement).focus();
          }, 0);
        } else {
          // もし対象のセルが無効（readOnly）の場合は、同じ方向の次のセルを探す
          let nextIndex = targetIndex;
          const direction = targetIndex > currentIndex ? 1 : -1;
          
          // 現在のセルから対象方向に有効なセルを見つけるまで探索
          while (nextIndex >= 0 && nextIndex < cells.length) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
              nextIndex += direction;
            } else {
              nextIndex += direction * gridSize;
            }
            
            // 有効範囲を超えたら終了
            if (nextIndex < 0 || nextIndex >= cells.length) break;
            
            const nextInput = cells[nextIndex].querySelector('input');
            if (nextInput && !(nextInput as HTMLInputElement).readOnly) {
              setTimeout(() => {
                (nextInput as HTMLInputElement).focus();
              }, 0);
              break;
            }
          }
        }
      }
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
        inputMode="numeric"
        pattern="[1-9]*"
        value={value || ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="sudoku-cell-input"
        maxLength={1}
        readOnly={isInitial}
      />
    </div>
  );
};

export default SudokuCell;