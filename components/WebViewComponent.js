import React, { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { View, BackHandler, Platform, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
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
  const [showButton, setShowButton] = useState(false); // State for showing button
  const [wasInjected, setWasInjected] = useState(false); // Track if the JS was injected
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const webViewRef = useRef(null);

  useEffect(() => {
    const decodedJs = base64Decode(deinExpertAgent64);
    console.log("Loaded Javascript");  // Debug log
    console.log('WINDOW_LOCATION_VALUE:', decodedJs.includes('WINDOW_LOCATION_VALUE'));  // Debug log

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

  useEffect(() => {
    // Fade in or out the button based on showButton state
    Animated.timing(fadeAnim, {
      toValue: showButton ? 1 : 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [showButton]);

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
    const urlPath = toUrl(navState.url).pathname;
    console.log(urlPath);  // Log the navigation state
    setStateUrl(navState.url);

    if (urlPath === '/') {
      setWasInjected(false); // Reset the injected state when navigating to home
    }

    if (urlPath.includes('/shop/unsere-produkte')) {
      if (!wasInjected) {
        setShowButton(true);
      }
    } else {
      setShowButton(false);
    }
  };

  const injectJavaScript = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(jsCode);
      setWasInjected(true); // Track that JS was injected
      setShowButton(false); // Hide the button after injecting JavaScript
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
          onLoadEnd={() => setWasInjected(false)}
          onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
          onNavigationStateChange={handleNavigationStateChange}
        />
      ) : <Guide processUrlAndNavigate={processUrlAndNavigate} />}
      <Animated.View style={[styles.floatingContainer, { opacity: fadeAnim }]} pointerEvents={showButton ? 'auto' : 'none'}>
        <TouchableOpacity style={styles.button} onPress={injectJavaScript}>
          <Text style={styles.buttonText}>deinExpert starten!</Text>
        </TouchableOpacity>
      </Animated.View>
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
  floatingContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100, // Ensure the button is on top
  },
  button: {
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#222222",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25, // Make the button rounded
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
