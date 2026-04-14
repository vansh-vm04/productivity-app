import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { createElement, ReactElement } from "react";
import { StyleProp, TextStyle } from "react-native";

import {
	CATEGORY_TAGS,
	CategoryType,
	PRIORITY_TAGS,
	PriorityType,
} from "@/shared/constants/tags";
import { CARD_PALETTES } from "@/shared/theme/colors";
import { moderateScale } from "@/shared/utils/responsive";

type IconStyle = StyleProp<TextStyle>;

type TaskCategoryIconOptions = {
	size?: number;
	color?: string;
	style?: IconStyle;
};

export const getTaskCardColors = (index: number) => {
	return CARD_PALETTES[index % CARD_PALETTES.length];
};

export const getTaskCategoryIcon = (
	category: CategoryType,
	options: TaskCategoryIconOptions = {},
): ReactElement => {
	const size = options.size ?? moderateScale(18);
	const color = options.color ?? "#ffffff";
	const style = options.style;

	switch (category) {
		case "work":
			return createElement(FontAwesome5, {
				name: "briefcase",
				size,
				color,
				style,
			});
		case "health":
			return createElement(MaterialCommunityIcons, {
				name: "dumbbell",
				size,
				color,
				style,
			});
		case "personal":
			return createElement(MaterialCommunityIcons, {
				name: "home",
				size,
				color,
				style,
			});
		case "growth":
			return createElement(MaterialCommunityIcons, {
				name: "sprout",
				size,
				color,
				style,
			});
		case "deepwork":
			return createElement(MaterialCommunityIcons, {
				name: "brain",
				size,
				color,
				style,
			});
		default:
			return createElement(FontAwesome5, {
				name: "tasks",
				size,
				color,
				style,
			});
	}
};

export const formatTaskDueDate = (date: Date) => {
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	const time = `${hours}:${minutes}`;

	if (date.toDateString() === today.toDateString()) {
		return `Today ${time}`;
	}

	if (date.toDateString() === tomorrow.toDateString()) {
		return `Tomorrow ${time}`;
	}

	const monthDay = date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});
	return `${monthDay} ${time}`;
};

export const isTaskCategoryType = (value: string): value is CategoryType => {
	return value in CATEGORY_TAGS;
};

export const isTaskPriorityType = (value: string): value is PriorityType => {
	return value in PRIORITY_TAGS;
};

export const formatTaskDate = (date: Date | null) => {
	if (!date) return "Select date";
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

export const formatTaskTime = (date: Date | null) => {
	if (!date) return "Select time";
	return date.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
	});
};
