import TodayProgress from "@/components/Progress";
import TasksScrollable from "@/components/TasksScrollable";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerGreeting}>
            Hey <Text style={styles.headerName}>Vansh!</Text>
          </Text>
          <Text style={styles.headerTextSmall}>
            Let’s make today productive.
          </Text>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Progress Card */}
      <TodayProgress completed={12} total={20} />

      {/* All Tasks Scrollable */}
      <TasksScrollable />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 16,
    paddingBottom: 40,
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
});
