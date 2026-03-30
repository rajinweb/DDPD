"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserRole } from "@/lib/types";

type PortfolioSessionState = {
  hasHydrated: boolean;
  role: UserRole;
  setHasHydrated: (value: boolean) => void;
  setRole: (role: UserRole) => void;
};

export const usePortfolioSessionStore = create<PortfolioSessionState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      role: "reviewer",
      setHasHydrated: (value) => set({ hasHydrated: value }),
      setRole: (role) => set({ role }),
    }),
    {
      name: "drug-portfolio-session",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
