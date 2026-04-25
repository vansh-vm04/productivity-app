import TasksScrollable from "@/features/tasks/components/TasksScrollable";
import CreateModal from "@/shared/components/CreateModal";
import TodayProgress from "@/shared/components/ProgressCard";
import { TEXT, SCREEN } from "@/shared/theme/colors";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <LinearGradient
      colors={[SCREEN.gradientStart, SCREEN.gradientEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradientBackground}
    >
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
              <MaterialCommunityIcons
                name="bell-ring-outline"
                size={24}
                color="#000000"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Progress Card */}
        <TodayProgress completed={12} total={20} />

        {/* All Tasks Scrollable */}
        <TasksScrollable />
      </ScrollView>

      {/* Create Modal */}
      <CreateModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  screen: {
    flexGrow: 1,
    backgroundColor: "transparent",
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
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bellButton: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: responsiveFontSize(26),
    fontWeight: "300",
    color: "#000000",
    textAlign: "center",
    lineHeight: moderateScale(40),
  },
  unreadMarker: {
    position: "absolute",
    top: 11,
    right: 17,
    color: "#000000",
    zIndex: 1,
    fontSize: responsiveFontSize(18),
  },
});
