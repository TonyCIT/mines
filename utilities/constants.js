// Game grid settings
//export const GRID_SIZE = 14; // Size of the grid (10x10)
//export const MINES_COUNT = 10; // Number of mines

// Difficulty levels 
export const EASY = { GRID_X: 10, GRID_Y: 10, MINES_COUNT: 10, label: 'Easy' };
export const MEDIUM = { GRID_X: 15, GRID_Y: 13, MINES_COUNT: 25, label: 'Medium' };
export const HARD = { GRID_X: 17, GRID_Y: 14, MINES_COUNT: 45, label: 'Hard' };
// feeling lucky punk
export const LUCKY_PUNK = { GRID_SIZE: 5, MINES_COUNT: 3 };



// Cell appearance
// export const CELL_SIZE = 20; // Size of each cell in pixels
export const CELL_COLOR = '#f0f0f0'; // Default cell color
export const REVEALED_CELL_COLOR = '#bdbdbd'; // Color of a revealed cell
export const FLAGGED_CELL_COLOR = '#ffcc00'; // Color of a flagged cell

// Text and color for the numbers in the game (1-8)
export const NUMBER_COLORS = {
  1: '#1a1aff', // Blue for 1
  2: '#2a8b2a', // Green for 2
  3: '#ff0000', // Red for 3
  4: '#00008b', // Dark blue for 4
  5: '#8b0000', // Dark red for 5
  6: '#008080', // Teal for 6
  7: '#000000', // Black for 7
  8: '#808080', // Gray for 8
};

// Timer settings
export const TIMER_UPDATE_INTERVAL = 1000; // Timer update interval in milliseconds (1000ms = 1 second)

// Other game settings
export const LONG_PRESS_DURATION = 500; // Duration in milliseconds to trigger a long press (e.g., for flagging a cell)
