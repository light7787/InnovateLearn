// app/calender.tsx (or wherever your calendar screen is)
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import Delete from '@/app/components/HomeScreen/cross';
import { PrimaryButton } from '@/app/components/button';
import Typography from '@/constants/typography';
import HeaderComponent from '@/app/components/AppHeader';
import AnimatedSingleButton from '@/app/components/footersinglebtn';

interface DateRange {
  startDate: string | null;
  endDate: string | null;
  specificDate: string | null;
  type: 'specific' | 'flexible';
}

const CalendarScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Initialize state from params if available
  const [startDate, setStartDate] = useState<string | null>(
    (params.startDate as string) || null
  );
  const [endDate, setEndDate] = useState<string | null>(
    (params.endDate as string) || null
  );
  const [specificDate, setSpecificDate] = useState<string | null>(
    (params.specificDate as string) || null
  );
  const [selectedTab, setSelectedTab] = useState<'specific' | 'flexible'>(
    (params.type as 'specific' | 'flexible') || 'specific'
  );
  
  const [focusedInput, setFocusedInput] = useState<'start' | 'end'>('start');
  const [currentMonth, setCurrentMonth] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Fixed: Calculate today's date more reliably
  const todayString = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const monthName = useMemo(() => {
    const date = new Date(currentMonth);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }, [currentMonth]);

  const formatDisplayDate = useCallback((dateString: string | null): string | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}'${date.getFullYear().toString().slice(-2)}`;
  }, []);

  const handleDayPress = useCallback((day: DateData) => {
    const date = day.dateString;
    
    if (selectedTab === 'specific') {
      setSpecificDate(date);
    } else {
      if (focusedInput === 'start') {
        if (endDate && new Date(date) > new Date(endDate)) setEndDate(null);
        setStartDate(date);
        setFocusedInput('end');
      } else {
        if (startDate && new Date(date) < new Date(startDate)) {
          setStartDate(null);
          setFocusedInput('start');
        }
        setEndDate(date);
      }
    }
  }, [selectedTab, focusedInput, endDate, startDate]);

  const updateMonth = useCallback((offset: number) => {
    const currentDate = new Date(currentMonth);
    currentDate.setMonth(currentDate.getMonth() + offset);
    const newMonth = currentDate.toISOString().split('T')[0];
    setCurrentMonth(newMonth);
  }, [currentMonth]);

  const getMarkedDates = useMemo(() => {
    const marked: { [key: string]: any } = {};

    if (selectedTab === 'specific') {
      marked[todayString] = {
        customStyles: {
          container: {
            backgroundColor: '#DEEEF6',
            borderRadius: 18,
            width: 36,
            height: 36,
            padding:10,
          },
          text: {
            color: '#007DB6',
            fontWeight: '600',
          },
        },
      };

      if (specificDate) {
        if (specificDate === todayString) {
          marked[specificDate] = {
            customStyles: {
              container: {
                backgroundColor: '#003F5C',
                borderRadius: 18,
                width: 36,
                height: 36,
                padding:10,
              },
              text: {
                color: '#FFFFFF',
                fontWeight: '600',
              },
            },
          };
        } else {
          marked[specificDate] = {
            customStyles: {
              container: {
                backgroundColor: '#003F5C',
                borderRadius: 18,
                width: 36,
                height: 36,
                padding:10,
              },
              text: {
                color: '#FFFFFF',
                fontWeight: '600',
              },
            },
          };
        }
      }
    } else {
      // Flexible dates - using same circular styling as specific dates
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

      if (startDate) {
        marked[startDate] = {
          customStyles: {
            container: {
              backgroundColor: '#003F5C',
              borderRadius: 18,
              width: 36,
              height: 36,
              zIndex:10,
              padding:10,
            },
            text: {
              color: '#FFFFFF',
              fontWeight: '600',
            },
          },
        };
      }
      
      if (endDate) {
        marked[endDate] = {
          customStyles: {
            container: {
              backgroundColor: '#003F5C',
              borderRadius: 18,
              width: 36,
              height: 36,
              zIndex:10,
              padding:10,
            },
            text: {
              color: '#FFFFFF',
              fontWeight: '600',
            },
          },
        };
      }

      // Mark dates in between start and end with circular styling
      if (startDate && endDate) {
        let d = new Date(startDate);
        const end = new Date(endDate);
        d.setDate(d.getDate() + 1);
        
        while (d < end) {
          const dateString = d.toISOString().split('T')[0];
          if (dateString === todayString) {
            marked[dateString] = {
              customStyles: {
                container: {
                  backgroundColor: '#DEEEF6',
                  borderRadius: 18,
                  width: 36,
                  height: 36,
                  borderColor: '#007DB6',
                  borderWidth: 2,
                  padding:10,
                  zIndex:10,
                },
                text: {
                  color: '#003F5C',
                  fontWeight: '600',
                },
              },
            };
          } else {
            marked[dateString] = {
              customStyles: {
                container: {
                  backgroundColor: '#DEEEF6',
                  borderRadius: 0,
                  width: "160%", // medium 
                  height: 36,
                  // padding:10,
                
                 
                  
                  
                },
                text: {
                  color: '#007DB6',
                  fontWeight: '600',
                },
              },
            };
          }
          d.setDate(d.getDate() + 1);
        }
      }
    }

    return marked;
  }, [selectedTab, specificDate, startDate, endDate, todayString]);

  const handleTabChange = useCallback((tab: 'specific' | 'flexible') => {
    setSelectedTab(tab);
    if (tab === 'specific') {
      setStartDate(null);
      setEndDate(null);
      setFocusedInput('start');
    } else {
      setSpecificDate(null);
    }
  }, []);

  // Handle Apply button press
  const handleApply = useCallback(() => {
    const dateRange: DateRange = {
      startDate,
      endDate,
      specificDate,
      type: selectedTab
    };

    // Pass data back to TimeFilterSelector
    if (typeof global !== 'undefined' && (global as any).handleCustomDateSelection) {
      (global as any).handleCustomDateSelection(dateRange);
    }

    // Navigate back
    router.back();
  }, [selectedTab, specificDate, startDate, endDate, router]);

  const isApplyEnabled = useMemo(() => {
    if (selectedTab === 'specific') {
      return !!specificDate;
    } else {
      return !!(startDate && endDate);
    }
  }, [selectedTab, specificDate, startDate, endDate]);

  const TabButton = useMemo(() => ({ tab }: { tab: 'specific' | 'flexible' }) => (
    <TouchableOpacity
      className={`flex-1  py-2 rounded-full items-center justify-center mx-1 ${
        selectedTab === tab ? 'bg-[#003F5C]' : 'bg-[#E8F4F8]'
      }`}
      onPress={() => handleTabChange(tab)}
    >
      <Text
        className={`text-sm font-medium ${
          selectedTab === tab ? 'text-white' : 'text-[#007DB6]'
        }`}
        style={Typography.subline2}
      >
        {tab === 'specific' ? 'Specific date' : 'Flexible dates'}
      </Text>
    </TouchableOpacity>
  ), [selectedTab, handleTabChange]);

  const DateDisplayBox = useMemo(() => ({ label, value, focus }: { 
    label: string, 
    value: string | null, 
    focus: 'start' | 'end' 
  }) => (
    <View className="flex-1 mx-1">
      <View className="rounded-2xl p-4 bg-[#E8F4F8] min-h-[60px] justify-center">
        <Text className="text-xs text-river-blue-6 font-medium mb-1 ml-1" style={Typography.copy2}>{label}</Text>
        <View className="flex-row justify-between items-center">
          <Text className="text-[#007DB6]" style={Typography.headline5}>
            {formatDisplayDate(value)}
          </Text>
          {value && (
            <TouchableOpacity
              onPress={() => {
                if (focus === 'start') setStartDate(null);
                else setEndDate(null);
                setFocusedInput(focus);
              }}
              className="w-5 h-5 bg-[#007DB6] rounded-full items-center justify-center"
            >
              <Delete />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  ), [formatDisplayDate]);

  // Updated calendar theme with two-letter day headers
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
    'stylesheet.calendar.main': {
      container: {
        backgroundColor: 'transparent',
      },
      week: {
        marginTop: 0,
        marginBottom: 0,
        paddingVertical: 4, // Try padding instead of margin
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
    },
    // @ts-ignore - Override the period stylesheet too
    'stylesheet.day.period': {
      base: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 2,
        marginHorizontal: 2,
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

  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFD] ">
      {/* Header */}
      <HeaderComponent
        title="Choose dates"
        onBackPress={()=>router.back()}
        noTopPadding={true}
      />

      {/* Tab selector */}
      <View className="px-6 mb-10 mt-4">
        <View className="flex-row">
          <TabButton tab="specific" />
          <TabButton tab="flexible" />
        </View>
      </View>

      {/* Month navigation */}
      <View className="flex-row justify-between items-center px-6 mb-6">
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

      {/* Date selection display for flexible dates */}
      {selectedTab === 'flexible' && (
        <View className="flex-row px-6 mb-6">
          <DateDisplayBox label="Start date" value={startDate} focus="start" />
          <DateDisplayBox label="End date" value={endDate} focus="end" />
        </View>
      )}

      {/* Calendar */}
      <View className="flex-1 mx-6 mb-2">
        <View className="border border-[#61AFD2] rounded-2xl p-4 bg-river-blue-1">
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, paddingTop: 0, paddingBottom: 0 ,paddingHorizontal: 16}}>
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
                backgroundColor:'#FFFFFF',
                borderRadius: 12,
                paddingBottom: 0,
                overflow:'hidden'
                
              }}
            />
          </View>
        </View>
      </View>

      {/* Apply button - properly disabled when dates not selected */}
      <AnimatedSingleButton
        onPress={isApplyEnabled ? handleApply : () => {}}
        buttonText="Apply"
        width={163}
        height={48}
        disabled={!isApplyEnabled}
      />
    </SafeAreaView>
  );
};

export default React.memo(CalendarScreen);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#2196F3',
    fontWeight: '500',
  },
  headerTitle: {
    color: '#333',
    flex: 1,
    marginLeft: 8,
  },
});