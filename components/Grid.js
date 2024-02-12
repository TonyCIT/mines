import React from 'react'; // Importing React library
import { View, StyleSheet, Dimensions } from 'react-native'; // Importing necessary components from 'react-native' library
import Cell from './Cell'; // Importing the Cell component from a local file

const screenWidth = Dimensions.get('window').width; // Get the width of the device's screen
const gridPadding = 10; // Total padding for the grid
const gridWidth = screenWidth - gridPadding * 2; // Adjust the grid width based on the device's screen width

// Functional component called Grid which takes gridData, onCellPress, and onCellLongPress as props
const Grid = ({ gridData, onCellPress, onCellLongPress }) => {
  // Assuming gridData is a square matrix
  const numCellsHorizontal = gridData[0].length; // Number of cells horizontally
  const cellSize = gridWidth / numCellsHorizontal; // Calculate dynamic cell size based on the grid width and number of cells

  // Component rendering
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

// Styles for the Grid component
const styles = StyleSheet.create({
  grid: {
    padding: gridPadding, // Apply padding to the grid
    backgroundColor: '#ffffff', // Set background color of the grid
  },
  row: {
    flexDirection: 'row', // Arrange cells in a row
  },
});

export default Grid; // Exporting the Grid component
