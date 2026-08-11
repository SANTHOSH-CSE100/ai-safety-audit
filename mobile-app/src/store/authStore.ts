import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import type { AuthResponse, Role } from "../types/api";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  email: string | null;
  fullName: string | null;
  role: Role | null;
  isHydrated: boolean;

  hydrate: () => Promise<void>;
  setAuth: (auth: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
}

const ACCESS_TOKEN_KEY = "asa_access_token";
const REFRESH_TOKEN_KEY = "asa_refresh_token";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  email: null,
  fullName: null,
  role: null,
  isHydrated: false,

  hydrate: async () => {
    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
    ]);
    set({ accessToken, refreshToken, isHydrated: true });
  },

  setAuth: async (auth) => {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, auth.accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, auth.refreshToken),
    ]);
    set({
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
      email: auth.email,
      fullName: auth.fullName,
      role: auth.role,
    });
  },

  logout: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
    set({ accessToken: null, refreshToken: null, email: null, fullName: null, role: null });
  },
}));
