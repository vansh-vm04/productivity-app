import {
  formatTaskDueDate,
  getTaskCategoryIcon,
} from "@/features/tasks/ui/tasks.helper";
import { CATEGORY_TAGS, PRIORITY_TAGS } from "@/shared/constants/tags";
import { TAG, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { Task } from "@/shared/types/task";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface TaskCardProps {
  task: Task;
  index: number;
  onPress: () => void;
  onLongPress?: () => void;
  activeOpacity?: number;
  dueIconSize?: number;
  categoryIconStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

export const TaskCard = React.memo(
  ({
    task,
    index,
    onPress,
    onLongPress,
    activeOpacity = 0.8,
    dueIconSize = moderateScale(14),
    categoryIconStyle,
    style,
  }: TaskCardProps) => {
    // Light blue for non-completed tasks, green for completed
    const colors = task.completed
      ? { base: "#E9FBF3", glow: "#34D399", accent: "#059669" }
      : { base: "#EAF3FF", glow: "#60A5FA", accent: "#2563EB" };

    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={onLongPress ? 300 : undefined}
        style={[
          styles.taskCard,
          {
            backgroundColor: "#FFFFFF",
          },
          style,
        ]}
        activeOpacity={activeOpacity}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            {getTaskCategoryIcon(task.category, {
              style: categoryIconStyle,
              color: task.completed ? TEXT.tertiary : TEXT.primary,
            })}
            <Text
              style={[
                styles.taskName,
                task.completed && styles.taskNameCompleted,
              ]}
              numberOfLines={1}
            >
              {task.name}
            </Text>
            <View
              style={[
                styles.checkbox,
                task.completed && {
                  backgroundColor: colors.glow,
                  borderColor: colors.glow,
                },
                !task.completed && {
                  borderColor: colors.glow,
                },
              ]}
            >
              {task.completed && (
                <FontAwesome5
                  name="check"
                  size={14}
                  color="#ffffff"
                  style={{ fontWeight: "bold" }}
                />
              )}
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.tagsContainer}>
              <View
                style={[
                  styles.tag,
                  {
                    backgroundColor: colors.base,
                    borderColor: colors.glow,
                  },
                ]}
              >
                <Text style={styles.tagText}>
                  {PRIORITY_TAGS[task.priority].label}
                </Text>
              </View>

              <View
                style={[
                  styles.tag,
                  {
                    backgroundColor: colors.base,
                  },
                ]}
              >
                <Text style={styles.tagText}>
                  {CATEGORY_TAGS[task.category].label}
                </Text>
              </View>
            </View>

            <View style={styles.dueDateInline}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={dueIconSize}
                color={TEXT.secondary}
              />
              <Text style={styles.dueDateText}>
                {formatTaskDueDate(task.dueDate)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

TaskCard.displayName = "TaskCard";

const styles = StyleSheet.create({
  taskCard: {
    width: "100%",
    height: moderateScale(110),
    borderRadius: moderateScale(16),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: moderateScale(16),
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "column",
    marginVertical: moderateScale(6),
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    elevation: 1,
  },
  cardContent: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "flex-start",
    zIndex: 1,
    flexDirection: "column",
    gap: moderateScale(30),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
    width: "100%",
    justifyContent: "space-between",
  },
  taskName: {
    fontSize: responsiveFontSize(13),
    fontFamily: fonts.semibold,
    color: TEXT.primary,
    flex: 1,
    lineHeight: moderateScale(16),
    paddingTop: moderateScale(2),
  },
  taskNameCompleted: {
    color: TEXT.tertiary,
    textDecorationLine: "line-through",
  },
  dueDateInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
  },
  dueDateText: {
    fontSize: responsiveFontSize(11),
    fontFamily: fonts.medium,
    color: TEXT.secondary,
    paddingTop: moderateScale(2),
  },
  cardFooter: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: moderateScale(8),
  },
  tagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
    flex: 1,
  },
  tag: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(3),
    borderRadius: moderateScale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  tagText: {
    fontSize: responsiveFontSize(11),
    fontFamily: fonts.medium,
    color: TAG.text,
  },
  checkbox: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(6),
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});
