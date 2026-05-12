import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, ScrollView, StyleSheet, ImageBackground } from "react-native";
import { SCREEN } from "../theme/colors";

type Props = {
  children: React.ReactNode;
  scrollable?: boolean;
};

const ScreenWrapper = ({
  children,
  scrollable = true,
}: Props) => {
  const Content = (
    <ImageBackground
      source={require("@/assets/images/screens-background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <SafeAreaView style={styles.content}>
        {children}
      </SafeAreaView>
    </ImageBackground>
  );

  if (scrollable) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {Content}
      </ScrollView>
    );
  }

  return <View style={styles.container}>{Content}</View>;
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SCREEN.base,
  },

  background: {
    flex: 1,
  },

  content: {
    flex: 1,
  },
});