/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { api, path, API_ROOT } from "@/api";


export default {
  namespaced: true,
  state: {
    statData: [],
    recentOrders: []
  },
  mutations: {
    setstatData(state, payload) {
      state.statData = payload;
      //console.log(state.statData);
    },
    setrecentOrders(state, payload){
      state.recentOrders = payload;
    }
  },
  actions: {
    async getstatData({ commit }) {
      let data = [];
      let date = new Date().toISOString().substr(0, 10);
      await api.create({date: date}, path.getStatBundleHistory).then(res => {
        res.forEach((item) => {
            //console.log(item)
            data.push(item)
        });
      });
      //data.push(1,2,3);
      //Total Orders
      await api.all(path.order).then(res => {
        //console.log(res);
        data.unshift(res.count);
      });

      commit("setstatData", data);
    },

    async getrecentOrders({commit}){
      let amount = 5;
      await api.create({amount}, path.recentOrders).then(res => {
        console.log(res);
        commit("setrecentOrders", res);
      })
      
    }
  },
}