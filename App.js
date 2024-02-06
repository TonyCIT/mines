import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Text, Alert, TouchableOpacity } from 'react-native';
import Grid from './components/Grid';
import StatusBar from './components/StatusBar';
import { initializeGrid, revealCell, toggleFlag } from './utilities/gameLogic';
import { LUCKY_PUNK, EASY, MEDIUM, HARD } from './utilities/constants';

const App = () => {
  const [currentDifficulty, setCurrentDifficulty] = useState(EASY);
  const [gridData, setGridData] = useState(() => initializeGrid(currentDifficulty.GRID_X, currentDifficulty.GRID_Y, currentDifficulty.MINES_COUNT));
  const [gameOver, setGameOver] = useState(false);
  const [mineCount, setMineCount] = useState(currentDifficulty.MINES_COUNT); // Initialize mine count based on difficulty
  const [gameStarted, setGameStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  // feeling lucky punk
  const [isLuckyPunkMode, setIsLuckyPunkMode] = useState(false);
  const [score, setScore] = useState(0);

  const startLuckyPunkMode = () => {
    setIsLuckyPunkMode(true);
    setGridData(initializeGrid(LUCKY_PUNK.GRID_SIZE, LUCKY_PUNK.GRID_SIZE, LUCKY_PUNK.MINES_COUNT, true));
    // Reset the score and other relevant states
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setTimeElapsed(0);
  };

  // handles stop and calculation
  const handleStopPress = () => {
    const finalScore = timeElapsed + score;
    Alert.alert("Stopped", `Your final score is: ${finalScore}`, [{ text: "OK" }]);
    setIsLuckyPunkMode(false);
  };
  
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
    // Only allow cell press if it's the 'Feeling Lucky, Punk' mode and the game hasn't started yet
    if (isLuckyPunkMode) {
      if (!gameStarted) {
      setGameStarted(true); // Start the game
      const { grid, gameOver: isGameOver } = revealCell(gridData, rowIndex, cellIndex, true); // true to indicate no hints
      setGridData(grid);
      if (isGameOver) {
        // If a mine is hit, game over
        Alert.alert("Boom!", "You hit a mine!", [{ text: "OK" }]);
        setIsLuckyPunkMode(false); // Exit 'Feeling Lucky, Punk' mode
        setGameOver(true); // Set game over
      } else {
        // If a safe cell is revealed, increment the score
        setScore((prevScore) => prevScore + 2); 
        setIsLuckyPunkMode(false); // Player can only uncover one cell, so end the mode
        setGameOver(false); // End the game - if true game ends on first click
      }
    }
    } else {

    }
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
    // Immediately create a new grid based on the new difficulty
    setGridData(initializeGrid(difficulty.GRID_X, difficulty.GRID_Y, difficulty.MINES_COUNT));
    setGameOver(false);
    setGameStarted(false);
    setTimeElapsed(0);
    setMineCount(difficulty.MINES_COUNT);
  };
  

  const resetGame = (newMineCount) => {
    // Use a functional update to ensure the state is updated based on the previous state
    setGridData(() => initializeGrid(currentDifficulty.GRID_X, currentDifficulty.GRID_Y, newMineCount));
    setGameOver(false);
    setGameStarted(false);
    setTimeElapsed(0);
    setMineCount(newMineCount);
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
        {!isLuckyPunkMode && (
            <Button title="Feeling Lucky, Punk" onPress={startLuckyPunkMode} />
          )}
          {isLuckyPunkMode && (
            <Button title="Stop" onPress={handleStopPress} />
          )}
      </View>
      <Grid 
        gridData={gridData}
        tableWidth={currentDifficulty.GRID_Y}
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
