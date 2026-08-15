import { ReactNode } from "react";
import { View } from "react-native";
import { Card } from "./Card";
import { SectionHeader } from "./SectionHeader";
import { DemoBadge } from "./DemoBadge";
import { cn } from "../../utils/cn";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  isDemo?: boolean;
  children: ReactNode;
  className?: string;
}

/** Standard wrapper for a titled chart panel — keeps every chart on Analytics/Reports visually consistent. */
export function ChartCard({ title, subtitle, isDemo, children, className }: ChartCardProps) {
  return (
    <View className={cn("gap-3", className)}>
      <SectionHeader title={title} subtitle={subtitle} right={isDemo ? <DemoBadge /> : undefined} />
      <Card>{children}</Card>
    </View>
  );
}
