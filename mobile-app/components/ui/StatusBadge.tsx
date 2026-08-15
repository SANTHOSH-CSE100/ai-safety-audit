import { Badge } from "./Badge";
import { colors } from "../../theme";
import type { UploadStatus } from "../../src/types/api";

const STATUS_META: Record<UploadStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Pending", color: colors.muted, bg: colors.mutedBg },
  PROCESSING: { label: "Processing", color: colors.info, bg: colors.infoBg },
  COMPLETED: { label: "Completed", color: colors.success, bg: colors.successBg },
  FAILED: { label: "Failed", color: colors.danger, bg: colors.dangerBg },
};

export function StatusBadge({ status }: { status: UploadStatus }) {
  const meta = STATUS_META[status];
  return <Badge label={meta.label} color={meta.color} bg={meta.bg} />;
}
