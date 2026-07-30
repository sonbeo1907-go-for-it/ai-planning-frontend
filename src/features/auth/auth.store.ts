"use client";

import { create } from "zustand";

import type { CurrentUserProfile } from "./auth.types";

interface AuthState {
  accessToken: string | null;
  profile: CurrentUserProfile | null;
  isInitialized: boolean;
  establishSession: (
    accessToken: string,
    profile: CurrentUserProfile,
  ) => void;
  clearSession: () => void;
  finishInitialization: () => void;
}

/**
 * The access token intentionally remains in memory. A page refresh restores a
 * session through the backend's HttpOnly refresh cookie instead of Web Storage.
 */
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  profile: null,
  isInitialized: false,
  establishSession: (accessToken, profile) => set({
    accessToken,
    profile,
    isInitialized: true,
  }),
  clearSession: () => set({
    accessToken: null,
    profile: null,
  }),
  finishInitialization: () => set({ isInitialized: true }),
}));
