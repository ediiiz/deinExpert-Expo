import React, { useState, useCallback } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

const App: React.FC = () => {
  const [content, setContent] = useState<string | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  const jsCode = `
    window.ReactNativeWebView.postMessage(document.querySelectorAll("body > div.pageWrapper.isChrome.isBlink > div > div.widget-Page-content > div > div > div > div.widget.widget-Container.widget-Container---size-full.widget-Container---46a17d16-9b21-48b4-9308-7d036f321fdd.widget-Container---view-container.widget-Container---preset-default > div > div.widget.widget-CaseWidget.widget-CaseWidget---a685bb45-72dc-4d5d-8dc2-041fb8cf6b8a.widget-CaseWidget---view-case-widget.widget-CaseWidget---preset-default > div > div.widget.widget-Container.widget-Container---size-default.widget-Container---66bae06e-89e9-4d9a-bf15-ca29694d5573.widget-Container---view-container.widget-Container---preset-default > div.widget.widget-Grid.widget-Grid---b8f07163-1017-4d73-8844-83ec14e7fb11.widget-Grid---view-grid.widget-Grid---preset-default.widget-Grid-content.grid-row > div.widget.widget-Column.widget-Column---09029308-cf51-46bd-b471-6fa597fec19c.widget-Column---view-column.widget-Column---preset-default.drag-not-allowed.grid-col-xs-12.grid-col-lg-3.grid-push-lg-4 > div.widget.widget-CaseWidget.widget-CaseWidget---dedf10fd-775a-4a85-a292-274322768fe4.widget-CaseWidget---view-case-widget.widget-CaseWidget---preset-default > div > div.widget.widget-Container.widget-Container---size-default.widget-Container---4bba1707-2c68-4b45-ab19-2bee95430bbb.widget-Container---view-container.widget-Container---preset-default.margin-xs-top-10.margin-xs-bottom-10.padding-xs-top-0.padding-xs-bottom-0 > div.widget.widget-ArticlePrice.widget-ArticlePrice---5cae0892-10f8-499f-8de1-38fb52b786ab.widget-ArticlePrice---view-article-price.widget-ArticlePrice---preset-md.padding-xs-bottom-10 > div.widget-ArticlePrice-priceWrapper.font-family-price.font-style-italic.font-weight-normal > div.widget-ArticlePrice-price")[0].innerHTML);
  `;

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    console.log('Received WebView content:', event.nativeEvent.data);
    setContent(event.nativeEvent.data);
    setShouldLoad(false); // Reset the state after loading and extracting data
  };

  const handleClick = useCallback(() => {
    setShouldLoad(true);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <View style={styles.buttonContainer}>
          <Button title="Load Content" onPress={handleClick} />
        </View>
      </View>
      <View style={styles.bottomHalf}>{content && <Text>{content}</Text>}</View>

      {shouldLoad && (
        <WebView
          source={{
            uri: 'https://www.expert.de/shop/unsere-produkte/tv-audio/fernseher/lcd-led-fernseher/11128434509-oled-tv-oled77c39lc-aeu.html?campaignid',
          }}
          injectedJavaScript={jsCode}
          onMessage={handleWebViewMessage}
          style={styles.hiddenWebView}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  topHalf: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomHalf: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenWebView: {
    width: 0,
    height: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  },
  buttonContainer: {
    zIndex: 999,
  },
});

export default App;
