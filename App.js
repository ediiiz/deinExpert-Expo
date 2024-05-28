import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import WebViewComponent from './components/WebViewComponent';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light"/>
      <WebViewComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
  },
});

export default App;
