import Typography from '@/constants/typography';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

interface CalendarModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  initialDate?: string;
}

export default function CalendarModal({
  isVisible,
  onClose,
  onSelectDate,
  initialDate,
}: CalendarModalProps) {
  // Fixed: Calculate today's date more reliably
  const todayString = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Fixed: Set today's date as default if no initialDate is provided
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return initialDate || todayString;
  });

  const [currentMonth, setCurrentMonth] = useState<string>(() => {
    if (initialDate) {
      return initialDate;
    }
    return todayString; // Use today's date instead of creating new Date
  });

  // Add validation error state
  const [validationError, setValidationError] = useState<string>('');

  const monthName = useMemo(() => {
    const date = new Date(currentMonth);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }, [currentMonth]);

  // Helper function to check if a date is in the past
  const isPastDate = useCallback((dateString: string) => {
    const selectedDate = new Date(dateString);
    const today = new Date(todayString);
    
    // Reset time to compare dates only
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    return selectedDate < today;
  }, [todayString]);

  // Update selectedDate when initialDate changes (e.g., when switching fields)
  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
      setCurrentMonth(initialDate);
      // Clear error when initialDate changes
      setValidationError('');
    } else {
      // If no initialDate provided, default to today
      setSelectedDate(todayString);
      setCurrentMonth(todayString);
      setValidationError('');
    }
  }, [initialDate, todayString]);

  const handleDayPress = useCallback((day: DateData) => {
    if (isPastDate(day.dateString)) {
      setValidationError('Please select a future date. Past dates are not allowed.');
      return;
    }
    
    // Clear any existing error and set the selected date
    setValidationError('');
    setSelectedDate(day.dateString);
  }, [isPastDate]);

  const updateMonth = useCallback((offset: number) => {
    const currentDate = new Date(currentMonth);
    currentDate.setMonth(currentDate.getMonth() + offset);
    const newMonth = currentDate.toISOString().split('T')[0];
    setCurrentMonth(newMonth);
  }, [currentMonth]);

  const getMarkedDates = useMemo(() => {
    const marked: { [key: string]: any } = {};

    // Mark today with special styling
    marked[todayString] = {
      customStyles: {
        container: {
          backgroundColor: '#DEEEF6',
          borderRadius: 18,
          width: 36,
          height: 36,
        },
        text: {
          color: '#007DB6',
          fontWeight: '600',
        },
      },
    };

    // Mark selected date
    if (selectedDate) {
      if (selectedDate === todayString) {
        marked[selectedDate] = {
          customStyles: {
            container: {
              backgroundColor: '#003F5C',
              borderRadius: 18,
              width: 36,
              height: 36,
            },
            text: {
              color: '#FFFFFF',
              fontWeight: '600',
            },
          },
        };
      } else {
        marked[selectedDate] = {
          customStyles: {
            container: {
              backgroundColor: '#003F5C',
              borderRadius: 18,
              width: 36,
              height: 36,
            },
            text: {
              color: '#FFFFFF',
              fontWeight: '600',
            },
          },
        };
      }
    }

    return marked;
  }, [selectedDate, todayString]);

  // Updated calendar theme matching the main calendar
  const calendarTheme = useMemo(() => ({
    selectedDayBackgroundColor: '#003F5C',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#007DB6',
    todayBackgroundColor: '#DEEEF6',
    arrowColor: '#007DB6',
    textSectionTitleColor: '#666666',
    // Day text styling - matching subline-s2 from Figma
    textDayFontSize: Typography.subline1?.fontSize || 16,
    textDayFontFamily: Typography.subline1?.fontFamily || 'System',
    // Day header styling - matching status-st02 from Figma  
    textDayHeaderFontSize: Typography.status?.fontSize || 12,
    textDayHeaderFontFamily: Typography.status?.fontFamily || 'System',
    dayTextColor: '#007DB6', // river-blue05 equivalent
    textDisabledColor: '#CCCCCC',
    calendarBackground: 'transparent',
    
    // @ts-ignore
    'stylesheet.calendar.header': {
      week: {
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 0,
      },
      dayHeader: {
        marginTop: 2,
        marginBottom: 7,
        width: 32,
        textAlign: 'center',
        fontSize: Typography.status?.fontSize || 12,
        fontFamily: Typography.status?.fontFamily || 'System',
        color: '#00405D', // river-blue06 equivalent
        lineHeight: Typography.status?.lineHeight || 16,
      },
    },
    // @ts-ignore
    'stylesheet.day.basic': {
      base: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        margin: 2,
      },
      selected: {
        backgroundColor: '#003F5C', // river-blue02 equivalent
        borderRadius: 18,
      },
      today: {
        borderRadius: 18,
        borderWidth: 0
      },
      text: {
        fontSize: Typography.subline2?.fontSize || 16,
        color:'#007DB6',
        fontFamily: Typography.subline2?.fontFamily || 'System',
        lineHeight: Typography.subline2?.lineHeight || 20,
        textAlign: 'center',
      },
    },
  }), []);

  // Custom render function for day names with two letters
  const renderCustomHeader = useCallback(() => {
    const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 0, marginTop: 10, marginBottom: 5 }}>
        {dayNames.map((day, index) => (
          <Text
            key={index}
            style={{
              width: 32,
              textAlign: 'center',
              fontSize: Typography.status?.fontSize || 12,
              fontFamily: Typography.status?.fontFamily || 'System',
              color: '#00405D',
              lineHeight: Typography.status?.lineHeight || 16,
              marginTop: 2,
              marginBottom: 5,
            }}
          >
            {day}
          </Text>
        ))}
      </View>
    );
  }, []);

  // Check if selected date is valid (not in the past)
  const isSelectedDateValid = useMemo(() => {
    return selectedDate ? !isPastDate(selectedDate) : false;
  }, [selectedDate, isPastDate]);

  if (!isVisible) {
    return null; // Don't render anything if not visible
  }

  return (
    // The main container for the modal content, styled to appear from the bottom
    <View className="bg-[#F7FBFD] rounded-t-2xl p-6 w-full items-center">
      {/* Header with month navigation */}
      <View className="flex-row justify-between items-center mb-6 w-full">
        <TouchableOpacity 
          className="w-8 h-8 items-center justify-center" 
          onPress={() => updateMonth(-1)}
        >
          <Ionicons name="chevron-back" size={24} color="#007DB6" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-[#007DB6]" style={Typography.headline5}>
          {monthName}
        </Text>
        <TouchableOpacity 
          className="w-8 h-8 items-center justify-center" 
          onPress={() => updateMonth(1)}
        >
          <Ionicons name="chevron-forward" size={24} color="#007DB6" />
        </TouchableOpacity>
      </View>

      {/* Calendar with matching design */}
      <View className="w-full mb-4">
        <View className="border border-[#61AFD2] rounded-2xl p-4 bg-river-blue-1">
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, paddingTop: 0, paddingBottom: 0, paddingHorizontal: 16 }}>
            {renderCustomHeader()}
            <Calendar
              key={currentMonth}
              current={currentMonth}
              onDayPress={handleDayPress}
              markedDates={getMarkedDates}
              markingType="custom"
              hideArrows={true}
              hideExtraDays={true}
              disableMonthChange={true}
              firstDay={1}
              showWeekNumbers={false}
              theme={calendarTheme}
              renderHeader={() => null}
              hideDayNames={true}
              style={{
                paddingTop: 0,
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                paddingBottom: 0,
              }}
            />
          </View>
        </View>
      </View>

      {/* Validation Error Message */}
      {validationError ? (
        <View className="w-full mb-4">
          <View className="flex-row items-center bg-red-50 border border-red-200 rounded-lg p-3">
            <Ionicons name="alert-circle" size={16} color="#DC2626" style={{ marginRight: 8 }} />
            <Text className="text-red-600 text-sm flex-1" style={{ 
              fontSize: Typography.status?.fontSize || 12,
              fontFamily: Typography.status?.fontFamily || 'System',
            }}>
              {validationError}
            </Text>
          </View>
        </View>
      ) : null}

      {/* Bottom buttons - Close and Apply */}
      <View className="flex-row gap-4 w-full">
        <TouchableOpacity
          className="flex-1 h-[48px] rounded-[90px] border border-river-blue-5 justify-center items-center bg-river-blue-1"
          onPress={onClose}
        >
          <Text className="text-river-blue-5" style={Typography.subline1}>Close</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className={`flex-1 h-[48px] rounded-[90px] justify-center items-center ${
            isSelectedDateValid 
              ? 'bg-river-blue-6' 
              : 'bg-gray-300'
          }`}
          onPress={() => {
            if (selectedDate && isSelectedDateValid) {
              onSelectDate(selectedDate);
              onClose(); // Close the modal after applying
            }
          }}
          disabled={!isSelectedDateValid}
        >
          <Text 
            className={`${isSelectedDateValid ? 'text-river-blue-1' : 'text-gray-500'}`} 
            style={Typography.subline1}
          >
            Apply
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}