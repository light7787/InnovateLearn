import Typography from '@/constants/typography';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';
import { Text, TouchableOpacity, View, Animated } from 'react-native';

interface DropdownProps {
  label?: string;
  options: string[];
  isRequired?: boolean;
  value?: string;
  onSelect?: (value: string) => void;
  placeholder?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label = 'Lead Source',
  isRequired=false,
  options,
  value,
  onSelect,
  placeholder = 'Select an option',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handleSelect = (option: string) => {
    onSelect?.(option);
    closeDropdown();
  };

  const openDropdown = () => {
    setIsOpen(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 120,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDropdown = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsOpen(false);
    });
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  // Calculate dynamic height based on number of options
  const calculateDropdownHeight = () => {
    const padding = 32; // 16px top + 16px bottom
    const optionHeight = 24; // Height of each option
    const gapBetweenOptions = 16; // Gap between options
    const totalOptionsHeight = options.length * optionHeight;
    const totalGapsHeight = Math.max(0, options.length - 1) * gapBetweenOptions;
    
    return padding + totalOptionsHeight + totalGapsHeight;
  };

  // Calculate inner content height
  const calculateInnerContentHeight = () => {
    const optionHeight = 24;
    const gapBetweenOptions = 16;
    const totalOptionsHeight = options.length * optionHeight;
    const totalGapsHeight = Math.max(0, options.length - 1) * gapBetweenOptions;
    
    return totalOptionsHeight + totalGapsHeight;
  };

  return (
    <View>
      {/* Label */}
      <Text style={[
        Typography.copy1,{
        
       
      
     
     
      }]} className='text-river-blue-6 mb-2'>
        {label}
        {isRequired && <Text className="text-red-500">*</Text>}
      </Text>
      
      {/* Dropdown Button */}
      <TouchableOpacity
        onPress={toggleDropdown}
        className='w-88'
        style={{
           // Fixed width from Figma
          height: 48,
          backgroundColor: '#DEEEF6',
          borderRadius: 24,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: isOpen ? 1 : 0,
          borderColor: isOpen ? '#007DB6' : undefined,
        }}
      >
        <Text 
          style={[
            Typography.copy1,{
              flex: 1, // Take available space
              marginRight: 8, // Space between text and icon
            }
          ]} 
          className='text-river-blue-5'
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {value || placeholder}
        </Text>

        <Animated.View
          style={{
            transform: [{
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg'],
              })
            }]
          }}
        >
          <FontAwesome5 
            name="chevron-down" 
            size={20} 
            color="#1976D2" 
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Dropdown Options */}
      {isOpen && (
        <Animated.View 
          className='w-88' 
          style={{
            // Match button width
            height: calculateDropdownHeight(), // Dynamic height
            backgroundColor: '#F7FBFD', // River Blue/01 background
            borderRadius: 16,
            marginTop: 4,
            padding: 16, // 16px padding all around
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15, // Match Figma shadow
            shadowRadius: 8, // Match Figma shadow
            elevation: 3,
            borderWidth: 1,
            borderColor: '#61AFD2', // River Blue/04 border
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                })
              }
            ],
          }}
        >
          <View style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 16, // 16px gap between options
            width: 310, // Inner content width
            height: calculateInnerContentHeight(), // Dynamic inner content height
          }}>
            {options.map((option, index) => (
              <Animated.View
                key={option}
                style={{
                  opacity: fadeAnim,
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    })
                  }],
                  width: '100%',
                }}
              >
                <TouchableOpacity
                  onPress={() => handleSelect(option)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: 310,
                    height: 24,
                    gap: 8, // 8px gap if there were icons
                  }}
                >
                  <Text 
                    className="text-river-blue-5 h-[24px] flex items-center" 
                    style={[
                      Typography.copy1,
                      { flex: 1 } // Take available space
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
};