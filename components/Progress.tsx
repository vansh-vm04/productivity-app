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
    <View
      style={styles.card}
    >
      <Text style={styles.cardTitle}>{"Today's Progress"}</Text>
      <View style={styles.progressContainer}>
        <AnimatedCircularProgress
          size={180}
          width={12}
          fill={progress}
          tintColor="#E10600"
          backgroundColor="#e7a0a030"
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 6,
    alignItems: "flex-start",
    width: "100%",
    marginVertical: 12,
    backgroundColor: "#202020",
    borderWidth: 0.5,
    borderColor: "#3d3d3d",
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold", 
    color: "#ffffff",
    borderBottomColor: "#3d3d3d",
    borderBottomWidth: 0.5,
    paddingTop: 6,
    paddingBottom: 4,
    width: "100%",
  },
  centerContent: {
    alignItems: "center",
  },
  percentText: {
    fontSize: 36,
    fontWeight: "900",
    color: "#ffffff",
    marginTop: -10,
  },
  subText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#ffffff",
    marginTop: 4,
  },
  message: {
    fontSize: 13,
    color: "#ffffff",
    textAlign: "center",
    marginTop: -36,
    fontFamily: "Poppins-Medium",
  },
  progressContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 8,
  },
});
