import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Guide = () => (
  <View style={styles.emptyStateContainer}>
    {['Gib "expert.de" in das Eingabefeld ein.', 'Drücke auf "Los"', 'Auf expert.de wird dann der Agent installiert',
      'Akzeptiere alle Expert Cookies damit der Agent funktioniert', 'Wähle keinen Markt und schließe das Popup einfach',
      'Der Agent ist jetzt auf den Produktseiten verfügbar und bereit!'].map((text, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listNumber}>{index + 1}.</Text>
          <Text style={styles.listText}>{text}</Text>
        </View>
      ))}
  </View>
);

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

export default Guide;
