import { create } from 'zustand';
import type { IUser } from '@/@types/IUser';

interface UserStore {
  user: IUser | null;
  setUser: (user: IUser) => void;
  logout: VoidFunction;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },
}));
