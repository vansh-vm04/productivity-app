import { BORDER, PRIMARY, SURFACE, TEXT, UTILITY } from "@/theme/colors";
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
    if (progress < 100)
      return `🔥 You’re ${progress}% there. Keep the momentum!`;
    return "You crushed today 👏";
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{"Today's Progress"}</Text>
      <View style={styles.progressContainer}>
        <AnimatedCircularProgress
          size={180}
          width={12}
          fill={progress}
          tintColor={PRIMARY.main}
          backgroundColor={UTILITY.transparentBlack30}
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
    backgroundColor: SURFACE.primary,
    borderWidth: 0.5,
    borderColor: BORDER.primary,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: TEXT.primary,
    borderBottomColor: BORDER.primary,
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
    color: TEXT.primary,
    marginTop: -10,
  },
  subText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: TEXT.primary,
    marginTop: 4,
  },
  message: {
    fontSize: 13,
    color: TEXT.primary,
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
