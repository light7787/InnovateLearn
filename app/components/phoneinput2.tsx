import Typography from '@/constants/typography';
import React from 'react';
import { View, StyleSheet, TextInput, ViewStyle, TextStyle } from 'react-native';

interface TextFieldProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  ref?: React.Ref<TextInput>;
  style?: ViewStyle;
  textInputStyle?: TextStyle;
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    backgroundColor: '#DEEEF6',
    borderRadius: 90,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'transparent',
    color: '#007DB6',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderWidth: 0,
    fontWeight: '400',
    ...(Typography?.copy1 || {}),
  },
});

export const TextField2: React.FC<TextFieldProps> = React.memo(({
  placeholder = '',
  value,
  onChangeText,
  secureTextEntry = false,
  onFocus,
  onBlur,
  style,
  textInputStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        onFocus={onFocus}
        onBlur={onBlur}
        style={[styles.textInput, textInputStyle]}
        placeholderTextColor="#61AFD2"
        selectionColor="#757575"
        autoCorrect={false}
        autoCapitalize="none"
        blurOnSubmit={false}
        returnKeyType="done"
      />
    </View>
  );
});