/* eslint no-unused-vars: ["error", { "args": "none" }] */
import Vue from "vue";
import Router from "vue-router";
import AuthService from "@/shared/services";
import routes from "./routes";

//progress
import "../../node_modules/nprogress/nprogress.css";
// import NProgress from "nprogress";
import store from '../store'
// import {mapMutations } from "vuex"

Vue.use(Router);
// Vue.use(NProgress);

const router = new Router({
  hashbang: false,
  mode: "history",
  routes,
});

router.beforeResolve((to, from, next) => {

  if (to.name) {
    store.commit("core/showLoading", true);
    // store.commit('showLoading', true)
    // NProgress.start();
  }
  next();
});

router.afterEach((to, from) => {
  store.commit("core/showLoading", false);
  // store.commit('showLoading', false)
  // NProgress.done();
});

router.beforeEach((to, from, next) => {
  const authenticated = AuthService.isAuthenticated();
  const userRole = AuthService.getRole();

  const { allowed } = to.meta;
  if (allowed && allowed.length) {
    if (!allowed.includes(userRole)) {
      next({ name: "unauthorized" });
    }
  }
  if (!authenticated && to.name !== "login") {
    next({ name: "login" });
  } else if (authenticated && to.name === "login") {
    next({ name: "dashboard" });
  } else {
    next();
  }
});

export default router;
