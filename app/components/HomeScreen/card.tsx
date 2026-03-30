import Typography from '@/constants/typography';
import React, { useRef } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface TestRideCardProps {
  number: string;
  label: string;
  isRed?: boolean;
  cardHeight?: number; // Make height dynamic
  fontScale?: number; // Make font scale dynamic
  variant?: 'default' | 'retails'; // New prop to specify variant
  onPress?: () => void; // Add onPress prop for button functionality
}

const TestRideCard: React.FC<TestRideCardProps> = ({
  number,
  label,
  isRed = false,
  cardHeight = 120, // Fixed 120px from Figma
  fontScale = 1,
  variant = 'default', // Default to original behavior
  onPress
}) => {
  // Navigation protection ref
  const isNavigatingRef = useRef(false);

  // Color scheme based on isRed prop
  const cardBgColor = isRed ? '#FDE3E0' : '#DEEEF6'; // River Red/02 or River Blue/02 
  const numberColor = isRed ? '#4C2522' : '#00405D'; // River Red/06 or River Blue/06
  const labelColor = isRed ? '#934842' : '#007DB6'; // River Red/05 or River Blue/05

  // Typography selection based on variant
  const numberTypography = variant === 'retails' ? Typography.headline5 : Typography.headline3B;
  const labelTypography = variant === 'retails' ? Typography.copy2 : Typography.copy1;
  const textColor = variant == 'retails'? isRed ? '#F3776C': '#007DB6' : labelColor;

  // Protected navigation handler
  const handleCardPressWithNavigation = () => {
    if (isNavigatingRef.current) return;
    
    isNavigatingRef.current = true;
    
    // Call the original handler
    if (onPress) {
      onPress();
    }
    
    // Reset navigation flag after delay
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000); // Adjust as needed
  };

  const CardContent = () => (
    <View
      style={{
        flex: 1,
        height: cardHeight, // Fixed height from Figma
        backgroundColor: cardBgColor,
        borderRadius: 16,
        paddingHorizontal: 32, // Fixed 32px horizontal padding from Figma
        paddingVertical: 14, // Fixed 14px vertical padding from Figma
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2, // Fixed 2px gap from Figma
          width: '100%',
        }}
      >
        {/* Number - Dynamic typography based on variant */}
        <View
          style={{
            minWidth: 40,
            // height: 36, // Fixed height for number container
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={[
              numberTypography,
              {
                textAlign: 'center',
                color: numberColor,
              },
            ]}
            numberOfLines={1}
            // adjustsFontSizeToFit={true}
            // minimumFontScale={0.7}
          >
            {number}
          </Text>
        </View>
                
        {/* Label - Dynamic typography based on variant */}
        <View
          style={{
            width: 120, // Fixed width from Figma
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={[
              labelTypography,
              {
                textAlign: 'center',
                color: textColor,
                // fontSize: labelTypography.fontSize * fontScale,
                // lineHeight: labelTypography.lineHeight * fontScale,
                width: '80%',
              }
            ]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {label}
          </Text>
        </View>
      </View>
    </View>
  );

  // If onPress is provided, wrap in TouchableOpacity with navigation protection
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={handleCardPressWithNavigation}
        activeOpacity={0.7}
        style={{ flex: 1 }}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  // Otherwise, return the card without touch handling
  return <CardContent />;
};

export default TestRideCard;