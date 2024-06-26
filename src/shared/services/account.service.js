import { api, path } from "@/api";
import Router from "@/router";
export const ACCESS_TOKEN_KEY = "token";
export const PROFILE_KEY = "profile";
const AccountService = {
  login(email, password) {
    return api
      .login(email, password, path.user)
      .then((res) => {
        if (res && res.auth_token) {
          localStorage.setItem(ACCESS_TOKEN_KEY, res.auth_token);
          localStorage.setItem(PROFILE_KEY, JSON.stringify(res));
          return Promise.resolve(true);
        }
        return Promise.reject(new Error("Unauthorized"));
      })
      .catch((err) => {
        throw err;
      });
  },
  async logout() {
    // clear local storage
    this.logoutClientOnly();

    // logout the user on the API
    await api.logout(path.user);
  },
  logoutClientOnly() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(PROFILE_KEY);
    Router.push({
      name: "login",
    });
  },
  updateToken(token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),

  getProfile: () => JSON.parse(localStorage.getItem(PROFILE_KEY)),
  getRole() {
    return this.getProfile() && this.getProfile().role;
  },
  isAuthenticated: () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return token !== null && token !== "undefined";
  },
};

export default AccountService;
