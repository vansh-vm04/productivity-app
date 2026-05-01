import { CapsuleSelector } from "@/shared/components/CapsuleSelector";
import { NOTE_CATEGORIES } from "@/shared/constants/notes";
import { BACKGROUND, PRIMARY, SURFACE, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { CreateNoteParams } from "@/shared/types/note";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function CreateNote() {
  const router = useRouter();
  const params = useLocalSearchParams<CreateNoteParams>();

  const [title, setTitle] = useState(
    typeof params.title === "string" ? params.title : "",
  );
  const [body, setBody] = useState(
    typeof params.body === "string" ? params.body : "",
  );
  const [isListening, setIsListening] = useState(false);
  const [transcriptPreview, setTranscriptPreview] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    typeof params.category === "string" ? params.category : "personal",
  );
  const [customCategory, setCustomCategory] = useState("");

  const isEditMode = params.mode === "edit";
  const baseBodyRef = useRef(body);

  const categoryItems = useMemo(() => {
    const items: Record<string, { label: string; icon: string }> = {};
    NOTE_CATEGORIES.filter((cat) => cat.key !== "all").forEach((cat) => {
      items[cat.key] = { label: cat.label, icon: "tag" };
    });
    return items;
  }, []);

  useSpeechRecognitionEvent("start", () => {
    setIsListening(true);
  });

  useSpeechRecognitionEvent("end", () => {
    setIsListening(false);
    setTranscriptPreview("");
  });

  useSpeechRecognitionEvent("result", (event) => {
    const latest = event.results?.[0]?.transcript ?? "";
    if (!latest) return;

    setTranscriptPreview(latest);
    const separator = baseBodyRef.current.trim().length > 0 ? "\n" : "";
    setBody(`${baseBodyRef.current}${separator}${latest}`);
  });

  useSpeechRecognitionEvent("error", (event) => {
    setIsListening(false);
    setTranscriptPreview("");
    Alert.alert("Speech Error", event.message || "Unable to recognize speech.");
  });

  const askForPermissions = async () => {
    const mic =
      await ExpoSpeechRecognitionModule.requestMicrophonePermissionsAsync();
    if (!mic.granted) {
      if (!mic.canAskAgain) {
        Alert.alert(
          "Microphone permission blocked",
          "Enable microphone access from app settings to use hold-to-speak.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
      } else {
        Alert.alert("Permission required", "Please allow microphone access.");
      }
      return false;
    }

    const speech =
      await ExpoSpeechRecognitionModule.requestSpeechRecognizerPermissionsAsync();
    if (!speech.granted) {
      if (!speech.canAskAgain) {
        Alert.alert(
          "Speech recognition blocked",
          "Enable speech recognition access from app settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
      } else {
        Alert.alert(
          "Permission required",
          "Please allow speech recognition access.",
        );
      }
      return false;
    }

    return true;
  };

  useEffect(() => {
    askForPermissions();
    // Ask once when screen opens so user gets the native allow/deny dialog directly.
  }, []);

  const handleStartListening = async () => {
    const hasPermissions = await askForPermissions();
    if (!hasPermissions) {
      return;
    }

    baseBodyRef.current = body;

    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      continuous: true,
      maxAlternatives: 1,
      requiresOnDeviceRecognition: false,
      addsPunctuation: true,
    });
  };

  const handleStopListening = () => {
    ExpoSpeechRecognitionModule.stop();
  };

  const handleDone = () => {
    if (!title.trim() && !body.trim()) {
      router.back();
      return;
    }

    const finalCategory =
      selectedCategory === "custom" ? customCategory : selectedCategory;

    const payload = {
      id: params.noteId,
      mode: isEditMode ? "edit" : "create",
      title,
      body,
      category: finalCategory || "personal",
    };

    console.log(isEditMode ? "Updating note:" : "Creating note:", payload);
    router.back();
  };

  const handleCategorySelect = (key: string) => {
    setSelectedCategory(key);
    if (key !== "custom") {
      setCustomCategory("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={moderateScale(26)}
            color={TEXT.primary}
          />
          <Text style={styles.headerTitle}>Note</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDone}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.editorArea}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? moderateScale(6) : 0}
      >
        {/* Category Selector */}
        <CapsuleSelector
          items={categoryItems}
          selectedValue={selectedCategory}
          onSelect={handleCategorySelect}
          showCustomOption={true}
          onCustomSelect={() => setSelectedCategory("custom")}
        />

        {/* Custom Category Input */}
        {selectedCategory === "custom" && (
          <TextInput
            value={customCategory}
            onChangeText={setCustomCategory}
            placeholder="Enter custom category"
            placeholderTextColor={TEXT.tertiary}
            style={styles.customCategoryInput}
            selectionColor={PRIMARY.main}
            maxLength={15}
          />
        )}

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={TEXT.tertiary}
          style={styles.titleInput}
          selectionColor={PRIMARY.main}
        />

        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder={
            isEditMode
              ? "Update your note..."
              : "Start writing or hold mic to speak..."
          }
          placeholderTextColor={TEXT.tertiary}
          multiline={true}
          textAlignVertical="top"
          style={styles.bodyInput}
          selectionColor={PRIMARY.main}
          scrollEnabled={true}
        />
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <View style={styles.toolsRow}>
          <TouchableOpacity
            style={[styles.micButton, isListening && styles.micButtonActive]}
            activeOpacity={0.9}
            onLongPress={handleStartListening}
            onPressOut={handleStopListening}
          >
            <MaterialCommunityIcons
              name={isListening ? "microphone" : "microphone-outline"}
              size={moderateScale(28)}
              color={TEXT.button}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.hintText}>
          {isListening
            ? transcriptPreview || "Listening... release to finish"
            : "Hold to speak, release to stop"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND.secondary,
    paddingTop: moderateScale(52),
  },
  header: {
    paddingHorizontal: moderateScale(10),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: responsiveFontSize(20),
    fontFamily: fonts.medium,
    color: TEXT.primary,
    marginLeft: moderateScale(6),
  },
  doneText: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.medium,
    color: PRIMARY.main,
    marginRight: moderateScale(8),
    lineHeight: moderateScale(18),
  },
  editorArea: {
    flex: 1,
    paddingHorizontal: moderateScale(14),
    paddingTop: moderateScale(12),
    paddingBottom: moderateScale(20),
  },
  customCategoryInput: {
    color: TEXT.primary,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(14),
    borderWidth: 1,
    borderColor: PRIMARY.main,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    marginBottom: moderateScale(12),
    marginTop: moderateScale(8),
  },
  titleInput: {
    color: TEXT.primary,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(20),
    marginBottom: moderateScale(8),
    marginTop: moderateScale(12),
    paddingVertical: moderateScale(8),
  },
  bodyInput: {
    flex: 1,
    color: TEXT.secondary,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(15),
    lineHeight: moderateScale(22),
    paddingVertical: moderateScale(6),
  },
  footer: {
    paddingBottom: moderateScale(50),
  },
  toolsRow: {
    paddingHorizontal: moderateScale(12),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sideCircle: {
    width: moderateScale(34),
    height: moderateScale(34),
    borderRadius: moderateScale(17),
    backgroundColor: SURFACE.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  micButton: {
    width: moderateScale(74),
    height: moderateScale(74),
    borderRadius: moderateScale(37),
    backgroundColor: PRIMARY.main,
    alignItems: "center",
    justifyContent: "center",
  },
  micButtonActive: {
    backgroundColor: PRIMARY.main,
    transform: [{ scale: 1.04 }],
  },
  hintText: {
    marginTop: moderateScale(8),
    textAlign: "center",
    color: TEXT.tertiary,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(11),
  },
});

export default React.memo(CreateNote);
