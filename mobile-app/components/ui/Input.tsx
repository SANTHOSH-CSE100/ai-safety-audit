import { forwardRef } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { colors } from "../../theme";
import { cn } from "../../utils/cn";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <View className="gap-1.5">
        {label ? <Text className="text-sm font-medium text-ink">{label}</Text> : null}
        <View
          className={cn(
            "flex-row items-center gap-2 bg-surface border rounded-2xl px-4 h-14",
            error ? "border-danger" : "border-border",
            className
          )}
        >
          {leftIcon}
          <TextInput
            ref={ref}
            placeholderTextColor={colors.muted}
            className="flex-1 text-base text-ink"
            {...props}
          />
          {rightIcon}
        </View>
        {error ? <Text className="text-xs text-danger">{error}</Text> : null}
      </View>
    );
  }
);
Input.displayName = "Input";
