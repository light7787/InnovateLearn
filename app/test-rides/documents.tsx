import Typography from '@/constants/typography';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { DocumentPickerAsset } from 'expo-document-picker';
import { Image } from 'expo-image';
import React, { useState, useEffect } from 'react';
import { 
  Pressable, 
  ScrollView, 
  Text, 
  View, 
  Alert, 
  Modal,
  Dimensions,
  StatusBar 
} from 'react-native';
import { Button, Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedSingleButton from '@/app/components/footersinglebtn';
import PlusIcon from '@/app/components/TestRide/plusicon';
import HeaderComponent from '@/app/components/AppHeader';
import { API_BASE, ENV } from '@/constants/env';
import { getValidAccessToken } from '../auth/auth.service';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const TestRideDocuments = () => {
  // Get passed parameters
  const params = useLocalSearchParams();
  const leadname = params.leadname as string;
  const leadId = params.leadId as string;
  const testrideId = params.testrideId as string;
  const phoneNumber = params.phoneNumber as string;
  const testRideType = params.testRideType as string;
  const scheduledDate = params.scheduledDate as string;
  const scheduledTime = params.scheduledTime as string;
  const address = params.address as string;
  const userId = params.userId as string;

  const [helmetProvided, setHelmetProvided] = useState<boolean>(false);
  const [drivingLicense, setDrivingLicense] = useState<DocumentPickerAsset | null>(null);
  const [indemnityForm, setIndemnityForm] = useState<DocumentPickerAsset | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [currentDocumentType, setCurrentDocumentType] = useState<'license' | 'indemnity' | null>(null);

  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  // Storage key for this specific test ride
  const storageKey = `testride_docs_${testrideId}`;

  // Load saved documents when component mounts
  useEffect(() => {
    loadSavedDocuments();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    // Request camera permissions
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus.status !== 'granted' || mediaLibraryStatus.status !== 'granted') {
       ENV === 'dev'&&console.log('Camera or media library permissions not granted');
    }
  };

  const loadSavedDocuments = async () => {
    try {
      setIsLoading(true);
      const savedData = await AsyncStorage.getItem(storageKey);
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
         ENV === 'dev'&&console.log('📁 Loading saved documents for testride:', testrideId);
        
        setDrivingLicense(parsedData.drivingLicense || null);
        setIndemnityForm(parsedData.indemnityForm || null);
        setHelmetProvided(parsedData.helmetProvided || false);
      }
    } catch (error) {
       ENV === 'dev'&&console.error('Error loading saved documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDocumentsToStorage = async (
    license: DocumentPickerAsset | null,
    indemnity: DocumentPickerAsset | null,
    helmet: boolean
  ) => {
    try {
      const dataToSave = {
        drivingLicense: license,
        indemnityForm: indemnity,
        helmetProvided: helmet,
        savedAt: new Date().toISOString(),
        testrideId: testrideId
      };

      await AsyncStorage.setItem(storageKey, JSON.stringify(dataToSave));
       ENV === 'dev'&&console.log('💾 Documents saved for testride:', testrideId);
    } catch (error) {
       ENV === 'dev'&&console.error('Error saving documents:', error);
    }
  };

  const updateTestDriveStatus = async (
    status: string, 
    startTestDrive: boolean = false, 
    completeTestDrive: boolean = false
  ) => {
    if (!userId || !testrideId) {
      Alert.alert('Error', 'Missing required data to update test ride status');
      return false;
    }
  
    try {
      setIsUpdatingStatus(true);
      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        throw new Error('Could not get valid access token');
      }
  
      const apiPayload = {
        UserId: userId,
        TestDriveId: testrideId,
        TestDriveStatus: status,
        TestDriveDate: new Date().toISOString().split('T')[0], // Current date
        TestDriveTime: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`, // Current time
        StartTestDrive: startTestDrive,
        CompleteTestDrive: status === 'Canceled' ? true : completeTestDrive
      };
  
       ENV === 'dev'&&console.log('🚀 Updating test drive with payload:', apiPayload);
  
      const response = await fetch(`${API_BASE}/api/data/UpdateTestDrive`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });
  
      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }
  
      const result = await response.json();
       ENV === 'dev'&&console.log('✅ Test drive status updated:', result);
  
      if (result.StatusCode === 200) {
        return true;
      } else {
        throw new Error(result.StatusMessage || 'Failed to update status');
      }
    } catch (error) {
       ENV === 'dev'&&console.error('❌ Error updating test drive status:', error);
      Alert.alert('Error', 'Failed to update test ride status. Please try again.');
      return false;
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const openUploadModal = (documentType: 'license' | 'indemnity') => {
    setCurrentDocumentType(documentType);
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setCurrentDocumentType(null);
  };

  const pickFromGallery = async (): Promise<void> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedFile = result.assets[0];
        await handleDocumentSelection(selectedFile);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document from gallery. Please try again.');
       ENV === 'dev'&&console.error('Gallery picker error:', error);
    } finally {
      closeUploadModal();
    }
  };

  const takePhoto = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Disable editing/crop
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const photo = result.assets[0];
        
        // Convert ImagePicker result to DocumentPickerAsset format
        const documentAsset: DocumentPickerAsset = {
          uri: photo.uri,
          name: `photo_${Date.now()}.jpg`,
          size: photo.fileSize || 0,
          mimeType: 'image/jpeg'
        };

        await handleDocumentSelection(documentAsset);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
       ENV === 'dev'&&console.error('Camera error:', error);
    } finally {
      closeUploadModal();
    }
  };

  const handleDocumentSelection = async (selectedFile: DocumentPickerAsset) => {
    if (currentDocumentType === 'license') {
      setDrivingLicense(selectedFile);
      await saveDocumentsToStorage(selectedFile, indemnityForm, helmetProvided);
    } else if (currentDocumentType === 'indemnity') {
      setIndemnityForm(selectedFile);
      await saveDocumentsToStorage(drivingLicense, selectedFile, helmetProvided);
    }
  };

  // Save helmet status when it changes
  const handleHelmetToggle = async (newValue: boolean) => {
    setHelmetProvided(newValue);
    await saveDocumentsToStorage(drivingLicense, indemnityForm, newValue);
  };

  interface DocumentUploadProps {
    documentType: 'license' | 'indemnity';
    selectedDocument: DocumentPickerAsset | null;
  }

  const DocumentUpload = ({ documentType, selectedDocument }: DocumentUploadProps) => {
    const isImage = selectedDocument?.mimeType?.startsWith('image/') || 
                   selectedDocument?.name?.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/);

    return (
      <Pressable 
        onPress={() => openUploadModal(documentType)}
        className="bg-river-blue-2 rounded-2xl h-48 items-center justify-center"
        style={{ borderWidth: 1, borderColor: '#E0F2FE', borderStyle: 'dashed' }}
      >
        {selectedDocument && isImage ? (
          <View className="relative w-full h-full rounded-2xl overflow-hidden">
            <Image 
              source={{ uri: selectedDocument.uri }} 
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={200}
              placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
            />
            {/* Simple replace overlay */}
            {/* <View className="absolute inset-0 bg-black/40 items-center justify-center">
              <View className="bg-white/90 rounded-full p-4 mb-2">
                <Ionicons name="camera" size={24} color="#007db6" />
              </View>
              <Text className="text-white font-medium">Tap to Replace</Text>
            </View> */}
          </View>
        ) : selectedDocument ? (
          // PDF or other document types
          <View className="items-center justify-center">
            <View className="bg-blue-100 rounded-full p-4 mb-3">
              <Ionicons name="document-text" size={32} color="#007db6" />
            </View>
            <Text className="text-blue-600 text-center px-4 font-medium" style={Typography.subline2}>
              {selectedDocument.name}
            </Text>
            <Text className="text-blue-500 mt-3 text-sm font-medium">
              Tap to Replace
            </Text>
          </View>
        ) : (
          // No document selected
          <View className="items-center justify-center">
            <View className=" rounded-full p-4 mb-3">
              <PlusIcon/>
            </View>
            <Text className="text-river-blue-6 " style={Typography.subline2}>
              Add Document
            </Text>
            {/* <Text className="text-river-blue-4 mt-1 text-xs">
              Camera • Gallery • Files
            </Text> */}
          </View>
        )}
      </Pressable>
    );
  };

  const UploadModal = () => {
    return (
      <Modal
        visible={showUploadModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeUploadModal}
        statusBarTranslucent={true}
      >
        <View 
          className="flex-1 bg-black/50 justify-end"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <Pressable 
            className="flex-1"
            onPress={closeUploadModal}
          />
          
          <View 
            className="bg-white rounded-t-3xl"
            style={{ 
              maxHeight: screenHeight * 0.7,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 8
            }}
          >
            {/* Modal Header */}
            <View className="px-6 py-4 border-b border-gray-100">
              <View className="flex-row items-center justify-between">
                <Text className="text-river-blue-6" style={Typography.headline3}>
                  Upload {currentDocumentType === 'license' ? 'License' : 'Indemnity Form'}
                </Text>
                <Pressable 
                  onPress={closeUploadModal}
                  className="p-2 -mr-2"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={24} color="#6B7280" />
                </Pressable>
              </View>
              <Text className="text-river-blue-5 mt-1" style={Typography.copy2}>
                Choose how you'd like to add your document
              </Text>
            </View>

            {/* Modal Options */}
            <View className="px-6 py-6">
              {/* Camera Option */}
              <Pressable
                onPress={takePhoto}
                className="flex-row items-center p-4 bg-blue-50 rounded-2xl mb-4 active:bg-blue-100"
              >
                <View className="bg-river-blue-4 rounded-full p-3">
                  <Ionicons name="camera" size={24} color="white" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-river-blue-6" style={Typography.headline4}>
                    Take Photo
                  </Text>
                  <Text className="text-river-blue-5 mt-1" style={Typography.copy2}>
                    Use camera to capture document
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>

              {/* Gallery Option */}
              <Pressable
                onPress={pickFromGallery}
                className="flex-row items-center p-4 bg-green-50 rounded-2xl mb-4 active:bg-green-100"
              >
                <View className="bg-green-500 rounded-full p-3">
                  <Ionicons name="images" size={24} color="white" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-river-blue-6" style={Typography.headline4}>
                    Choose from Gallery
                  </Text>
                  <Text className="text-river-blue-5 mt-1" style={Typography.copy2}>
                    Select from photos or files
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>

              {/* Files Option */}
              <Pressable
                onPress={pickFromGallery}
                className="flex-row items-center p-4 bg-purple-50 rounded-2xl active:bg-purple-100"
              >
                <View className="bg-purple-500 rounded-full p-3">
                  <Ionicons name="folder" size={24} color="white" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-river-blue-6" style={Typography.headline4}>
                    Browse Files
                  </Text>
                  <Text className="text-river-blue-5 mt-1" style={Typography.copy2}>
                    Upload PDF or image files
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>
            </View>

            {/* Safe Area Bottom */}
            <View className="h-8" />
          </View>
        </View>
      </Modal>
    );
  };

  const handleConfirm = async () => {
    // Update status to "On-going" with StartTestDrive = true
    const success = await updateTestDriveStatus('On-going', true, false);
    
    if (success) {
       ENV === 'dev'&&console.log('Test ride started and status updated to On-going!');
      
      // Navigate to success splash screen
      router.push({
        pathname: '/components/SplashProps',
        params: {
          title: "Test Ride Started",
          subtitle: "Thank you for booking your ride with River Indie.",
          showSubtitle: 'true',
          navigateTo: '/test-rides/ongoing',
          delay: '2500',
          // Pass all the necessary data to be forwarded to ongoing page
          leadname,
          leadId,
          testrideId,
          phoneNumber,
          testRideType,
          scheduledDate,
          scheduledTime,
          address,
          userId,
          // Add flag to indicate this is coming from documents
          from: 'Documents'
        }
      });
    } else {
      // If status update failed, don't navigate
       ENV === 'dev'&&console.log('Failed to update test ride status, staying on documents page');
    }
  };

  // Check if all required fields are completed
  const isFormComplete = drivingLicense && indemnityForm && helmetProvided;

  // Show loading indicator while loading saved data
  if (isLoading) {
    return (
      <View className="flex-1 bg-river-blue-1 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 items-center shadow-sm">
          <View className="bg-blue-100 rounded-full p-4 mb-4">
            <Ionicons name="document-text" size={32} color="#007db6" />
          </View>
          <Text className="text-gray-700 font-medium">Loading saved documents...</Text>
          <Text className="text-gray-500 text-sm mt-1">Please wait</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-river-blue-1">
      {/* Header */}
      <HeaderComponent
        title='Documents'
        onBackPress={() => router.back()}
        showDropdown={false}
      />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        {/* Document Section */}
        <View className="px-6 pt-6">
          {/* Document Form */}
          <View>
            {/* Driving License */}
            <View className="mb-6">
              <Text className="text-river-blue-6 mb-4 font-medium" style={Typography.copy1}>
                Driving License
                <Text className="text-red-500">*</Text>
              </Text>
              <DocumentUpload 
                documentType="license" 
                selectedDocument={drivingLicense}
              />
            </View>

            {/* Indemnity Form */}
            <View className="mb-6">
              <Text className="text-river-blue-6 mb-4 font-medium" style={Typography.copy1}>
                Indemnity Form Signed
                <Text className="text-red-500">*</Text>
              </Text>
              <DocumentUpload 
                documentType="indemnity" 
                selectedDocument={indemnityForm}
              />
            </View>

            {/* Helmet Provided Checkbox - Simple Version */}
            <Pressable 
              className="flex-row items-center mb-8"
              onPress={() => handleHelmetToggle(!helmetProvided)}
            >
              <Checkbox
                status={helmetProvided ? "checked" : "unchecked"}
                color="#007db6"
                onPress={() => handleHelmetToggle(!helmetProvided)}
              />
              <Text className="text-river-blue-5 ml-2" style={Typography.headline4}>
                Helmet Provided
                <Text className="text-red-500">*</Text>
              </Text>
              {/* {helmetProvided && (
                <Text className="text-green-600 ml-2 text-xs">✓ Saved</Text>
              )} */}
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button - Fixed at bottom */}
      <AnimatedSingleButton
        onPress={handleConfirm}
        buttonText="Submit"
        width={221}
        height={48}
        disabled={!isFormComplete}
      />

      {/* Upload Modal */}
      <UploadModal />
    </View>
  );
};

export default TestRideDocuments;