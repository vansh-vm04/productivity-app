import { PRIMARY, TAB } from "@/shared/theme/colors";
import { moderateScale } from "@/shared/utils/responsive";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";

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
        },
        tabBarLabelStyle: {
          fontFamily: "Poppins-SemiBold",
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="home-sharp" color={color} size={20} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused ? "checkmark-circle-sharp" : "checkmark-circle-outline"
              }
              size={24}
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
              name={focused ? "note-edit" : "note-edit-outline"}
              size={24}
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
            <Ionicons
              name={focused ? "flame-sharp" : "flame-outline"}
              size={22}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
