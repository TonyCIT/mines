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
  const [mineCount, setMineCount] = useState(currentDifficulty.MINES_COUNT);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  // feeling lucky punk
  const [isLuckyPunkMode, setIsLuckyPunkMode] = useState(false);
  const [score, setScore] = useState(0);
  const [stopButtonDisabled, setStopButtonDisabled] = useState(true); 
  // score
  const [scores, setScores] = useState([]);


  useEffect(() => {
    // Disable stop button if lucky mode is enabled but no cell has been pressed yet
    if (isLuckyPunkMode && !gameStarted) {
      setStopButtonDisabled(true);
    } else {
      setStopButtonDisabled(false);
    }
  }, [isLuckyPunkMode, gameStarted]);

  const startLuckyPunkMode = () => {
    setIsLuckyPunkMode(true);
    setGridData(initializeGrid(LUCKY_PUNK.GRID_SIZE, LUCKY_PUNK.GRID_SIZE, LUCKY_PUNK.MINES_COUNT, true));
    setMineCount(LUCKY_PUNK.MINES_COUNT);
    setScore(0);
    setGameOver(false);
    setGameStarted(false); // Game hasn't really started until a cell is pressed
    setTimeElapsed(0);
    setCurrentDifficulty(LUCKY_PUNK);
    setStopButtonDisabled(true); // Disable stop button until a cell is pressed
  };

  const handleStopPress = () => {
    handleEndGameAlert(true);
    setIsLuckyPunkMode(false); // Exit Lucky Punk mode
    setScore(0);
    setGameOver(true); // Set game over to true
    setGameStarted(false);
    setStopButtonDisabled(true); // Disable stop button since the game has stopped
  };

  useEffect(() => {
    let intervalId;
    if (gameStarted && !gameOver) {
      intervalId = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [gameStarted, gameOver]);

  const handleEndGameAlert = (win) => {
    if (win) {
      let finalScore;
      if (isLuckyPunkMode) {
        finalScore = score - timeElapsed;
      } else {
        finalScore = Math.abs(timeElapsed);
      }
      finalScore = Math.abs(finalScore); // Convert negative score to positive
  
      setGameOver(true); // Set game over before resetting to prevent further actions
      if (isLuckyPunkMode) {
        Alert.alert(
          "Congratulations",
          `You've won the game! Your final score is: ${finalScore + 5}`,
          [
            { text: "OK", onPress: () => startLuckyPunkMode() }
          ]
        );
      } else {
        Alert.alert(
          "Congratulations",
          `You've won the game! Your final score is: ${finalScore}`,
          [
            { text: "OK" }
          ]
        );
      }
    } else {
      setScore(0); // Reset score because a mine was hit
      setGameOver(true); // Set game over before resetting to prevent further actions
      Alert.alert("Boom!", "You hit a mine! Score reset to 0", [{ text: "OK" }]);
    }
  };
  

  const checkGameCompletion = () => {
    if (isLuckyPunkMode) {
      // In "Feeling Lucky, Punk" mode, completion might be based solely on revealing non-mine cells.
      for (let row of gridData) {
        for (let cell of row) {
          // If there's a non-mine cell that hasn't been revealed, the game is not complete.
          if (!cell.isMine && !cell.isRevealed) {
            return false; // Game is not complete, as there are still safe cells to reveal.
          }
        }
      }
      return true; // All non-mine cells have been revealed, game is complete.
    } else {
      // For normal mode, you might still check both conditions: mines flagged and non-mine cells revealed.
      let mineCellsFlagged = true; // Assume all mines are correctly flagged initially
      let nonMineCellsRevealed = true; // Assume all non-mine cells are revealed initially
  
      for (let row of gridData) {
        for (let cell of row) {
          if (cell.isMine && !cell.isFlagged) {
            mineCellsFlagged = false; // A mine is not flagged.
          }
          if (!cell.isMine && !cell.isRevealed) {
            nonMineCellsRevealed = false; // A non-mine cell is not revealed.
          }
        }
      }
      return mineCellsFlagged && nonMineCellsRevealed; // Both conditions must be true for the game to be complete.
    }
  };
  

  const handleCellPress = (rowIndex, cellIndex) => {
    if (isLuckyPunkMode) {
      if (!gameStarted) {
        setGameStarted(true);
      }
      if (gameOver) return;

      const { grid, gameOver: isGameOver } = revealCell(gridData, rowIndex, cellIndex, true);
      if (isGameOver) {
        handleEndGameAlert(false);
        setIsLuckyPunkMode(false);

      } else {
        if (!gameOver) { // Ensure the game is not over before updating the score
          setScore((prevScore) => prevScore + 5);
        }
        if (checkGameCompletion()) {
          handleEndGameAlert(true);
        }
      }
      setGridData(grid);
    } else {
      if (!gameStarted) {
        setGameStarted(true);
      }
      if (gameOver) return;

      const { grid, gameOver: isGameOver } = revealCell(gridData, rowIndex, cellIndex);
      setGridData(grid);
      if (isGameOver) {
        handleEndGameAlert(false);
      } else if (checkGameCompletion()) {
        handleEndGameAlert(true);
      }
    }
  };
  
 
  const handleCellLongPress = (rowIndex, cellIndex) => {
    if (gameOver) return;
    const { grid, flagAdded } = toggleFlag(gridData, rowIndex, cellIndex);
    setGridData(grid);
    setMineCount(prevCount => prevCount + (flagAdded ? -1 : 1));
    if (!gameOver && checkGameCompletion()) {
      handleEndGameAlert(true);
      setGameOver(true);
    }
  };

  const handleDifficultyChange = (difficulty) => {
    setCurrentDifficulty(difficulty);
    // resetGame(); // Reset the game parameters
    setGridData(initializeGrid(difficulty.GRID_X, difficulty.GRID_Y, difficulty.MINES_COUNT));
    setIsLuckyPunkMode(false);
    setGameOver(false);
    setGameStarted(false);
    setTimeElapsed(0);
    setMineCount(difficulty.MINES_COUNT);
    setScore(0);
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
        {/* Toggle Feeling Lucky, Punk Mode */}
        {!isLuckyPunkMode && (
          <Button title="Feeling Lucky, Punk" onPress={startLuckyPunkMode} />
        )}
      </View>

      {gameOver && <Text style={styles.gameOverText}>Game Over</Text>}
      {isLuckyPunkMode && (
        <Button title="Stop" onPress={handleStopPress} disabled={stopButtonDisabled} />
      )}
      <Grid
        gridData={gridData}
        tableWidth={currentDifficulty.GRID_Y}
        onCellPress={handleCellPress}
        onCellLongPress={handleCellLongPress}
        gameOver={gameOver} // Pass gameOver state to Grid component
      />
      {isLuckyPunkMode ? (
        <View style={styles.instructions}>
          <Text style={styles.instructionText1}>Feeling Lucky, Punk Mode:</Text>
          <Text style={styles.instructionText}>1- Tap a cell to start timer.</Text>
          <Text style={styles.instructionText}>2 - Try to reveal as many cells as possible without hitting a mine.</Text>
          <Text style={styles.instructionText}>3 - Press "Stop" when you're happy with your score.</Text>
        </View>
      ) : (
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>1 - Select a difficulty to start / restart the game.</Text>
          <Text style={styles.instructionText}>2 - Tap a cell to reveal it.</Text>
          <Text style={styles.instructionText}>3 - Long press to flag / unflag suspected cell mine.</Text>
          <Text style={styles.instructionText}>4 - Clear all non-mine cells to win.</Text>
        </View>
      )}
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
  instructions: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  instructionText1: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
  },
});

export default App;
