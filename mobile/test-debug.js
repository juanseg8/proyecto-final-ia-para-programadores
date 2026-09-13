const { render } = require('@testing-library/react-native');
const React = require('react');
const { View, Text } = require('react-native');

try {
  render(React.createElement(View, null, React.createElement(Text, null, 'Hello')));
  console.log('Render success');
} catch (e) {
  console.error('Render failed:', e);
}
