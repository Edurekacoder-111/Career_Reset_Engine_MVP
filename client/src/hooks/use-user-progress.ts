import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useUserProgress(userId: number | null) {
  const queryClient = useQueryClient();

  const { data: progress, isLoading } = useQuery({
    queryKey: ["/api/progress", userId],
    queryFn: () => userId ? api.getUserProgress(userId) : null,
    enabled: !!userId,
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({ updates }: { updates: any }) => {
      if (!userId) throw new Error("No user ID");
      return api.updateUserProgress(userId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress", userId] });
    },
  });

  const addConfidenceMutation = useMutation({
    mutationFn: ({ confidenceLevel }: { confidenceLevel: number }) => {
      if (!userId) throw new Error("No user ID");
      return api.addConfidenceEntry(userId, confidenceLevel);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/confidence", userId] });
    },
  });

  return {
    progress,
    isLoading,
    updateProgress: updateProgressMutation.mutate,
    isUpdating: updateProgressMutation.isPending,
    addConfidence: addConfidenceMutation.mutate,
    isAddingConfidence: addConfidenceMutation.isPending,
  };
}
