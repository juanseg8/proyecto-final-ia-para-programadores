import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { View, Text } from 'react-native';

test('debug await', async () => {
  const result = await render(<View><Text>Hello</Text></View>);
  console.log('Result keys:', Object.keys(result));
  console.log('Screen Hello:', !!screen.getByText('Hello'));
});
