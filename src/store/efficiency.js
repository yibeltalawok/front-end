/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { api, path } from "@/api";


export default {
  namespaced: true,
  state: {
    efficiencyData: [],
    averageEfficiency: 0,
    dailyEffStatusResultShow: false,
  },

  mutations: {
    setDailyEffStatusResultShow(state, payload) {
      state.dailyEffStatusResultShow = payload;
    },
    setEfficiencyData(state, payload) {
      state.efficiencyData = payload;
      //console.log(state.efficiencyData);
    },
    setEfficiencyDataTotal(state, payload) {
      state.averageEfficiency = payload;
    }
  },

  actions: {
    async saveDailyEffStatusResult({ commit }, data) {
      // //"Daily performanc Exist!"
      // var date = data.date;
      // var average = data.average;

      var filter = { where: { date: data.date } };

      data.forEach(async (item, index) => {
        //var i = item;
        await api.all(path.efficiency, filter).then(res => {
                res = res['rows'];
                if (res.length === 0) {
                  //"New daily efficiency record successful!"
                  api.create(item, path.efficiency).then(() => {
                    commit("setDailyEffStatusResultShow", true);
                  });
                
                } else {
                  var query = { efficiency: item.efficiency, id: res[index].id };
                  api.update(query, path.efficiency).then(() => {
                    commit("setDailyEffStatusResultShow", true);
                  });
                }
              });
        // console.log(item.efficiency);
      });
      

    },
    async getEfficiencyData({commit}, date){
      var avEffi = 0;
      let leff = await api.create(date, path.lineEfficiency);
      let bh = await api.create(date, path.getTotalad);

      for (let l = 0; l < leff.length; l++) {
        for (let b = 0; b < bh.length; b++) {
          if(leff[l].line === bh[b].line)
            leff[l].totalad = bh[b].totalad;
            leff[l].efficiency = leff[l].totalad*leff[l].totalsam*100/leff[l].totalwhr
        }
        avEffi += leff[l].efficiency;
      }
      commit("setEfficiencyData", leff);
      commit("setEfficiencyDataTotal", avEffi / leff.length);
      //loadEfficencyRealData(commit);
    },
    // async getEfficiencyData({ commit }, date) {
    //   var data = [];
    //   var averageEff = 0;
    //   await api.create(date, path.lineEfficiency).then(res => {
    //     for (let i = 0; i < res.length; i++) {
    //       //console.log(res);
    //       var line = res[i].line;
    //       var totalwhr = res[i].totalwhr;
    //       var totalad = res[i].totalad;
    //       var totalsam = res[i].totalsam;
    //       var efficiency = res[i].efficiency;

    //       averageEff += res[i].efficiency;
    //       data.push({ line, totalwhr, totalad, totalsam,  efficiency})
    //     }
    //     commit("setEfficiencyData", data);
    //     commit("setEfficiencyDataTotal", averageEff / res.length);
    //     // console.log(state.efficiencyData);
    //   });
    // }
  }
}


