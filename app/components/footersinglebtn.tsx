import React, { useRef } from 'react';
import { View, TouchableOpacity, Text, Animated, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Typography from '@/constants/typography';

interface TypographyStyle {
  subline1: StyleProp<TextStyle>;
}

import { DimensionValue } from 'react-native';

interface AnimatedSingleButtonProps {
  onPress: () => void;
  buttonText?: string;
  width?: DimensionValue;
  height?: number;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const AnimatedSingleButton: React.FC<AnimatedSingleButtonProps> = ({ 
  onPress, 
  buttonText = "Create Enquiry",
  width = 184, // Fixed width from Figma
  height = 48, // Fixed height from Figma
  containerStyle,
  disabled = false,
  style,
  textStyle
}) => {
  // Animated value for the button
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const isNavigatingRef = useRef(false);

  // Animation function
  const animatePress = (animValue: Animated.Value, toValue: number, duration: number = 150) => {
    if (!disabled) {
      Animated.timing(animValue, {
        toValue,
        duration,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleCreateEnquiryWithNavigation = () => {
    if (isNavigatingRef.current) return;
 
    isNavigatingRef.current = true;
    
    // Call the original handler
    onPress();
    
    // Navigate if router is provided
   
 
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000); // Adjust as needed
  };

  // Interpolate colors for the button - keeping original animation
  const buttonBgColor = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#00405D', 'yellow'], // Original animation: blue to yellow
  });

  const buttonTextColor = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F7FBFD', '#000000'], // Original animation: white to black
  });

  // Footer container style - matches Figma specifications
  const defaultContainerStyle: StyleProp<ViewStyle> = {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    height: 86, // Fixed height from Figma (748px to 844px = 96px)
    backgroundColor: 'rgba(247, 251, 253, 0.9)', // Semi-transparent background
    // Apply backdrop blur effect (iOS only, Android will ignore)
    backdropFilter: 'blur(4px)',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const buttonContainerStyle: StyleProp<ViewStyle> = {
    width: typeof width === 'number' ? width : 184,
    height: height,
    alignSelf: 'center',
  };

  const animatedButtonStyle = (backgroundColor: Animated.AnimatedInterpolation<string>): StyleProp<Animated.AnimatedProps<ViewStyle>> => ({
    width: '100%',
    height: height,
    borderRadius: 90, // Fully rounded (90px radius from Figma)
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: disabled ? '#DEEEF6' : backgroundColor,
    // Add subtle shadow for elevation
    shadowColor: '#00405D',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: disabled ? 0.05 : 0.1,
    shadowRadius: 4,
    elevation: disabled ? 1 : 3,
    opacity: disabled ? 0.8 : 1,
    
  });

  const getTextColor = () => {
    if (disabled) {
      return '#61AFD2';
    }
    return buttonTextColor;
  };

  return (
    <View style={[defaultContainerStyle, containerStyle]}>
      <View style={buttonContainerStyle}>
        <TouchableOpacity
          activeOpacity={disabled ? 1 : 0.8}
          onPressIn={() => animatePress(buttonAnim, 1)}
          onPressOut={() => animatePress(buttonAnim, 0)}
          onPress={disabled ? () => {} : handleCreateEnquiryWithNavigation}
          style={{ width: '100%', height: '100%' }}
          // Add accessibility
          accessibilityRole="button"
          accessibilityLabel={buttonText}
          accessibilityHint={disabled ? "Button is disabled" : "Creates a new enquiry"}
          accessibilityState={{ disabled }}
        >
          <Animated.View
            style={[animatedButtonStyle(buttonBgColor)] as any}
          >
            <Animated.Text
              style={[
                Typography.subline1,
                {
                  color: getTextColor(),
                  textAlign: 'center',
                  // Ensure text is properly centered
                  includeFontPadding: false,
                  textAlignVertical: 'center',
                },
                textStyle
              ]}
              numberOfLines={1}
            >
              {buttonText}
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AnimatedSingleButton;