import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { TextField } from './input';

// Safely import typography - handle if it doesn't exist or is malformed
let Typography: any = {};
try {
  Typography = require('@/constants/typography').default || require('@/constants/typography');
} catch (error) {
  Typography = {};
}

interface TextFieldProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
}

const styles = StyleSheet.create({
  container: {
    width: 352, // w-88 equivalent (88 * 4 = 352px)
    height: 48,
    backgroundColor: '#DEEEF6',
    borderRadius: 90,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: 'transparent',
    height: 24,
    color: '#212121',
    paddingVertical: 0,
    paddingHorizontal: 0,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    // Apply Typography.copy1 if it exists, otherwise use defaults
    ...(Typography?.copy1 || {}),
  },
});

const theme = {
  colors: {
    text: '#212121',
    placeholder: '#61AFD2', // Matching TextField placeholder color
    background: 'transparent',
    primary: '#212121',
  },
};

const PhoneText: React.FC<TextFieldProps> = React.memo(({
  placeholder = 'Your name',
  value,
  onChangeText,
  secureTextEntry = false,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        mode="flat"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        style={styles.textInput}
        placeholderTextColor="#61AFD2"
        selectionColor="#757575"
        theme={theme}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="done"
      />
    </View>
  );
});

export default PhoneText;