/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { api, path, API_ROOT } from "@/api";


export default {
  namespaced: true,
  state: {
    statData: [],
  },
  mutations: {
    setstatData(state, payload) {
      state.statData = payload;
      //console.log(state.statData);
    },
  },
  actions: {
    async getstatData({ commit }) {
      let data = [];
      let date = new Date().toISOString().substr(0, 10);
      //Total Employees
      await api.all(path.employee).then(res => {
        //console.log(res);
        data.push(res.count);
      });


      //Total Jobs
      var totalJob = 0;
      await api.all(path.job).then(res => {
        //console.log(res);
        //res = [{}]
        totalJob = res.length;
      });

      await api.create({date}, path.lineEfficiency).then(res => {
        var ad = 0;
        let labProd = 0;
        //console.log(res);
        if(res.length > 0){
          for (let i = 0; i < res.length; i++) {
            ad += res[i].totalad;
          }
          if(ad != 0) labProd = totalJob/ad;
        }
        data.push(labProd);
      });


     


      await api.all(path.customer).then(res => {
        //console.log(res);
        data.push(res.count);
      });

      await api.all(path.supplier).then(res => {
        //console.log(res)
        data.push(res.count)
      });

      
      await api.create({date}, path.lineEfficiency).then(res => {
        var averageEff = 0;
        //console.log(res);
        if(res.length > 0){
          for (let i = 0; i < res.length; i++) {
            averageEff += res[i].efficiency;
          }
          averageEff /= res.length;
        }
        data.push(averageEff);
      });


      commit("setstatData", data);
    },
  },
}