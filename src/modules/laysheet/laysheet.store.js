/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint no-param-reassign:0 */

import { getCustomDateFormat } from "@syncfusion/ej2-grids";
import { api, path } from "../../api";

export default {
  namespaced: true,
  state: {
    allTkts: JSON.parse(localStorage.getItem("allTkts")),
    parts: JSON.parse(localStorage.getItem("parts")),
    laysheet: JSON.parse(localStorage.getItem("laysheet")),
    color: JSON.parse(localStorage.getItem("color")),
    orderId: localStorage.getItem("orderId"),
    styleName: localStorage.getItem("styleName"),
    cutbalance: [],
    items: [],
    bundlesList: [],
    ScanedOrderData:[],
    cutNumbers: [],
    bCSheetId: '',
    bndls: []
  },
  getters: {
    parts: (state) => state.parts,
    laysheet: (state) => state.laysheet,
    color: (state) => state.color,
    sizes(state) {
      let arr = state.allTkts;
      let vals = [];
      for (let i = 0; i < arr.length; i++) {
        vals.push({
          label: arr[i].label,
        });
      }
      const key = "label";
      return [...new Map(vals.map((item) => [item[key], item])).values()];
    },
    orderId: (state) => state.orderId,
    styleName: (state) => state.styleName,
    allItems(state) {
      let arr = state.allTkts;
      let count = 0;
      let a = [];
      let vals = [];
      let nums = [];
      let temp = 0;
      let from = 0;
      // let fromCount = 1;
      let to = 0;
      
      // eslint-disable-next-line no-console
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].nb; j++) {
          count = j == 0 && arr[i].cardCounter == 0 ? 0 : count;
          temp =
            j < arr[i].nb - 1
              ? arr[i].tQ
              : arr[i].rSum - (arr[i].nb - 1) * arr[i].tQ;
          from = (count + j) * arr[i].tQ + 1;
          
          to = from - 1 + temp;
          a[j] = {
            count: count + j + 1,
            bq: temp,
            from: from,
            to: to,
            cardCounter: arr[i].cardCounter,
            bundleCounter: count + j,
            tktElement: j == 0 && arr[i].cardCounter == 0 ? "first" : "other",
          };
        }
        count += arr[i].nb;
        while (a.length) nums = a.splice(a, arr[i].nb);
        vals.push({
          label: arr[i].label,
          color: arr[i].color,
          val: arr[i].val,
          No: nums,
          rSum: arr[i].rSum,
          nb: arr[i].nb,
        });
      }

      const key = "val";
      return [...new Map(vals.map((item) => [item[key], item])).values()];
    },
    allItem(state) {
      return state.allTkts

    }
  },

  mutations: {
    setScanedOrder(state,payload){
     state.ScanedOrderData=payload
    },
    setBundles(state, payload){
        state.bundlesList = payload;
    },
    pushBundles(state, payload){
        state.bundlesList.push(payload);
    },
    manageState(state, items) {
      state.allTkts = items
      localStorage.setItem("allTkts", JSON.stringify(items))
    },
    setCurrentBalance(state, payload) {
      state.cutbalance = payload
    },
    setLaysheet(state, items) {
      state.allTkts = items
      localStorage.setItem("allTkts", JSON.stringify(items))
    },
    manageParts(state, chips) {
      (state.parts = chips)
      localStorage.setItem("parts", JSON.stringify(chips))

    },
    manageLaysheet(state, laysheet) {
      state.laysheet = laysheet
      localStorage.setItem("laysheet", JSON.stringify(laysheet))

    },
    manageColor(state, color) {
      state.color = color
      localStorage.setItem("color", JSON.stringify(color))
    },
    manageOrderId(state, orderId) {
      state.orderId = orderId
      localStorage.setItem("orderId", orderId)

    },
    manageStyleName(state, styleName) {
      state.styleName = styleName
      localStorage.setItem("styleName", styleName)
    },
    setBundleData(state, payload) {
      console.log(payload)
      state.items = payload[0]
      //setAllTkts*******************************************
      state.allTkts = payload[0]
      localStorage.setItem("allTkts", JSON.stringify(payload[0]))
      //set the chips**************************************
      state.parts = payload[1]
      localStorage.setItem("parts", JSON.stringify(payload[1]))

      //set laysheet  **************************************
      state.laysheet = payload[2]
      localStorage.setItem("laysheet", JSON.stringify(payload[2]))
      //set colors ********************************************
      state.color = payload[3]
      localStorage.setItem("color", JSON.stringify(payload[3]))
      //set order Id *****************************************
      state.orderId = payload[4]
      localStorage.setItem("orderId", payload[4])
      //set Style name  ****************************************
      state.styleName = payload[5]
      localStorage.setItem("styleName", payload[5])

    },

    setCutNumber(state, cutnums){
      state.cutNumbers = cutnums
    },
    setBCSheetId(state, bcsheetId){
      state.bCSheetId = bcsheetId
    },
    setCheckBundles(state, bndls){
      state.bndls = bndls
    }
    
  },

  actions: {

    async fetchCutbalance({ commit }, idx) {

      await api.create({ orderid: idx }, path.cutbalance).then(res => {
        commit("setCurrentBalance", res)
      })

    },

    // eslint-disable-next-line no-unused-vars
    async createBundlesStatus({ commit }, data) {
      await api.create(data, path.scannedOrders).then(res => {
        // console.log(res)
      })
      .catch(e => {
          console.log(e)
      })

    },
          // eslint-disable-next-line no-unused-vars
      async getScanedOrder({commit}, data){
        let filter = { include: ['ScannedOrderStatus'] }
        let dataLength=0;
        try {
            await api
            .get(data,path.order,filter)
            .then(res => {
                dataLength=res.ScannedOrderStatus.length
                commit('setScanedOrder', dataLength)
            });

        } 
        catch (e) {
            console.log("Unable to fetch")
            return null
        }
    },
      // eslint-disable-next-line no-unused-vars
    async postLaysheet({ commit },data) {
      api
       await api.create(data[0],path.laysheet).then(res=>{
          var bcsheetId = res.id
          console.log(bcsheetId)

          // since it is needed for creating bundles, we need to commit the bcsheetId
          commit("setBCSheetId", bcsheetId)

      })  
      .catch(err => {
          this.showErrors(err);
      });
   },

    //   async checknumofbundles({}){

    //   },


    async getBundleData({ commit }, item) {
      await api
        .create({ laysheetId: item[0] }, path.getLaysheet)
        .then(result => {
          commit("setBundleData", [result, item[1], item[2], item[3], item[4], item[5]])
          // this.$store.commit("setLaysheet", items);
          // this.$store.commit("manageParts", chips);
          // this.$store.commit("manageLaysheet", laysheet);
          // this.$store.commit("manageColor", color);
          // this.$store.commit("manageOrderId", orderId);
          // this.$store.commit("manageStyleName", styleName);
          // this.$router.push({ name: "bcsheet" });
        });

    },

    // get all the cut numbers for validation so that it will not be repeated.
    async getCutNums({commit}, data){
      console.log("ORDER ID: "+data);
      let filter = {where: {orderId: data}}
      let laysht = (await api.all(path.laysheet, filter)).rows

      var cutnums = [];
      console.log(laysht);
      
      for (let i = 0; i < laysht.length; i++) {
        cutnums.push(laysht[i].cutNo)
      }
      commit("setCutNumber", cutnums)
    },

    // Check if the cut has bundles.
    async checkBundleList({commit}, data){
      var bndls;
      var filter = {where: {'bCSheetId': data}}
      await api.all("/BCSheets/"+data+"/ScannedOrderStatus", filter).then(res =>{
        bndls = res;
      })

      // console.log(bndls)
      commit("setCheckBundles", bndls)
    },

    // async deleteBundles({commit}, data){
    //   // console.log(data)
    //   var filter = {include: ['BundleHistory'],where: {'bCSheetId': data}};

    //   await api.all(path.scannedOrders, filter).then(res =>{

    //     res = res['rows']
    //     console.log(res)
    //     for (let i = 0; i < res.length; i++) {
    //       api.remove(res[i].id, path.scannedOrders);
    //       api.remove(res[i].BundleHistory.id, path.bundleHistory);
    //     }

    //   })
    // },

    async deleteBundleHistory({commit}, data){
      var filter = {where: {'bCSheetId': data}}
      await api.all("/BCSheets/"+data+"/ScannedOrderStatus", filter).then(res =>{
        // console.log(res)
        for (let i = 0; i < res.length; i++) {
          var bundleid = res[i].id
          // fetch the bundle histories for a bundle
          var filterhistory = {where: {'scannedOrderStatusId': bundleid}}
          api.all("/ScannedOrderStatuses/"+bundleid+"/BundleHistory", filterhistory).then(result =>{
            for (let j = 0; j < result.length; j++) {
              var bundlehistoryId = result[j].id
              api.remove(bundlehistoryId, path.bundleHistory)
            }
          })
        }
      })
    },

    async deleteBundles({commit}, data){
      // console.log(data)
      var filter = {where: {'bCSheetId': data}}
      await api.all("/BCSheets/"+data+"/ScannedOrderStatus", filter).then(res =>{
        // console.log(res)
        for (let i = 0; i < res.length; i++) {
          var bundleid = res[i].id
          api.remove(bundleid, path.scannedOrders)
        }
      })
    },

    async updateBCSheet({commit}, data){
      await api.update(data, path.laysheet);
    },

    async deleteBCSheet({commit}, data){
      await api.remove(data, path.laysheet);
    }
  },

};
