import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusBar = ({ mineCount, gameActive }) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    let interval;

    // Start or reset the timer based on gameActive status
    if (gameActive) {
      setSecondsElapsed(0); // Reset the timer when a new game starts
      interval = setInterval(() => {
        setSecondsElapsed(prevSeconds => prevSeconds + 1);
      }, 1000);
    }

    // Cleanup interval on component unmount or game end
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameActive]); // gameActive should control the timer start/stop

  // Format time to display as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.statusBar}>
      <Text>Mines: {mineCount}</Text>
      <Text>Time: {formatTime(secondsElapsed)}</Text>
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
