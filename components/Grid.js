import React from 'react';
import { View, StyleSheet } from 'react-native';
import Cell from './Cell';

const Grid = ({ gridData, onCellPress, onCellLongPress }) => {
  return (
    <View style={styles.grid}>
      {gridData.map((rowData, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {rowData.map((cellData, cellIndex) => (
            <Cell
              key={cellIndex}
              {...cellData}
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
