import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Constants from "expo-constants";
import { LogOut, Bell, Shield, ChevronRight, Info } from "lucide-react-native";
import { Avatar } from "../../../components/ui/Avatar";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { DetailHeader } from "../../../components/layout/DetailHeader";
import { colors, typography } from "../../../theme";
import { useAuthStore } from "../../../src/store/authStore";
import { useLogout } from "../../../features/auth/hooks";

export default function ProfileScreen() {
  const { fullName, email, role } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: () => {
          logoutMutation.mutate(undefined, {
            onSuccess: () => router.replace("/(auth)/login"),
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <DetailHeader title="Profile" />

      <ScrollView contentContainerStyle={{ paddingBottom: 40, gap: 20 }} showsVerticalScrollIndicator={false}>
        <View className="items-center gap-3 pt-2">
          <Avatar name={fullName ?? "User"} size={72} />
          <View className="items-center">
            <Text className={typography.sectionTitle}>{fullName}</Text>
            <Text className={typography.secondaryText}>{email}</Text>
          </View>
          {role ? (
            <View className="bg-primary-50 rounded-pill px-3 py-1">
              <Text className="text-xs font-semibold text-primary-700">{role.replace("_", " ")}</Text>
            </View>
          ) : null}
        </View>

        <View className="px-5 gap-3">
          <Text className="text-xs font-semibold text-muted uppercase tracking-wide">Settings</Text>
          <Card padded={false} elevation="flat">
            <SettingsRow
              icon={<Bell size={17} color={colors.ink} />}
              label="Notifications"
              onPress={() => router.push("/(app)/notifications")}
            />
            <SettingsRow
              icon={<Shield size={17} color={colors.ink} />}
              label="Privacy & Security"
              onPress={() => Alert.alert("Privacy & Security", "Nothing configurable here yet.")}
              isLast
            />
          </Card>
        </View>

        <View className="px-5 gap-3">
          <Text className="text-xs font-semibold text-muted uppercase tracking-wide">About</Text>
          <Card padded={false} elevation="flat">
            <SettingsRow
              icon={<Info size={17} color={colors.ink} />}
              label="App Version"
              value={Constants.expoConfig?.version ?? "1.0.0"}
              isLast
            />
          </Card>
        </View>

        <View className="px-5">
          <Button
            label="Sign Out"
            variant="danger"
            icon={<LogOut size={17} color="#fff" />}
            onPress={handleLogout}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  isLast,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
}) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      className={`flex-row items-center gap-3 p-4 ${isLast ? "" : "border-b border-border"}`}
    >
      {icon}
      <Text className="flex-1 text-sm font-medium text-ink">{label}</Text>
      {value ? <Text className="text-sm text-muted">{value}</Text> : null}
      {onPress ? <ChevronRight size={16} color={colors.muted} /> : null}
    </Wrapper>
  );
}
