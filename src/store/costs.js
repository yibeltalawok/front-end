/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { api, path } from "@/api";


export default {
    namespaced: true,
    state: {
        lineChart: {},
        opcosts: [],
        opcostscount: 0,
        pieChart: {},
        oplistloadding: false,
        years: [],
        samLineChart: {},
        samPieChart: {},
        samYears: []
    },

    mutations: {

        setCostDashboard(state, payload) {
            state.lineChart = payload[0]
            state.pieChart = payload[1]
            state.years = payload[2]
        },
        setCostPerSamDashboard(state, payload) {
            state.samLineChart = payload[0]
            state.samPieChart = payload[1]
            state.samYears = payload[2]
        },

        setOpCosts(state, payload){
            state.opcosts = payload.rows
            state.opcostscount = payload.count
        },

        setOpListLoadding(state, payload){
            state.oplistloadding = payload
        }


    },
    actions: {

       async getOpCosts({commit}, filter){
           await api.all(path.operationalCost, filter)
           .then( res => {
            commit("setOpCosts", res)
           })
           .catch( e => {

           })
       },
        async getCostDashboard({ commit }, year) {
            await api.create({ year: year }, path.getCostPerMinuteDashboard,).then(result => {
                commit('setCostDashboard', result)
            })
        },
        async getPerSamDashboard({ commit }, year) {
            await api.create({ year: year }, path.getCostPerSamDashboard,).then(result => {
                commit('setCostPerSamDashboard', result)
            })
        },

        async uploadOperations({ commit }, data) {
            // eslint-disable-next-line no-console
            // console.log(this.csvdata)

            return await api
                .create(data, path.operationalCost)
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
    },
};


