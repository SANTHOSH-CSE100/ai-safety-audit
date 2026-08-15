import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Card } from "../../components/ui/Card";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { UploadCard } from "../../components/ui/UploadCard";
import { DemoBadge } from "../../components/ui/DemoBadge";
import { colors } from "../../theme";
import type { UploadResponse } from "../../src/types/api";

export function RecentUploads({ uploads, isDemo }: { uploads: UploadResponse[]; isDemo?: boolean }) {
  if (uploads.length === 0) return null;

  const recent = uploads.slice(0, 4);

  return (
    <View className="px-5 gap-3">
      <SectionHeader
        title="Recent Uploads"
        right={
          <View className="flex-row items-center gap-2.5">
            {isDemo ? <DemoBadge /> : null}
            <Pressable onPress={() => router.push("/(app)/reports")} className="flex-row items-center gap-0.5" hitSlop={8}>
              <Text className="text-sm font-medium text-primary">See all</Text>
              <ChevronRight size={14} color={colors.primary.DEFAULT} />
            </Pressable>
          </View>
        }
      />
      <Card padded={false}>
        {recent.map((upload, i) => (
          <UploadCard
            key={upload.id}
            upload={upload}
            isLast={i === recent.length - 1}
            onPress={
              upload.status === "COMPLETED" && upload.reportId
                ? () => router.push(`/(app)/reports/${upload.reportId}` as never)
                : undefined
            }
          />
        ))}
      </Card>
    </View>
  );
}
