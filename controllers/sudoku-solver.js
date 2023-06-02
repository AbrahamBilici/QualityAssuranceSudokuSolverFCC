class SudokuSolver {
  validate(puzzleString) {
    const regex = /^[1-9.]{81}$/;
    return regex.test(puzzleString);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const puzzle = this.convertToGrid(puzzleString);
    const rowValues = puzzle[row];
    if (!rowValues) {
      throw new Error('Invalid row: ' + row);
    }
    return !rowValues.includes(parseInt(value));
  }

  checkColPlacement(puzzleString, row, column, value) {
    const puzzle = this.convertToGrid(puzzleString);
    const columnValues = puzzle.map(rowValues => rowValues[column]);
    if (!columnValues) {
      throw new Error('Invalid column: ' + column);
    }
    return !columnValues.includes(parseInt(value));
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const puzzle = this.convertToGrid(puzzleString);
    const regionRowStart = Math.floor(row / 3) * 3;
    const regionColStart = Math.floor(column / 3) * 3;
    for (let i = regionRowStart; i < regionRowStart + 3; i++) {
      for (let j = regionColStart; j < regionColStart + 3; j++) {
        if (puzzle[i][j] === parseInt(value)) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    const puzzle = this.convertToGrid(puzzleString);
    if (this.solveSudoku(puzzle)) {
      return this.convertToString(puzzle);
    } else {
      return { error: 'Puzzle cannot be solved' };
    }
  }

  convertToGrid(puzzleString) {
    const grid = [];
    for (let i = 0; i < puzzleString.length; i += 9) {
      const row = puzzleString.slice(i, i + 9).split('').map(char => {
        if (char === '.') {
          return null;
        } else {
          return parseInt(char);
        }
      });
      grid.push(row);
    }
    return grid;
  }

  convertToString(grid) {
    return grid
      .map(row => row.map(cell => cell || '.').join(''))
      .join('');
  }

  findEmptyCell(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) {
          return [row, col];
        }
      }
    }
    return [-1, -1]; // No empty cell found
  }

  isValid(grid, row, col, num) {
    // Check if num already exists in the row
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num) {
        return false;
      }
    }

    // Check if num already exists in the column
    for (let j = 0; j < 9; j++) {
      if (grid[j][col] === num) {
        return false;
      }
    }

    // Check if num already exists in the 3x3 region
    const regionRowStart = Math.floor(row / 3) * 3;
    const regionColStart = Math.floor(col / 3) * 3;
    for (let i = regionRowStart; i < regionRowStart + 3; i++) {
      for (let j = regionColStart; j < regionColStart + 3; j++) {
        if (grid[i][j] === num) {
          return false;
        }
      }
    }

    return true; // num is valid in the current cell
  }

  solveSudoku(grid) {
    const emptyCell = this.findEmptyCell(grid);

    if (emptyCell[0] === -1 && emptyCell[1] === -1) {
      return true; // All cells have been filled, puzzle is solved
    }

    const [row, col] = emptyCell;

    for (let num = 1; num <= 9; num++) {
      if (this.isValid(grid, row, col, num)) {
        grid[row][col] = num;

        if (this.solveSudoku(grid)) {
          return true;
        }

        // Backtrack
        grid[row][col] = null;
      }
    }

    return false; // No solution found
  }
}

module.exports = SudokuSolver;
