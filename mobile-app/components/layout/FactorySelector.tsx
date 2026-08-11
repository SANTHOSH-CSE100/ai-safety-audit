import { useState } from "react";
import { Modal, Pressable, Text, View, FlatList } from "react-native";
import { ChevronDown, Check, Building2 } from "lucide-react-native";
import { colors } from "../../theme";
import { useFactoryStore } from "../../src/store/factoryStore";
import type { FactoryResponse } from "../../src/types/api";

export function FactorySelector() {
  const [open, setOpen] = useState(false);
  const { selected, factories, select } = useFactoryStore();

  if (factories.length === 0) return null;

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="flex-row items-center gap-2 self-start bg-surface border border-border rounded-pill pl-3 pr-3.5 py-2 mx-5 mb-2"
      >
        <Building2 size={15} color={colors.primary.DEFAULT} />
        <Text className="text-sm font-semibold text-ink" numberOfLines={1}>
          {selected?.name ?? "Select factory"}
        </Text>
        <ChevronDown size={16} color={colors.muted} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/30 justify-end" onPress={() => setOpen(false)}>
          <Pressable className="bg-surface rounded-t-3xl pt-4 pb-8 px-5 max-h-[70%]">
            <View className="w-10 h-1 rounded-full bg-border self-center mb-4" />
            <Text className="text-lg font-bold text-ink mb-3">Select Factory</Text>
            <FlatList
              data={factories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <FactoryRow
                  factory={item}
                  active={item.id === selected?.id}
                  onPress={() => {
                    select(item);
                    setOpen(false);
                  }}
                />
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function FactoryRow({
  factory,
  active,
  onPress,
}: {
  factory: FactoryResponse;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between py-3.5 border-b border-border"
    >
      <View>
        <Text className="text-base font-medium text-ink">{factory.name}</Text>
        {factory.location ? <Text className="text-xs text-muted mt-0.5">{factory.location}</Text> : null}
      </View>
      {active ? <Check size={18} color={colors.primary.DEFAULT} /> : null}
    </Pressable>
  );
}
