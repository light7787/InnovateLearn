import Typography from '@/constants/typography';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface DropdownProps {
  label?: string;
  options: string[];
  value?: string;
  onSelect?: (value: string) => void;
  placeholder?: string;
  // Add external state management props
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export const Dropdownsmall2: React.FC<DropdownProps> = ({
  label = 'Lead Source',
  options,
  value,
  onSelect,
  placeholder = 'Select an option',
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
}) => {
  // Use internal state if external state is not provided
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Determine which state to use
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalSetIsOpen || setInternalIsOpen;

  const handleSelect = (option: string) => {
    onSelect?.(option);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Filter out the currently selected value from options
  const filteredOptions = options.filter(option => 
    option.toLowerCase() !== value?.toLowerCase()
  );

  // Calculate dynamic width based on longest option or current value
  const calculateWidth = () => {
    const allTexts = [...options, placeholder, value || ''];
    const longestText = allTexts.reduce((longest, current) => 
      current.length > longest.length ? current : longest
    );
    
    // Approximate width calculation: 8px per character + 32px padding + 24px for icon
    const estimatedWidth = Math.max(longestText.length * 8 + 56, 120); // Minimum 120px
    return Math.min(estimatedWidth, 250); // Maximum 250px
  };

  // Get dynamic styles based on selected value
  const getDynamicStyles = () => {
    if (!value) {
      return {
        backgroundColor: '#15CA5D',
        textColor: '#007DB6',
        iconColor: '#1976D2'
      };
    }

    switch (value.toLowerCase()) {
         case 'scheduled':
        return {
          backgroundColor: '#F7FBFD', // Green
          textColor: '#007DB6',       // White text
          iconColor: '#007DB6'        // White icon
        };
      case 'confirmed':
        return {
          backgroundColor: '#15CA5D', // Green
          textColor: '#FFFFFF',       // White text
          iconColor: '#FFFFFF'        // White icon
        };
      case 'rescheduled':
        return {
          backgroundColor: '#FFA500', // Amber
          textColor: '#FFFFFF',       // White text
          iconColor: '#FFFFFF'        // White icon
        };
      case 'cancelled':
        return {
          backgroundColor: '#F3776C', // Red
          textColor: '#FFFFFF',       // White text
          iconColor: '#FFFFFF'        // White icon
        };
      default:
        return {
          backgroundColor: '#15CA5D',
          textColor: '#007DB6',
          iconColor: '#1976D2'
        };
    }
  };

  const dynamicWidth = calculateWidth();
  const styles = getDynamicStyles();

  return (
    <View style={{ width: dynamicWidth, position: 'relative' }}>
      {/* Dropdown Button */}
      <TouchableOpacity
        onPress={handleToggle}
        style={{
          width: dynamicWidth,
          height: 32,
          backgroundColor: styles.backgroundColor,
          borderRadius: 24,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: isOpen ? 1 : 0,
          borderColor: isOpen ? '#007DB6' : undefined,
        }}
      >
        <Text style={[
          Typography.subline2,
          {
            color: styles.textColor,
            textAlign: 'center'
          }
        ]}>
          {value || placeholder}
        </Text>
        
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={styles.iconColor}
        />
      </TouchableOpacity>

      {/* Dropdown Options */}
      {isOpen && filteredOptions.length > 0 && (
        <View style={{
          position: 'absolute',
          top: 36, // 4px gap from button
          left: 0,
          width: 177, // Match the HTML width
          backgroundColor: '#FFFFFF', // White background like HTML
          borderRadius: 16,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 3,
          borderWidth: 1,
          borderColor: '#61AFD2', // River Blue/04 border
          zIndex: 1000,
        }}>
          <View style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 16, // 16px gap between options like HTML
            width: '100%',
          }}>
            {filteredOptions.map((option, index) => (
              <TouchableOpacity
                key={option}
                onPress={() => handleSelect(option)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  minHeight: 24,
                  gap: 8,
                }}
              >
                <Text style={[Typography.copy2,{
                  color:'#007DB6'
                }]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Check icon positioned like in HTML
          <View style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 16,
            height: 16,
          }}>
            <Ionicons
              name="checkmark"
              size={16}
              color="#007DB6"
            />
          </View> */}
        </View>
      )}
    </View>
  );
};