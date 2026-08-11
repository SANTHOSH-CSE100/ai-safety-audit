import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUpload, listUploads, uploadVideo } from "../../src/api/uploads";
import { queryKeys } from "../../constants/queryKeys";

export function useUploads(factoryId: string | null) {
  return useQuery({
    queryKey: queryKeys.uploads(factoryId ?? ""),
    queryFn: () => listUploads(factoryId as string),
    enabled: !!factoryId,
    refetchInterval: (query) => {
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
