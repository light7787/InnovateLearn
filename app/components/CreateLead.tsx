import { ENV } from '@/constants/env';
import * as React from 'react';
import { Text } from 'react-native';
import { Button } from 'react-native-paper';

const CreateLeadBtn = () => (
  <Button icon="plus"  mode="contained" onPress={() =>  ENV === 'dev'&&console.log('Pressed')} className='mb-4 h-16 '>
   <Text className='text-3xl'> Create Lead</Text> 
  </Button>
);

export default CreateLeadBtn;