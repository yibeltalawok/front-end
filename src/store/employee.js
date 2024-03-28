/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { api, path, API_ROOT } from "@/api";


export default {
  namespaced: true,
  state: {
    reloadAttendanceChartData: [],
    employeeList: [],
    csv_employeeList: [],
    vroles: [],
    employeeSearchResult: [],
    csvRefistationLoading: false,
    attendanceChartSeries: [],
    chartOptions: {},
    chartData: [],
    attendEmpp: [],
    uniqueColors: [],
    profileImage: "",
    outPutData: [],
    attendanceReason: {},
    departments: []
  },

  mutations: {
    setReloadAttendanceChart(state, payload) {
      state.reloadAttendanceChartData = payload;
    },
    setCSVemployeeList(state, payload) {
      state.csv_employeeList = payload
    },
    setRoles(state, payload) {
      state.vroles = payload;
    },
    setEmployee(state, payload) {
      state.employeeList = payload;
    },
    setSearchResult(state, payload) {
      state.employeeSearchResult = payload;
    },

    setAttendanceChart(state, payload) {
      state.attendanceChartSeries = payload;
      // state.chartOptions = payload[1]
    },
    setReasonDashboard(state, payload) {
      state.attendanceReason = payload
    },
    setAttendance(state, payload) {
      state.attendEmpp = payload[0]
      state.uniqueColors = payload[1]
    },
    setoutPutData(state, payload) {
      state.outPutData = payload;
    },
    setProfile(state, profile) {
      state.profileImage = profile
    },
    attendacChartOpetion(state, payload) {
      state.chardData = payload
    },
    setDepartement(state, payload) {
      state.departments = payload
    }
  },
  actions: {
    async getReloadAttendanceChart({ commit }, date) {
      var filter = "&startDate=" + date[0] + "&endDate=" + date[1];
      await api.all(path.attendanceDashboardStartEndDate, filter).then(data => {
        commit("setReloadAttendanceChart", data);
      });
    },
    async getDepartment({ commit }) {
      let tempEmp = (await api.all(path.employee)).rows.map((result) => {
        return {
          department: result.department
        }
      })
      const key = "department";
      let uniqueDepartment = [...new Map(tempEmp.map(item => [item[key], item])).values()];
      commit('setDepartement', uniqueDepartment)
    },
    async getReasonDashboard({ commit }, item) {
      await api.create({ date: item[0], department: item[1], type: item[2] }, path.getReasonDashboard,).then(result => {
        commit('setReasonDashboard', result)
      })
    },

    // Get attendance 
    async getAttendanceChart({ commit }, item) {
      await api.create({ date: item[0], department: item[1], type: item[2] }, path.getDashboardAttendance,).then(result => {
        // let chartOptions = {
        //   colors: ["#78C5EF", "#E91E63"],
        //   chart: {
        //     type: "bar",
        //     height: 350,
        //     stacked: true,
        //     toolbar: {
        //       show: true
        //     },
        //     zoom: {
        //       enabled: true
        //     }
        //   },
        //   grid: {
        //     row: {
        //       colors: ["#e5e5e5", "transparent"]
        //     },
        //     column: {
        //       colors: ["#f8f8f8", "transparent"]
        //     },
        //     xaxis: {
        //       lines: {
        //         show: true
        //       }
        //     }
        //   },
        //   responsive: [
        //     {
        //       breakpoint: 480,
        //       options: {
        //         legend: {
        //           position: "bottom",
        //           offsetX: -10,
        //           offsetY: 0
        //         }
        //       }
        //     }
        //   ],
        //   plotOptions: {
        //     bar: {
        //       horizontal: false
        //     }
        //   },
        //   xaxis: {
        //     type: "text",
        //     categories: []
        //   },
        //   legend: {
        //     position: "right",
        //     offsetY: 40
        //   },
        //   fill: {
        //     opacity: 1,
        //     colors: ["#78C5EF", "#E91E63"]
        //   }
        // };
        // chartOptions.xaxis.categories = result.categories;
        // let employeeValue = result.roleValuesFromEmployee
        // commit('setAttendanceChart', [result.series, chartOptions, employeeValue])
        // let employeeValue = result.roleValuesFromEmployee
        commit('setAttendanceChart', result)

      })
    },

    async getOutPutData({ commit }, date) {
      await api
        .create({ date: date }, path.countEmployee)
        .then(result => {

          // eslint-disable-next-line no-console
          // console.log(this.result)
          commit('setoutPutData', result)
        });

    },

    async getProfileImage({ commit }, phoneNumber) {
      // eslint-disable-next-line no-console
      // console.log(phoneNumber)
      return await api
        .getProfile("profilePictures/download", phoneNumber)
        .then(
          // eslint-disable-next-line no-unused-vars
          res =>
            commit('setProfile', (API_ROOT +
              "/containers" +
              "/profilePictures" +
              "/download/" + phoneNumber))
        )
        .catch(
          // eslint-disable-next-line no-unused-vars
          err =>
            commit('setProfile', (API_ROOT +
              "/containers/profilePictures/download/defaultProfile"))
        );
    },
    async getAttend({ commit }, data) {
      let attended = []
      await api
        .create(
          {
            value: data[0],
            type: "employee",
            month: data[1],
            year: data[2]
          },
          path.getAttendance
        )
        .then(result => {
          attended = result;
        });
      const key = "value";
      let uniqueColors = [
        ...new Map(
          attended[0].attendance.map(item => [item[key], item])
        ).values()
      ];
      commit('setAttendance', [attended, uniqueColors])
    },
    async registerBulkEmployees({ state, commit }) {

      var temp = api
        .create(state.csv_employeeList, path.employee)
        .then((resp) => {

          // eslint-disable-next-line no-console
          // console.log(resp)
          if (resp.length > 0) {
            commit("setCSVemployeeList", [])
            return true;
          }
          else {
            return false;
          }


        })
      return temp;
    },

    async fetchAllEmployees({ commit }) {
      await api
        .all(path.employee)
        .then((resp) => {
          // eslint-disable-next-line no-console
          // console.log(resp.rows)
          if (resp.rows.length > 0) {
            let searchresult = resp.rows.map(x => {
              return {
                id: x.id,
                name: x.fullName + "   =>    " + x.idno,
                fullName: x.fullName
              };
            });
            commit("setEmployee", resp.rows)
            commit("setSearchResult", searchresult)
            return true;
          }
          else {
            return false;
          }


        })
    }


 },
 };


