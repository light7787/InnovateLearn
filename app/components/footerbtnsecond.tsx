import React, { useRef } from 'react';
import { View, TouchableOpacity, Text, Animated, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface TypographyStyle {
  subline1: StyleProp<TextStyle>;
}

interface AnimatedButtonsFooterProps {
  handleCreateEnquiry: () => void;
  handleCancel: () => void;
  Typography: TypographyStyle;
  createEnquiryText?: string;
  cancelText?: string;
  extraPadding?: boolean;
  disableCreateEnquiry?: boolean;
  disableCancel?: boolean;
}

const AnimatedButtonsFooter: React.FC<AnimatedButtonsFooterProps> = ({ 
  handleCreateEnquiry, 
  handleCancel, 
  Typography,
  createEnquiryText = "Create Enquiry",
  cancelText = "Cancel",
  extraPadding = false,
  disableCreateEnquiry = false,
  disableCancel = false,
}) => {
  // Animated values for both buttons
  const createEnquiryAnim = useRef(new Animated.Value(0)).current;
  const cancelAnim = useRef(new Animated.Value(0)).current;
  const isNavigatingRef = useRef(false);

  // Animation functions
  const animatePress = (animValue: Animated.Value, toValue: number, duration: number = 150) => {
    Animated.timing(animValue, {
      toValue,
      duration,
      useNativeDriver: false,
    }).start();
  };

  const handleCreateEnquiryWithNavigation = () => {
    if (isNavigatingRef.current) return;
 
    isNavigatingRef.current = true;
    
    // Call the original handler
    handleCreateEnquiry();
    
    // Navigate if router is provided
   
 
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000); // Adjust as needed
  };

  // Interpolate colors for Create Enquiry button
  const createEnquiryBgColor = createEnquiryAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [disableCreateEnquiry ? '#DEEEF6' : '#00405D', disableCreateEnquiry ? '#DEEEF6' : 'yellow'],
  });

  const createEnquiryTextColor = createEnquiryAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [disableCreateEnquiry ? '#61AFD2' : '#F7FBFD', disableCreateEnquiry ? '#61AFD2' : '#000000'],
  });

  // Interpolate colors for Cancel button
  const cancelBgColor = cancelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [disableCancel ? '#DEEEF6' : '#FFFFFF', disableCancel ? '#DEEEF6' : 'yellow'],
  });

  const cancelTextColor = cancelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [disableCancel ? '#666666' : '#00405D', disableCancel ? '#666666' : '#000000'],
  });

  const cancelBorderColor = cancelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [disableCancel ? '#DEEEF6' : '#00405D', disableCancel ? '#DEEEF6' : 'yellow'],
  });

  const footerStyle: StyleProp<ViewStyle> = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F7FBFD',
    paddingTop: 16,
    paddingBottom: 0,
    paddingHorizontal: 16,
  };

  const buttonsContainerStyle: StyleProp<ViewStyle> = {
    flexDirection: 'row',
    gap: 12,
  };

  const baseButtonStyle: StyleProp<ViewStyle> = {
    flex: 1,
  };

  const animatedButtonStyle = (backgroundColor: Animated.AnimatedInterpolation<string>): StyleProp<Animated.AnimatedProps<ViewStyle>> => ({
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor,
  });

  const cancelButtonAdditionalStyle: Animated.WithAnimatedObject<ViewStyle> = {
    borderWidth: 1,
    borderColor: cancelBorderColor,
  };

  return (
    <View style={footerStyle}>
      <View style={buttonsContainerStyle}>
        {/* Create Enquiry Button */}
        <TouchableOpacity
          activeOpacity={disableCreateEnquiry ? 1 : 0.8}
          onPressIn={disableCreateEnquiry ? undefined : () => animatePress(createEnquiryAnim, 1)}
          onPressOut={disableCreateEnquiry ? undefined : () => animatePress(createEnquiryAnim, 0)}
          onPress={disableCreateEnquiry ? undefined : handleCreateEnquiryWithNavigation}
          style={baseButtonStyle}
          disabled={disableCreateEnquiry}
        >
          <Animated.View
            style={[animatedButtonStyle(createEnquiryBgColor)] as any}
          >
            <Animated.Text
              style={[
                Typography.subline1,
                {
                  color: createEnquiryTextColor,
                }
              ]}
            >
              {createEnquiryText}
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          // onPressIn={disableCancel ? undefined : () => animatePress(cancelAnim, 1)}
          // onPressOut={disableCancel ? undefined : () => animatePress(cancelAnim, 0)}
          onPress={disableCancel ? undefined : handleCancel}
          activeOpacity={disableCancel ? 1 : 0.8}
          style={baseButtonStyle}
          disabled={disableCancel}
        >
          <Animated.View
            style={[animatedButtonStyle(cancelBgColor), cancelButtonAdditionalStyle] as any}
          >
            <Animated.Text
              style={[
                Typography.subline1,
                {
                  color: cancelTextColor,
                }
              ]}
            >
              {cancelText}
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AnimatedButtonsFooter;