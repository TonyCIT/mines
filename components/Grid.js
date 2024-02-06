import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Cell from './Cell';

// Dynamic cell size calculation
const screenWidth = Dimensions.get('window').width;
const gridWidth = screenWidth - 10; // Subtract some padding for the grid


const Grid = ({ gridData, onCellPress, onCellLongPress }, tableWidth) => {
  const numCellsHorizontal = tableWidth; // Number of cells horizontally
  const cellSize = gridWidth / numCellsHorizontal; // Width for each cell

  return (
    <View style={styles.grid}>
      {gridData.map((rowData, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {rowData.map((cellData, cellIndex) => (
            <Cell
              key={cellIndex}
              {...cellData}
              /// pass cellSize as a property to cell compoonent
              cellSize={cellSize}
              onPress={() => onCellPress(rowIndex, cellIndex)}
              onLongPress={() => onCellLongPress(rowIndex, cellIndex)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    padding: 10,
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
  },
});

export default Grid;
