import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';

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
      <View style={styles.cardView}>
        {/* Notes Card */}
        <View style={styles.noteCard}>
          <Text style={styles.cardTextBlack}>Notes</Text>
          <View style={styles.noteContainer}>
            <View style={styles.noteBox}>
              <Text numberOfLines={2} style={styles.noteText}>Meeting at 3 PM</Text>
            </View>
          </View>
        </View>
        {/* Other Cards */}
        <View style={styles.otherCards}>
          {/* Task Card */}
          <View style={styles.taskCard}>
            <FontAwesome5 name="tasks" size={24} color="#2B2B2B" />

            <View>
              <Text style={styles.cardTextGray}>20 Tasks</Text>
              <Text style={styles.cardTextBlack}>To do list</Text>
            </View>
          </View>
          {/* Streak Card */}
          <View style={styles.streakCard}>
            <AntDesign name="fire" size={24} color="#2B2B2B" />

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
  screen:{
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
  },
  header:{
    width: "100%",
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
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
  },
  cardView:{
    width: "100%",
    height: "40%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  noteCard:{
    width: "49%",
    height: "100%",
    backgroundColor: "#f8e9c8",
    borderRadius: 34,
    padding: 24
  },
  otherCards:{
    width: "49%",
    height: "100%",
    justifyContent: "space-between",
  },
  taskCard:{
    width: "100%",
    height: "49%",
    backgroundColor: "#deecec",
    borderRadius: 34,
    padding: 24,
    justifyContent: "space-between",
  },
  streakCard:{
    width: "100%",
    height: "49%",
    backgroundColor: "#ded3fd",
    borderRadius: 34,
    padding: 24,
    justifyContent: "space-between",
  },
  cardTextGray:{
    fontSize: 14,
    fontWeight: "400",
    color: "#6B6B6B",
  },
  cardTextBlack:{
    fontSize: 18,
    fontWeight: "600",
    color: "#2B2B2B",
  },
  noteBox:{
    borderTopColor: "#A3A3A3",
    borderTopWidth: 0.5,
    paddingVertical: 6,
  },
  noteContainer:{
    paddingVertical: 8,
  },
  noteText:{
    fontSize: 14,
    fontWeight: "400",
    color: "#6B6B6B",
    textOverflow: "ellipsis",
  }
})