import React from 'react';
import { TouchableOpacity, StyleSheet, Text, Dimensions } from 'react-native';
import { NUMBER_COLORS } from '../utilities/constants'; // Assuming you have color definitions for numbers

// Dynamic cell size calculation
const screenWidth = Dimensions.get('window').width;
const gridWidth = screenWidth - 10; // Subtract some padding for the grid
const numCellsHorizontal = 10; // Number of cells horizontally
const cellSize = gridWidth / numCellsHorizontal; // Width for each cell

const Cell = ({ isMine, isRevealed, isFlagged, adjacentMines, onPress, onLongPress }) => {
  const cellStyle = [
    styles.cell,
    isRevealed ? styles.revealed : styles.hidden,
    isFlagged && styles.flagged,
  ];

  const renderCellContent = () => {
    if (isFlagged) {
      return <Text>🚩</Text>; // Ensure emojis or strings are wrapped in <Text>
    }
    if (isRevealed) {
      if (isMine) {
        return <Text>💣</Text>; // Ensure emojis or strings are wrapped in <Text>
      }
      if (adjacentMines > 0) {
        return (
          <Text style={{ color: NUMBER_COLORS[adjacentMines] }}>
            {adjacentMines}
          </Text>
        );
      }
    }
    return null; // Return null if there's nothing to render
  };

  return (
    <TouchableOpacity
      style={cellStyle}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={isRevealed}
    >
      {renderCellContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: cellSize,
    height: cellSize,
    borderWidth: 1,
    borderColor: '#bdbdbd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hidden: {
    backgroundColor: '#f0f0f0',
  },
  revealed: {
    backgroundColor: '#bdbdbd',
  },
  flagged: {
    // Add any specific style for flagged cells
  },
});

export default Cell;
