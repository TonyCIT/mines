import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusBar = ({ mineCount, timeElapsed, gameOver }) => {
  // Format time to display as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.statusBar}>
      <Text style={[styles.text, styles.mineCount]}>Mines: {mineCount}</Text>
      {/* Conditionally render the "Game Over" message if gameOver is true */}
      {gameOver && <Text style={[styles.text, styles.gameOver]}>Game Over</Text>}
      <Text style={[styles.text, styles.timeElapsed]}>Time: {formatTime(timeElapsed)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 7,
    backgroundColor: '#fff',
    width: '107%',
    alignItems: 'center',
    marginTop: 10, // Lock the statusBar at the top with a 10 margin
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  mineCount: {
    marginRight: 'auto',
  },
  timeElapsed: {
    marginLeft: 'auto', 
  },
  gameOver: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'red', // Red accent for the game-over text to catch attention
    margin: 0.1,
  },
});

export default StatusBar;
