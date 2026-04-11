import TodayProgress from "@/components/Progress";
import TasksScrollable from "@/components/TasksScrollable";
import { BACKGROUND, PRIMARY, TEXT } from "@/theme/colors";
import { moderateScale, responsiveFontSize } from "@/utils/responsive";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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
        <View style={{ flexDirection: "row", gap: moderateScale(8) }}>
        <TouchableOpacity style={styles.bellButton}>
          <Text style={styles.unreadMarker}>●</Text>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        </View>
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
    backgroundColor: BACKGROUND.secondary,
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(40),
  },
  header: {
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: moderateScale(8),
    paddingTop: moderateScale(50),
  },
  headerGreeting: {
    fontSize: responsiveFontSize(26),
    fontFamily: "Poppins-Light",
    color: TEXT.primary,
  },
  headerName: {
    fontSize: responsiveFontSize(26),
    fontFamily: "Poppins-Medium",
    color: TEXT.primary,
  },
  headerTextSmall: {
    fontSize: responsiveFontSize(12),
    fontFamily: "Poppins-Light",
    color: TEXT.primary,
  },
  headerLeft: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  addButton: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: PRIMARY.main,
    alignItems: "center",
    justifyContent: "center",
  },
  bellButton: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: PRIMARY.main,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: responsiveFontSize(26),
    fontWeight: "200",
    color: TEXT.primary,
    textAlign: "center",
    lineHeight: moderateScale(40),
  },
  unreadMarker: {
    position: "absolute",
    top: 11,
    right: 17,
    color: "#ffffff",
    zIndex: 1,
    fontSize: responsiveFontSize(18),
  },
});
