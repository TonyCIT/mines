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
    const updatedScores = [...(normalScores[difficultyKey] || []), { score: newScore, name: playerName }].sort((a, b) => b.score - a.score).slice(0, 3);
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
      <StatusBar mineCount={mineCount} timeElapsed={timeElapsed} />
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
          <Button title="Lucky" onPress={startLuckyPunkMode} />
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
        gameOver={gameOver}
      />
      <NameInputModal 
        visible={nameModalVisible} 
        onSave={handleNameSave} 
      />
      <View>
        <Text>Top 3 Scores:</Text>
        {isLuckyPunkMode ? (
          luckyScores.map((scoreEntry, index) => (
            <Text key={index}>{`Score: ${scoreEntry.score}  Name: ${scoreEntry.name}`}</Text>
          ))
        ) : (
          normalScores[currentDifficulty.label] || []).map((scoreEntry, index) => (
            <Text key={index}>{`Score: ${scoreEntry.score}  Name: ${scoreEntry.name}`}</Text>
          )
        )}
      </View>

      {isLuckyPunkMode ? (
        <View style={styles.instructions}>
          <Text style={styles.instructionText1}>Feeling Lucky Mode:</Text>
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
    backgroundColor: 'gainsboro',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align content at the top
    padding: 20,
    marginTop: 10,
    paddingBottom: 50, // Add padding bottom to accommodate instructions
  },
  gameOverText: {
    fontSize: 24,
    color: 'red',
    marginVertical: 10,
    fontWeight: 'bold',
    alignSelf: 'center', // Center the text horizontally
  },
  difficultySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  difficultyButton: {
    backgroundColor: 'dodgerblue',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'dodgerblue',
  },
  selectedDifficulty: {
    backgroundColor: 'dodgerblue',
    borderWidth: 2,
    borderColor: 'dodgerblue',
  },
  difficultyText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  instructions: {
    position: 'absolute',
    bottom: 20, // Adjust this value to change the distance from the bottom
    left: 0,
    right: 0,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'dimgray',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  instructionText: {
    fontSize: 12,
    color: 'dimgray',
    textAlign: 'center',
    marginBottom: 5,
  },
  instructionText1: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
    marginBottom: 5,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
    marginTop: 10, // Add margin top to separate from the difficulty selector
  },
});





export default App;