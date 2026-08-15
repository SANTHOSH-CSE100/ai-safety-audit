import { Text, View, Pressable } from "react-native";
import { FileVideo, ChevronRight } from "lucide-react-native";
import { StatusBadge } from "./StatusBadge";
import { colors, typography } from "../../theme";
import { formatRelative } from "../../utils/format";
import { cn } from "../../utils/cn";
import type { UploadResponse } from "../../src/types/api";

interface UploadCardProps {
  upload: UploadResponse;
  onPress?: () => void;
  isLast?: boolean;
}

/** One row in an upload list — thumbnail glyph, name, relative time, processing-status chip. */
export function UploadCard({ upload, onPress, isLast }: UploadCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={cn("flex-row items-center gap-3 p-4", !isLast && "border-b border-border")}
    >
      <View className="w-10 h-10 rounded-xl bg-primary-50 items-center justify-center">
        <FileVideo size={18} color={colors.primary.DEFAULT} />
      </View>
      <View className="flex-1">
        <Text className={cn(typography.body, "font-medium")} numberOfLines={1}>
          {upload.originalName ?? "Untitled video"}
        </Text>
        <Text className={cn(typography.caption, "mt-0.5")}>{formatRelative(upload.createdAt)}</Text>
      </View>
      <StatusBadge status={upload.status} />
      {onPress ? <ChevronRight size={16} color={colors.muted} /> : null}
    </Pressable>
  );
}
