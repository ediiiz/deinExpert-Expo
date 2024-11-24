import React, { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { View, BackHandler, Platform, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import deinExpertAgent64 from "../assets/deinExpert"
import Guide from './Guide';
import { base64Decode } from '../utils/utils';

const CustomProgressBar = ({ progress }) => (
  <View style={styles.progressBarContainer}>
    <View 
      style={[
        styles.progressBarFill, 
        { width: `${progress * 100}%` }
      ]} 
    />
  </View>
);

const WebViewComponent = () => {
  const [jsCode] = useState(base64Decode(deinExpertAgent64));
  const [webViewUrl, setWebViewUrl] = useState('');
  const [stateUrl, setStateUrl] = useState('');
  const [loadWebView, setLoadWebView] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [wasInjected, setWasInjected] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const webViewRef = useRef(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      });
      return () => backHandler.remove();
    }
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showButton ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [showButton, fadeAnim]);

  const processUrlAndNavigate = () => {
    setWebViewUrl('https://www.expert.de/');
    setLoadWebView(true);
  };

  function getPathname(url) {
    let path = url.replace(/(^\w+:|^)\/\//, '');
    path = path.substring(path.indexOf('/'));
    return path ? path.split('?')[0] : '/';
  }

  const handleNavigationStateChange = (navState) => {
    if(navState.url !== stateUrl) {
      setShowButton(false);
      const urlPath = getPathname(navState.url);
      setStateUrl(navState.url);

      if(urlPath === "/"){
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
      }
    }
  };

  const injectJavaScript = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(jsCode);
      setWasInjected(true);
      setShowButton(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {progress < 1 && <CustomProgressBar progress={progress} />}
      {loadWebView ? (
        <WebView
          ref={webViewRef}
          source={{ uri: webViewUrl }}
          javaScriptEnabled={true}
          originWhitelist={['*']}
          pullToRefreshEnabled={true}
          allowsBackForwardNavigationGestures={true}
          onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
          onNavigationStateChange={handleNavigationStateChange}
        />
      ) : (
        <Guide processUrlAndNavigate={processUrlAndNavigate} />
      )}
      {showButton && (
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
  progressBarContainer: {
    height: 3,
    backgroundColor: '#E0E0E0',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  floatingContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  button: {
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#222222",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 25,
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
