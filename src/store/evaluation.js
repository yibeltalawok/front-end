/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { api, path } from "@/api";

export default {
  namespaced: true,
  state: {
    line_num_choices: [],
    evaluations: [],
    singleEvaluations: [],
    defectids: [],
    chartdata: [],
    dhuchartdata: [],
    rftchartdata: [],
    qualitypiechartdata: [],
    gantchartdata: [],
    evaluationHistory: {},
    upperchartloadded: false,
    lowerchartloadded: false,
  },

  mutations: {
    setline_num_choices(state, payload) {
      state.line_num_choices = payload;
    },
    setgantchartData(state, payload) {
      state.gantchartdata = payload
    },
    setQualityPiechartData(state, payload) {
      state.qualitypiechartdata = payload
    },
    setDhuChartData(state, payload) {
      state.dhuchartdata = payload
    },

    setEvaluationhistory(state, payload) {
      state.evaluationHistory = payload
    },

    setEvaluations(state, payload) {
      state.evaluations = payload
      // console.log(state.defects)
    },

    setupperchartloadded(state, payload) {
      state.upperchartloadded = payload
      // console.log(state.defects)
    },

    empityChartData(state) {
      state.chartdata = []
      // console.log(state.defects)
    },

    addChartData(state, payload) {
      state.chartdata.push(payload)
      // console.log(state.defects)
    },

    setChartData(state, payload) {
      state.chartdata = payload
      // console.log(state.defects)
    },

    setDHUChartData(state, payload) {
      state.dhuchartdata = payload
      // console.log(state.defects)
    },

    setRFTChartData(state, payload) {
      state.rftchartdata = payload
      // console.log(state.defects)
    },

    retrunDHUChartData(state) {
      return state.dhuchartdata;
      // console.log(state.defects)
    },


    setSingleEvaluations(state, payload) {
      state.singleEvaluations = payload
    }

  },

  getters: {
    getdhuchartdata(state) {
      return state.dhuchartdata
    }

  },

  actions: {
    //get Distinict line from single evalution model used in quality dashboard chart filtering
    async getline_num_choices({ commit }) {
      api.all(path.singleevaluations, { fields: ['linenum'] }).then(res => {
        var lineDistinict = [];
        var lineExist = 0;

        for (let i = 0; i < res.length; i++) {
          for (let l = 0; l < lineDistinict.length; l++) {
            if (res[i].linenum === lineDistinict[l]) {
              lineExist = 1;
              break;
            } else
              lineExist = 0;
          }

          if (lineExist === 0)
            lineDistinict.push(res[i].linenum);
        }
        commit("setline_num_choices", lineDistinict)
      });
    },

    async fetchAllEvaluations({ commit }) {
      try {
        const resp = await api.all(path.evaluations, { include: { OperationBulletins: "order" } })
        commit('setEvaluations', resp)
        return resp
      }
      catch (e) {
        console.log("failed to fetch defects")
        return null
      }
    },


    async fetchEvaluationHistory({ commit }) {
      try {
        const resp = await api.all(path.evaluationHistory)
        commit('setEvaluationhistory', resp)
        return resp
      }
      catch (e) {
        console.log("failed to fetch defects")
        return null
      }
    },

    async fetchDHUChartDate({ commit }) {
      try {
        const resp = await api.all(path.dhuChartData)
        console.log(resp)
        commit('setDhuChartData', resp)
        return resp
      }
      catch (e) {
        console.log("failed to fetch defects")
        return null
      }
    },

    async fetchQualityPieChart({ commit }) {
      try {
        const resp = await api.all(path.getPieChartData)
        console.log(resp)
        commit('setQualityPiechartData', resp)
        return resp
      }
      catch (e) {
        console.log("failed to fetch defects")
        return null
      }
    },



    async fetchGantChartData({ commit }, data) {

      const r = await api.getwithmoredata(path.gantchartdata, { params: { from: data.from, to: data.to, line: data.line, opbltn: data.opbltn } })
      commit("setgantchartData", r)
    },

    async fetchAllGantChartData({ commit }) {

      const r = await api.all(path.allgantchartdata)
      commit("setgantchartData", r)
    },

    async fetchSingleEvaluationsForChart({ commit, state }) {

      try {
        const resp = await api.all(path.singleevaluations)

        return resp;
      }
      catch (e) {
        console.log("failed to fetch chartdata")
      }
      return null;
    },


  },
};


