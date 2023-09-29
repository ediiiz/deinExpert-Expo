import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import WebViewComponent from './components/WebViewComponent';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <WebViewComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
});

export default App;
