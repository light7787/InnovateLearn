import { useState } from "react";
import { View } from "react-native";
import { Dialog, Portal, RadioButton, Button } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';

interface FilterDialogProps {
  visible: boolean;
  onDismiss: () => void;
  value: string;
  onValueChange: (value: string) => void;
  onDateConfirm: (params: { date: Date }) => void;
  selectedDate?: Date;
}

export const FilterDialog = ({
  visible,
  onDismiss,
  value,
  onValueChange,
  onDateConfirm,
  selectedDate
}: FilterDialogProps) => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  return (
    <Portal>
      <Dialog 
        visible={visible} 
        onDismiss={onDismiss}
        style={{ width: '85%', maxHeight: '70%', alignSelf: 'center', borderRadius: 16 }}
      >
        <Dialog.Title className="text-lg font-bold px-4 pt-4">
          Filter Options
        </Dialog.Title>
        <Dialog.Content className="px-4">
          <RadioButton.Group onValueChange={onValueChange} value={value}>
            <View className="py-2">
              <RadioButton.Item 
                label="Today" 
                value="today" 
                style={{ paddingVertical: 4 }}
                labelStyle={{ fontSize: 16 }}
              />
            </View>
            <View className="py-2">
              <RadioButton.Item 
                label="This Week" 
                value="week" 
                style={{ paddingVertical: 4 }}
                labelStyle={{ fontSize: 16 }}
              />
            </View>
            <View className="py-2">
              <RadioButton.Item 
                label="This Month" 
                value="month" 
                style={{ paddingVertical: 4 }}
                labelStyle={{ fontSize: 16 }}
              />
            </View>
            <View className="py-2">
              <RadioButton.Item 
                label="Custom Date" 
                value="custom" 
                style={{ paddingVertical: 4 }}
                labelStyle={{ fontSize: 16 }}
              />
            </View>
          </RadioButton.Group>
          
          {value === 'custom' && (
            <Button 
              mode="contained" 
              onPress={() => setDatePickerVisible(true)} 
              className="mt-4 rounded-lg py-1"
            >
              Select Date
            </Button>
          )}
        </Dialog.Content>
        <Dialog.Actions className="px-4 pb-4">
          <Button 
            mode="contained" 
            onPress={onDismiss} 
            className="rounded-lg w-full"
          >
            Apply Filters
          </Button>
        </Dialog.Actions>
      </Dialog>

      <DatePickerModal
        locale="en"
        mode="single"
        visible={datePickerVisible}
        onDismiss={() => setDatePickerVisible(false)}
        date={selectedDate}
        onConfirm={(params) => {
       
        }}
        presentationStyle="pageSheet"
        animationType="slide"
        label="Select date"
        saveLabel="Confirm"
      />
    </Portal>
  );
};