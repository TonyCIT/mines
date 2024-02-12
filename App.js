import React, { useState, useEffect } from 'react'; // Import necessary components and hooks from React
import { StyleSheet, View, Button, Text, Alert, TouchableOpacity } from 'react-native'; // Import components from React Native
import Grid from './components/Grid'; // Import Grid component
import StatusBar from './components/StatusBar'; // Import StatusBar component
import { initializeGrid, revealCell, toggleFlag } from './utilities/gameLogic'; // Import game logic functions
import { LUCKY_PUNK, EASY, MEDIUM, HARD } from './utilities/constants'; // Import game constants
import NameInputModal from './components/NameInputModal'; // Import NameInputModal component

const App = () => {
  // Define state variables using useState hook
  // Define state variable for current difficulty and a function to update it
const [currentDifficulty, setCurrentDifficulty] = useState(EASY);
// Define state variable for grid data and a function to update it, initializing it with the grid for the current difficulty
const [gridData, setGridData] = useState(() => initializeGrid(currentDifficulty.GRID_X, currentDifficulty.GRID_Y, currentDifficulty.MINES_COUNT));
// Define state variable for game over status and a function to update it, initializing it as false
const [gameOver, setGameOver] = useState(false);
// Define state variable for mine count and a function to update it, initializing it with the mine count for the current difficulty
const [mineCount, setMineCount] = useState(currentDifficulty.MINES_COUNT);
// Define state variable for game started status and a function to update it, initializing it as false
const [gameStarted, setGameStarted] = useState(false);
// Define state variable for time elapsed and a function to update it, initializing it as 0
const [timeElapsed, setTimeElapsed] = useState(0);
// Define state variable for Lucky Punk mode status and a function to update it, initializing it as false
const [isLuckyPunkMode, setIsLuckyPunkMode] = useState(false);
// Define state variable for score and a function to update it, initializing it as 0
const [score, setScore] = useState(0);
// Define state variable for stop button disabled status and a function to update it, initializing it as true
const [stopButtonDisabled, setStopButtonDisabled] = useState(true);
// Define state variable for lucky scores and a function to update it, initializing it as an empty array
const [luckyScores, setLuckyScores] = useState([]);
// Define state variable for normal scores and a function to update it, initializing it as an empty array
const [normalScores, setNormalScores] = useState([]);
// Define state variable for top 3 name and a function to update it, initializing it as an empty string
const [top3Name, setTop3Name] = useState('');
// Define state variable for modal visibility and a function to update it, initializing it as false
const [modalVisible, setModalVisible] = useState(false);
// Define state variable for name modal visibility and a function to update it, initializing it as false
const [nameModalVisible, setNameModalVisible] = useState(false);
// Define state variable for player name and a function to update it, initializing it as an empty string
const [playerName, setPlayerName] = useState('');


  // Define a function called addScore that takes three parameters: newScore, playerName, and isLuckyMode
const addScore = (newScore, playerName, isLuckyMode) => {
  // Create a copy of either luckyScores or normalScores array, depending on the value of isLuckyMode
  const modeScores = isLuckyMode ? [...luckyScores] : [...normalScores]; 
  // Add a new score object with properties score and name to the modeScores array
  modeScores.push({ score: newScore, name: playerName }); 
  // Sort the modeScores array in descending order based on the score property
  modeScores.sort((a, b) => b.score - a.score);
  // Extract the top 3 scores from the sorted modeScores array
  const top3Scores = modeScores.slice(0, 3);
  // Update either luckyScores or normalScores state variable with the top 3 scores
  if (isLuckyMode) {
      setLuckyScores(top3Scores);
  } else {
      setNormalScores(top3Scores);
  }
};


  // useEffect hook to enable/disable stop button based on game mode and status
  useEffect(() => {
    if (isLuckyPunkMode && !gameStarted) {
      setStopButtonDisabled(true);
    } else {
      setStopButtonDisabled(false);
    }
  }, [isLuckyPunkMode, gameStarted]);

  // Function to start the Lucky Punk mode
  const startLuckyPunkMode = () => {
    // Set the isLuckyPunkMode state variable to true, indicating that the game is now in Lucky Punk mode
setIsLuckyPunkMode(true);
// Set the grid data using the initializeGrid function with parameters for the grid size and mine count for Lucky Punk mode
setGridData(initializeGrid(LUCKY_PUNK.GRID_SIZE, LUCKY_PUNK.GRID_SIZE, LUCKY_PUNK.MINES_COUNT, true));
// Set the mine count state variable to the number of mines for Lucky Punk mode
setMineCount(LUCKY_PUNK.MINES_COUNT);
// Set the score state variable to 0, indicating that the player's score is reset to 0 at the start of Lucky Punk mode
setScore(0);
// Set the gameOver state variable to false, indicating that the game is not over at the start of Lucky Punk mode
setGameOver(false);
// Set the gameStarted state variable to false, indicating that the game has not started yet in Lucky Punk mode
setGameStarted(false);
// Set the timeElapsed state variable to 0, indicating that no time has elapsed yet in Lucky Punk mode
setTimeElapsed(0);
// Set the currentDifficulty state variable to the Lucky Punk difficulty settings
setCurrentDifficulty(LUCKY_PUNK);
// Set the modalVisible state variable to true, displaying a modal for entering the player's name at the start of Lucky Punk mode
setModalVisible(true);
// Set the stopButtonDisabled state variable to true, disabling the stop button at the start of Lucky Punk mode
setStopButtonDisabled(true);

  };

  // Function to handle pressing the Stop button
  const handleStopPress = () => {
    handleEndGameAlert(true);
    setIsLuckyPunkMode(false);
    setScore(0);
    setGameOver(true);
    setGameStarted(false);
    setStopButtonDisabled(true);
  };

  // useEffect hook to start the timer when the game starts
  useEffect(() => {
    let intervalId;
    if (gameStarted && !gameOver) {
      intervalId = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [gameStarted, gameOver]);

  // Function to handle end game alert
  const handleEndGameAlert = (win) => {
    // Check if the player won the game
if (win) {
  // Calculate the final score
  let finalScore;
  if (isLuckyPunkMode) {
      // Adjust final score for Lucky Punk mode
      finalScore = score - timeElapsed;
  } else {
      finalScore = Math.abs(timeElapsed);
  }
  finalScore = Math.abs(finalScore);

  // Set gameOver state variable to true
  setGameOver(true);

  // Save the score when the game ends
  addScore(finalScore, top3Name, isLuckyPunkMode);

  // Check if the player achieved a high score in Lucky Punk mode
  if (isLuckyPunkMode) {
      // Check if the final score is in the top 3 scores
      if (luckyScores.find(entry => entry.score === finalScore)) {
          // Display the modal for entering the player's name
          setNameModalVisible(true);
      } else {
          // Display congratulations message with final score and restart Lucky Punk mode
          Alert.alert(
              "Congratulations",
              `You've won the game! Your final score is: ${finalScore}`,
              [{ text: "OK", onPress: () => startLuckyPunkMode() }]
          );
      }
  } else {
      // Check if the final score is in the top 3 scores
      if (normalScores.find(entry => entry.score === finalScore)) {
          // Display the modal for entering the player's name
          setNameModalVisible(true);
      } else {
          // Display congratulations message with final score
          Alert.alert(
              "Congratulations",
              `You've won the game! Your final score is: ${finalScore}`,
              [{ text: "OK" }]
          );
      }
  }
} else {
  // Handle game over scenario
  // Reset the score to 0
  setScore(0);
  // Set gameOver state variable to true
  setGameOver(true);
  // Display alert message indicating that the player hit a mine and reset score to 0
  Alert.alert("Boom!", "You hit a mine! Score reset to 0", [{ text: "OK" }]);
}
  };

  // Function to check if the game is completed
  const checkGameCompletion = () => {
    if (isLuckyPunkMode) {
      for (let row of gridData) {
        for (let cell of row) {
          if (!cell.isMine && !cell.isRevealed) {
            return false;
          }
        }
      }
      return true;
    } else {
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
    }
  };

  // Function to handle cell press
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
        if (!gameOver) {
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

  // Function to handle long press on a cell
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

  // Function to handle difficulty change
  const handleDifficultyChange = (difficulty) => {
    setCurrentDifficulty(difficulty);
    setGridData(initializeGrid(difficulty.GRID_X, difficulty.GRID_Y, difficulty.MINES_COUNT));
    setIsLuckyPunkMode(false);
    setGameOver(false);
    setGameStarted(false);
    setTimeElapsed(0);
    setMineCount(difficulty.MINES_COUNT);
    setScore(0);
  };

  // Function to handle saving player's name
  const handleNameSave = (name) => {
    setTop3Name(name);
    setNameModalVisible(false);
  };

 // Render the UI
return (
  // Main container for the entire app
  <View style={styles.container}>
      // Displaying the status bar with mine count and time elapsed
      <StatusBar mineCount={mineCount} timeElapsed={timeElapsed} />
      
      // Difficulty selector section
      <View style={styles.difficultySelector}>
          // Button for selecting Easy difficulty
          <TouchableOpacity
              style={[styles.difficultyButton, currentDifficulty === EASY && styles.selectedDifficulty]}
              onPress={() => handleDifficultyChange(EASY)}
          >
              <Text style={styles.difficultyText}>Easy</Text>
          </TouchableOpacity>
          // Button for selecting Medium difficulty
          <TouchableOpacity
              style={[styles.difficultyButton, currentDifficulty === MEDIUM && styles.selectedDifficulty]}
              onPress={() => handleDifficultyChange(MEDIUM)}
          >
              <Text style={styles.difficultyText}>Medium</Text>
          </TouchableOpacity>
          // Button for selecting Hard difficulty
          <TouchableOpacity
              style={[styles.difficultyButton, currentDifficulty === HARD && styles.selectedDifficulty]}
              onPress={() => handleDifficultyChange(HARD)}
          >
              <Text style={styles.difficultyText}>Hard</Text>
          </TouchableOpacity>
          // Button for starting Lucky Punk mode
          {!isLuckyPunkMode && (
              <Button title="Feeling Lucky, Punk" onPress={startLuckyPunkMode} />
          )}
      </View>

      // Display "Game Over" text when the game is over
      {gameOver && <Text style={styles.gameOverText}>Game Over</Text>}
      
      // Display "Stop" button during Lucky Punk mode
      {isLuckyPunkMode && (
          <Button title="Stop" onPress={handleStopPress} disabled={stopButtonDisabled} />
      )}
      
      // Display the game grid
      <Grid
          gridData={gridData}
          tableWidth={currentDifficulty.GRID_Y}
          onCellPress={handleCellPress}
          onCellLongPress={handleCellLongPress}
          gameOver={gameOver}
      />
      
      // Display the modal for entering the player's name
      <NameInputModal 
          visible={nameModalVisible} 
          onSave={handleNameSave} 
      />
      
      // Display the top 3 scores
      <View>
          <Text>Top 3 Scores:</Text>
          {isLuckyPunkMode ? (
              // Display top scores in Lucky Punk mode
              luckyScores.map((scoreEntry, index) => (
                  <Text key={index}>{`Score: ${scoreEntry.score} - Name: ${scoreEntry.name}`}</Text>
              ))
          ) : (
              // Display top scores in normal mode
              normalScores.map((scoreEntry, index) => (
                  <Text key={index}>{`Score: ${scoreEntry.score} - Name: ${scoreEntry.name}`}</Text>
              ))
          )}
      </View>
      
      // Display instructions based on game mode
      {isLuckyPunkMode ? (
          // Display instructions for Lucky Punk mode
          <View style={styles.instructions}>
              <Text style={styles.instructionText1}>Feeling Lucky, Punk Mode:</Text>
              <Text style={styles.instructionText}>1- Tap a cell to start timer.</Text>
              <Text style={styles.instructionText}>2 - Try to reveal as many cells as possible without hitting a mine.</Text>
              <Text style={styles.instructionText}>3 - Press "Stop" when you're happy with your score.</Text>
          </View>
      ) : (
          // Display instructions for normal mode
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

// Stylesheet for the component
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

export default App; // Export the App component
