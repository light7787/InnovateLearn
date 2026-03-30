import { router } from 'expo-router';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextField } from '@/app/components/input';
import { Dropdown } from '@/app/components/inputdropdown';
import { useLocalSearchParams } from 'expo-router';
 import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Typography from '@/constants/typography';
import { TextField2 } from '@/app/components/phoneinput2';
import AnimatedButtonsFooter from '@/app/components/footerbtn';
import { ENV } from '@/constants/env';
 
export default function CreateBookingScreen() {
  // Form state
  const params = useLocalSearchParams();
 
  const safeString = (value: string | string[] | undefined): string =>
    Array.isArray(value) ? value[0] : value || '';
 
  const rawLeadname = safeString(params.leadname);
  const rawPhone = safeString(params.phoneNumber);
  const followupId = safeString(params.followupId); // still used in the payload
  const leadId = safeString(params.leadId); // still used in the payload
  const testrideId = params.testrideId as string;
  const rawEmail = params.email as string;
  // const rawPincode = params.pincode as string;
  ENV === 'dev'&&console.log('Email:',rawEmail);
 
  ENV === 'dev'&&console.log('Lead ID:', leadId);
  ENV === 'dev'&&console.log('Raw Lead Name:', rawLeadname);
  ENV === 'dev'&&console.log('Raw Phone:', rawPhone);
ENV === 'dev'&&  console.log('Followup ID:', followupId);
 
  const [firstName, setFirstName] = useState(() => rawLeadname.split(' ')[0] || '');
  const [lastName, setLastName] = useState(() => rawLeadname.split(' ').slice(1).join(' ') || '');
  const [phone, setPhone] = useState(() => rawPhone || '');
  const [pincode, setPincode] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [email, setEmail] = useState(() => rawEmail || '');
 
  // Validation state
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    pincode: '',
    vehicleColor: '',
    paymentMode: ''
  });
 
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    phone: false,
    email: false,
    pincode: false,
    vehicleColor: false,
    paymentMode: false
  });
  const validateEmail = useCallback((value: string): string => {
    if (!value.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Invalid email address';
    }
    return '';
  }, []);
  // Validation functions
  const validateFirstName = useCallback((value: string): string => {
    if (!value.trim()) {
      return 'First name is required';
    }
    if (value.trim().length < 2) {
      return 'First name must be at least 2 characters';
    }
    return '';
  }, []);
 
  const validateLastName = useCallback((value: string): string => {
    if (!value.trim()) {
      return 'Last name is required';
    }
    if (value.trim().length < 2) {
      return 'Last name must be at least 2 characters';
    }
    return '';
  }, []);
 
  const validatePhone = useCallback((value: string): string => {
    if (!value.trim()) {
      return 'Phone number is required';
    }
    if (value.length !== 10) {
      return 'Phone number must be 10 digits';
    }
    if (!/^\d{10}$/.test(value)) {
      return 'Phone number must contain only digits';
    }
    return '';
  }, []);
 
  const validatePincode = useCallback((value: string): string => {
    if (!value.trim()) {
      return 'Pincode is required';
    }
    if (value.length !== 6) {
      return 'Pincode must be 6 digits';
    }
    if (!/^\d{6}$/.test(value)) {
      return 'Pincode must contain only digits';
    }
    return '';
  }, []);
 
  const validateVehicleColor = useCallback((value: string): string => {
    if (!value.trim()) {
      return 'Vehicle color is required';
    }
    return '';
  }, []);
 
  const validatePaymentMode = useCallback((value: string): string => {
    if (!value.trim()) {
      return 'Payment mode is required';
    }
    return '';
  }, []);
 
  // Update errors when form values change
  useEffect(() => {
    const newErrors = {
      firstName: validateFirstName(firstName),
      lastName: validateLastName(lastName),
      phone: validatePhone(phone),
      email: validateEmail(email),
      pincode: validatePincode(pincode),
      vehicleColor: validateVehicleColor(vehicleColor),
      paymentMode: validatePaymentMode(paymentMode)
    };
   
    setErrors(newErrors);
  }, [firstName, lastName, phone,email, pincode, vehicleColor, paymentMode, email,
      validateFirstName, validateLastName, validatePhone, validatePincode,
      validateVehicleColor, validatePaymentMode, validateEmail]);
 
  // Form validation
  const isFormValid = useMemo(() => {
    return !errors.firstName && !errors.lastName && !errors.phone &&  !errors.email &&
           !errors.pincode && !errors.vehicleColor && !errors.paymentMode &&
           firstName.trim() && lastName.trim() && phone.trim() && email.trim() &&
           pincode.trim() && vehicleColor.trim() && paymentMode.trim();
  }, [errors, firstName, lastName, phone,email, pincode, vehicleColor, paymentMode]);
 
  // Handle input changes with validation
  const handleFirstNameChange = useCallback((text: string) => {
    setFirstName(text);
    if (!touched.firstName) {
      setTouched(prev => ({ ...prev, firstName: true }));
    }
  }, [touched.firstName]);
 
  const handleLastNameChange = useCallback((text: string) => {
    setLastName(text);
    if (!touched.lastName) {
      setTouched(prev => ({ ...prev, lastName: true }));
    }
  }, [touched.lastName]);
 
  const handlePhoneChange = useCallback((text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(digitsOnly);
    if (!touched.phone) {
      setTouched(prev => ({ ...prev, phone: true }));
    }
  }, [touched.phone]);
 
  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    if (!touched.email) {
      setTouched(prev => ({ ...prev, email: true }));
    }
  }, [touched.email]);
 
  const handleEmailBlur = useCallback(() => {
    setTouched(prev => ({ ...prev, email: true }));
  }, []);
 
 
 
  const handlePincodeChange = useCallback((text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, '').slice(0, 6);
    setPincode(digitsOnly);
    if (!touched.pincode) {
      setTouched(prev => ({ ...prev, pincode: true }));
    }
  }, [touched.pincode]);
 
  const handleVehicleColorChange = useCallback((value: string) => {
    setVehicleColor(value);
    if (!touched.vehicleColor) {
      setTouched(prev => ({ ...prev, vehicleColor: true }));
    }
  }, [touched.vehicleColor]);
 
  const handlePaymentModeChange = useCallback((value: string) => {
    setPaymentMode(value);
    if (!touched.paymentMode) {
      setTouched(prev => ({ ...prev, paymentMode: true }));
    }
  }, [touched.paymentMode]);
 
  // Handle blur events
  const handleFirstNameBlur = useCallback(() => {
    setTouched(prev => ({ ...prev, firstName: true }));
  }, []);
 
  const handleLastNameBlur = useCallback(() => {
    setTouched(prev => ({ ...prev, lastName: true }));
  }, []);
 
  const handlePhoneBlur = useCallback(() => {
    setTouched(prev => ({ ...prev, phone: true }));
  }, []);
 
  const handlePincodeBlur = useCallback(() => {
    setTouched(prev => ({ ...prev, pincode: true }));
  }, []);
 
  // Dropdown options
  const vehicleColorOptions = [
    'Monsoon Blue',
    'Summer Red',
    'Spring Yellow',
    'Storm Grey',
    'Winter White'
  ];
 
  const paymentModeOptions = [
    'Cash',
    'UPI',
    'Card'
  ];
 
  // Error message component
  const ErrorMessage = ({ error, show }: { error: string; show: boolean }) => {
    if (!show || !error) return null;
   
    return (
      <Text className="text-red-500 text-sm mt-1" style={Typography.status}>
        {error}
      </Text>
    );
  };
 
  // Handle proceed based on payment mode
  const handleConfirm = () => {
    // Mark all fields as touched to show validation errors
    setTouched({
      firstName: true,
      lastName: true,
      phone: true,
      email: true,
      pincode: true,
      vehicleColor: true,
      paymentMode: true
    });
 
    // Don't proceed if form is invalid
    if (!isFormValid) {
      return;
    }
 
    const formData = {
      firstName,
      lastName,
      phone,
      email,
      pincode,
      vehicleColor,
      paymentMode,
      leadId,
      followupId,
      testrideId
    };
 
    switch (paymentMode) {
      case 'Card':
        router.push({ pathname: '/bookings/payment/card', params: formData });
        break;
      case 'UPI':
        router.push({ pathname: '/bookings/payment/upi', params: formData });
        break;
      case 'Cash':
        router.push({ pathname: '/bookings/payment/cash', params: formData });
        break;
      default:
        ENV === 'dev'&&console.log('Unknown payment mode');
    }
  };
 
  const handleClose = () => {
    router.back();
  };
 
  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFD]" edges={['top']}>
      <View className="flex-1 relative">
        <KeyboardAwareScrollView
          className="flex-1 px-4 pt-6"
          contentContainerStyle={{ paddingBottom: 120 }}
         
          showsVerticalScrollIndicator={false}
           keyboardShouldPersistTaps="handled"
  enableOnAndroid={true}
  extraScrollHeight={20} 
        >
          {/* Header */}
          <View className="mb-8">
            <Text className=" text-[#00405D]" style={Typography.headline4}> New Booking</Text>
          </View>
 
          {/* Form Fields */}
          <View className="space-y-6">
            {/* First Name */}
            <View className='mb-6'>
              <Text className="text-base text-river-blue-6 mb-3 font-medium" style={Typography.copy1}>
                First name<Text className="text-red-500">*</Text>
              </Text>
              <TextField
                value={firstName}
                onChangeText={handleFirstNameChange}
                onBlur={handleFirstNameBlur}
                style={errors.firstName && touched.firstName ? { borderColor: '#ef4444', borderWidth: 1 } : {}}
              />
              <ErrorMessage error={errors.firstName} show={touched.firstName} />
            </View>
 
            {/* Last Name */}
            <View className='mb-6'>
              <Text className=" text-river-blue-6  mb-3 " style={Typography.copy1}>
                Last name<Text className="text-red-500">*</Text>
              </Text>
              <TextField
                value={lastName}
                onChangeText={handleLastNameChange}
                onBlur={handleLastNameBlur}
                style={errors.lastName && touched.lastName ? { borderColor: '#ef4444', borderWidth: 1 } : {}}
              />
              <ErrorMessage error={errors.lastName} show={touched.lastName} />
            </View>
 
            {/* Phone Number */}
            <View className='mb-6'>
              <Text className=" text-river-blue-6  mb-3 " style={Typography.copy1}>
                Phone number<Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-[#DEEEF6] rounded-full justify-center items-center mr-3">
                  <Text className=" text-river-blue-6  " style={Typography.copy1}>+91</Text>
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
  <Text className="text-river-blue-6 mb-3" style={Typography.copy1}>
    Email<Text className="text-red-500">*</Text>
  </Text>
  <TextField
    value={email}
    onChangeText={handleEmailChange}
    onBlur={handleEmailBlur}
 
 
    style={errors.email && touched.email ? { borderColor: '#ef4444', borderWidth: 1 } : {}}
  />
  <ErrorMessage error={errors.email} show={touched.email} />
</View>
 
            {/* Pincode */}
            <View className='mb-6'>
              <Text className=" text-river-blue-6  mb-3 " style={Typography.copy1}>
                Pincode<Text className="text-red-500">*</Text>
              </Text>
              <TextField
                value={pincode}
                onChangeText={handlePincodeChange}
                onBlur={handlePincodeBlur}
                style={errors.pincode && touched.pincode ? { borderColor: '#ef4444', borderWidth: 1 } : {}}
              />
              <ErrorMessage error={errors.pincode} show={touched.pincode} />
            </View>
 
            {/* Vehicle Color */}
            <View className='mb-6'>
              <Dropdown
                label="Vehicle Color"
                value={vehicleColor}
                onSelect={handleVehicleColorChange}
                options={vehicleColorOptions}
                // style={errors.vehicleColor && touched.vehicleColor ? { borderColor: '#ef4444', borderWidth: 1 } : {}}
              />
              <ErrorMessage error={errors.vehicleColor} show={touched.vehicleColor} />
            </View>
 
            {/* Payment Mode */}
            <View className='mb-6'>
              <Dropdown
                label="Payment Mode"
                value={paymentMode}
                onSelect={handlePaymentModeChange}
                options={paymentModeOptions}
                // style={errors.paymentMode && touched.paymentMode ? { borderColor: '#ef4444', borderWidth: 1 } : {}}
              />
              <ErrorMessage error={errors.paymentMode} show={touched.paymentMode} />
            </View>
          </View>
        </KeyboardAwareScrollView>
 
        {/* Fixed Bottom Buttons */}
        <AnimatedButtonsFooter
          handleCreateEnquiry={handleConfirm}
          handleCancel={handleClose}
          Typography={Typography}
          createEnquiryText="Proceed"
          cancelText="Cancel"
          disableCreateEnquiry={!isFormValid}
          disableCancel={false}
        />
      </View>
    </SafeAreaView>
  );
}