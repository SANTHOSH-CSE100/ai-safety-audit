import { useState } from "react";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import Toast from "react-native-toast-message";
import { getReportPdfUrl } from "../../src/api/reports";
import { useAuthStore } from "../../src/store/authStore";

export function usePdfDownload(reportId: string) {
  const [downloading, setDownloading] = useState(false);

  const downloadAndShare = async () => {
    setDownloading(true);
    try {
      const { accessToken } = useAuthStore.getState();
      const url = getReportPdfUrl(reportId);
      const targetPath = `${FileSystem.cacheDirectory}safety-report-${reportId}.pdf`;

      const result = await FileSystem.downloadAsync(url, targetPath, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });

      if (result.status !== 200) {
        throw new Error(`Download failed with status ${result.status}`);
      }

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(result.uri, {
          mimeType: "application/pdf",
          dialogTitle: "Safety Report",
        });
      } else {
        Toast.show({ type: "success", text1: "Report downloaded", text2: result.uri });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Couldn't download report",
        text2: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setDownloading(false);
    }
  };

  return { downloadAndShare, downloading };
}
