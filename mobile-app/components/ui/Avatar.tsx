import { Text, View } from "react-native";
import { colors } from "../../theme";

interface AvatarProps {
  name: string;
  size?: number;
}

export function Avatar({ name, size = 44 }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.primary[100] }}
      className="items-center justify-center"
    >
      <Text style={{ color: colors.primary[700], fontWeight: "700", fontSize: size * 0.36 }}>
        {initials}
      </Text>
    </View>
  );
}
