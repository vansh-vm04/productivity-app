import { PRIMARY, TAB } from "@/shared/theme/colors";
import { moderateScale } from "@/shared/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: TAB.inActive,
        tabBarActiveTintColor: PRIMARY.main,
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerShadowVisible: false,
        headerTintColor: "#000000",
        tabBarStyle: {
          backgroundColor: TAB.background,
          paddingVertical: moderateScale(2),
          paddingHorizontal: moderateScale(24),
          borderTopColor: "#000000",
          borderRightColor: "#000000",
          borderLeftColor: "#000000",
          borderTopWidth: 0.5,
          borderRightWidth: 0.5,
          borderLeftWidth: 0.5,
          borderTopLeftRadius: moderateScale(18),
          borderTopRightRadius: moderateScale(18),
          paddingTop: moderateScale(6),
        },
        tabBarLabelStyle: {
          fontFamily: "Poppins-SemiBold",
          fontSize: 10,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Octicons name="home" color={color} size={24} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={
                focused ? "task-alt" : "task-alt"
              }
              size={25}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: "Notes",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "note-edit-outline" : "note-edit-outline"}
              size={25.5}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: "Habits",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "event-repeat" : "event-repeat"}
              size={25.5}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
