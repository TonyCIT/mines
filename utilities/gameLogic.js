// Function to initialize the grid with mines and calculate adjacent mines
export const initializeGrid = (rows, cols, mines, noHints = false) => {
  // Create an empty grid with specified dimensions and initialize each cell with default values
  const grid = new Array(rows).fill(null).map(() => 
    new Array(cols).fill(null).map(() => ({
      isMine: false, // Whether the cell contains a mine
      isRevealed: false, // Whether the cell is revealed
      isFlagged: false, // Whether the cell is flagged by the player
      adjacentMines: 0 // Number of adjacent cells containing mines
    }))
  );

  // Place mines randomly on the grid
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    if (!grid[row][col].isMine) {
      grid[row][col].isMine = true; // Set the cell as a mine
      minesPlaced++;
    }
  }

  // Calculate adjacent mines for each cell if hints are enabled
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
          grid[r][c].adjacentMines = count; // Set the number of adjacent mines for the cell
        }
      }
    }
  }

  // Log the final grid to the console
  console.log('Final grid:', grid.map(row => row.map(cell => cell.isMine ? 'M' : '0').join(' ')).join('\n'));
  return grid; // Return the initialized grid
};

// Function to reveal a cell on the grid
export const revealCell = (grid, row, col, noHints = false) => {
  // Copy the grid to avoid mutating the state directly
  const newGrid = grid.map(row => row.slice());

  // If hints are disabled, reveal the cell without checking for adjacent mines
  const noRecursiveReveal = noHints;
  
  if (noRecursiveReveal) {
    if (!newGrid[row][col].isRevealed) {
      newGrid[row][col].isRevealed = true; // Set the cell as revealed
      if (newGrid[row][col].isMine) {
        return { grid: newGrid, gameOver: true }; // Game over if a mine is revealed
      }
    }
    return { grid: newGrid, gameOver: false }; // Return updated grid and indicate game is not over
  } else {
    return revealCellHelper(newGrid, row, col, true, noRecursiveReveal); // Continue with normal cell revealing logic
  }
};

// Helper function to recursively reveal adjacent cells
function revealCellHelper(grid, row, col, firstCall = true, noRecursiveReveal = false) {
  const cell = grid[row][col];
  
  // Base conditions for stopping recursion
  if (cell.isRevealed || cell.isFlagged || (!firstCall && cell.isMine)) {
    return { grid, gameOver: false };
  }

  cell.isRevealed = true; // Set the cell as revealed

  if (firstCall && cell.isMine) {
    return { grid, gameOver: true }; // Game over if the first revealed cell is a mine
  }

  if (!noRecursiveReveal && cell.adjacentMines === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const adjRow = row + i;
        const adjCol = col + j;
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

// Function to toggle the flag on a cell
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
