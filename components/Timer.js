import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

export default function Timer({ seconds, onFinish }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (!seconds) return;

    setTimeLeft(seconds);
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          onFinish && onFinish();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds]);

  // Format time as mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const secondsLeft = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;

  // Determine color based on time left
  const getColor = () => {
    if (timeLeft < 30) return '#ff3b30'; // Red when < 30s
    if (timeLeft < 60) return '#ff9500'; // Orange when < 1min
    return '#34c759'; // Green otherwise
  };

  return (
    <View className="flex-row items-center">
      <Text className="text-base font-bold mr-1" style={{ color: getColor() }}>
        {formattedTime}
      </Text>
    </View>
  );
}
