jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  const MockMapView = (props) => <View {...props}>{props.children}</View>;
  const MockMarker = (props) => <View {...props}>{props.children}</View>;
  
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: (props) => <View {...props}>{props.children}</View>,
  };
});

jest.mock('@react-navigation/bottom-tabs', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  
  const createBottomTabNavigator = () => ({
    Navigator: ({ children, screenOptions, tabBar }) => {
      const React = require('react');
      return React.createElement(View, { testID: 'bottom-tab-navigator' }, children);
    },
    Screen: ({ component: Component, name }) => {
      const React = require('react');
      return React.createElement(Component, { navigation: { navigate: jest.fn(), goBack: jest.fn() }, route: { params: {} } });
    },
  });

  return { createBottomTabNavigator };
});

