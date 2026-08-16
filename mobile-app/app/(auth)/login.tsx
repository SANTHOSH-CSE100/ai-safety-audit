import { useState } from "react";
import { Text, View, KeyboardAvoidingView, Platform, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { colors, typography } from "../../theme";
import { useLogin } from "../../features/auth/hooks";
import { ApiError } from "../../src/api/client";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: FormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        router.replace("/(app)/dashboard");
      },
      onError: (error) => {
        const message =
          error instanceof ApiError && error.status === 401
            ? "Incorrect email or password."
            : "Couldn't sign in. Check your connection and try again.";
        Toast.show({ type: "error", text1: "Sign in failed", text2: message });
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, justifyContent: "center", gap: 32, paddingVertical: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-3">
            <View className="w-16 h-16 rounded-2xl bg-primary items-center justify-center" style={{ shadowColor: colors.primary[700], shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 6 }}>
              <ShieldCheck size={30} color="#fff" />
            </View>
            <View className="items-center gap-1">
              <Text className={typography.screenTitle}>AI Safety Audit</Text>
              <Text className="text-xs font-semibold tracking-wide text-primary uppercase">
                Enterprise Safety Platform
              </Text>
            </View>
            <Text className="text-sm text-muted text-center px-4">
              Sign in to view your factory's safety reports and analytics.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(100)} className="gap-4">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="you@company.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  leftIcon={<Mail size={18} color={colors.muted} />}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  leftIcon={<Lock size={18} color={colors.muted} />}
                  rightIcon={
                    <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={8}>
                      {showPassword ? (
                        <EyeOff size={18} color={colors.muted} />
                      ) : (
                        <Eye size={18} color={colors.muted} />
                      )}
                    </Pressable>
                  }
                />
              )}
            />

            <Pressable onPress={() => router.push("/(auth)/forgot-password")} className="self-end">
              <Text className="text-sm font-medium text-primary">Forgot password?</Text>
            </Pressable>

            <Button
              label="Sign In"
              onPress={handleSubmit(onSubmit)}
              loading={loginMutation.isPending}
              fullWidth
              className="mt-2"
            />
          </Animated.View>

          {__DEV__ ? (
            <Text className="text-xs text-faint text-center">
              Dev build — demo: admin@ai-safety-audit.dev / password123
            </Text>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
