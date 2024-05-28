import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Guide = ({processUrlAndNavigate}) => (
  <View style={styles.emptyStateContainer}>
    {[
      'Klick auf "Los" um die Expert Seite zu öffnen',
      "Auf der Expert Seite angekommen, klicke auf ein Produkt",
      "Akzeptiere alle Expert Cookies damit der Agent funktioniert",
      "Der Agent ist jetzt auf den Produktseiten verfügbar und bereit!",
    ].map((text, index) => (
      <View key={index} style={styles.listItem}>
        <Text style={styles.listNumber}>{index + 1}.</Text>
        <Text style={styles.listText}>{text}</Text>
      </View>
    ))}
    <TouchableOpacity style={styles.button} onPress={processUrlAndNavigate}>
      <Text style={styles.buttonText}>Verstanden!</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#FFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#d1d1d6",
  },
  input: {
    flex: 1,
    borderColor: "#E0E0E0",
    borderWidth: 0,
    marginRight: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#EFEFF4",
  },
  button: {
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 8,
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  buttonText: {
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontWeight: "500",
  },
  emptyStateContainer: {
    flex: 1,
  
    flexGrow: 1,
    gap:4,
    justifyContent: "center",
    alignItems: "left",
    paddingHorizontal: 30,
  },
  guideHeaderText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
  },
  listItem: {
    flexDirection: "row", // Make it horizontal
    alignItems: "center", // Vertically center the number and text
    marginBottom: 8, // Space between items
  },
  listNumber: {
    fontSize: 14,
    color: "#555",
    width: 25, // Fixed width to ensure alignment
  },
  listText: {
    fontSize: 14,
    color: "#555",
  },
});

export default Guide;
