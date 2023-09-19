import React, { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { View } from 'react-native';
import deinExpertAgent64 from './assets/deinExpert';
import { BackHandler, Platform } from 'react-native';
import { Buffer } from 'buffer';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';


function base64Decode(input) {
  try {
    const decoded = Buffer.from(input, 'base64').toString('utf-8');
    return decoded;
  } catch (e) {
    console.error('Failed to decode base64 string', e);
    return '';
  }
}

const WebViewComponent = () => {
  const [jsCode, setJsCode] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef(null);
  const onAndroidBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true; // prevent default behavior (exit app)
    }
    return false;
  };

  useEffect(() => {
    const decodedJs = base64Decode(deinExpertAgent64);
    setJsCode(`window.addEventListener("load", function () {${decodedJs}})`);

    // Adding an event listener for the hardware back button
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onAndroidBackPress
        );
      };
    }
  }, []);

  const onNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
    if (navState.url.startsWith('https://www.expert.de/shop/') && jsCode) {
      webViewRef.current.injectJavaScript(jsCode);
    }
  };

  const onSwipeHandlerStateChange = (event) => {
    if (
      canGoBack &&
      event.nativeEvent.oldState === 4 &&
      event.nativeEvent.translationX > 50
    ) {
      // Detect a swipe from the left to the right
      webViewRef.current.goBack();
    }
  };

  return (
  <PanGestureHandler onHandlerStateChange={onSwipeHandlerStateChange}>
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://www.expert.de/' }}
        javaScriptEnabled={true}
        onNavigationStateChange={onNavigationStateChange}
        originWhitelist={['*']}
        pullToRefreshEnabled={true}
        allowsBackForwardNavigationGestures={true}
      />
    </SafeAreaView>
  </PanGestureHandler>
);
};

export default WebViewComponent;
