import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: "#616161",
        tabBarActiveTintColor: "#E10600",
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerShadowVisible: false,
        headerTintColor: "#000000",
        tabBarStyle: {
          backgroundColor: "#000000",
          paddingTop: 2,
          paddingHorizontal: 24,
          borderTopColor: "#000000",
        },
        tabBarLabelStyle: {
          fontFamily: "Poppins-SemiBold",
          fontSize: 8.5,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
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
        name="streaks"
        options={{
          title: "Streaks",
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
