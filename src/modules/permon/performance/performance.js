/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { api, path, API_ROOT } from "@/api";


export default {
  namespaced: true,
  state: {
    performanceData: [],
    averagePerformance: 0,
    topEmployeeId: '',
    topvalue: 0,
  },

  mutations: {

    setTopEmployeeInDailyPerformance(state, payload) {
      state.topEmployeeId = payload;
    },
    setTopEmployeeValueDailyPerformance(state, payload) {
      state.topvalue = payload;
    },
    setLoadPerformanceData(state, payload) {
      state.performanceData = payload;
    },
    setLoadPerformanceDataTotal(state, payload) {
      state.averagePerformance = payload;
    }
  },

  actions: {
    async saveDailyPerStatusResult({ commit }, data) {
      //"Daily performanc Exist!"
      var date = data[0].date;
      var topValue = data[0].topValue;
      var employeeId = data[0].employeeId;
      var average = data[0].average;

      var filter = { where: { date: date } };
      await api.all(path.performance, filter).then(resp => {
        if (resp['rows'].length === 0) {
          //"New daily performance record successful!"
          api.create(data[0], path.performance).then(() => {
            commit(null, null);
          });
        } else {
          resp = resp['rows'];
          var query = { average: average, employeeId: employeeId, topValue: topValue, id: resp[0].id };
          api.update(query, path.performance).then(() => {
            commit(null, null);

          });
        }
      });

    },

    async getLoadPerformanceData({ commit }, date) {
      var data = [];
      var averagePerfo = 0;
      var topvalue = 0;
      var topEmployeeId = '';

      await api.create(date, path.fetchPerformance).then(resp => {
        for (let i = 0; i < resp.length; i++) {
          resp[i].employeeProfilePicture = API_ROOT + "/containers/profilePictures/download/" + resp[i].employeeProfilePicture;
          if (topvalue <= resp[i].performance) {
            topvalue = resp[i].performance;
            topEmployeeId = resp[i].employeeid;
          }

          averagePerfo += resp[i].performance;
        }
        commit("setTopEmployeeInDailyPerformance", topEmployeeId);
        commit("setTopEmployeeValueDailyPerformance", topvalue);
        commit("setLoadPerformanceData", resp);
        commit("setLoadPerformanceDataTotal", averagePerfo / resp.length);
      });
    }
  }
}


