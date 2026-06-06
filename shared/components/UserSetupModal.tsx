import { MODAL, PRIMARY, SURFACE, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onSubmit: (name: string, email: string) => void;
};

export default function UserSetupModal({ visible, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit(name.trim(), email.trim());
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "padding"}
            >
              <View style={styles.modalContent}>
                <Text style={styles.title}>Welcome!</Text>
                <Text style={styles.subtitle}>
                  Tell us about yourself to get started.
                </Text>

                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor={TEXT.tertiary}
                  value={name}
                  onChangeText={setName}
                  autoFocus
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={TEXT.tertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  style={[styles.button, !name.trim() && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={!name.trim()}
                >
                  <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: MODAL.overlay,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(14),
  },
  modalContent: {
    backgroundColor: SURFACE.primary,
    borderRadius: moderateScale(24),
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(24),
    paddingBottom: moderateScale(24),
    width: "100%",
  },
  title: {
    fontSize: responsiveFontSize(24),
    fontFamily: fonts.bold,
    color: TEXT.primary,
    marginBottom: moderateScale(4),
  },
  subtitle: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.regular,
    color: TEXT.secondary,
    marginBottom: moderateScale(20),
  },
  label: {
    fontSize: responsiveFontSize(13),
    fontFamily: fonts.medium,
    color: TEXT.primary,
    marginBottom: moderateScale(6),
  },
  input: {
    borderWidth: 1,
    borderColor: TEXT.tertiary,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(12),
    fontSize: responsiveFontSize(15),
    fontFamily: fonts.regular,
    color: TEXT.primary,
    marginBottom: moderateScale(16),
  },
  button: {
    backgroundColor: PRIMARY.main,
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(14),
    alignItems: "center",
    marginTop: moderateScale(4),
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: responsiveFontSize(16),
    fontFamily: fonts.semibold,
    color: TEXT.button,
  },
});
