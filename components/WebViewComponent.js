import React, { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { View, BackHandler, Platform, StyleSheet, TouchableOpacity, Text, Animated, ActivityIndicator  } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar } from 'react-native-paper';
import deinExpertAgent64 from "../assets/deinExpert"

import Guide from './Guide';
import { base64Decode } from '../utils/utils';

const WebViewComponent = () => {
  const [jsCode, setJsCode] = useState(base64Decode(deinExpertAgent64));
  const [webViewUrl, setWebViewUrl] = useState('');
  const [stateUrl, setStateUrl] = useState('');
  const [loadWebView, setLoadWebView] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showButton, setShowButton] = useState(false); // State for showing button
  const [wasInjected, setWasInjected] = useState(false); // Track if the JS was injected
  const [isLoading, setIsLoading] = useState(false); // Track if the page is loading
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const webViewRef = useRef(null);

  useEffect(() => {
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
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [showButton, fadeAnim]);

  const reload = () => {
    webViewRef.current.reload();
  }

  const processUrlAndNavigate = () => {
    const tempUrl = 'https://www.expert.de/'
    setWebViewUrl(tempUrl);
    setLoadWebView(true);
  };

  function getPathname(url) {
    let path = url.replace(/(^\w+:|^)\/\//, ''); // Remove protocol (http, https)
    path = path.substring(path.indexOf('/')); // Get the substring starting from the first slash
    return path ? path.split('?')[0] : '/'; // Split on '?' to remove query parameters
  }


  const handleNavigationStateChange = (navState) => {
    if(navState.url !== stateUrl) {
      setShowButton(false);
      const urlPath = getPathname(navState.url)
      console.log(urlPath)
      setStateUrl(navState.url);

      if(urlPath==="/"){
        setShowButton(false);
        setWasInjected(false);
        return;
      }

      if (urlPath.startsWith('/shop/unsere-produkte')) {
        if (!wasInjected) {
          setShowButton(true);
          return;
        }
      }

      if (!(urlPath === '/shop')) {
        setShowButton(false);
        setWasInjected(false);
        return;
      }
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
      <ProgressBar progress={progress} style={styles.progressBar} pointerEvents='none'/>
      {loadWebView ? (
          <WebView
            ref={webViewRef}
            source={{ uri: webViewUrl }}
            javaScriptEnabled
            originWhitelist={['*']}
            pullToRefreshEnabled
            allowsBackForwardNavigationGestures
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
            onNavigationStateChange={handleNavigationStateChange}
          />
      ) : (
        <Guide processUrlAndNavigate={processUrlAndNavigate} />
      )}
      { showButton && (
        <Animated.View style={[styles.floatingContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.button} onPress={injectJavaScript}>
            <Text style={styles.buttonText}>deinExpert starten!</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
  },
  progressBar: {
    marginTop: 5,
    backgroundColor: '#222222',
    height: 8,
  },
  floatingContainer: {
    position: 'relative',
    top: 0,
    bottom: 0,
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
    paddingVertical: 20,
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
