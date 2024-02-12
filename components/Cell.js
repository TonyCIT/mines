import React from 'react'; // Importing React library
import { TouchableOpacity, StyleSheet, Text } from 'react-native'; // Importing necessary components from 'react-native' library
import { NUMBER_COLORS } from '../utilities/constants'; // Importing color definitions for numbers from a local file

// Functional component called Cell which takes several props to represent the state and behavior of a cell in a grid
const Cell = ({ isMine, isRevealed, isFlagged, adjacentMines, onPress, onLongPress, cellSize }) => {
  // Define styles for the cell
  const cellStyle = [
    styles.cell,
    isRevealed ? styles.revealed : styles.hidden,
    isFlagged && styles.flagged,
  ];

  // Define dynamic styles for the cell based on cellSize
  const dynamicCellStyle = {
    width: cellSize,
    height: cellSize,
  };

  // Function to render the content of the cell based on its state
  const renderCellContent = () => {
    if (isFlagged) {
      return <Text>🚩</Text>; // Render flag emoji if the cell is flagged
    }
    if (isRevealed) {
      if (isMine) {
        return <Text>💣</Text>; // Render bomb emoji if the cell is a mine
      }
      if (adjacentMines > 0) {
        return (
          <Text style={{ color: NUMBER_COLORS[adjacentMines] }}>
            {adjacentMines}
          </Text>
        ); // Render the number of adjacent mines with color based on the adjacentMines value
      }
    }
    return null; // Return null if there's no content to render
  };

  // Component rendering
  return (
    <TouchableOpacity
      style={[styles.cell, dynamicCellStyle, isRevealed ? styles.revealed : styles.hidden, isFlagged && styles.flagged]}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={isRevealed} // Disable onPress and onLongPress if the cell is already revealed
    >
      {renderCellContent()} {/* Render the content of the cell */}
    </TouchableOpacity>
  );
};

// Styles for the Cell component
const styles = StyleSheet.create({
  cell: {
    borderWidth: 0.5, // Set border width for the cell
    borderColor: '#bdbdbd', // Set border color for the cell
    alignItems: 'center', // Align content of the cell to the center
    justifyContent: 'center', // Align content of the cell to the center
    borderBottomWidth: StyleSheet.hairlineWidth, // Set border width for the bottom of the cell
    borderRightWidth: StyleSheet.hairlineWidth, // Set border width for the right side of the cell
    borderColor: 'grey', // Set border color for the cell
  },
  firstCellInRow: {
    borderLeftWidth: StyleSheet.hairlineWidth, // Set border width for the left side of the cell
  },
  firstCellInColumn: {
    borderTopWidth: StyleSheet.hairlineWidth, // Set border width for the top of the cell
  },
  hidden: {
    backgroundColor: '#f0f0f0', // Set background color for hidden cells
  },
  revealed: {
    backgroundColor: '#bdbdbd', // Set background color for revealed cells
  },
  flagged: {
    // Add any specific style for flagged cells
  },
});

export default Cell; // Exporting the Cell component
