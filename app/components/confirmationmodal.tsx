import Typography from '@/constants/typography';
import { BlurView } from 'expo-blur';
import React from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
 
const { width, height } = Dimensions.get('window');
 
const colors = {
  'river-blue-6': '#00405d',
  'river-blue-5': '#007db6',
  'river-blue-4': '#61afd2',
  'river-blue-1': '#f7fbfd',
};
 
interface ConfirmationPopupProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  highlightedText?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showBlur?: boolean;
}
 
const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  visible,
  onClose,
  onConfirm,
  title = "Do you wish to continue?",
  message = "You are about to",
  highlightedText,
  confirmButtonText = "Yes",
  cancelButtonText = "No",
  showBlur = true,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end items-center pb-6">
          {/* Strong Backdrop Blur Effect */}
          {showBlur && (
            <>
              <BlurView
                intensity={100}
                tint="light"
                style={{
                  position: 'absolute',
                  width: width,
                  height: height,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  width: width,
                  height: height,
                  backgroundColor: 'rgba(110, 110, 110, 0.236)',
                }}
              />
            </>
          )}
         
          {/* Prevent modal from closing when touching the card */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="px-2 w-full ">
              <Card
                className=" w-full pt-9 px-5 pb-6  "
                style={{
                  backgroundColor:'#F7FBFD',
              
                  borderColor: colors['river-blue-4'],
                  borderWidth: 2,
                  elevation: 0,
                  shadowOpacity: 0,
                  borderRadius:32,
                  shadowRadius: 0,
                  shadowOffset: { width: 0, height: 0 }
                }}
              >
                <View className="flex items-center space-y-5">
                  {/* Title */}
                  <Text
                    className="text-center mb-5"
                    style={{
                      ...Typography.headline5,
                      color: colors['river-blue-6'],
                      paddingHorizontal: 20,
                    }}
                  >
                    {title}
                  </Text>
 
                  {/* Message - Fixed to center the complete message */}
                  <View className="mb-5 items-center">
                    <Text
                      className="text-center"
                      style={{
                        ...Typography.copy1,
                        fontSize: 14,
                        color: colors['river-blue-6'],
                        textAlign: 'center',
                      }}
                    >
                      {message}
                    </Text>
                    {highlightedText && (
                      <Text 
                        className="text-center"
                        style={{
                          ...Typography.subline1,
                          color: colors['river-blue-6'],
                          textAlign: 'center',
                        }}
                      >
                        {highlightedText}
                      </Text>
                    )}
                  </View>
 
                 
            

<Pressable
  className="w-80 h-[48px] rounded-[32px] mb-5 justify-center items-center"
  style={{
    backgroundColor: colors['river-blue-6'],
  }}
  onPress={onConfirm}
>
  <Text
    style={[
      Typography.subline1,
      { color: colors['river-blue-1'] }
    ]}
  >
    {confirmButtonText}
  </Text>
</Pressable>

<Pressable
  className="w-80 h-[48px] rounded-[32px] justify-center items-center"
  style={{
    borderColor: colors['river-blue-5'],
    borderWidth: 1,
    backgroundColor: 'transparent',
  }}
  onPress={onClose}
>
  <Text
    style={[
      Typography.subline1,
      { color: colors['river-blue-5'] }
    ]}
  >
    {cancelButtonText}
  </Text>
</Pressable>
                  </View>
              
              </Card>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
 
export default ConfirmationPopup;