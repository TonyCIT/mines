export const initializeGrid = (rows, cols, mines) => {
    // Create a 2D array filled with default cell data
    const grid = new Array(rows).fill(null).map(() => 
      new Array(cols).fill({ isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0 })
    );
  
    // Randomly place mines
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
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!grid[r][c].isMine) {
          let count = 0;
          // Check all adjacent cells
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const adjRow = r + i;
              const adjCol = c + j;
              // Check if adjacent cell is within grid bounds
              if (adjRow >= 0 && adjRow < rows && adjCol >= 0 && adjCol < cols && grid[adjRow][adjCol].isMine) {
                count++;
              }
            }
          }
          grid[r][c].adjacentMines = count;
        }
      }
    }
  
    return grid;
  };
  
  
  export const revealCell = (grid, row, col) => {
    // Copy the grid to avoid mutating the state directly
    const newGrid = grid.map(row => row.slice());
    return revealCellHelper(newGrid, row, col);
  };
  
  function revealCellHelper(grid, row, col) {
    const cell = grid[row][col];
  
    // If cell is already revealed or flagged, return early
    if (cell.isRevealed || cell.isFlagged) {
      return { grid, gameOver: false };
    }
  
    cell.isRevealed = true;
  
    // If mine is revealed, game is over
    if (cell.isMine) {
      return { grid, gameOver: true };
    }
  
    // If no adjacent mines, recursively reveal adjacent cells
    if (cell.adjacentMines === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const adjRow = row + i;
            const adjCol = col + j;
            // Skip the original cell, out-of-bounds locations, and cells that are already revealed or are mines
            if ((i !== 0 || j !== 0) && 
                adjRow >= 0 && adjRow < grid.length &&
                adjCol >= 0 && adjCol < grid[0].length &&
                !grid[adjRow][adjCol].isRevealed &&
                !grid[adjRow][adjCol].isMine) {
              revealCellHelper(grid, adjRow, adjCol);
            }
          }
        }
      }
  
    return { grid, gameOver: false };
  }
  