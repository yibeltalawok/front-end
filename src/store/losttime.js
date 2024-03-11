/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { api, path } from "@/api";

export default {
  namespaced: true,
  state: {
    iotlist: [],
    losttimelist: [],
    iotdialog: false,
    unassignediotlist: [],
    asigniotdialog: false,
    chartOptions: {},
    series: [],
    dashboardData: [],
    losttimefiltering: false,
    lineChart: {},
    LostTimeSummaryData: null,
    pieChart: {},
    costPieChart: {},
    iotDevId: ''
  },

  mutations: {
    setIotDialog(state) {
      state.iotdialog = !state.iotdialog
    },
    setLostTimeSummaryData(state, payload) {
      state.LostTimeSummaryData = payload
    },
    setAssIotDialog(state, payload) {
      state.asigniotdialog = payload
    },
    setLostTimeFiltering(state, payload) {
      state.losttimefiltering = payload
    },
    setIoTList(state, payload) {
      state.iotlist = payload
    },
    setIotDeviceId(state, payload) {
      state.iotDevId = payload
    },

    setLostTimeList(state, payload) {
      state.losttimelist = payload
    },
    setUnAssignedIoTList(state, payload) {
      state.unassignediotlist = payload
    },
    setLostimeDashboard(state, payload) {
      state.lineChart = payload[0]
      state.pieChart = payload[1]
    },
    setCostDashboard(state, payload) {
      state.costPieChart = payload
    }


  },
  actions: {
    async getCostDashboard({ commit }, date) {
      await api.create({ date: date }, path.getCostDashboard,).then(result => {

        commit('setCostDashboard', result)
      })
    },
    async getLostimeDashboard({ commit }, item) {
      await api.create({ date: item[0], line: item[1], type: item[2] }, path.getLostimeDashboard,).then(result => {

        commit('setLostimeDashboard', result)
      })
    },
    async getLostimeDashboardByLine({ commit }, item) {
      await api.create({ date: item[0], line: item[1] }, path.getLostimeDashboardByLine,).then(result => {

        commit('setLostimeDashboard', result)
      })
    },
    // async getLostimePieDashboard({ commit }, item) {
    //   await api.create({ date: item[0], type: item[1] }, path.getLostimeDashboard,).then(result => {

    //     commit('setLostimePieDashboard', result)
    //   })
    // },
    async fetchIotDevices({ commit }, filter) {

      await api.all(path.iot, filter).then(res => {
        commit("setIoTList", res)
      })
    },

    async fetchIotId({ commit }, data) {
      let filter = { where: { iotid: data } };
      await api.all(path.iot, filter).then(res => {
        let deviceId = res[0].id;
        commit('setIotDeviceId', deviceId)
      });
    },

    async fetchLostTime({ commit }, data) {
      var date = data.date;

      var filter = { include: { job: ["employee", { operation: "machine" }] }, where: { and: [{ date: { gte: date[0] } }, { date: { lte: date[1] } }], linenumber: data.line }, };
      if (data.line === "")
        filter = { include: { job: ["employee", { operation: "machine" }] }, where: { and: [{ date: { gte: date[0] } }, { date: { lte: date[1] } }] }, };

      await api.all(path.lostTime, filter).then(res => {
        res = res['rows'];
        data = [];
        for (let i = 0; i < res.length; i++) {
          data.push(res[i]);
        }
        commit("setLostTimeList", data)
      })
    },

    async fetchLostTimeWithDateFilter({ commit }, data) {
      var dt = data.date;
      var line = data.line;

      await api.all(path.lostTime,
        {
          include: { job: ["employee", { operation: "machine" }] },
          where: { and: [{ date: { gte: dt[0] } }, { date: { lte: dt[1] } }], linenumber: line },
        }
      ).then(res => {


        var temp = res.rows
        var lines = []
        var store = []
        var mb = []
        var pl = []
        var ml = []
        var nw = []


        temp.forEach(element => {
          var idx = lines.indexOf(element.job.line)

          if (idx == -1) {
            lines.push(element.job.line)
            if (element.reasonid == 3) {
              nw.push(parseFloat(element.totalmins))
              ml.push(parseFloat(0))
              mb.push(parseFloat(0))
              pl.push(parseFloat(0))
            } else if (element.reasonid == 1) {
              nw.push(parseFloat(0))
              ml.push(parseFloat(element.totalmins))
              mb.push(parseFloat(0))
              pl.push(parseFloat(0))
            } else if (element.reasonid == 2) {
              nw.push(parseFloat(0))
              ml.push(parseFloat(0))
              mb.push(parseFloat(element.totalmins))
              pl.push(parseFloat(0))
            } else {
              nw.push(parseFloat(0))
              ml.push(parseFloat(0))
              mb.push(parseFloat(0))
              pl.push(parseFloat(element.totalmins))
            }
          }
          else {
            if (element.reasonid == 3) {
              nw[idx] += parseFloat(element.totalmins)
            } else if (element.reasonid == 1) {
              ml[idx] += parseFloat(element.totalmins)
            } else if (element.reasonid == 2) {
              mb[idx] += parseFloat(element.totalmins)
            } else {
              pl[idx] += parseFloat(element.totalmins)
            }
          }

        });

        var datacollection = {
          labels: lines,
          datasets: [{
            label: 'Miscellaneous',
            backgroundColor: "#ffbf00",
            data: ml
          }, {
            label: 'No Work',
            backgroundColor: "#ddff00",
            data: nw
          }, {
            label: 'Power Loss',
            backgroundColor: "#22aa77",
            data: pl
          }, {
            label: 'Machine Breakdown',
            backgroundColor: "#dd7777",
            data: mb
          }]

        }

        commit("setLostTimeSummaryData", datacollection)


      })
    },


    async registerLostTime({ commit }, data) {
      console.log("register data")
      // console.log(data)

      await api.create(data, path.lostTime).then(res => {
      })
    },

    async asignIotDevices({ commit }, data) {
      //await api.update(data[0], path.product).then(res => {

      try {
        await api.update(data, path.iot).then(_ => async function () {
          _
          await api.all(path.iot, { include: ["employee"] }).then(res => {
            commit("setIoTList", res)

          })
        })
        return true
      }
      catch (e) {
        return e
      }


    },

    async asignnewIotDevices({ commit }, data) {

      try {
        await api.create(data, path.iot).then(_ => async function () {
          _
          await api.all(path.iot, { include: ["employee"] }).then(res => {
            commit("setIoTList", res)

          })

        })
        return true
      }
      catch (e) {
        return e
      }


    },

    async deleteIotDevices({ commit }, id) {

      try {
        await api.remove(id, path.iot).then(_ => async function () {
          _
          await api.all(path.iot, { include: ["employee"] }).then(res => {
            commit("setIoTList", res)

          })
        })
        return true
      }
      catch (e) {
        return e
      }


    },

    async setUnAssignedIoTList({ state, commit }) {

      let temp = state.iotlist.filter(val => {
        return val.asigned === false;
      })
      commit("setUnAssignedIoTList", temp)
    },


  },
};


