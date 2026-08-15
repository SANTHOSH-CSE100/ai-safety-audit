import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUpload, listUploads, uploadVideo } from "../../src/api/uploads";
import { queryKeys } from "../../constants/queryKeys";
import { useFactoryStore } from "../../src/store/factoryStore";
import { getMockUploads } from "../../src/mock";

export function useUploads(factoryId: string | null) {
  const isMockMode = useFactoryStore((s) => s.isMockMode);

  return useQuery({
    queryKey: [...queryKeys.uploads(factoryId ?? ""), isMockMode],
    queryFn: () =>
      isMockMode ? Promise.resolve(getMockUploads(factoryId as string)) : listUploads(factoryId as string),
    enabled: !!factoryId,
    refetchInterval: (query) => {
      if (isMockMode) return false; // demo data is static — nothing to poll for
      // Keep polling as a backstop while anything is still processing —
      // the WebSocket hook gives instant updates, this covers reconnects.
      const hasActive = query.state.data?.some(
        (u) => u.status === "PENDING" || u.status === "PROCESSING"
      );
      return hasActive ? 5000 : false;
    },
  });
}

export function useUpload(uploadId: string | null) {
  return useQuery({
    queryKey: queryKeys.upload(uploadId ?? ""),
    queryFn: () => getUpload(uploadId as string),
    enabled: !!uploadId,
  });
}

export function useUploadVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      factoryId,
      fileUri,
      fileName,
    }: {
      factoryId: string;
      fileUri: string;
      fileName: string;
    }) => uploadVideo(factoryId, fileUri, fileName),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uploads(variables.factoryId) });
    },
  });
}
