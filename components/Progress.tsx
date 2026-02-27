import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

type Props = {
  completed: number;
  total: number;
};

export default function TodayProgress({ completed, total }: Props) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const progress = Math.round((completed / total) * 100);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const getMessage = () => {
    if (progress === 0) return "Let’s start your day 🚀";
    if (progress < 50) return "Nice start. Keep going 🔥";
    if (progress < 100) return `🔥 You’re ${progress}% there. Keep the momentum!`;
    return "You crushed today 👏";
  };

  return (
    <LinearGradient
      colors={["#f3e8ff", "#e8eaff", "#dbeafe"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.cardTitle}>{"Today's Progress"}</Text>
      <View style={styles.progressContainer}>
        <AnimatedCircularProgress
          size={180}
          width={12}
          fill={progress}
          tintColor="#9b7bf7"
          backgroundColor="#d7d0e774"
          arcSweepAngle={180}
          rotation={270}
          lineCap="round"
        >
          {() => (
            <View style={styles.centerContent}>
              <Text style={styles.percentText}>{progress}%</Text>
              <Text style={styles.subText}>
                {completed} of {total} tasks
              </Text>
            </View>
          )}
        </AnimatedCircularProgress>

        <Text style={styles.message}>{getMessage()}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 34,
    paddingHorizontal: 20,
    paddingVertical: 6,
    alignItems: "flex-start",
    width: "100%",
    borderColor: "rgba(180, 160, 240, 0.25)",
    borderWidth: 1,
    shadowColor: "#c38cc1e1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    marginTop: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3b3660",
    borderBottomColor: "rgba(155, 123, 247, 0.15)",
    borderBottomWidth: 1,
    paddingVertical: 10,
    width: "100%",
  },
  centerContent: {
    alignItems: "center",
  },
  percentText: {
    fontSize: 36,
    fontWeight: "900",
    color: "#2d275a",
    marginTop: -10,
  },
  subText: {
    fontSize: 14,
    color: "#6b6894",
    marginTop: 4,
  },
  message: {
    fontSize: 15,
    color: "#6b6894",
    textAlign: "center",
    marginTop: -26,
  },
  progressContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
});
