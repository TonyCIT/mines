import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusBar = ({ mineCount, timeElapsed }) => {

  // Format time to display as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.statusBar}>
      {/* Use a single Text component to display both mine count and time */}
      <Text style={[styles.text, styles.mineCount]}>Mines: {mineCount}</Text>
      <Text style={[styles.text, styles.timeElapsed]}>Time: {formatTime(timeElapsed)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  mineCount: {
    marginRight: 'auto',
  },
  timeElapsed: {
    marginLeft: 'auto', 
  },
});

export default StatusBar;
