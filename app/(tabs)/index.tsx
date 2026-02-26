import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.screen}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTextSmall}>Good Morning,</Text>
          <Text style={styles.headerTextLarge}>Vansh!</Text>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      
    </View>
  );
}

const styles = StyleSheet.create({
  screen:{
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#ffffff",
  },
  header:{
    width: "100%",
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 30,
    paddingVertical: 8,
    paddingTop: 50,
  },
  headerTextLarge:{
    fontSize: 32,
    fontWeight: "400",
  },
  headerTextSmall:{
    fontSize: 12,
    fontWeight: "400",
  },
  headerLeft:{
    justifyContent: "center",
    alignItems: "flex-start",
  },
  addButton:{
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#434343",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText:{
    fontSize: 28,
    fontWeight: "200",
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 40,
  }
})