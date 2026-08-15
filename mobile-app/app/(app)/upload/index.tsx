import { useCallback, useRef, useState } from "react";
import { Text, View, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { VideoView, useVideoPlayer } from "expo-video";
import {
  FilmIcon,
  Camera,
  FolderOpen,
  CheckCircle2,
  RotateCcw,
  Upload as UploadIcon,
  Check,
} from "lucide-react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { AppHeader } from "../../../components/layout/AppHeader";
import { FactorySelector } from "../../../components/layout/FactorySelector";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { EmptyState } from "../../../components/ui/EmptyState";
import { DemoBadge } from "../../../components/ui/DemoBadge";
import { colors, typography } from "../../../theme";
import { cn } from "../../../utils/cn";
import { useFactoryStore } from "../../../src/store/factoryStore";
import { useVideoUploadWithProgress } from "../../../features/uploads/useVideoUploadWithProgress";
import type { UploadResponse } from "../../../src/types/api";

interface PickedVideo {
  uri: string;
  name: string;
}

type UploadState = "idle" | "uploading" | "success" | "error";

const STEPS = ["Select", "Upload", "Processing", "Report"] as const;

/**
 * Simulates the upload lifecycle client-side for demo-mode factories — a
 * mock factory id has no meaning to the real backend, so we can't actually
 * POST to it. Mirrors useVideoUploadWithProgress's shape so the rest of
 * this screen doesn't need to know which one is active.
 */
function useMockUploadSimulation() {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const upload = useCallback(async (_factoryId: string, _fileUri: string, fileName: string) => {
    setState("uploading");
    setProgress(0);
    return new Promise<UploadResponse>((resolve) => {
      let p = 0;
      timerRef.current = setInterval(() => {
        p = Math.min(1, p + 0.1 + Math.random() * 0.08);
        setProgress(p);
        if (p >= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          const mockResult: UploadResponse = {
            id: `mock-upload-demo-${Math.round(Math.random() * 1e6)}`,
            originalName: fileName,
            status: "PENDING",
            reportId: null,
            createdAt: new Date().toISOString(),
          };
          setResult(mockResult);
          setState("success");
          resolve(mockResult);
        }
      }, 180);
    });
  }, []);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState("idle");
    setProgress(0);
    setResult(null);
  }, []);

  return { state, progress, error: null as string | null, result, upload, reset };
}

export default function UploadScreen() {
  const selected = useFactoryStore((s) => s.selected);
  const isMockMode = useFactoryStore((s) => s.isMockMode);
  const [video, setVideo] = useState<PickedVideo | null>(null);

  const realUpload = useVideoUploadWithProgress();
  const mockUpload = useMockUploadSimulation();
  const { state, progress, error, result, upload, reset } = isMockMode ? mockUpload : realUpload;

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

  const stepIndex = !video ? 0 : state === "success" ? 2 : 1;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader
        title="Upload Video"
        subtitle={isMockMode ? "Submit footage for safety analysis (demo)" : "Submit footage for safety analysis"}
      />
      <FactorySelector />

      {selected ? (
        <View className="px-5 mb-4">
          <WorkflowSteps activeIndex={stepIndex} />
        </View>
      ) : null}

      <View className="flex-1 px-5">
        {!selected ? (
          <EmptyState
            icon={FilmIcon}
            title="Select a factory first"
            description="Choose a factory above to upload footage for."
          />
        ) : state === "success" && result ? (
          <SuccessView
            uploadName={result.originalName}
            isDemo={isMockMode}
            onDone={() => {
              startOver();
              router.push("/(app)/reports");
            }}
            onUploadAnother={startOver}
          />
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

function WorkflowSteps({ activeIndex }: { activeIndex: number }) {
  return (
    <View className="flex-row items-center">
      {STEPS.map((label, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        return (
          <View key={label} className="flex-1 flex-row items-center">
            <View className="items-center gap-1.5" style={{ width: 56 }}>
              <View
                className={cn(
                  "w-7 h-7 rounded-full items-center justify-center",
                  done ? "bg-primary" : active ? "bg-primary-100 border-2 border-primary" : "bg-mutedBg"
                )}
              >
                {done ? (
                  <Check size={14} color="#fff" />
                ) : (
                  <Text className={cn("text-xs font-bold", active ? "text-primary" : "text-muted")}>{i + 1}</Text>
                )}
              </View>
              <Text
                className={cn("text-[10px] font-semibold text-center", active || done ? "text-ink" : "text-faint")}
                numberOfLines={1}
              >
                {label}
              </Text>
            </View>
            {i < STEPS.length - 1 ? (
              <View className={cn("flex-1 h-0.5 -mt-4", i < activeIndex ? "bg-primary" : "bg-border")} />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function PickerView({ onPickLibrary, onRecord }: { onPickLibrary: () => void; onRecord: () => void }) {
  return (
    <Animated.View entering={FadeIn.duration(300)} className="flex-1 items-center justify-center gap-4">
      <View className="w-20 h-20 rounded-full bg-primary-50 items-center justify-center mb-2">
        <FilmIcon size={34} color={colors.primary.DEFAULT} />
      </View>
      <Text className={cn(typography.sectionTitle, "text-center")}>Choose footage to analyze</Text>
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
  state: UploadState;
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
    <Animated.View entering={FadeInDown.duration(300)} className="flex-1 gap-4 pt-2">
      <View className="rounded-card overflow-hidden bg-black" style={{ aspectRatio: 16 / 9 }}>
        <VideoView player={player} style={{ flex: 1 }} nativeControls contentFit="contain" />
      </View>

      <Card>
        <View className="flex-row items-center justify-between">
          <Text className={cn(typography.body, "font-medium flex-1")} numberOfLines={1}>
            {video.name}
          </Text>
          {state === "idle" ? (
            <Pressable onPress={onRemove} hitSlop={8}>
              <Text className="text-xs font-semibold text-danger">Remove</Text>
            </Pressable>
          ) : null}
        </View>

        {state === "uploading" ? (
          <View className="mt-3 gap-2">
            <ProgressBar progress={progress} />
            <Text className={typography.caption}>{Math.round(progress * 100)}% uploaded</Text>
          </View>
        ) : null}

        {state === "error" ? <Text className="text-xs text-danger mt-2">{error}</Text> : null}
      </Card>

      {state === "error" ? (
        <Button label="Retry Upload" icon={<RotateCcw size={17} color="#fff" />} onPress={onRetry} fullWidth />
      ) : (
        <Button
          label={state === "uploading" ? "Uploading…" : "Upload for Analysis"}
          icon={state !== "uploading" ? <UploadIcon size={17} color="#fff" /> : undefined}
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
  isDemo,
  onDone,
  onUploadAnother,
}: {
  uploadName: string;
  isDemo?: boolean;
  onDone: () => void;
  onUploadAnother: () => void;
}) {
  return (
    <Animated.View entering={FadeIn.duration(300)} className="flex-1 items-center justify-center gap-4">
      <View className="w-20 h-20 rounded-full bg-successBg items-center justify-center">
        <CheckCircle2 size={38} color={colors.success} />
      </View>
      <Text className={cn(typography.sectionTitle, "text-center")}>Upload complete!</Text>
      {isDemo ? <DemoBadge /> : null}
      <Text className="text-sm text-muted text-center px-6">
        {isDemo
          ? `"${uploadName}" is a simulated demo upload — no real footage was sent anywhere.`
          : `"${uploadName}" is being analyzed. You'll get a notification when the safety report is ready.`}
      </Text>

      <View className="w-full gap-3 mt-4">
        <Button label="View Reports" onPress={onDone} fullWidth />
        <Button label="Upload Another" variant="secondary" onPress={onUploadAnother} fullWidth />
      </View>
    </Animated.View>
  );
}
