import { router } from 'expo-router';
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, Keyboard, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarModal from '@/app/components/HomeScreen/calenderModal';
import TimeModal from '@/app/components/HomeScreen/timemodal';
import ToggleSwitch from '@/app/components/HomeScreen/togglebutton';
import { TextField } from '@/app/components/input';
import { DateField } from '@/app/components/inputCalender';
import { Dropdown } from '@/app/components/inputdropdown';
import { TimeField } from '@/app/components/inputTime';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderComponent from '@/app/components/AppHeader';
import Typography from '@/constants/typography';
import PhoneText from '@/app/components/phoneinput';
import { TextField2 } from '@/app/components/phoneinput2';
import AnimatedButtonsFooter from '@/app/components/footerbtnsecond';
import { useLocalSearchParams } from 'expo-router';
import { ENV } from '@/constants/env';
import { createLead } from '../services/lead.service';
import { createTestRide } from '../services/testride.service';
import { createFollowUp } from '../services/followup.service';
import { getChargers, getColorsByCharger } from '../services/productMapper';

const getTodayISO = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

type OpportunitySources = {
  [key: string]: string[];
};

type UserProfile = {
  StoreName: string;
  StorePhone: string;
  UserDesignation: string | null;
  UserEmail: string;
  UserId: string;
  UserName: string;
  UserPhone: string;
};

type MasterItem = {
  label?: string;
  lable?: string;
  value: number;
  LeadSourceValue?: number;
};

const TimeSlotSelector = React.memo(({ selectedSlot, onSlotSelect, selectedDate }: {
  selectedSlot: string;
  onSlotSelect: (slot: string) => void;
  selectedDate: string;
}) => {
  const timeSlots = useMemo(() => [
    '9 AM - 11 AM',
    '11 AM - 1 PM',
    '2 PM - 4 PM',
    '4 PM - 6 PM'
  ], []);

  const isTimeSlotPast = useCallback((timeSlot: string, selectedDate: string): boolean => {
    try {
      const today = new Date();
      const selectedDateObj = new Date(selectedDate);
      const isToday = selectedDateObj.toDateString() === today.toDateString();
      if (!isToday) return false;

      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      const timeSlotEndHours: { [key: string]: number } = {
        '9 AM - 11 AM': 11 * 60,
        '11 AM - 1 PM': 13 * 60,
        '2 PM - 4 PM': 16 * 60,
        '4 PM - 6 PM': 18 * 60,
      };

      const slotEndTime = timeSlotEndHours[timeSlot];
      return slotEndTime ? currentTimeInMinutes >= slotEndTime : false;
    } catch (error) {
      ENV === 'dev' && console.error('Error checking time slot:', error);
      return false;
    }
  }, []);

  const handlePress = useCallback((slot: string) => {
    if (isTimeSlotPast(slot, selectedDate)) return;
    onSlotSelect(slot);
  }, [onSlotSelect, isTimeSlotPast, selectedDate]);

  const getBtnClass = useCallback((slot: string) => {
    const isPast = isTimeSlotPast(slot, selectedDate);
    const isSelected = selectedSlot === slot;
    if (isPast) return 'flex-row justify-center items-center px-4 w-44 h-12 rounded-full border bg-gray-200 border-gray-300';
    return `flex-row justify-center items-center px-4 w-44 h-12 rounded-full border ${isSelected ? 'bg-[#007DB6]' : 'bg-[#F7FBFD] border-[#007DB6]'}`;
  }, [selectedSlot, isTimeSlotPast, selectedDate]);

  const getTextClass = useCallback((slot: string) => {
    const isPast = isTimeSlotPast(slot, selectedDate);
    const isSelected = selectedSlot === slot;
    if (isPast) return 'text-base font-normal text-gray-400';
    return `text-base font-normal ${isSelected ? 'text-[#F7FBFD]' : 'text-[#007DB6]'}`;
  }, [selectedSlot, isTimeSlotPast, selectedDate]);

  return (
    <View className="flex flex-col items-start gap-4 w-full">
      <Text className="text-[#00405D]" style={Typography.copy1}>Select Time Slot</Text>
      <View className="flex-row gap-2 justify-between w-full">
        <TouchableOpacity
          className={getBtnClass(timeSlots[0])}
          onPress={() => handlePress(timeSlots[0])}
          disabled={isTimeSlotPast(timeSlots[0], selectedDate)}
        >
          <Text className={getTextClass(timeSlots[0])} style={Typography.copy1}>{timeSlots[0]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={getBtnClass(timeSlots[1])}
          onPress={() => handlePress(timeSlots[1])}
          disabled={isTimeSlotPast(timeSlots[1], selectedDate)}
        >
          <Text className={getTextClass(timeSlots[1])} style={Typography.copy1}>{timeSlots[1]}</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row gap-2 w-full justify-between">
        <TouchableOpacity
          className={getBtnClass(timeSlots[2])}
          onPress={() => handlePress(timeSlots[2])}
          disabled={isTimeSlotPast(timeSlots[2], selectedDate)}
        >
          <Text className={getTextClass(timeSlots[2])} style={Typography.copy1}>{timeSlots[2]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={getBtnClass(timeSlots[3])}
          onPress={() => handlePress(timeSlots[3])}
          disabled={isTimeSlotPast(timeSlots[3], selectedDate)}
        >
          <Text className={getTextClass(timeSlots[3])} style={Typography.copy1}>{timeSlots[3]}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default function CreateEnquiryScreen() {
  const params = useLocalSearchParams();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // ── product selection ──────────────────────────────────
  const [charger, setCharger] = useState('');
  const [color, setColor] = useState('');
  const [chargerOptions, setChargerOptions] = useState<string[]>([]);
  const [colorOptions, setColorOptions] = useState<string[]>([]);

  const [isProcessing, setIsProcessing] = useState(false);

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    phone: false
  });

  const addressFieldRef = React.useRef<View | null>(null);
  const pincodeFieldRef = React.useRef<View | null>(null);
  const leadSourceRef = React.useRef<View | null>(null);
  const secondarySourceRef = React.useRef<View | null>(null);
  const scrollViewRef = React.useRef<ScrollView | null>(null);

  const [opportunitySources, setOpportunitySources] = useState<OpportunitySources | null>(null);
  const [isOpportunitySourcesLoaded, setIsOpportunitySourcesLoaded] = useState(false);
  const [mastersCache, setMastersCache] = useState<any>(null);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [leadSource, setLeadSource] = useState('');
  const [secondarySource, setSecondarySource] = useState('');
  const [testRideType, setTestRideType] = useState('Store Test Ride');

  const [selectedTimeSlot, setSelectedTimeSlot] = useState('11 AM - 1 PM');

  const [testRideDateISO, setTestRideDateISO] = useState(() => getTodayISO());
  const [followUpDateISO, setFollowUpDateISO] = useState(() => getTodayISO());

  const [testRideTime, setTestRideTime] = useState((() => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0, 0, 0);
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    return `${hours.toString().padStart(2, '0')}:00 ${ampm}`;
  })());

  const [followUpTime, setFollowUpTime] = useState((() => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0, 0, 0);
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    return `${hours.toString().padStart(2, '0')}:00 ${ampm}`;
  })());

  const [isDirectBooking, setIsDirectBooking] = useState(false);
  const [isBookTestRide, setIsBookTestRide] = useState(true);

  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [currentDateField, setCurrentDateField] = useState<'testRide' | 'followUp' | null>(null);

  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
  const [currentTimeField, setCurrentTimeField] = useState<'testRide' | 'followUp' | null>(null);

  const ANIMATION_DURATION = 300;
  const [sectionOpacity] = useState(() => new Animated.Value(1));
  const easeInOut = Easing.bezier(0.25, 0.46, 0.45, 0.94);

  const validateFirstName = useCallback((value: string): string => {
    if (!value.trim()) return 'First name is required';
    if (value.trim().length < 2) return 'First name must be at least 2 characters';
    if (value.trim().length > 15) return 'First name cannot exceed 15 characters';
    return '';
  }, []);

  const validateLastName = useCallback((value: string): string => {
    if (!value.trim()) return 'Last name is required';
    if (value.trim().length < 2) return 'Last name must be at least 2 characters';
    if (value.trim().length > 15) return 'Last name cannot exceed 15 characters';
    return '';
  }, []);

  const validatePhone = useCallback((value: string): string => {
    if (!value.trim()) return 'Phone number is required';
    if (value.length !== 10) return 'Phone number must be 10 digits';
    if (!/^\d{10}$/.test(value)) return 'Phone number must contain only digits';
    return '';
  }, []);

  const validateEmail = useCallback((value: string): string => {
    if (isDirectBooking && !value.trim()) return 'Email is required for direct booking';
    if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address';
    return '';
  }, [isDirectBooking]);

  useEffect(() => {
    setErrors({
      firstName: validateFirstName(firstName),
      lastName: validateLastName(lastName),
      phone: validatePhone(phone),
      // email: validateEmail(email)
    });
  }, [firstName, lastName, phone, validateFirstName, validateLastName, validatePhone, email, validateEmail]);

  const isFormValid = useMemo(() => {
    return !errors.firstName && !errors.lastName && !errors.phone &&
      firstName.trim() && lastName.trim() && phone.trim() &&
      (!isDirectBooking || email.trim()) &&
      charger.trim() && color.trim(); // ← require charger + color
  }, [errors, firstName, lastName, phone, email, isDirectBooking, charger, color]);

  const convertTimeTo24Hour = (timeSlot: string): string => {
    const timeMap: { [key: string]: string } = {
      '9 AM - 11 AM': '09:00',
      '11 AM - 1 PM': '11:00',
      '2 PM - 4 PM': '14:00',
      '4 PM - 6 PM': '16:00',
    };
    return timeMap[timeSlot] || '09:00';
  };

  useEffect(() => {
    const loadMasters = async () => {
      try {
        const mastersRaw = await AsyncStorage.getItem('masters');
        if (!mastersRaw) throw new Error('Masters missing');

        const masters = JSON.parse(mastersRaw);
        setMastersCache(masters);

        const leadSources = masters?.leadSource?.map(
          (item: MasterItem) => item.label || item.lable
        );

        setOpportunitySources({ dynamic: leadSources });

        if (leadSources?.length) {
          setLeadSource(leadSources[0]);
        }

        // ── load product chargers from cache ──────────────
        const chargers = await getChargers();
        setChargerOptions(chargers);
        if (chargers.length) {
          setCharger(chargers[0]);
          const colors = await getColorsByCharger(chargers[0]);
          setColorOptions(colors);
          if (colors.length) setColor(colors[0]);
        }

        setIsOpportunitySourcesLoaded(true);
      } catch (e) {
        console.error('❌ Masters load failed:', e);
      }
    };

    loadMasters();
  }, []);

  const leadSourceOptions = useMemo(() => {
    return opportunitySources?.dynamic || [];
  }, [opportunitySources]);

  const secondarySourceOptions = useMemo(() => {
    if (!leadSource || !mastersCache) return [];
    const leadSourceValue = mastersCache?.leadSource?.find(
      (l: MasterItem) => (l.label || l.lable)?.toLowerCase() === leadSource.toLowerCase()
    )?.value;
    return mastersCache?.leadSecondarySource
      ?.filter((s: MasterItem) => s.LeadSourceValue === leadSourceValue)
      ?.map((s: MasterItem) => s.label || s.lable) || [];
  }, [leadSource, mastersCache]);

  useEffect(() => {
    if (isBookTestRide && testRideType === 'Home Test Ride' && testRideDateISO) {
      const isCurrentSlotPast = (() => {
        try {
          const today = new Date();
          const selectedDateObj = new Date(testRideDateISO);
          const isToday = selectedDateObj.toDateString() === today.toDateString();
          if (!isToday) return false;

          const currentTimeInMinutes = today.getHours() * 60 + today.getMinutes();
          const timeSlotEndHours: { [key: string]: number } = {
            '9 AM - 11 AM': 11 * 60,
            '11 AM - 1 PM': 13 * 60,
            '2 PM - 4 PM': 16 * 60,
            '4 PM - 6 PM': 18 * 60,
          };
          const slotEndTime = timeSlotEndHours[selectedTimeSlot];
          return slotEndTime ? currentTimeInMinutes >= slotEndTime : false;
        } catch {
          return false;
        }
      })();

      if (isCurrentSlotPast) {
        const availableSlots = ['9 AM - 11 AM', '11 AM - 1 PM', '2 PM - 4 PM', '4 PM - 6 PM'];
        const currentTimeInMinutes = new Date().getHours() * 60 + new Date().getMinutes();
        const timeSlotEndHours: { [key: string]: number } = {
          '9 AM - 11 AM': 11 * 60,
          '11 AM - 1 PM': 13 * 60,
          '2 PM - 4 PM': 16 * 60,
          '4 PM - 6 PM': 18 * 60,
        };
        const nextAvailableSlot = availableSlots.find(
          slot => currentTimeInMinutes < (timeSlotEndHours[slot] ?? 0)
        );
        setSelectedTimeSlot(nextAvailableSlot ?? '9 AM - 11 AM');
      }
    }
  }, [testRideDateISO, testRideType, selectedTimeSlot, isBookTestRide]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const scrollToField = useCallback((fieldRef: React.RefObject<View | null>) => {
    if (fieldRef.current && scrollViewRef.current) {
      setTimeout(() => {
        fieldRef.current?.measureInWindow((x, y, width, height) => {
          const fieldBottom = y + height;
          const visibleHeight = 800 - 300;
          if (fieldBottom > visibleHeight - 100) {
            scrollViewRef.current?.scrollTo({ y: Math.max(0, fieldBottom - visibleHeight + 200), animated: true });
          }
        });
      }, 100);
    }
  }, []);

  const animateTransition = useCallback(() => {
    Animated.timing(sectionOpacity, {
      toValue: 0,
      duration: ANIMATION_DURATION / 2,
      easing: easeInOut,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(sectionOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION / 2,
        easing: easeInOut,
        useNativeDriver: true,
      }).start();
    });
  }, [sectionOpacity]);

  const handleLeadSourceChange = useCallback((value: string) => {
    setLeadSource(value);
    setSecondarySource('');
  }, []);

  const handleSecondarySourceChange = useCallback((value: string) => {
    setSecondarySource(value);
  }, []);

  // ── product handlers ───────────────────────────────────
  const handleChargerChange = useCallback(async (value: string) => {
    setCharger(value);
    setColor('');
    const colors = await getColorsByCharger(value);
    setColorOptions(colors);
    if (colors.length) setColor(colors[0]);
  }, []);

  const handleColorChange = useCallback((value: string) => {
    setColor(value);
  }, []);

  const handleFirstNameChange = useCallback((text: string) => {
    setFirstName(text.slice(0, 15));
    if (!touched.firstName) setTouched(prev => ({ ...prev, firstName: true }));
  }, [touched.firstName]);

  const handleLastNameChange = useCallback((text: string) => {
    setLastName(text.slice(0, 15));
    if (!touched.lastName) setTouched(prev => ({ ...prev, lastName: true }));
  }, [touched.lastName]);

  const handlePhoneChange = useCallback((text: string) => {
    setPhone(text.replace(/[^0-9]/g, '').slice(0, 10));
    if (!touched.phone) setTouched(prev => ({ ...prev, phone: true }));
  }, [touched.phone]);

  const handleFirstNameBlur = useCallback(() => setTouched(prev => ({ ...prev, firstName: true })), []);
  const handleLastNameBlur = useCallback(() => setTouched(prev => ({ ...prev, lastName: true })), []);
  const handlePhoneBlur = useCallback(() => setTouched(prev => ({ ...prev, phone: true })), []);
  const handleEmailChange = useCallback((text: string) => setEmail(text), []);

  const handleAddressChange = useCallback((text: string) => setAddress(text), []);
  const handleAddressFocus = useCallback(() => setTimeout(() => scrollToField(addressFieldRef), 100), [scrollToField]);

  const handlePincodeChange = useCallback((text: string) => {
    setPincode(text.replace(/[^0-9]/g, '').slice(0, 6));
  }, []);
  const handlePincodeFocus = useCallback(() => setTimeout(() => scrollToField(pincodeFieldRef), 100), [scrollToField]);

  const handleTestRideTypeChange = useCallback((value: string) => setTestRideType(value), []);
  const handleTimeSlotChange = useCallback((slot: string) => setSelectedTimeSlot(slot), []);

  const formatDisplayDate = useCallback((isoDate: string) => {
    const date = new Date(isoDate);
    const formatted = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    return formatted.replace(/(\d+\s\w+)\s(\d+)/, '$1, $2');
  }, []);

  const handleDateSelect = useCallback((date: string) => {
    if (currentDateField === 'testRide') setTestRideDateISO(date);
    else if (currentDateField === 'followUp') setFollowUpDateISO(date);
    setIsCalendarVisible(false);
    setCurrentDateField(null);
  }, [currentDateField]);

  const openCalendar = useCallback((field: 'testRide' | 'followUp') => {
    setCurrentDateField(field);
    setIsCalendarVisible(true);
  }, []);

  const closeCalendar = useCallback(() => {
    setIsCalendarVisible(false);
    setCurrentDateField(null);
  }, []);

  const handleTimeSelect = useCallback((time: string) => {
    if (currentTimeField === 'testRide') setTestRideTime(time);
    else if (currentTimeField === 'followUp') setFollowUpTime(time);
    setIsTimeModalVisible(false);
    setCurrentTimeField(null);
  }, [currentTimeField]);

  const openTimeModal = useCallback((field: 'testRide' | 'followUp') => {
    setCurrentTimeField(field);
    setIsTimeModalVisible(true);
  }, []);

  const closeTimeModal = useCallback(() => {
    setIsTimeModalVisible(false);
    setCurrentTimeField(null);
  }, []);

  const handleDirectBookingToggle = useCallback(() => {
    const next = !isDirectBooking;
    animateTransition();
    setIsDirectBooking(next);
    if (next) setIsBookTestRide(false);
  }, [isDirectBooking, animateTransition]);

  const handleTestRideToggle = useCallback(() => {
    const next = !isBookTestRide;
    animateTransition();
    setIsBookTestRide(next);
    if (next) setIsDirectBooking(false);
  }, [isBookTestRide, animateTransition]);

  function convertTo24HourFormat(time12h: string): string {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    let hrs = parseInt(hours, 10);
    if (modifier === 'PM' && hrs < 12) hrs += 12;
    if (modifier === 'AM' && hrs === 12) hrs = 0;
    return `${hrs.toString().padStart(2, '0')}:${minutes}`;
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileString = await AsyncStorage.getItem('userProfile');
        if (profileString) setUserProfile(JSON.parse(profileString));
      } catch (e) {
        ENV === 'dev' && console.error('Failed to load user profile:', e);
      }
    };
    fetchProfile();
  }, []);

  const handleCreateEnquiry = useCallback(async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      // ── createLead now receives charger + color ──────────
      const leadId = await createLead({
        firstName,
        lastName,
        phone,
        email,
        leadSource,
        secondarySource,
        charger,
        color,
      });

      if (!leadId) throw new Error('Lead failed');

      if (isBookTestRide) {
        await createTestRide({
          opportunityId: leadId,
          testRideDate: testRideDateISO,
          testRideSlot: testRideType === 'Home Test Ride' ? selectedTimeSlot : testRideTime,
          isHome: testRideType === 'Home Test Ride',
          address,
        });

        router.push({
          pathname: '/components/SplashProps',
          params: {
            title: 'New Enquiry Created',
            subtitle: 'You can see your updated list in Test Rides.',
            showSubtitle: 'true',
            navigateTo: '/test-rides/details',
            delay: '2500',
          },
        });
        return;
      }

      if (isDirectBooking) return;

      const followUpDateTime = `${followUpDateISO}T${convertTo24HourFormat(followUpTime)}:00`;

      await createFollowUp({ opportunityId: leadId, followUpDateTime });

      router.push({
        pathname: '/components/SplashProps',
        params: {
          title: 'New Enquiry Created',
          subtitle: 'You can see your updated list in Follow-ups.',
          showSubtitle: 'true',
          navigateTo: '/follow-ups',
          delay: '2500',
        },
      });
    } catch (error) {
      console.error('🧨 Flow failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [
    isProcessing, isBookTestRide, isDirectBooking,
    firstName, lastName, email, phone,
    leadSource, secondarySource,
    charger, color,
    testRideDateISO, testRideTime, testRideType,
    address, selectedTimeSlot,
    followUpDateISO, followUpTime,
  ]);

  const handleCancel = useCallback(() => {
    if (isProcessing) return;
    try { if (router?.back) router.back(); } catch (e) { ENV === 'dev' && console.error(e); }
  }, [isProcessing]);

  const handleBack = useCallback(() => {
    if (isProcessing) return;
    try { if (router?.back) router.back(); } catch (e) { ENV === 'dev' && console.error(e); }
  }, [isProcessing]);

  const handleTestRideDatePress = useCallback(() => openCalendar('testRide'), [openCalendar]);
  const handleFollowUpDatePress = useCallback(() => openCalendar('followUp'), [openCalendar]);
  const handleTestRideTimePress = useCallback(() => openTimeModal('testRide'), [openTimeModal]);
  const handleFollowUpTimePress = useCallback(() => openTimeModal('followUp'), [openTimeModal]);

  const ErrorMessage = ({ error, show }: { error: string; show: boolean }) => {
    if (!show || !error) return null;
    return <Text className="text-red-500 text-sm mt-1" style={Typography.status}>{error}</Text>;
  };

  const TestRideFields = useMemo(() => {
    if (!isBookTestRide) return null;
    return (
      <View className="px-4">
        <View className='mb-6'>
          <Dropdown
            label="Test Ride Type"
            value={testRideType}
            onSelect={handleTestRideTypeChange}
            options={['Store Test Ride', 'Home Test Ride']}
          />
        </View>

        <View className='mb-6'>
          <Text className="text-base text-[#212121] mb-3 font-medium" style={Typography.copy1}>Select Date</Text>
          <DateField date={formatDisplayDate(testRideDateISO)} onPress={handleTestRideDatePress} />
        </View>

        {testRideType === 'Store Test Ride' && (
          <View className='mb-6'>
            <Text className="text-base text-[#212121] mb-3 font-medium" style={Typography.copy1}>Select Time</Text>
            <TimeField time={testRideTime} onPress={handleTestRideTimePress} />
          </View>
        )}

        {testRideType === 'Home Test Ride' && (
          <View className='mb-6 pr-2'>
            <TimeSlotSelector
              selectedSlot={selectedTimeSlot}
              onSlotSelect={handleTimeSlotChange}
              selectedDate={testRideDateISO}
            />
          </View>
        )}

        {testRideType === 'Home Test Ride' && (
          <>
            <View className='mb-6' ref={addressFieldRef}>
              <Text className="text-base text-[#212121] mb-3" style={Typography.copy1}>
                Address <Text className="text-red-500">*</Text>
              </Text>
              <TextField value={address} onChangeText={handleAddressChange} onFocus={handleAddressFocus} />
            </View>

            <View className='mb-6' ref={pincodeFieldRef}>
              <Text className="text-base text-[#212121] mb-3" style={Typography.copy1}>
                Pincode <Text className="text-red-500">*</Text>
              </Text>
              <TextField2 value={pincode} onChangeText={handlePincodeChange} onFocus={handlePincodeFocus} />
            </View>
          </>
        )}
      </View>
    );
  }, [isBookTestRide, testRideType, testRideDateISO, testRideTime, selectedTimeSlot, address, pincode,
    handleTestRideTypeChange, formatDisplayDate, handleTestRideDatePress, handleTestRideTimePress,
    handleTimeSlotChange, handleAddressChange, handleAddressFocus, handlePincodeChange, handlePincodeFocus]);

  const FollowUpFields = useMemo(() => {
    if (isBookTestRide || isDirectBooking) return null;
    return (
      <View className="px-4">
        <View className='mb-6'>
          <Text className="text-[#212121] mb-3" style={Typography.copy1}>Follow Up Date</Text>
          <DateField date={formatDisplayDate(followUpDateISO)} onPress={handleFollowUpDatePress} />
        </View>

        <View className='mb-6'>
          <Text className="text-base text-[#212121] mb-3 font-medium" style={Typography.copy1}>Follow Up Time</Text>
          <TimeField time={followUpTime} onPress={handleFollowUpTimePress} />
        </View>
      </View>
    );
  }, [isBookTestRide, isDirectBooking, followUpDateISO, followUpTime, formatDisplayDate,
    handleFollowUpDatePress, handleFollowUpTimePress]);

  const PersonalInfoFields = useMemo(() => {
    if (!isOpportunitySourcesLoaded) {
      return (
        <View className="px-4">
          <View className='mb-6'>
            <Text className="text-base text-[#212121] mb-3" style={Typography.copy1}>Loading...</Text>
          </View>
        </View>
      );
    }

    return (
      <View className="px-4">
        <View className='mb-6'>
          <Text className="text-base text-[#212121] mb-3" style={Typography.copy1}>
            First name <Text className="text-red-500">*</Text>
          </Text>
          <TextField
            value={firstName}
            onChangeText={handleFirstNameChange}
            onBlur={handleFirstNameBlur}
            style={errors.firstName && touched.firstName ? { borderColor: '#ef4444', borderWidth: 1 } : {}}
          />
          <ErrorMessage error={errors.firstName} show={touched.firstName} />
        </View>

        <View className='mb-6'>
          <Text className="text-base text-[#212121] mb-3" style={Typography.copy1}>
            Last name <Text className="text-red-500">*</Text>
          </Text>
          <TextField
            value={lastName}
            onChangeText={handleLastNameChange}
            onBlur={handleLastNameBlur}
            style={errors.lastName && touched.lastName ? { borderColor: '#ef4444', borderWidth: 1 } : {}}
          />
          <ErrorMessage error={errors.lastName} show={touched.lastName} />
        </View>

        <View className='mb-6'>
          <Text className="text-base text-[#212121] mb-3 font-medium" style={Typography.copy1}>
            Phone number <Text className="text-red-500">*</Text>
          </Text>
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-[#DEEEF6] rounded-full justify-center items-center mr-3">
              <Text className="text-[#1976D2] text-base font-medium" style={Typography.copy1}>+91</Text>
            </View>
            <View className="flex-1">
              <TextField2
                value={phone}
                onChangeText={handlePhoneChange}
                onBlur={handlePhoneBlur}
                style={errors.phone && touched.phone ? { borderColor: '#ef4444', borderWidth: 1 } : {}}
              />
            </View>
          </View>
          <ErrorMessage error={errors.phone} show={touched.phone} />
        </View>

        <View className='mb-6'>
          <Text className="text-base text-[#212121] mb-3 font-medium" style={Typography.copy1}>
            Email ID{isDirectBooking && <Text className="text-red-500"> *</Text>}
          </Text>
          <TextField value={email} onChangeText={handleEmailChange} />
        </View>

        <View className="mt-2 mb-6" ref={leadSourceRef}>
          <Dropdown
            label="Lead Source"
            value={leadSource}
            onSelect={handleLeadSourceChange}
            options={leadSourceOptions}
          />
        </View>

        <View className="mt-2 mb-6" ref={secondarySourceRef}>
          <Dropdown
            label="Secondary Source"
            value={secondarySource}
            onSelect={handleSecondarySourceChange}
            options={secondarySourceOptions}
          />
        </View>

        {/* ── Charger dropdown ── */}
        <View className="mt-2 mb-6">
          <Dropdown
            label="Charger *"
            value={charger}
            onSelect={handleChargerChange}
            options={chargerOptions}
          />
        </View>

        {/* ── Vehicle Color dropdown (drives SKU lookup) ── */}
        <View className="mt-2 mb-6">
          <Dropdown
            label="Vehicle Color *"
            value={color}
            onSelect={handleColorChange}
            options={colorOptions}
          />
        </View>
      </View>
    );
  }, [
    firstName, lastName, phone, email, leadSource, secondarySource,
    charger, color, chargerOptions, colorOptions,
    leadSourceOptions, secondarySourceOptions, isOpportunitySourcesLoaded,
    errors, touched,
    handleFirstNameChange, handleLastNameChange, handlePhoneChange, handleEmailChange,
    handleFirstNameBlur, handleLastNameBlur, handlePhoneBlur,
    handleLeadSourceChange, handleSecondarySourceChange,
    handleChargerChange, handleColorChange,
    isDirectBooking,
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderComponent
        title="Create Enquiry"
        onBackPress={handleBack}
        showDropdown={false}
        noTopPadding={true}
      />

      <View className="flex-1 relative">
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-2"
          contentContainerStyle={{ paddingBottom: 400 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
          keyboardDismissMode="interactive"
          scrollEventThrottle={16}
          nestedScrollEnabled={true}
        >
          <View className="h-4" />

          <View className="bg-[#F7FBFD] rounded-2xl mb-6 px-4">
            <Pressable
              className="flex-row justify-between items-center py-4"
              onPress={handleDirectBookingToggle}
              disabled={isProcessing}
            >
              <Text className="text-[#212121]" style={Typography.subline1}>Direct Booking</Text>
              <ToggleSwitch isOn={isDirectBooking} onToggle={handleDirectBookingToggle} />
            </Pressable>

            <View className="h-px my-2" />

            <Pressable
              className="flex-row justify-between items-center py-4"
              onPress={handleTestRideToggle}
              disabled={isProcessing}
            >
              <Text className="text-base text-[#212121] font-medium" style={Typography.subline1}>Book a Test Ride</Text>
              <ToggleSwitch isOn={isBookTestRide} onToggle={handleTestRideToggle} />
            </Pressable>
          </View>

          <Animated.View className="rounded-2xl bg-[#F7FBFD]" style={{ opacity: sectionOpacity }}>
            {TestRideFields}
            {FollowUpFields}
            {PersonalInfoFields}
          </Animated.View>
        </ScrollView>

        <AnimatedButtonsFooter
          handleCreateEnquiry={handleCreateEnquiry}
          handleCancel={handleCancel}
          Typography={Typography}
          createEnquiryText={isProcessing ? 'Creating...' : 'Create Enquiry'}
          cancelText="Cancel"
          disableCreateEnquiry={isProcessing || !isFormValid}
          disableCancel={isProcessing}
        />

        {isCalendarVisible && !isProcessing && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
            <CalendarModal
              isVisible={isCalendarVisible}
              onClose={closeCalendar}
              onSelectDate={handleDateSelect}
              initialDate={
                currentDateField === 'testRide' ? testRideDateISO
                : currentDateField === 'followUp' ? followUpDateISO
                : new Date().toISOString().split('T')[0]
              }
            />
          </View>
        )}

        {isTimeModalVisible && !isProcessing && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
            <TimeModal
              isVisible={isTimeModalVisible}
              onClose={closeTimeModal}
              onSelectTime={handleTimeSelect}
              initialTime={
                currentTimeField === 'testRide' ? testRideTime
                : currentTimeField === 'followUp' ? followUpTime
                : '10:00 AM'
              }
              selectedDate={
                currentTimeField === 'testRide' ? testRideDateISO
                : currentTimeField === 'followUp' ? followUpDateISO
                : getTodayISO()
              }
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FBFD',
  },
});