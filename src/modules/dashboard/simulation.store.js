/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { api, path, API_ROOT } from "@/api";

function getToday(){
        return new Date().toISOString().substr(0,10);
}

function loadEfficencyRealData (commit){
    
}

export default {
  namespaced: true,
  state: {
    performanceData: [],
    performanceDataAverage: 0,
    bunddleHistorySimulation: [],
    efficiencyData: [],
    efficiencyAverage: 0,
    notificationList: [],

  },
  mutations: {
    setLoadPerformanceData(state, payload){
      state.performanceData = payload;
    },
    setLoadPerformanceDataAverage(state, payload){
      state.performanceDataAverage = payload;
    },
    setBunddleHistorySimulation(state, payload){
      state.bunddleHistorySimulation = payload;
    },
    setEfficiencyAverage(state, payload){
      state.efficiencyAverage = payload;
    },
    setEfficiencyData(state, payload){
      state.efficiencyData = payload;
    },
    setNotificationList(state, payload){
      state.notificationList = payload;
    }
  },
  actions: {
    SOCKET_BundleHistory_POST: async function ({ commit }, recievd) {
      await api.all(path.getTodayBundleHistoryAll+"?date="+getToday()).then(res=>{
        commit("setBunddleHistorySimulation",res);
      });
      var date = getToday();
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
      commit("setEfficiencyAverage", avEffi / leff.length);
      //loadEfficencyRealData(commit);
    },

    async getEfficiencyDatas({commit}){
      await api.all(path.getTodayBundleHistoryAll+"?date="+getToday()).then(res=>{
        commit("setBunddleHistorySimulation",res);
      });
      var date = {date: getToday()};
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
      commit("setEfficiencyAverage", avEffi / leff.length);
      //loadEfficencyRealData(commit);
    },
    async getbunddleHistorySimulation({commit}){
      await api.all(path.getTodayBundleHistoryAll+"?date="+getToday()).then(res=>{
        commit("setBunddleHistorySimulation",res);
      });
    },

    SOCKET_Productionhistory_POST: async function ({ commit }, recievd) {
      var date = {date: getToday()};
      var average = 0;
      await api.create(date, path.fetchPerformance).then(resp => {
        for (let i = 0; i < resp.length; i++) {
          average += parseFloat(resp[i].performance);
          resp[i].employeeProfilePicture = API_ROOT + "/containers/profilePictures/download/" + resp[i].employeeProfilePicture;
        }
        commit("setLoadPerformanceData",resp);
        commit("setLoadPerformanceDataAverage",average/resp.length);
      });
        
    },

    SOCKET_Notification_POST: async function({commit}, recievd){
      var date = new Date();
      date = new Date(date.setDate(date.getDate()-1)).toISOString().substr(0,10);
      var filter = {where: {date:{gt: date}}};

      await api.all(path.notifications, filter).then( res => {
        commit("setNotificationList", res['rows'])
      });
    },

    async getNotificationList({commit}){
      var date = new Date();
      date = new Date(date.setDate(date.getDate()-1)).toISOString().substr(0,10);
      var filter = {where: {date:{gt: date}}};

      await api.all(path.notifications, filter).then( res => {
        commit("setNotificationList", res['rows'])
      });
    },

    async getLoadPerformanceData({commit}){
      var date = {date: getToday()};
      var average = 0;
      await api.create(date, path.fetchPerformance).then(resp => {
        console.log(resp)
        for (let i = 0; i < resp.length; i++) {
          average += parseFloat(resp[i].performance);
          resp[i].employeeProfilePicture = API_ROOT + "/containers/profilePictures/download/" + resp[i].employeeProfilePicture;
        }
        commit("setLoadPerformanceData",resp);
        commit("setLoadPerformanceDataAverage",average/resp.length);
      });
  },
},
}