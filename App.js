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
    setMineCount(LUCKY_PUNK.MINES_COUNT);
    // Reset the score and other relevant states
    setScore(0);
    setGameOver(false);
    setGameStarted(false); // set this to true to start the game imediately
    setTimeElapsed(0);
  };

   // handles stop and calculation
   const handleStopPress = () => {
    const finalScore = score - timeElapsed;
    Alert.alert("Stopped", `Your final score is: ${finalScore}`, [{ text: "OK" }]);
    setScore(0);
    setIsLuckyPunkMode(true); // if true reset works okay, if false reset sends you to normal mode
    setGameOver(true);
    setGameStarted(false);
  };
  
  // Effect to handle the timer
useEffect(() => {
  let intervalId;
  // Check if the game has started and not yet over to start the timer
  if (gameStarted && !gameOver) {
    // Create a timer that increments the time elapsed every second
    intervalId = setInterval(() => {
      setTimeElapsed((prevTime) => prevTime + 1);
    }, 1000); // 1000 milliseconds = 1 second
  }
  // Cleanup function to clear the timer interval when the component unmounts
  // or when the game is over or not started to prevent memory leaks
  return () => clearInterval(intervalId);
}, [gameStarted, gameOver]); // This effect depends on gameStarted and gameOver states


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
    // Only allow cell press if it's the 'Feeling Lucky, Punk' mode and the game hasn't started yet
    if (isLuckyPunkMode) {
      if (!gameStarted) {
      setGameStarted(true); // Start the game
      }
      if (gameOver) return;
      const { grid, gameOver: isGameOver } = revealCell(gridData, rowIndex, cellIndex, true); // true to indicate no hints
        if (isGameOver) {
          
          // If a mine is hit, game over
          Alert.alert("Boom!", "You hit a mine!", [{ text: "OK" }]);
          setIsLuckyPunkMode(true);
          setGameOver(true); // Set game over
          setGameStarted(false); // End the game
          setScore(timeElapsed);
        } else {
          // If a safe cell is revealed, increment the score
          setScore((prevScore) => prevScore + 2); 
          if (!gameOver && checkGameCompletion()) {
            Alert.alert("Congratulations", `You've won the game! Your final score is: ${score}`, [{ text: "OK" }]);
            setGameOver(true);
          }
          setIsLuckyPunkMode(true); // Player can only uncover one cell, so end the mode
          setGameOver(false); // End the game - if true game ends on first click
        }
      setGridData(grid);
    } else {
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
    // Reset the game to initial parameters when changing difficulty, especially coming from Lucky Punk Mode
    setGridData(initializeGrid(difficulty.GRID_X, difficulty.GRID_Y, difficulty.MINES_COUNT));
    setIsLuckyPunkMode(false); // Ensure we exit Lucky Punk mode when changing difficulty
    setGameOver(false);
    setGameStarted(false);
    setTimeElapsed(0);
    setMineCount(difficulty.MINES_COUNT);
    setScore(0); // Reset score for good measure, though score is not used outside Lucky Punk Mode
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
      <Grid 
        gridData={gridData}
        tableWidth={currentDifficulty.GRID_Y}
        onCellPress={handleCellPress}
        onCellLongPress={handleCellLongPress} 
      />
      {gameOver && <Text style={styles.gameOverText}>Game Over</Text>}
      {/* Show Stop only in Lucky Punk Mode */}
      {isLuckyPunkMode && (
        <Button title="Stop/Reset" onPress={handleStopPress} />
      )}
      
       {/* Conditional rendering of instructions */}
    {isLuckyPunkMode ? (
      <View style={styles.instructions}>
        <Text style={styles.instructionText1}>Feeling Lucky, Punk Mode:</Text>
        <Text style={styles.instructionText}>1- Tap a cell to reveal it.</Text>
        <Text style={styles.instructionText}>2 - Try to reveal as many cells as possible without hitting a mine.</Text>
        <Text style={styles.instructionText}>3 - Press "Stop" when you're happy with your score.</Text>
        <Text style={styles.instructionText}>4 - Press "exit" if you hit a bomb.</Text>
      </View>
    ) : (
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>1 - Select a difficulty to start or restart the game.</Text>
        <Text style={styles.instructionText}>2 - Tap a cell to reveal it.</Text>
        <Text style={styles.instructionText}>3 - Long press to place a flag on suspected mines.</Text>
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
