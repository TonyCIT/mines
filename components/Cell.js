import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { NUMBER_COLORS } from '../utilities/constants'; // Assuming you have color definitions for numbers

const Cell = ({ isMine, isRevealed, isFlagged, adjacentMines, onPress, onLongPress, cellSize }) => {
  const cellStyle = [
    styles.cell,
    isRevealed ? styles.revealed : styles.hidden,
    isFlagged && styles.flagged,
  ];

  const dynamicCellStyle = {
    width: cellSize,
    height: cellSize,
  };

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
      style={[styles.cell, dynamicCellStyle, isRevealed ? styles.revealed : styles.hidden, isFlagged && styles.flagged]}
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
    borderWidth: 0.5,
    borderColor: '#bdbdbd',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: 'grey',
  },
  firstCellInRow: {
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
  firstCellInColumn: {
    borderTopWidth: StyleSheet.hairlineWidth,
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
