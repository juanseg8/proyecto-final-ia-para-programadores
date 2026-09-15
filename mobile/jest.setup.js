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
