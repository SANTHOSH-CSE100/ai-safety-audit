import { TextInput, View } from "react-native";
import { Search } from "lucide-react-native";
import { colors } from "../../theme";
import { cn } from "../../utils/cn";

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChangeText, placeholder = "Search…", className }: SearchBarProps) {
  return (
    <View className={cn("flex-row items-center gap-2 bg-surface border border-border rounded-2xl px-4 h-12", className)}>
      <Search size={17} color={colors.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        className="flex-1 text-sm text-ink"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}
