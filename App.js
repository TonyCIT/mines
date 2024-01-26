import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, Alert } from 'react-native';
import Grid from './components/Grid';
import StatusBar from './components/StatusBar';
import { initializeGrid, revealCell, toggleFlag } from './utilities/gameLogic';
import { GRID_SIZE, MINES_COUNT } from './utilities/constants';

const App = () => {
  const [gridData, setGridData] = useState(() => initializeGrid(GRID_SIZE, GRID_SIZE, MINES_COUNT));
  const [gameOver, setGameOver] = useState(false);
  const [mineCount, setMineCount] = useState(MINES_COUNT);

  const handleCellPress = (rowIndex, cellIndex) => {
    if (gameOver) return;
    const { grid, gameOver: isGameOver } = revealCell(gridData, rowIndex, cellIndex);
    setGridData(grid);
    if (isGameOver) {
      Alert.alert("Game Over", "You hit a mine!", [{ text: "OK" }]);
      setGameOver(true);
    }
  };

  const handleCellLongPress = (rowIndex, cellIndex) => {
    if (gameOver) return;
    const { grid, flagAdded } = toggleFlag(gridData, rowIndex, cellIndex);
    setGridData(grid);
    setMineCount(prevCount => prevCount + (flagAdded ? -1 : 1));
  };

  const resetGame = () => {
    setGridData(initializeGrid(GRID_SIZE, GRID_SIZE, MINES_COUNT));
    setGameOver(false);
    setMineCount(MINES_COUNT);
  };

  return (
    <View style={styles.container}>
      <StatusBar mineCount={mineCount} timeElapsed={0} />
      <Grid 
        gridData={gridData} 
        onCellPress={handleCellPress}
        onCellLongPress={handleCellLongPress} 
      />
      {gameOver && <Text style={styles.gameOverText}>Game Over</Text>}
      <Button title="Reset Game" onPress={resetGame} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  gameOverText: {
    fontSize: 24,
    color: 'red',
    margin: 10,
  },
});

export default App;
