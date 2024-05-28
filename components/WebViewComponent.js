import React, { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { View, BackHandler, Platform, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar } from 'react-native-paper';
import deinExpertAgent64 from "../assets/deinExpert"

import Guide from './Guide';
import { base64Decode } from '../utils/utils';

const WebViewComponent = () => {
  const [jsCode, setJsCode] = useState('');
  const [webViewUrl, setWebViewUrl] = useState('');
  const [stateUrl, setStateUrl] = useState('');
  const [loadWebView, setLoadWebView] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasReloaded, setHasReloaded] = useState(false);
  const webViewRef = useRef(null);

  useEffect(() => {
    const decodedJs = base64Decode(deinExpertAgent64);
    console.log("Loaded Javascript");  // Debug log
    console.log('WINDOW_LOCATION_VALUE:', decodedJs.includes('WINDOW_LOCATION_VALUE'));  // Debug log

    //setJsCode(`window.addEventListener("DOMContentLoaded", function () {${decodedJs}})`);
    setJsCode(decodedJs);

    console.log(stateUrl);  // Debug log


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

  const reload = () => {
    webViewRef.current.reload();
  }

  const processUrlAndNavigate = () => {
    const tempUrl = 'https://www.expert.de/'
    setWebViewUrl(tempUrl);
    setLoadWebView(true);
  };

  const toUrl = (url) => {
    const urlObj = new URL(url);
    return urlObj;
  };

  const handleNavigationStateChange = (navState) => {
    // Check if the URL has actually changed before logging
    if (navState.url !== stateUrl) {
      console.log(toUrl(navState.url).pathname);  // Log the navigation state
      setStateUrl(navState.url);
      //webViewRef.current.injectJavaScript(jsCode.replace('WINDOW_LOCATION_VALUE', toUrl(stateUrl).pathname));
      console.log('Reloading');
      webViewRef.current.reload();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar progress={progress} style={styles.progressBar} />
      {loadWebView ? (
        <WebView
          ref={webViewRef}
          source={{ uri: webViewUrl }}
          javaScriptEnabled
          originWhitelist={['*']}
          pullToRefreshEnabled
          allowsBackForwardNavigationGestures
          onLoadEnd={() => {
            webViewRef.current.injectJavaScript(jsCode);
          }}
          onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
        //onNavigationStateChange={handleNavigationStateChange}
        />
      ) : <Guide processUrlAndNavigate={processUrlAndNavigate} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
  },
  progressBar: {
    backgroundColor: '#222222',
    height: 2,
  },
  button: {
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#222222",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  buttonText: {
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontWeight: "600",
    fontSize: 20,
  },
});

export default WebViewComponent;
