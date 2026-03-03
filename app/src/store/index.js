import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

export const useStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      license: null,
      cheatStatus: {
        cs2: 'idle',
        minecraft: 'idle',
      },

      setToken: (token) => set({ token }),

      setUser: (user) => set({ user }),

      setLicense: (license) => set({ license }),

      setCheatStatus: (game, status) =>
        set((state) => ({
          cheatStatus: { ...state.cheatStatus, [game]: status },
        })),

      fetchUser: async () => {
        try {
          const res = await api.get('/auth/me');
          set({ user: res.data, license: res.data.activeLicense });
        } catch {
          // Token invalid — clear session
          set({ token: null, user: null, license: null });
        }
      },

      logout: () => {
        set({ token: null, user: null, license: null, cheatStatus: { cs2: 'idle', minecraft: 'idle' } });
      },
    }),
    {
      name: 'vanish-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
