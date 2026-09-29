import React from 'react';
import { AppInput, AppInputProps } from './AppInput';

// FormField now acts as a thin wrapper over AppInput to maintain backwards compatibility
// without introducing double margins or duplicate labels.
export const FormField = (props: AppInputProps) => {
  return <AppInput {...props} />;
};
