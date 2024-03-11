/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint no-param-reassign:0 */

import { api, path } from "@/api";


export default {
  namespaced: true,
  state: {
    machinelist: [],
    ocupiedmachinelist: [],
    csv_machinelist: [],
    machineDetails: ""
  },

  mutations: {
    setMachineList(state, payload) {
      state.machinelist = payload;
    },
    setSingleMachine(state, payload) {
      state.machineDetails = payload;
    },
    setCsvMachineList(state, payload) {
      state.csv_machinelist = payload
    },
    setOcupiedMachines(state, payload) {
      state.ocupiedmachinelist = payload;
    },


  },
  actions: {

    async fetchAllMachines({ commit }) {
      await api.all(path.machine).then(res => {
        commit("setMachineList", res.rows)
      });
    },

    async registerBulkMachines({ state, commit }) {

      var temp = api
        .create(state.csv_machinelist, path.machine)
        .then(async function (resp) {

          // eslint-disable-next-line no-console
          console.log(resp)
          if (resp.length > 0) {
            commit("setCsvMachineList", [])
            await api.all(path.machine).then(res => {
              commit("setMachineList", res.rows)
            });
            return true;
          }
          else {
            return false;
          }


        })
      return temp;
    },

    async fetchOcupiedMachines({ commit }, opbltnid) {
      await api.create({ operationid: opbltnid }, path.ocupiedmachine).then(res => {
        console.log(res)
        commit("setOcupiedMachines", res)
      });
    },

    async registerStock({ commit }, data) {
      await api.create(data, "/Machines/addstock").then(res => {
      });
    },

    async fetchMachinesWithID({ commit }, id) {
      commit("setSingleMachine", "")
      await api.get(id, path.machine).then(res => {
        commit("setSingleMachine", res)
      });
    },


  },
};


