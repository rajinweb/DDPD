"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPortfolioSnapshot, fetchProgramDetails, patchProgramMetadata } from "@/lib/api/client";
import { portfolioQueryKeys } from "@/lib/query/keys";
import type { PortfolioFilters, PortfolioSnapshot, Program, ProgramMetadataUpdateRequest, UserRole } from "@/lib/types";

export function usePortfolioSnapshot(filters: PortfolioFilters, initialData?: PortfolioSnapshot) {
  return useQuery({
    queryKey: portfolioQueryKeys.snapshot(filters),
    queryFn: () => fetchPortfolioSnapshot(filters),
    initialData,
    placeholderData: keepPreviousData,
  });
}

export function useProgramDetails(programId: number, initialData?: Program) {
  return useQuery({
    queryKey: portfolioQueryKeys.program(programId),
    queryFn: () => fetchProgramDetails(programId),
    initialData,
    staleTime: 60 * 1000,
  });
}

export function usePrefetchProgramDetails() {
  const queryClient = useQueryClient();

  return async (programId: number) => {
    await queryClient.prefetchQuery({
      queryKey: portfolioQueryKeys.program(programId),
      queryFn: () => fetchProgramDetails(programId),
      staleTime: 60 * 1000,
    });
  };
}

export function useUpdateProgramMetadata(programId: number, role: UserRole) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProgramMetadataUpdateRequest) => patchProgramMetadata(programId, payload, role),
    onSuccess: (updatedProgram) => {
      queryClient.setQueryData(portfolioQueryKeys.program(programId), updatedProgram);
      queryClient.invalidateQueries({
        queryKey: portfolioQueryKeys.all,
      });
    },
  });
}
