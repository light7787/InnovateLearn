import Typography from '@/constants/typography';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, Modal, Pressable, Animated } from 'react-native';

interface DropdownProps {
  label?: string;
  options: string[];
  value?: string;
  onSelect?: (value: string) => void;
  placeholder?: string;
}

export const Dropdownsmall: React.FC<DropdownProps> = ({
  label = 'Lead Source',
  options,
  value,
  onSelect,
  placeholder = 'Select an option',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

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

  const [, forceUpdate] = useState({});
  useEffect(() => {
    forceUpdate({});
  }, [value]);

  return (
    <View style={{ position: 'relative' }}>
      {/* Dropdown Button */}
      <TouchableOpacity
        onPress={toggleDropdown}
        onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout;
          setButtonLayout({ x, y, width, height });
        }}
        style={{
          minHeight: 32,
          backgroundColor: '#007DB6',
          borderRadius: 24,
          paddingHorizontal: 16,
          paddingVertical: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: isOpen ? 1 : 0,
          borderColor: isOpen ? '#007DB6' : undefined,
          alignSelf: 'flex-start',
        }}
      >
        <Text 
          style={[Typography.subline2, {
            color: 'white',
            paddingRight: 8,
            flexShrink: 0,
          }]}
        >
          {value || placeholder}
        </Text>
        
        <Animated.View
          style={{
            transform: [{
              rotate: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg'],
              })
            }]
          }}
        >
          <Ionicons
            name="chevron-down"
            size={20}
            color="#F7FBFD"
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Modal-based Dropdown Options */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="none"
        onRequestClose={closeDropdown}
      >
        <Pressable 
          style={{ flex: 1 }} 
          onPress={closeDropdown}
        >
          {/* Background overlay with fade */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              opacity: fadeAnim,
            }}
          />
          
          {/* Dropdown content */}
          <Animated.View style={{
            position: 'absolute',
            top: buttonLayout.y + buttonLayout.height + 16,
            right: 16,
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 1000,
            borderWidth: 1,
            borderColor: '#61AFD2',
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
          }}>
            <View style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 16,
              width: '100%',
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
                      minHeight: 24,
                      gap: 8,
                      width: '100%',
                      paddingRight: 24,
                    }}
                  >
                    <Text 
                      style={[Typography.copy2, {
                        color: '#007DB6',
                        flex: 1,
                      }]}
                    >
                      {option}
                    </Text>
                    {value === option && (
                      <Animated.View
                        style={{
                          opacity: fadeAnim,
                          transform: [{
                            scale: fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.5, 1],
                            })
                          }]
                        }}
                      >
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color="#007DB6"
                        />
                      </Animated.View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};