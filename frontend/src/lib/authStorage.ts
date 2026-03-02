import Cookies from 'js-cookie';
import { User } from '@/types';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'authUser';

function canUseLocalStorage() {
  return typeof window !== 'undefined' && !!window.localStorage;
}

function safeParseUser(value?: string): User | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
}

export const authStorage = {
  getToken: () => Cookies.get(TOKEN_KEY),
  setToken: (token: string) => Cookies.set(TOKEN_KEY, token),
  removeToken: () => Cookies.remove(TOKEN_KEY),

  getRefreshToken: () => Cookies.get(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => Cookies.set(REFRESH_TOKEN_KEY, token),
  removeRefreshToken: () => Cookies.remove(REFRESH_TOKEN_KEY),

  getUser: (): User | null => {
    if (!canUseLocalStorage()) return null;
    return safeParseUser(window.localStorage.getItem(USER_KEY) || undefined);
  },
  setUser: (user: User) => {
    if (!canUseLocalStorage()) return;
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  removeUser: () => {
    if (!canUseLocalStorage()) return;
    window.localStorage.removeItem(USER_KEY);
  },

  clearAll: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    if (canUseLocalStorage()) {
      window.localStorage.removeItem(USER_KEY);
    }
  },

  isAuthenticated: () => !!Cookies.get(TOKEN_KEY),
};
