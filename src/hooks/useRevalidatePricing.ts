import { useQuery } from "@tanstack/react-query";
import { fetchPrices } from "@/api/bookingAPI";

export function useRevalidatePricing(sessionId: string | null) {
  return useQuery({
    queryKey: ["pricing", sessionId],
    queryFn: () => fetchPrices(sessionId!),
    enabled: !!sessionId,
    staleTime: 0,
  });
}