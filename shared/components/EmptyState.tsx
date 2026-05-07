import { TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import React from "react";
import {
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
}

export const EmptyState = React.memo(
  ({
    title,
    subtitle,
    compact = false,
    style,
    titleStyle,
    subtitleStyle,
  }: EmptyStateProps) => {
    return (
      <View style={[styles.container, style]}>
        <Text
          style={[styles.title, compact && styles.titleCompact, titleStyle]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.subtitle,
            compact && styles.subtitleCompact,
            subtitleStyle,
          ]}
        >
          {subtitle}
        </Text>
      </View>
    );
  },
);

EmptyState.displayName = "EmptyState";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: responsiveFontSize(18),
    fontFamily: fonts.semibold,
    color: TEXT.tertiary,
  },
  titleCompact: {
    fontSize: responsiveFontSize(16),
  },
  subtitle: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.regular,
    color: TEXT.tertiary,
    marginTop: moderateScale(8),
  },
  subtitleCompact: {
    fontSize: responsiveFontSize(12),
  },
});
