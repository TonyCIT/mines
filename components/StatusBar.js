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
      {/* Remove the nested Text component for Mines */}
      <Text>Mines: {mineCount}</Text>
      {/* Time is already correctly formatted */}
      <Text>Time: {formatTime(timeElapsed)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
  },
});

export default StatusBar;
