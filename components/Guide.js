import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Guide = ({ processUrlAndNavigate }) => (
  <View style={styles.emptyStateContainer}>
    {[
      'Klicke auf "Verstanden", um zu starten!',
      "Akzeptiere alle Cookies, damit der Agent funktioniert!",
      "Auf der Seite angekommen, suche dein Produkt!",
      "Der Agent sollte jetzt auf den Produktseiten am unteren Rand verfügbar und bereit sein!",
      "Falls nichts zusehen, auf 'Agent erneut laden' drücken!",
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
    fontWeight: "600",
    fontSize: 22,
  },
  emptyStateContainer: {
    flex: 1,

    flexGrow: 1,
    gap: 16,
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
    marginBottom: 8, // Space between items
  },
  listNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#E8E8E8",
    width: 25, // Fixed width to ensure alignment
  },
  listText: {
    fontSize: 20,
    color: "#E8E8E8",
    fontWeight: "700",
  },
});

export default Guide;
