import Typography from '@/constants/typography';
import React, { useState } from 'react';
import { Button } from 'react-native-paper';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
};

export const PrimaryButton = ({ 
  title, 
  onPress, 
  disabled = false,
  color = '#00405D' 
}: PrimaryButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  return (
    <Button
      mode="contained"
      onPress={() => {
        onPress(); // Call the original onPress prop
        // Any other logic you want to run after the press
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      className={`w-[184px] h-12 rounded-2xl justify-center items-center mt-8 ${disabled ? 'opacity-60' : ''}`}
      labelStyle={[
        Typography.subline1,
        {
          color: disabled ? '#61AFD2' : (isPressed ? '#000000' : '#F7FBFD'), // Black text when pressed, otherwise white
          textTransform: 'none',
        }
      ]}
      style={{
        backgroundColor: disabled ? '#DEEEF6' : (isPressed ? '#FFC500' : '#00405D'), // Orange when pressed, otherwise original color
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        height: 48,
        width: 184
      }}
      contentStyle={{
        height: 48,
      }}
    >
      {title}
    </Button>
  );
};