// contexts/TimeFilterContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '@/constants/env';
interface DateRange {
  startDate: string | null;
  endDate: string | null;
  specificDate: string | null;
  type: 'specific' | 'flexible';
}

interface TimeFilterContextType {
  filter: string;
  dateRange: DateRange | undefined;
  resetToDashboard: () => Promise<void>;
  setGlobalFilter: (filter: string, range?: DateRange) => Promise<void>;
  isLoading: boolean;
}

const TimeFilterContext = createContext<TimeFilterContextType | undefined>(undefined);

export const useTimeFilter = () => {
  const context = useContext(TimeFilterContext);
  if (!context) {
    throw new Error('useTimeFilter must be used within a TimeFilterProvider');
  }
  return context;
};

interface TimeFilterProviderProps {
  children: ReactNode;
}

export const TimeFilterProvider: React.FC<TimeFilterProviderProps> = ({ children }) => {
  const [filter, setFilter] = useState<string>('Today');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved filter on app start
  useEffect(() => {
    loadSavedFilter();
  }, []);

  const loadSavedFilter = async () => {
    try {
      setIsLoading(true);
      const savedFilter = await AsyncStorage.getItem('globalTimeFilter');
      const savedRange = await AsyncStorage.getItem('globalTimeFilterRange');
      
      if (savedFilter) {
        setFilter(savedFilter);
      }
      
      if (savedRange) {
        const parsedRange = JSON.parse(savedRange);
        setDateRange(parsedRange);
      }
    } catch (error) {
      console.error('Failed to load saved time filter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDashboard = async () => {
    try {
      await setGlobalFilter('Today'); // This will handle both state and AsyncStorage
      ENV==='dev'&&console.log('🏠 Global filter reset to Today for dashboard');
    } catch (error) {
      console.error('Error resetting global filter:', error);
    }
  };

  const setGlobalFilter = async (newFilter: string, range?: DateRange) => {
    try {
      setFilter(newFilter);
      setDateRange(range);

      // Save to AsyncStorage for persistence
      await AsyncStorage.setItem('globalTimeFilter', newFilter);
      
      if (range) {
        await AsyncStorage.setItem('globalTimeFilterRange', JSON.stringify(range));
      } else {
        await AsyncStorage.removeItem('globalTimeFilterRange');
      }

      // Also store in the existing format for backwards compatibility
      const filterPayload: any = {};
      
      if (newFilter === 'Custom' && range) {
        if (range.specificDate) {
          filterPayload.FilterDate = range.specificDate;
        } else if (range.startDate && range.endDate) {
          filterPayload.FilterDate = range.startDate;
          filterPayload.FilterEndRange = range.endDate;
        }
      } else {
        filterPayload.FilterDate = newFilter.toUpperCase();
      }

      await AsyncStorage.setItem('timeFilter', JSON.stringify(filterPayload));
       ENV === 'dev'&&console.log('🌐 Global time filter updated:', { filter: newFilter, range });
      
    } catch (error) {
      console.error('Failed to save global time filter:', error);
    }
  };

  return (
    <TimeFilterContext.Provider 
      value={{
        filter,
        dateRange,
        setGlobalFilter,
        resetToDashboard,
        isLoading
      }}
    >
      {children}
    </TimeFilterContext.Provider>
  );
};