/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { api, path, API_ROOT } from "@/api";


export default {
  namespaced: true,
  state: {
    yearlyPerformanceData: [],
  },

  mutations: {
    setYearlyPerformanceData(state, payload) {
      state.yearlyPerformanceData = payload;
    },
  },

  actions: {
    async getYearlyPerformanceData({ commit }) {
      var year = new Date();
      year = year.getFullYear();

      await api.all(path.yearlyPerformance + "?year=" + year).then(res => {

        var data = [];
        for (let i = 0; i < res.length; i++) {
          var date = res[i].date.toString().substr(0, 10);
          //date = date.charAt(0) + date.charAt(1) + date.charAt(2) + date.charAt(3) + date.charAt(4) + date.charAt(5) + date.charAt(6) + date.charAt(7) + date.charAt(8) + date.charAt(9);
          var average = res[i].average;
          var id = res[i].id;
          var topValue = res[i].topValue;
          var fullName = res[i].fullName;
          var department = res[i].department;
          var gender = res[i].gender;
          var image = API_ROOT + "/containers/profilePictures/download/" + res[i].phoneNumber;

          data.push({ date, average, id, topValue, fullName, department, gender, image });
        }

        commit("setYearlyPerformanceData", data);
      });

    },
  }
}