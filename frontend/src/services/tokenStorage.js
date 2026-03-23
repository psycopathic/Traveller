export const ACCESS_TOKEN_KEY = "traveller-token";
export const REFRESH_TOKEN_KEY = "traveller-refresh-token";
export const AUTH_TOKEN_KEY = "traveller-auth-token";

const hasWindow = () => typeof window !== "undefined";

export const getStoredAuthToken = () => {
  if (!hasWindow()) {
    return null;
  }

  return (
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    localStorage.getItem(REFRESH_TOKEN_KEY)
  );
};

export const setStoredAuthTokens = ({ token, refreshToken }) => {
  if (!hasWindow() || !token) {
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(AUTH_TOKEN_KEY, token);

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const clearStoredAuthTokens = () => {
  if (!hasWindow()) {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
};
