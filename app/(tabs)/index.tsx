import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import TodayProgress from "@/components/Progress";

export default function Index() {
  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerGreeting}>Hey <Text style={styles.headerName}>Vansh!</Text></Text>
          <Text style={styles.headerTextSmall}>
            Let’s make today productive.
          </Text>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <TodayProgress completed={12} total={20}></TodayProgress>

      <View style={styles.cardView}>
        {/* Notes Card */}
        <View style={styles.noteCard}>
          <Text style={styles.cardTextBlack}>Notes</Text>
          <View style={styles.noteContainer}>
            <View style={styles.noteBox}>
              <Text numberOfLines={2} style={styles.noteText}>
                Meeting at 3 PM
              </Text>
            </View>
          </View>
        </View>
        {/* Other Cards */}
        <View style={styles.otherCards}>
          {/* Task Card */}
          <View style={styles.taskCard}>
            <FontAwesome5 name="tasks" size={22} color="#2B2B2B" />

            <View>
              <Text style={styles.cardTextGray}>20 Tasks</Text>
              <Text style={styles.cardTextBlack}>To do list</Text>
            </View>
          </View>
          {/* Streak Card */}
          <View style={styles.streakCard}>
            <AntDesign name="fire" size={22} color="#2B2B2B" />

            <View>
              <Text style={styles.cardTextGray}>7 days</Text>
              <Text style={styles.cardTextBlack}>Streak</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#111111",
    paddingHorizontal: 24,
  },
  header: {
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 8,
    paddingTop: 50,
  },
  headerGreeting: {
    fontSize: 26,
    fontFamily: "Poppins-Light",
    color: "#ffffff",
  },
  headerName: {
    fontSize: 26,
    fontFamily: "Poppins-Medium",
    color: "#ffffff",
  },
  headerTextSmall: {
    fontSize: 12,
    fontFamily: "Poppins-Light",
    color: "#ffffff",
  },
  headerLeft: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E10600",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 26,
    fontWeight: "200",
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 40,
  },
  cardView: {
    width: "100%",
    height: "36%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  noteCard: {
    width: "49%",
    height: "100%",
    backgroundColor: "#f8efc8",
    borderRadius: 34,
    padding: 24,
  },
  otherCards: {
    width: "49%",
    height: "100%",
    justifyContent: "space-between",
  },
  taskCard: {
    width: "100%",
    height: "49%",
    backgroundColor: "#f8e0c8",
    borderRadius: 34,
    padding: 24,
    justifyContent: "space-between",
  },
  streakCard: {
    width: "100%",
    height: "49%",
    backgroundColor: "#c8f8dc",
    borderRadius: 34,
    padding: 24,
    justifyContent: "space-between",
  },
  cardTextGray: {
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    color: "#6B6B6B",
  },
  cardTextBlack: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#2B2B2B",
  },
  noteBox: {
    borderTopColor: "#A3A3A3",
    borderTopWidth: 0.5,
    paddingVertical: 6,
  },
  noteContainer: {
    paddingVertical: 4,
  },
  noteText: {
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    color: "#6B6B6B",
    textOverflow: "ellipsis",
  },
});
