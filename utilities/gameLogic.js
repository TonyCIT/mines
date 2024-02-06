export const initializeGrid = (rows, cols, mines, noHints = false) => {
  const grid = new Array(rows).fill(null).map(() => 
    new Array(cols).fill(null).map(() => ({
      isMine: false, 
      isRevealed: false, 
      isFlagged: false, 
      adjacentMines: 0
    }))
  );

  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    if (!grid[row][col].isMine) {
      grid[row][col].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate adjacent mines for each cell
  if (!noHints) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!grid[r][c].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const adjRow = r + i;
              const adjCol = c + j;
              if (adjRow >= 0 && adjRow < rows && adjCol >= 0 && adjCol < cols) {
                count += grid[adjRow][adjCol].isMine ? 1 : 0;
              }
            }
          }
          grid[r][c].adjacentMines = count;
        }
      }
    }
  }
    // shows the "game" in the terminal
  console.log('Final grid:', grid.map(row => row.map(cell => cell.isMine ? 'M' : '0').join(' ')).join('\n'));
  return grid;
};

  
  
export const revealCell = (grid, row, col, noHints = false) => {
  // Copy the grid to avoid mutating the state directly
  const newGrid = grid.map(row => row.slice());

  // If in Feeling Lucky Punk mode, set noRecursiveReveal to true
  const noRecursiveReveal = noHints;
  
  // Directly reveal the cell without checking for adjacent mines if noHints is true
  if (noHints) {
    if (!newGrid[row][col].isRevealed) {
      newGrid[row][col].isRevealed = true;
      // If the cell is a mine, then it's game over
      if (newGrid[row][col].isMine) {
        return { grid: newGrid, gameOver: true };
      }
    }
    // Return the updated grid and that the game is not over
    return { grid: newGrid, gameOver: false };
  } else {
    // Keep the existing logic that handles revealing cells normally
    return revealCellHelper(newGrid, row, col, true, noRecursiveReveal);
  }
};


function revealCellHelper(grid, row, col, firstCall = true, noRecursiveReveal = false) {
  const cell = grid[row][col];
  
  // Base conditions for stopping recursion
  if (cell.isRevealed || cell.isFlagged || (!firstCall && cell.isMine)) {
    return { grid, gameOver: false };
  }

  cell.isRevealed = true;

  // If mine is revealed on first call, game is over
  if (firstCall && cell.isMine) {
    return { grid, gameOver: true };
  }

  // If no adjacent mines and recursive reveal is allowed, recursively reveal adjacent cells
  if (!noRecursiveReveal && cell.adjacentMines === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const adjRow = row + i;
        const adjCol = col + j;
        // Skip the original cell, out-of-bounds locations, and cells that are already revealed or are mines
        if ((i !== 0 || j !== 0) && 
            adjRow >= 0 && adjRow < grid.length &&
            adjCol >= 0 && adjCol < grid[0].length) {
          revealCellHelper(grid, adjRow, adjCol, false);
        }
      }
    }
  }

  return { grid, gameOver: false };
}
  
  // New function to toggle the flag on a cell
export const toggleFlag = (grid, row, col) => {
  const newGrid = [...grid];
  const cell = newGrid[row][col];

  // Toggle the isFlagged state
  cell.isFlagged = !cell.isFlagged;

  // Return updated grid and whether a flag was added or removed
  return { 
    grid: newGrid, 
    flagAdded: cell.isFlagged 
  };
};