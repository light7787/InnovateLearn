// components/TimeFilterSelector.tsx
import { useRouter } from 'expo-router';
import React, { useRef, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Provider as PaperProvider, useTheme } from 'react-native-paper';
import FilterButton from './filterbtn';
import { useTimeFilter } from '@/app/timefiltercontext';

interface DateRange {
  startDate: string | null;
  endDate: string | null;
  specificDate: string | null;
  type: 'specific' | 'flexible';
}

interface TimeFilterSelectorProps {
  onFilterChange?: (filter: string, dateRange?: DateRange) => void;
  disabled?: boolean;
}

const TimeFilterSelector: React.FC<TimeFilterSelectorProps> = ({ 
  onFilterChange, 
  disabled = false 
}) => {
  const { filter: globalFilter, dateRange: globalDateRange, setGlobalFilter, isLoading } = useTimeFilter();
  const theme = useTheme();
  const router = useRouter();
  const isNavigatingRef = useRef(false);

  const filters = ['Today', 'THIS_WEEK', 'THIS_MONTH', 'Custom'];

  const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day} ${month}'${year}`;
  };

  const getLabelFromFilter = (filter: string): string => {
    switch (filter) {
      case 'THIS_WEEK':
        return 'Week';
      case 'THIS_MONTH':
        return 'Month';
      case 'Today':
        return 'Today';
      default:
        return filter;
    }
  };

  const getCustomFilterLabel = (): string => {
    if (!globalDateRange) return 'Custom';

    if (globalDateRange.type === 'specific' && globalDateRange.specificDate) {
      return formatDateForDisplay(globalDateRange.specificDate);
    } else if (
      globalDateRange.type === 'flexible' &&
      globalDateRange.startDate &&
      globalDateRange.endDate
    ) {
      const startFormatted = formatDateForDisplay(globalDateRange.startDate);
      const endFormatted = formatDateForDisplay(globalDateRange.endDate);
      return `${startFormatted} - ${endFormatted}`;
    }

    return 'Custom';
  };

  const handleCustomFilterWithNavigation = () => {
    if (isNavigatingRef.current || disabled) return;

    isNavigatingRef.current = true;

    router.push({
      pathname: '/calender',
      params: {
        ...(globalDateRange && {
          startDate: globalDateRange.startDate || '',
          endDate: globalDateRange.endDate || '',
          specificDate: globalDateRange.specificDate || '',
          type: globalDateRange.type
        })
      }
    });

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  const handleStandardFilterWithNavigation = async (filter: string) => {
    if (isNavigatingRef.current || disabled) return;

    isNavigatingRef.current = true;

    try {
      // Update global state
      await setGlobalFilter(filter);
      
      // Call local callback if provided (for backwards compatibility)
      if (onFilterChange) {
        onFilterChange(filter);
      }
    } catch (error) {
      console.error('Error updating filter:', error);
    }

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 500);
  };

  const handleFilterPress = (filter: string) => {
    if (filter === 'Custom') {
      handleCustomFilterWithNavigation();
    } else {
      handleStandardFilterWithNavigation(filter);
    }
  };

  const handleCustomDateSelection = async (dateRange: DateRange) => {
    if (isNavigatingRef.current) return;

    isNavigatingRef.current = true;

    try {
      // Update global state
      await setGlobalFilter('Custom', dateRange);

      // Call local callback if provided (for backwards compatibility)
      if (onFilterChange) {
        onFilterChange('Custom', dateRange);
      }
    } catch (error) {
      console.error('Error updating custom date filter:', error);
    }

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 500);
  };

  useEffect(() => {
    (global as any).handleCustomDateSelection = handleCustomDateSelection;
  }, []);

  // Notify parent component when global filter changes
  useEffect(() => {
    if (!isLoading && onFilterChange) {
      onFilterChange(globalFilter, globalDateRange);
    }
  }, [globalFilter, globalDateRange, isLoading, onFilterChange]);

  if (isLoading) {
    return (
      <View className="h-[32px] flex-row items-center justify-center">
        {/* You can add a loading indicator here if needed */}
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 8,
          flexGrow: 1,
          justifyContent: 'space-between',
          minWidth: '100%'
        }}
        className="h-[32px]"
      >
        <View className="flex-row items-center gap-2 h-[32px] justify-between flex-1">
          {filters.map((filter) => (
            <FilterButton
              key={filter}
              label={filter === 'Custom' ? getCustomFilterLabel() : getLabelFromFilter(filter)}
              isActive={disabled ? false : globalFilter === filter} 
              onPress={() => handleFilterPress(filter)}
              disabled={disabled}
            />
          ))}
        </View>
      </ScrollView>
    </PaperProvider>
  );
};

export default TimeFilterSelector;