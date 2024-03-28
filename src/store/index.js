/* eslint no-param-reassign:0 */

import Vue from "vue";
import Vuex from "vuex";
import i18n from "../i18n";
import laysheet from "../modules/laysheet/laysheet.store";
import tna from "./tna";
import cost from "../modules/ob/operational-cost/cost.store";
import notifications from "../modules/layout/notification.store"
import attendance from './attendance'
import employee from './employee'
import employeeDashboard from './employeeDashboard'
import efficiency from './efficiency'
import losttime from './losttime'
import machines from './machines'
import line from './line'
import evaluation from './evaluation'
import payrolls from './payroll'
import defects from './defects'
import jobs from './jobs'
import operation from './operation'
import payroll from './payroll_summary'
import Styles from "./styles"
import SelectItem from './slectItems'
import taxslab from './taxslab'
import costs from './costs'
import inventory from './inventory'
import order from './order'
import bundlehistory from "../modules/bundle/bundlehistory.store"
import productionHistory from './productionHistory'
import Nattendance from "../modules/pages/salary/payroll/attendance/store.attendance"
import performance from "../../src/modules/permon/performance/performance"
import dashboard from "../../src/modules/dashboard/employeeDashboard/dashboard"
import companyDashboard from "../../src/modules/dashboard/companyDashboard/companyDashboard.store"
import rftanddhu from "../../src/modules/quality/rftanddhu"
import simulation from "../../src/modules/dashboard/simulation.store"

const core = {
  namespaced: true,
  state: {
    appName: "POSHAK",
    version: "1.0.0",
    pendingNetworkRequest: 0,
    currentLanguage: "am",
    loading: true
  },
  mutations: {
    initializeStore(state) {
      // check if 'currentLanguage' exists
      if (localStorage.getItem("currentLanguage")) {
        let localStorageCurrentLanguage;
        try {
          localStorageCurrentLanguage = JSON.parse(
            localStorage.getItem("currentLanguage")
          );
          const supportedLanguages = ["am", "en"];
          if (supportedLanguages.indexOf(localStorageCurrentLanguage) === -1) {
            throw new Error("Unsupported current language on local storage");
          }
        } catch (error) {
          localStorageCurrentLanguage = "am";
        }
        state.currentLanguage = localStorageCurrentLanguage;

        i18n.locale = state.currentLanguage;
      }
    },
    showLoading(state, payload) {
      state.loading = payload
    },
    addPendingRequest(state) {
      state.pendingNetworkRequest += 1;
    },
    removePendingRequest(state) {
      state.pendingNetworkRequest -= 1;
    },
    toggleLanguage(state) {
      state.currentLanguage = state.currentLanguage === "am" ? "en" : "am";
      i18n.locale = state.currentLanguage;
    },
  },
  getters: {
    getFullAppName: (state) => `${state.appName} v${state.version}`,
    getAppName: (state) => state.appName,
    isAmharic: (state) => state.currentLanguage === "am",
    showNetworkProgressBar: (state) => state.pendingNetworkRequest > 0,
    load: (state) => state.loading
  },
};

const layout = {
  namespaced: true,
  state: {
    navDrawerToggle: true,
  },
  getters: {},
  mutations: {
    toggleNavBar: (state) => (state.navDrawerToggle = !state.navDrawerToggle),
  },
};

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    core,
    line,
    tna,
    jobs,
    evaluation,
    losttime,
    operation,
    employee,
    employeeDashboard,
    defects,
    notifications,
    layout,
    machines,
    laysheet,
    Nattendance,
    attendance,
    payrolls,
    payroll,
    efficiency,
    Styles,
    SelectItem,
    taxslab,
    costs,
    inventory,
    order,
    bundlehistory,
    productionHistory,
    performance,
    dashboard,
    cost,
    rftanddhu,
    companyDashboard,
    simulation
  },
});
