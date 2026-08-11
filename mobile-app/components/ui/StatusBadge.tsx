import { Badge } from "./Badge";
import { colors } from "../../theme";
import type { UploadStatus } from "../../src/types/api";

const STATUS_META: Record<UploadStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Pending", color: colors.muted, bg: "#F3F4F6" },
  PROCESSING: { label: "Processing", color: colors.info, bg: "#EFF6FF" },
  COMPLETED: { label: "Completed", color: colors.success, bg: "#F0FDF4" },
  FAILED: { label: "Failed", color: colors.danger, bg: "#FEF2F2" },
};

export function StatusBadge({ status }: { status: UploadStatus }) {
  const meta = STATUS_META[status];
  return <Badge label={meta.label} color={meta.color} bg={meta.bg} />;
}
