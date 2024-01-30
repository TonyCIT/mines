import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Text, Alert, TouchableOpacity } from 'react-native';
import Grid from './components/Grid';
import StatusBar from './components/StatusBar';
import { initializeGrid, revealCell, toggleFlag } from './utilities/gameLogic';
import { GRID_SIZE, MINES_COUNT, EASY, MEDIUM, HARD } from './utilities/constants';

const App = () => {
  const [currentDifficulty, setCurrentDifficulty] = useState(EASY);
  const [gridData, setGridData] = useState(() => initializeGrid(GRID_SIZE, currentDifficulty.GRID_SIZE, currentDifficulty.MINES_COUNT));
  const [gameOver, setGameOver] = useState(false);
  const [mineCount, setMineCount] = useState(currentDifficulty.MINES_COUNT); // Initialize mine count based on difficulty
  const [gameStarted, setGameStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  


  // Effect to handle the timer
  useEffect(() => {
    let intervalId;
    if (gameStarted && !gameOver) {
      intervalId = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId); // Cleanup on unmount or game over
  }, [gameStarted, gameOver]);

  const checkGameCompletion = () => {
    let mineCellsFlagged = true;
    let nonMineCellsRevealed = true;

    for (let row of gridData) {
      for (let cell of row) {
        if (cell.isMine && !cell.isFlagged) {
          mineCellsFlagged = false;
        }
        if (!cell.isMine && !cell.isRevealed) {
          nonMineCellsRevealed = false;
        }
      }
    }

    return mineCellsFlagged && nonMineCellsRevealed;
  };

  const handleCellPress = (rowIndex, cellIndex) => {
    if (!gameStarted) {
      setGameStarted(true); // Start the game on the first cell press
    }
    if (gameOver) return;
    const { grid, gameOver: isGameOver } = revealCell(gridData, rowIndex, cellIndex);
    setGridData(grid);
    if (isGameOver) {
      Alert.alert("Game Over", "You hit a mine!", [{ text: "OK" }]);
      setGameOver(true);
    }
    if (!gameOver && checkGameCompletion()) {
      Alert.alert("Congratulations", "You've won the game!", [{ text: "OK" }]);
      setGameOver(true);
    }
  };

  const handleCellLongPress = (rowIndex, cellIndex) => {
    if (gameOver) return;
    const { grid, flagAdded } = toggleFlag(gridData, rowIndex, cellIndex);
    setGridData(grid);
    setMineCount(prevCount => prevCount + (flagAdded ? -1 : 1));
    if (!gameOver && checkGameCompletion()) {
      Alert.alert("Congratulations", "You've won the game!", [{ text: "OK" }]);
      setGameOver(true);
    }
  };

  const handleDifficultyChange = (difficulty) => {
    setCurrentDifficulty(difficulty);
    resetGame(difficulty.MINES_COUNT); // Reset the game when changing difficulty and update mine count
  };

  const resetGame = (newMineCount) => {
    setGridData(initializeGrid(GRID_SIZE, currentDifficulty.GRID_SIZE, newMineCount)); // Use the new mine count
    setGameOver(false);
    setGameStarted(false);
    setTimeElapsed(0);
    setMineCount(newMineCount); // Update mine count based on the new difficulty
  };
  

  return (
    <View style={styles.container}>

      <StatusBar mineCount={mineCount} timeElapsed={timeElapsed} />
      <View style={styles.difficultySelector}>
        <TouchableOpacity
          style={[styles.difficultyButton, currentDifficulty === EASY && styles.selectedDifficulty]}
          onPress={() => handleDifficultyChange(EASY)}
        >
          <Text style={styles.difficultyText}>Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.difficultyButton, currentDifficulty === MEDIUM && styles.selectedDifficulty]}
          onPress={() => handleDifficultyChange(MEDIUM)}
        >
          <Text style={styles.difficultyText}>Medium</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.difficultyButton, currentDifficulty === HARD && styles.selectedDifficulty]}
          onPress={() => handleDifficultyChange(HARD)}
        >
          <Text style={styles.difficultyText}>Hard</Text>
        </TouchableOpacity>
      </View>
      <Grid 
        gridData={gridData} 
        onCellPress={handleCellPress}
        onCellLongPress={handleCellLongPress} 
      />
      {gameOver && <Text style={styles.gameOverText}>Game Over</Text>}
      <Button title="Reset Game" onPress={() => resetGame(currentDifficulty.MINES_COUNT)} />

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
  difficultySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  difficultyButton: {
    backgroundColor: '#ccc',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  selectedDifficulty: {
    backgroundColor: '#007bff',
  },
  difficultyText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default App;
