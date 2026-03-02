import Cookies from 'js-cookie';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const authStorage = {
  getToken: () => Cookies.get(TOKEN_KEY),
  setToken: (token: string) => Cookies.set(TOKEN_KEY, token),
  removeToken: () => Cookies.remove(TOKEN_KEY),

  getRefreshToken: () => Cookies.get(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => Cookies.set(REFRESH_TOKEN_KEY, token),
  removeRefreshToken: () => Cookies.remove(REFRESH_TOKEN_KEY),

  clearAll: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  },

  isAuthenticated: () => !!Cookies.get(TOKEN_KEY),
};
