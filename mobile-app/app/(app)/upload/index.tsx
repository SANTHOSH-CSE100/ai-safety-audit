import { useState } from "react";
import { Text, View, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { VideoView, useVideoPlayer } from "expo-video";
import {
  FilmIcon,
  Camera,
  FolderOpen,
  X,
  CheckCircle2,
  RotateCcw,
  Upload as UploadIcon,
} from "lucide-react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { AppHeader } from "../../../components/layout/AppHeader";
import { FactorySelector } from "../../../components/layout/FactorySelector";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { EmptyState } from "../../../components/ui/EmptyState";
import { colors } from "../../../theme";
import { useFactoryStore } from "../../../src/store/factoryStore";
import { useVideoUploadWithProgress } from "../../../features/uploads/useVideoUploadWithProgress";

interface PickedVideo {
  uri: string;
  name: string;
}

export default function UploadScreen() {
  const selected = useFactoryStore((s) => s.selected);
  const [video, setVideo] = useState<PickedVideo | null>(null);
  const { state, progress, error, result, upload, reset } = useVideoUploadWithProgress();

  const pickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow access to your video library to continue.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });
    if (!result.canceled && result.assets[0]) {
      setVideo({ uri: result.assets[0].uri, name: result.assets[0].fileName ?? "safety-video.mp4" });
    }
  };

  const recordVideo = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow camera access to record safety footage.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
      videoMaxDuration: 300,
    });
    if (!result.canceled && result.assets[0]) {
      setVideo({ uri: result.assets[0].uri, name: `recording-${Date.now()}.mp4` });
    }
  };

  const startUpload = async () => {
    if (!video || !selected) return;
    await upload(selected.id, video.uri, video.name);
  };

  const startOver = () => {
    setVideo(null);
    reset();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader title="Upload Video" subtitle="Submit footage for safety analysis" />
      <FactorySelector />

      <View className="flex-1 px-5">
        {!selected ? (
          <EmptyState
            icon={FilmIcon}
            title="Select a factory first"
            description="Choose a factory above to upload footage for."
          />
        ) : state === "success" && result ? (
          <SuccessView uploadName={result.originalName} onDone={() => { startOver(); router.push("/(app)/reports"); }} onUploadAnother={startOver} />
        ) : !video ? (
          <PickerView onPickLibrary={pickFromLibrary} onRecord={recordVideo} />
        ) : (
          <PreviewAndUpload
            video={video}
            state={state}
            progress={progress}
            error={error}
            onRemove={startOver}
            onUpload={startUpload}
            onRetry={startUpload}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function PickerView({ onPickLibrary, onRecord }: { onPickLibrary: () => void; onRecord: () => void }) {
  return (
    <Animated.View entering={FadeIn.duration(300)} className="flex-1 items-center justify-center gap-4">
      <View className="w-20 h-20 rounded-full bg-primary-50 items-center justify-center mb-2">
        <FilmIcon size={34} color={colors.primary.DEFAULT} />
      </View>
      <Text className="text-lg font-bold text-ink text-center">Choose footage to analyze</Text>
      <Text className="text-sm text-muted text-center px-6">
        Record new footage or pick an existing video from your library.
      </Text>

      <View className="w-full gap-3 mt-4">
        <Button label="Record Video" icon={<Camera size={18} color="#fff" />} onPress={onRecord} fullWidth />
        <Button
          label="Choose from Library"
          variant="secondary"
          icon={<FolderOpen size={18} color={colors.primary.DEFAULT} />}
          onPress={onPickLibrary}
          fullWidth
        />
      </View>
    </Animated.View>
  );
}

function PreviewAndUpload({
  video,
  state,
  progress,
  error,
  onRemove,
  onUpload,
  onRetry,
}: {
  video: PickedVideo;
  state: "idle" | "uploading" | "success" | "error";
  progress: number;
  error: string | null;
  onRemove: () => void;
  onUpload: () => void;
  onRetry: () => void;
}) {
  const player = useVideoPlayer(video.uri, (player) => {
    player.loop = false;
  });

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      className="flex-1 gap-4 pt-2"
    >
      <View
        className="rounded-card overflow-hidden bg-black"
        style={{ aspectRatio: 16 / 9 }}
      >
        <VideoView
          player={player}
          style={{ flex: 1 }}
          nativeControls
          contentFit="contain"
        />
      </View>

      <Card>
        <Text
          className="text-sm font-medium text-ink"
          numberOfLines={1}
        >
          {video.name}
        </Text>

        {state === "uploading" ? (
          <View className="mt-3 gap-2">
            <ProgressBar progress={progress} />
            <Text className="text-xs text-muted">
              {Math.round(progress * 100)}% uploaded
            </Text>
          </View>
        ) : null}

        {state === "error" ? (
          <Text className="text-xs text-danger mt-2">
            {error}
          </Text>
        ) : null}
      </Card>

      {state === "error" ? (
        <Button
          label="Retry Upload"
          icon={<RotateCcw size={17} color="#fff" />}
          onPress={onRetry}
          fullWidth
        />
      ) : (
        <Button
          label={
            state === "uploading"
              ? "Uploading…"
              : "Upload for Analysis"
          }
          icon={
            state !== "uploading" ? (
              <UploadIcon size={17} color="#fff" />
            ) : undefined
          }
          onPress={onUpload}
          loading={state === "uploading"}
          disabled={state === "uploading"}
          fullWidth
        />
      )}
    </Animated.View>
  );
}

function SuccessView({
  uploadName,
  onDone,
  onUploadAnother,
}: {
  uploadName: string;
  onDone: () => void;
  onUploadAnother: () => void;
}) {
  return (
    <Animated.View entering={FadeIn.duration(300)} className="flex-1 items-center justify-center gap-4">
      <View className="w-20 h-20 rounded-full bg-green-50 items-center justify-center">
        <CheckCircle2 size={38} color={colors.success} />
      </View>
      <Text className="text-lg font-bold text-ink text-center">Upload complete!</Text>
      <Text className="text-sm text-muted text-center px-6">
        "{uploadName}" is being analyzed. You'll get a notification when the safety report is ready.
      </Text>

      <View className="w-full gap-3 mt-4">
        <Button label="View Reports" onPress={onDone} fullWidth />
        <Button label="Upload Another" variant="secondary" onPress={onUploadAnother} fullWidth />
      </View>
    </Animated.View>
  );
}
