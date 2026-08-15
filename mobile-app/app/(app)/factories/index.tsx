import { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable } from "react-native";
import { router } from "expo-router";
import { MapPin, ChevronRight, Building2 } from "lucide-react-native";
import { AppHeader } from "../../../components/layout/AppHeader";
import { Card } from "../../../components/ui/Card";
import { SearchBar } from "../../../components/ui/SearchBar";
import { SkeletonCard } from "../../../components/ui/Skeleton";
import { ErrorState } from "../../../components/ui/ErrorState";
import { EmptyState } from "../../../components/ui/EmptyState";
import { DemoBadge } from "../../../components/ui/DemoBadge";
import { colors } from "../../../theme";
import { useFactories } from "../../../features/factories/hooks";
import { useFactoryStore } from "../../../src/store/factoryStore";
import type { FactoryResponse } from "../../../src/types/api";

export default function FactoriesScreen() {
  const { data, isLoading, isError, refetch } = useFactories();
  const isMockMode = useFactoryStore((s) => s.isMockMode);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (f) => f.name.toLowerCase().includes(q) || f.location?.toLowerCase().includes(q)
    );
  }, [data, query]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader title="Factories" subtitle={data ? `${data.length} total` : undefined} />

      <View className="px-5 pb-3 gap-2.5">
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search factories..." />
        {isMockMode ? <DemoBadge /> : null}
      </View>

      {isLoading ? (
        <View className="px-5 gap-3">
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : isError ? (
        <ErrorState message="Couldn't load factories." onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={query ? "No matches" : "No factories"}
          description={query ? "Try a different search term." : "No factories have been added yet."}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 12 }}
          renderItem={({ item }) => <FactoryCard factory={item} />}
        />
      )}
    </SafeAreaView>
  );
}

function FactoryCard({ factory }: { factory: FactoryResponse }) {
  return (
    <Pressable onPress={() => router.push(`/(app)/factories/${factory.id}` as never)}>
      <Card className="flex-row items-center gap-3">
        <View className="w-12 h-12 rounded-2xl bg-primary-50 items-center justify-center">
          <Building2 size={20} color={colors.primary.DEFAULT} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-ink">{factory.name}</Text>
          {factory.location ? (
            <View className="flex-row items-center gap-1 mt-1">
              <MapPin size={12} color={colors.muted} />
              <Text className="text-xs text-muted" numberOfLines={1}>{factory.location}</Text>
            </View>
          ) : null}
        </View>
        <ChevronRight size={18} color={colors.muted} />
      </Card>
    </Pressable>
  );
}
