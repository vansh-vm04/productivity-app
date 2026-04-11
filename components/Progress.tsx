import { BORDER, PRIMARY, SURFACE, TEXT, UTILITY } from "@/theme/colors";
import { moderateScale, responsiveFontSize } from "@/utils/responsive";
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
          size={moderateScale(180)}
          width={moderateScale(12)}
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
    borderRadius: moderateScale(24),
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(6),
    alignItems: "flex-start",
    width: "100%",
    marginVertical: moderateScale(12),
    backgroundColor: SURFACE.primary,
    borderWidth: 0.5,
    borderColor: BORDER.primary,
  },
  cardTitle: {
    fontSize: responsiveFontSize(16),
    fontFamily: "Poppins-Bold",
    color: TEXT.primary,
    borderBottomColor: BORDER.primary,
    borderBottomWidth: 0.5,
    paddingTop: moderateScale(6),
    paddingBottom: moderateScale(4),
    width: "100%",
  },
  centerContent: {
    alignItems: "center",
  },
  percentText: {
    fontSize: responsiveFontSize(36),
    fontWeight: "900",
    color: TEXT.primary,
    marginTop: moderateScale(-10),
  },
  subText: {
    fontSize: responsiveFontSize(14),
    fontFamily: "Poppins-Regular",
    color: TEXT.primary,
    marginTop: moderateScale(4),
  },
  message: {
    fontSize: responsiveFontSize(13),
    color: TEXT.primary,
    textAlign: "center",
    marginTop: moderateScale(-36),
    fontFamily: "Poppins-Medium",
  },
  progressContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: moderateScale(14),
    paddingBottom: moderateScale(8),
  },
});
