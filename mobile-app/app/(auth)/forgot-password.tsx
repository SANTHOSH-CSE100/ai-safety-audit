import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Mail, MailCheck } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { colors, typography } from "../../theme";
import { useForgotPassword } from "../../features/auth/hooks";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const [sent, setSent] = useState(false);
  const mutation = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values.email, { onSuccess: () => setSent(true) });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-5 pt-2">
        <Pressable onPress={() => router.back()} hitSlop={12} className="w-10 h-10 items-center justify-center">
          <ArrowLeft size={22} color={colors.ink} />
        </Pressable>
      </View>

      <View className="flex-1 px-6 justify-center gap-6">
        {sent ? (
          <Animated.View entering={FadeInDown.duration(400)} className="items-center gap-3">
            <View className="w-16 h-16 rounded-full bg-primary-50 items-center justify-center">
              <MailCheck size={28} color={colors.primary.DEFAULT} />
            </View>
            <Text className={typography.screenTitle + " text-center"}>Check your email</Text>
            <Text className="text-sm text-muted text-center">
              If an account exists for that address, we've sent a link to reset your password.
            </Text>
            <Button label="Back to Sign In" onPress={() => router.replace("/(auth)/login")} className="mt-2" />
          </Animated.View>
        ) : (
          <>
            <View className="gap-2">
              <Text className={typography.screenTitle}>Forgot password?</Text>
              <Text className={typography.secondaryText}>
                Enter the email linked to your account and we'll send you a reset link.
              </Text>
            </View>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="you@company.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  leftIcon={<Mail size={18} color={colors.muted} />}
                />
              )}
            />

            <Button
              label="Send reset link"
              onPress={handleSubmit(onSubmit)}
              loading={mutation.isPending}
              fullWidth
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
