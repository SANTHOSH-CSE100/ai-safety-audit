import { Badge } from "./Badge";
import { severityBg, severityColor } from "../../utils/severity";
import type { Severity } from "../../src/types/api";

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <Badge label={severity} color={severityColor(severity)} bg={severityBg(severity)} />;
}
