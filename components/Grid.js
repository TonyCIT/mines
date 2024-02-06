import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Cell from './Cell';

const screenWidth = Dimensions.get('window').width;
const gridPadding = 10; // Total padding for grid
const gridWidth = screenWidth - gridPadding * 2; // Adjust grid width based on the device's screen width

const Grid = ({ gridData, onCellPress, onCellLongPress }) => {
  // Assuming gridData is a square matrix
  const numCellsHorizontal = gridData[0].length; // Number of cells horizontally
  const cellSize = gridWidth / numCellsHorizontal; // Dynamic cell size based on the grid width and number of cells

  return (
    <View style={styles.grid}>
      {gridData.map((rowData, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
        {rowData.map((cellData, cellIndex) => (
          <Cell
            key={cellIndex}
            {...cellData}
            // Add conditional styling for the first cell of each row and column
            style={[
              cellIndex === 0 && styles.firstCellInRow,
              rowIndex === 0 && styles.firstCellInColumn,
            ]}
            cellSize={cellSize} // Pass the dynamically calculated cell size
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
    padding: gridPadding,
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
  },
});

export default Grid;
