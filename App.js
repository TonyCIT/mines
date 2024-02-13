import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Text, Alert, TouchableOpacity } from 'react-native';
import Grid from './components/Grid';
import StatusBar from './components/StatusBar';
import { initializeGrid, revealCell, toggleFlag } from './utilities/gameLogic';
import { LUCKY_PUNK, EASY, MEDIUM, HARD } from './utilities/constants';
import NameInputModal from './components/NameInputModal';

const App = () => {
  const [currentDifficulty, setCurrentDifficulty] = useState(EASY);
  const [gridData, setGridData] = useState(() => initializeGrid(currentDifficulty.GRID_X, currentDifficulty.GRID_Y, currentDifficulty.MINES_COUNT));
  const [gameOver, setGameOver] = useState(false);
  const [mineCount, setMineCount] = useState(currentDifficulty.MINES_COUNT);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isLuckyPunkMode, setIsLuckyPunkMode] = useState(false);
  const [score, setScore] = useState(0);
  const [stopButtonDisabled, setStopButtonDisabled] = useState(true);
  const [luckyScores, setLuckyScores] = useState([]);
  const [normalScores, setNormalScores] = useState({
    [EASY.label]: [],
    [MEDIUM.label]: [],
    [HARD.label]: [],
  });
  
  const [top3Name, setTop3Name] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [tempScore, setTempScore] = useState(null); // Temporary score state

  // Simplify the addScore function to work correctly for both lucky and normal modes.
  const addScore = (newScore, playerName, isLuckyMode) => {
    if (isLuckyMode) {
      const updatedScores = [...luckyScores, { score: newScore, name: playerName }].sort((a, b) => b.score - a.score).slice(0, 3);
      setLuckyScores(updatedScores);
    } else {
      // Update normalScores for the current difficulty.
      const difficultyKey = currentDifficulty.label;
      const updatedScores = [...(normalScores[difficultyKey] || []), { score: newScore, name: playerName }].sort((a, b) => a.score - b.score).slice(0, 3);
      setNormalScores(prevScores => ({
        ...prevScores,
        [difficultyKey]: updatedScores,
      }));
    }
  };
  
  const addLuckyScore = (newScore, playerName) => {
    const updatedScores = [...luckyScores, { score: newScore, name: playerName }];
    updatedScores.sort((a, b) => b.score - a.score);
    const top3Scores = updatedScores.slice(0, 3);
    setLuckyScores(top3Scores);
  };

  useEffect(() => {
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
    setGameStarted(false);
    setTimeElapsed(0);
    setCurrentDifficulty(LUCKY_PUNK);
    setModalVisible(true);
    setStopButtonDisabled(true);
  };

  const handleStopPress = () => {
    handleEndGameAlert(true);
    setIsLuckyPunkMode(false);
    setScore(0);
    setGameOver(true);
    setGameStarted(false);
    setStopButtonDisabled(true);
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
        finalScore = score - timeElapsed; // Adjust final score for lucky punk mode
      } else {
        finalScore = Math.abs(timeElapsed);
      }
      finalScore = Math.abs(finalScore);

      setGameOver(true);

      const currentScores = isLuckyPunkMode ? luckyScores : normalScores[currentDifficulty.label];
      const sortedScores = [...currentScores, { score: finalScore, name: '' }].sort((a, b) => b.score - a.score);
      const isInTop3 = sortedScores.findIndex(scoreEntry => scoreEntry.score === finalScore) < 3;

      if (isInTop3) {
        setTempScore({ score: finalScore, isLuckyMode: isLuckyPunkMode });
        setNameModalVisible(true);
      } else {
        addLuckyScore(finalScore, "Anonymous", isLuckyPunkMode);
      }

      if (isLuckyPunkMode) {
        Alert.alert(
          "Congratulations",
          `You've won the game! Your final score is: ${finalScore}`,
          [{ text: "OK", onPress: () => startLuckyPunkMode() }]
        );
      } else {
        Alert.alert(
          "Congratulations",
          `You've won the game! Your final score is: ${finalScore}`,
          [{ text: "OK" }]
        );
      }
    } else {
      setScore(0);
      setGameOver(true);
      Alert.alert("Boom!", "You hit a mine! Score reset to 0", [{ text: "OK" }]);
    }
  };

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
    setGridData(initializeGrid(difficulty.GRID_X, difficulty.GRID_Y, difficulty.MINES_COUNT));
    setIsLuckyPunkMode(false);
    setGameOver(false);
    setGameStarted(false);
    setTimeElapsed(0);
    setMineCount(difficulty.MINES_COUNT);
    setScore(0);
  };

  const handleNameSave = (name) => {
    setTop3Name(name);
    if (tempScore) {
      addScore(tempScore.score, name, tempScore.isLuckyMode);
      setTempScore(null);
    }
    setNameModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar mineCount={mineCount} timeElapsed={timeElapsed} gameOver={gameOver} />
      <View style={styles.difficultySelector}>
        <TouchableOpacity
          style={[styles.difficultyButton, currentDifficulty === EASY && styles.selectedDifficulty]}
          onPress={() => handleDifficultyChange(EASY)}
        >
          <Text style={styles.difficultyText}>{EASY.label}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.difficultyButton, currentDifficulty === MEDIUM && styles.selectedDifficulty]}
          onPress={() => handleDifficultyChange(MEDIUM)}
        >
          <Text style={styles.difficultyText}>{MEDIUM.label}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.difficultyButton, currentDifficulty === HARD && styles.selectedDifficulty]}
          onPress={() => handleDifficultyChange(HARD)}
        >
          <Text style={styles.difficultyText}>{HARD.label}</Text>
        </TouchableOpacity>
        {!isLuckyPunkMode && (
          <TouchableOpacity 
            style={styles.luckyButton} onPress={startLuckyPunkMode}
            >
            <Text style={styles.luckyButtonText}>Lucky</Text>
          </TouchableOpacity>
        )}
      </View>

      <Grid
        gridData={gridData}
        tableWidth={currentDifficulty.GRID_Y}
        onCellPress={handleCellPress}
        onCellLongPress={handleCellLongPress}
        gameOver={gameOver}
      />
      <NameInputModal 
        visible={nameModalVisible} 
        onSave={handleNameSave} 
      />
      {isLuckyPunkMode && (
        <TouchableOpacity 
          style={[styles.stopButton, stopButtonDisabled ? null : styles.stopButtonActive]} 
          onPress={handleStopPress} 
          disabled={stopButtonDisabled}
        >
          <Text style={styles.stopButtonText}>Stop</Text>
        </TouchableOpacity>
      )}
      <View style={styles.topScores}>
        <Text style={styles.topScoresText}>Top 3 Scores:</Text>
        {isLuckyPunkMode ? (
          luckyScores.map((scoreEntry, index) => (
            <Text key={index} style={styles.scoreEntryText}>{`Score: ${scoreEntry.score}  Name: ${scoreEntry.name}`}</Text>
          ))
        ) : (
          (normalScores[currentDifficulty.label] || []).map((scoreEntry, index) => (
            <Text key={index} style={styles.scoreEntryText}>{`Score: ${scoreEntry.score}  Name: ${scoreEntry.name}`}</Text>
          )).reverse() // Reverse the order for normal mode
        )}
      </View>


      {isLuckyPunkMode ? (
        <View style={styles.instructions}>
          <Text style={styles.instructionText1}>Feeling Lucky Mode:</Text>
          <Text style={styles.instructionText}>1- Tap a cell to start timer.</Text>
          <Text style={styles.instructionText}>2 - Reveal cells without hitting a mine.</Text>
          <Text style={styles.instructionText}>3 - Press "Stop" if you are happy with your score.</Text>
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
    backgroundColor: '#E6E0F0', // Soft gray background for a neutral look
    alignItems: 'center',
    justifyContent: 'flex-start', // Start aligning items from the top
    padding: 20,
    paddingTop: 27, // Additional padding at the top for aesthetic spacing
  },
  difficultySelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%', // Utilize full width for spacing out difficulty buttons
    marginBottom: 20,
  },
  difficultyButton: {
    marginTop: 3,
    backgroundColor: '#1976D2', // Gold color for the lucky button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFEB3B',
  },
  selectedDifficulty: {
    borderColor: 'red', // Highlight selected difficulty with a yellow border
  },
  difficultyText: {
    color: '#ffffff',
    fontWeight: '600', // Medium font weight for readability
    fontSize: 16, // Slightly larger text for ease of reading
    textAlign: 'center', // Center align the text within the button
  },
  luckyButton: {
    marginTop: 3,
    backgroundColor: '#FFD700', // Gold color for the lucky button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#1976D2',
  },
  luckyButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  stopButton: {
    marginTop: 1,
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    borderColor: 'red', // Color for inactive state
    backgroundColor: 'lightgray', // Background color for inactive state
    marginBottom: 10,
  },
  stopButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
  stopButtonActive: {
    borderColor: 'green', // Color for active state
    backgroundColor: 'lightgreen', // Background color for active state
  },
  instructions: {
    position: 'absolute',
    bottom: 2, // Lock instructions at the bottom
    left: 20, // Add left margin for aesthetic spacing
    right: 20, // Add right margin for aesthetic spacing
    backgroundColor: '#ECEFF1', // Light background for instructions for subtlety
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1976D2', // A light grey border for definition
  },
  instructionText: {
    color: '#455A64', // Darker text color for contrast against the light background
    fontSize: 14, // Clear, readable font size
    textAlign: 'left',
    lineHeight: 18, // Line height for better readability in paragraphs
  },
  instructionText1: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
  },
  instructionTitle: {
    fontWeight: 'bold',
  },
  topScores: {
    marginTop: 1, // Add top margin for separation from other elements
  },
  topScoresText: {
    fontSize: 16,
    color: '#388E3C', // Green for a positive, high-score vibe
    fontWeight: 'bold',
  },
  scoreEntryText: {
    fontSize: 14,
    color: '#455A64', // Dark grey for readability
  },
});


export default App;