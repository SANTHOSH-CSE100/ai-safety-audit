import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { FileVideo, ChevronRight } from "lucide-react-native";
import { Card } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { colors } from "../../theme";
import { formatRelative } from "../../utils/format";
import type { UploadResponse } from "../../src/types/api";

export function RecentUploads({ uploads }: { uploads: UploadResponse[] }) {
  if (uploads.length === 0) return null;

  return (
    <View className="px-5 gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-bold text-ink">Recent Uploads</Text>
        <Pressable onPress={() => router.push("/(app)/reports")}>
          <Text className="text-sm font-medium text-primary">See all</Text>
        </Pressable>
      </View>

      <Card padded={false}>
        {uploads.slice(0, 4).map((upload, i) => (
          <Pressable
            key={upload.id}
            onPress={() => {
              if (upload.status === "COMPLETED" && upload.reportId) {
                router.push(`/(app)/reports/${upload.reportId}` as never);
              }
            }}
            className={`flex-row items-center gap-3 p-4 ${i < uploads.length - 1 ? "border-b border-border" : ""}`}
          >
            <View className="w-10 h-10 rounded-xl bg-primary-50 items-center justify-center">
              <FileVideo size={18} color={colors.primary.DEFAULT} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-ink" numberOfLines={1}>
                {upload.originalName ?? "Untitled video"}
              </Text>
              <Text className="text-xs text-muted mt-0.5">{formatRelative(upload.createdAt)}</Text>
            </View>
            <StatusBadge status={upload.status} />
            <ChevronRight size={16} color={colors.muted} />
          </Pressable>
        ))}
      </Card>
    </View>
  );
}
