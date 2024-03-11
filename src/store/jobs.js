/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint no-param-reassign:0 */

import { api, path } from "@/api";
import { rest } from "lodash";


export default {
  namespaced: true,
  state: {
    jobslist: [],
    selectedJobsList: [],
    checkTodayAttendance: false,
  },

  mutations: {
    setJobsList(state, payload) {
      state.jobslist = payload
    },
    setSelectedList(state, payload) {
      state.selectedJobsList = payload;
    },
    setcheckTodayAttendanceInsertOrNot(state, payload) {
      state.checkTodayAttendance = payload;
    }
  },
  actions: {
    async recordAbsentAttendanceAll({ commit }, state) {
      var today = new Date();
      var year = today.getFullYear();
      var month = today.getMonth() + 1;

      if (month < 10)
        month = "0" + month

      var date = today.getDate();
      if (date < 10)
        date = "0" + date
      today = [year, month, date].join('-');

      var data = { dateAttended: today, value: state, lateMinutes: "0", slValue: "1", employeeId: "" };

      let res = await api.all(path.attendance, { where: { dateAttended: { like: today } } });

      if (res['rows'].length === 0) {
        res = await api.all(path.employee);
        res = res['rows'];

        for (let i = 0; i < res.length; i++) {
          data.employeeId = res[i].id;
          api.create(data, path.attendance);
        }
      }

      commit(null, null);
    },

    async checkTodayAttendanceInsertOrNot({ commit }) {
      var today = new Date();
      var year = today.getFullYear();
      var month = today.getMonth() + 1;

      if (month < 10)
        month = "0" + month

      var date = today.getDate();
      if (date < 10)
        date = "0" + date
      today = [year, month, date].join('-');

      let res = await api.all(path.attendance, { where: { dateAttended: { like: today } } });

      if (res['rows'].length === 0)
        commit("setcheckTodayAttendanceInsertOrNot", false);
      else
        commit("setcheckTodayAttendanceInsertOrNot", true);
    },

    async fetchAllJobs({ commit }, flt) {
      let filter = {
        include: 'employee',
        ...flt
      }
      // console.log(filter);

      await api.all(path.job, filter).then(res => {
        commit("setJobsList", res.rows)
      })
    },

    async assignNewJobs({ commit }, data) {

      await api.create(data, path.job).then(async function (r) {
        let filter = {
          include: 'employee',
        }

        await api.all(path.job, filter).then(res => {
          commit("setJobsList", res.rows)
        })
      })
    },

    async deleteJob({ commit }, id) {

      await api.remove(id, path.job).then(async function (r) {

        let filter = {
          include: 'employee',
        }

        await api.all(path.job, filter).then(res => {
          commit("setJobsList", res.rows)
        })

      })

    },

    async fetchMachinesWithID({ commit }, id) {

    },

    async bulkJobAssignment({ commit }, data) {
      await api.all("/Jobs/jobAutoAssign?date=" + data).then(res => {
        // console.log(res)
      })
    },
    async fetchJobsOfSelectedDate({ commit }, data) {
      let today = new Date().toISOString().substr(0, 10)
      let filter = {
        where: { date: { like: data } },
        include: {
          relation: 'employee',
          scope: {
            include: {
              relation: 'attendances',
              scope: {
                where: { dateAttended: { like: today } } // only select order with id 5
              }
            }
          }
        }
      };

      await api.all(path.job, filter).then(res => {
        // console.log(res.rows)

        commit('setSelectedList', res.rows)

      })
    }


  },
};


