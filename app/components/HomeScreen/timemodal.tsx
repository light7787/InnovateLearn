import { ENV } from '@/constants/env';
import Typography from '@/constants/typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useMemo, useCallback } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface TimeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectTime: (time: string) => void;
  initialTime?: string;
  selectedDate?: string; // Add selectedDate prop to determine if it's today
}

export default function TimeModal({ 
  isVisible, 
  onClose, 
  onSelectTime, 
  initialTime,
  selectedDate 
}: TimeModalProps) {
  // Check if the selected date is today
  const isToday = useMemo(() => {
    if (!selectedDate) return false;
    
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;
    
    return selectedDate === todayString;
  }, [selectedDate]);

  // Get current time for validation (refresh when modal opens)
  const currentTime = useMemo(() => {
    if (!isVisible) return { hours: 0, minutes: 0 };
    
    const now = new Date();
     ENV === 'dev'&&console.log(`Current time: ${now.getHours()}:${now.getMinutes()}`);
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
    };
  }, [isVisible]);

  // Parse the initial time into hours, minutes, and period
  const parseInitialTime = () => {
    if (!initialTime) return { time: '10:00', period: 'AM' };

    try {
      const [timeStr, period] = initialTime.split(' ');
      const [hours, minutes] = timeStr.split(':');
      return { time: `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`, period: period as 'AM' | 'PM' };
    } catch (e) {
       ENV === 'dev'&&console.warn('Invalid initial time format, using default');
      return { time: '10:00', period: 'AM' };
    }
  };

  const initialParsed = parseInitialTime();
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>(initialParsed.period as 'AM' | 'PM');
  const [selectedHourMinute, setSelectedHourMinute] = useState(initialParsed.time);
  const [validationError, setValidationError] = useState<string>('');

  const generateTimes = () => {
    const times = [];
  
    for (let i = 1; i <= 11; i++) {
      times.push(`${i.toString().padStart(2, '0')}:00`);
    }
    times.push('12:00');
    return times;
  };

  // Check if a time is in the past for today
  const isPastTime = useCallback((timeStr: string, period: 'AM' | 'PM') => {
    if (!isToday) return false;

    const [hours, minutes] = timeStr.split(':').map(Number);
    let hour24 = hours;

    // Convert to 24-hour format
    if (period === 'AM' && hours === 12) {
      hour24 = 0;
    } else if (period === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    }

    const selectedTimeInMinutes = hour24 * 60 + minutes;
    const currentTimeInMinutes = currentTime.hours * 60 + currentTime.minutes;

    // Debug logging
     ENV === 'dev'&&console.log(`Checking time: ${timeStr} ${period}`);
     ENV === 'dev'&&console.log(`Selected: ${hour24}:${minutes} (${selectedTimeInMinutes} minutes)`);
     ENV === 'dev'&&console.log(`Current: ${currentTime.hours}:${currentTime.minutes} (${currentTimeInMinutes} minutes)`);
     ENV === 'dev'&&console.log(`Is past: ${selectedTimeInMinutes < currentTimeInMinutes}`);

    return selectedTimeInMinutes < currentTimeInMinutes;
  }, [isToday, currentTime]);

  const allTimes = generateTimes();

  const handleApply = () => {
    if (isPastTime(selectedHourMinute, selectedPeriod)) {
      setValidationError('Please select a future time. Past times are not allowed.');
      return;
    }

    const fullTime = `${selectedHourMinute} ${selectedPeriod}`;
    onSelectTime(fullTime);
    onClose();
  };

  const handleTimeSelect = (time: string) => {
    if (isPastTime(time, selectedPeriod)) {
      setValidationError('Please select a future time. Past times are not allowed.');
      return;
    }
    
    setValidationError('');
    setSelectedHourMinute(time);
  };

  const handlePeriodChange = (period: 'AM' | 'PM') => {
    setSelectedPeriod(period);
    
    // Check if current selected time becomes invalid with new period
    if (isPastTime(selectedHourMinute, period)) {
      setValidationError('Please select a future time. Past times are not allowed.');
    } else {
      setValidationError('');
    }
  };

  // Check if the currently selected time is valid
  const isSelectedTimeValid = useMemo(() => {
    return !isPastTime(selectedHourMinute, selectedPeriod);
  }, [selectedHourMinute, selectedPeriod, isPastTime]);

  const renderTimeColumn = (times: string[]) => (
    <View className="flex-1 gap-3">
      {times.map((time, index) => {
        const isSelected = selectedHourMinute === time;
        const isPast = isPastTime(time, selectedPeriod);
        
        return (
          <TouchableOpacity
            key={`${time}-${index}`}
            className={`flex-row items-center justify-between ${isPast ? 'opacity-40' : ''}`}
            onPress={() => handleTimeSelect(time)}
            disabled={isPast}
          >
            <Text
              className={`${isPast ? 'text-gray-400' : 'text-river-blue-5'}`}
              style={isSelected ? Typography.headline5 : Typography.headline4}
            >
              {time}
            </Text>
            {isSelected && !isPast && (
              <MaterialCommunityIcons name="check" size={24} color="#007DB6" />
            )}
            {isPast && (
              <MaterialCommunityIcons name="clock-outline" size={20} color="#CCCCCC" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end items-center w-full px-4 bg-opacity-0.2">
        <View className="bg-[#F7FBFD] border border-[#61AFD2] rounded-2xl p-6 w-full max-h-[508px]">
          <Text className="text-[#00405D] mb-4" style={Typography.copy1}>Select Time</Text>
          
          {/* Show today indicator if applicable */}
          {/* {isToday && (
            <View className="mb-4">
              <Text className="text-sm text-gray-600" style={{
                fontSize: Typography.status?.fontSize || 12,
                fontFamily: Typography.status?.fontFamily || 'System',
              }}>
                Times in the past are disabled for today
              </Text>
            </View>
          )} */}

          <View className="flex-row justify-start mb-6">
            <TouchableOpacity
              className={`w-[77px] h-8 justify-center items-center rounded-full ${
                selectedPeriod === 'AM' ? 'bg-[#007DB6]' : 'bg-[#F7FBFD] border border-[#007DB6]'
              } mr-4`}
              onPress={() => handlePeriodChange('AM')}
            >
              <Text className={`text-[16px] font-semibold ${
                selectedPeriod === 'AM' ? 'text-white' : 'text-[#007DB6]'
              }`}>AM</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`w-[77px] h-8 justify-center items-center rounded-full ${
                selectedPeriod === 'PM' ? 'bg-[#007DB6]' : 'bg-[#F7FBFD] border border-[#007DB6]'
              }`}
              onPress={() => handlePeriodChange('PM')}
            >
              <Text className={`text-[16px] font-semibold ${
                selectedPeriod === 'PM' ? 'text-white' : 'text-[#007DB6]'
              }`}>PM</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between gap-4 px-2 mb-4">
            {renderTimeColumn(allTimes.slice(0, 6))}
            {renderTimeColumn(allTimes.slice(6, 12))}
          </View>

          {/* Validation Error Message */}
          {validationError ? (
            <View className="mb-4">
              <View className="flex-row items-center bg-red-50 border border-red-200 rounded-lg p-3">
                <MaterialCommunityIcons name="alert-circle" size={16} color="#DC2626" style={{ marginRight: 8 }} />
                <Text className="text-red-600 text-sm flex-1" style={{ 
                  fontSize: Typography.status?.fontSize || 12,
                  fontFamily: Typography.status?.fontFamily || 'System',
                }}>
                  {validationError}
                </Text>
              </View>
            </View>
          ) : null}

          <View className="flex-row gap-6 justify-center">
            <TouchableOpacity
              className="flex-1 max-w-[139px] h-[48px] rounded-[32px] border border-[#007DB6] justify-center items-center"
              onPress={onClose}
            >
              <Text className="text-[#007DB6]" style={Typography.subline1}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 max-w-[139px] h-[48px] rounded-[32px] justify-center items-center ${
                isSelectedTimeValid ? 'bg-[#00405D]' : 'bg-gray-300'
              }`}
              onPress={handleApply}
              disabled={!isSelectedTimeValid}
            >
              <Text 
                className={`${isSelectedTimeValid ? 'text-river-blue-1' : 'text-gray-500'}`}
                style={Typography.subline1}
              >
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
