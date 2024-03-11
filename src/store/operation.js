/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { api, path } from "@/api";


export default {
  namespaced: true,
  state: {
    operationList: [],
    oprationCostPerYear: [],
    paymentMethodList: [],
    reasonForPaymentList: []
  },

  mutations: {
    setOperation(state, payload) {
      state.operationList = payload
    },

    setOprationCostPerYear(state, payload) {
      state.oprationCostPerYear = payload;
    },

    setReasonForPaymentList(state, payload) {
      state.reasonForPaymentList = payload;
    },

    setPaymentMethodList(state, payload) {
      state.paymentMethodList = payload;
    }
  },
  actions: {

    async fetchAllOperations({ commit }) {
      await api.all(path.operation).then(res => {
        commit("setOperation", res.rows)
      })
    },

    async getPaymentMethodList({ commit }) {
      var list = [];
      var checkExistance = 0;

      await api.all(path.operationalCost).then(result => {
        result = result["rows"]
        for (var i in result) {
          for (var c = 0; c < list.length; c++) {
            if (list[c] === result[i].type) {
              checkExistance = 1;
              break;
            } else checkExistance = 0;
          }
          if (checkExistance === 0) list.push(result[i].type);
        }
        var returnData = [];
        returnData.push({ nametype: 'All' })

        for (var key in list) {
          returnData.push({ nametype: list[key] })
        }
        commit("setPaymentMethodList", returnData);
      });
    },

    async getReasonForPaymentList({ commit }) {
      var list = [];
      var checkExistance = 0;

      await api.all(path.operationalCost).then(result => {
        result = result["rows"]
        for (var i in result) {
          for (var c = 0; c < list.length; c++) {
            if (list[c] === result[i].narration) {
              checkExistance = 1;
              break;
            } else checkExistance = 0;
          }
          if (checkExistance === 0) list.push(result[i].narration);
        }

        var returnData = [];
        returnData.push({ namenarration: 'All' })

        for (var key in list) {
          returnData.push({ namenarration: list[key] })
        }
        commit("setReasonForPaymentList", returnData);
      });
    },

    async getOprationCostPerYear({ commit }, input) {
      var type = input[0];
      var narration = input[1];

      var data = [];
      var md = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var monthList = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      var dateFilter = new Date();
      var year = dateFilter.getFullYear() + "-01-01";


      //Used to make correction / transalting chooased data (slection from frontend)
      if (type === 'All')
        type = '';

      if (narration === 'All')
        narration = '';

      var filter = { where: { date: { gte: year }, type: { like: type }, narration: { like: narration } } };
      await api.all(path.operationalCost, filter).then(res => {
        res = res['rows'];
        for (var i in res) {
          var month = res[i].date;
          month = (month.charAt(5) + month.charAt(6));


          if (month === '01') md[0] += parseFloat(res[i].amount);
          else if (month === '02') md[1] += parseFloat(res[i].amount);
          else if (month === '03') md[2] += parseFloat(res[i].amount);
          else if (month === '04') md[3] += parseFloat(res[i].amount);
          else if (month === '05') md[4] += parseFloat(res[i].amount);
          else if (month === '06') md[5] += parseFloat(res[i].amount);
          else if (month === '07') md[6] += parseFloat(res[i].amount);
          else if (month === '08') md[7] += parseFloat(res[i].amount);
          else if (month === '09') md[8] += parseFloat(res[i].amount);
          else if (month === '10') md[9] += parseFloat(res[i].amount);
          else if (month === '11') md[10] += parseFloat(res[i].amount);
          else if (month === '12') md[11] += parseFloat(res[i].amount);
        }

        for (var k in md) {
          if (md[k] > 0)
            data.push({ month: monthList[k], cost: md[k]/1000000 });
        }
        commit("setOprationCostPerYear", data);
      });
    },

    async uploadOperations({ commit }, data) {
      // eslint-disable-next-line no-console
      // console.log(this.csvdata)

      return await api
        .create(data, path.operation)
        .then(() => {
          // eslint-disable-next-line no-console
          console.log("Success")

          return true;
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.log(err)

          return false;
        });
    },

    async fetchMachinesWithID({ commit }, id) {

    },


  },
};


