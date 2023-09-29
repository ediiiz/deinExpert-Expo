import React, { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { View } from 'react-native';
import deinExpertAgent64 from './assets/deinExpert';
import { BackHandler, Platform } from 'react-native';
import { Buffer } from 'buffer';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar, Colors } from 'react-native-paper';

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
  const [progress, setProgress] = useState(0);
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

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
      };
    }
  }, []);

  const onNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
    if (navState.url.startsWith('https://www.expert.de/shop/') && jsCode) {
      webViewRef.current.injectJavaScript(jsCode);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <ProgressBar progress={progress} color={Colors.orange100} />
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://www.expert.de/' }}
        javaScriptEnabled={true}
        onNavigationStateChange={onNavigationStateChange}
        originWhitelist={['*']}
        pullToRefreshEnabled={true}
        allowsBackForwardNavigationGestures={true}
        onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
      />
    </SafeAreaView>
  );
};

export default WebViewComponent;

