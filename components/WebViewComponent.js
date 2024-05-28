import React, { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { View, BackHandler, Platform, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar } from 'react-native-paper';
import deinExpertAgent64 from "../assets/deinExpert"

import Guide from './Guide';
import { base64Decode } from '../utils/utils';

const WebViewComponent = () => {
  const [jsCode, setJsCode] = useState('');
  const [webViewUrl, setWebViewUrl] = useState('');
  const [loadWebView, setLoadWebView] = useState(false);
  const [progress, setProgress] = useState(0);
  const webViewRef = useRef(null);

  useEffect(() => {
    setJsCode(`window.addEventListener("load", function () {${base64Decode(deinExpertAgent64)}})`);

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', () => {
        if (webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      });
    }
  }, []);

  const processUrlAndNavigate = () => {
    const tempUrl = 'https://www.expert.de/'
    setWebViewUrl(tempUrl);
    setLoadWebView(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ProgressBar progress={progress} />
      {loadWebView ? (
        <WebView
          ref={webViewRef}
          source={{ uri: webViewUrl }}
          javaScriptEnabled
          originWhitelist={['*']}
          pullToRefreshEnabled
          allowsBackForwardNavigationGestures
          onNavigationStateChange={(navState) => {
            if (navState.url.startsWith('https://www.expert.de/shop/') && jsCode) {
              webViewRef.current.injectJavaScript(jsCode);
            }
          }}
          onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
        />
      ) : <Guide processUrlAndNavigate={processUrlAndNavigate} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#d1d1d6'
  },
  input: {
    flex: 1,
    borderColor: '#E0E0E0',
    borderWidth: 0,
    marginRight: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#EFEFF4'
  },
  button: {
    borderRadius: 8,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '500'
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'left',
    paddingHorizontal: 30,
  },
  guideHeaderText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15
  },
  listItem: {
    flexDirection: 'row', // Make it horizontal
    alignItems: 'center',  // Vertically center the number and text
    marginBottom: 8       // Space between items
  },
  listNumber: {
    fontSize: 14,
    color: '#555',
    width: 25  // Fixed width to ensure alignment
  },
  listText: {
    fontSize: 14,
    color: '#555'
  },
});


export default WebViewComponent;
