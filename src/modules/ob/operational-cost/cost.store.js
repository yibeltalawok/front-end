/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { api, path } from "@/api";
import { rest } from "lodash";
export default {
    namespaced: true,
    state: {
        totalAmount: '',
        totalMinutes: 0,
        totalCost: '',
        totalCostMin:'',
        samHistories: [],
        sams: '',
        cpsamhistory: [],
        cpsamId: '',
        costPerMins: [],
        costPMdialog: [],
        costPerMinId: '',
        cpms: '',
        currentMonthCost: 0,
        prevMonthCost: 0,
        currentYearCost: 0,
        prevYearCost: 0,
    },
    mutations: {
        setTotalMinProduced(state, totalmins){
            state.totalMinutes = totalmins;
        },
        // setTotalAmount(state, totalamount){
        //     state.totalAmount = totalamount;
        // },
        setTotalCost(state, totalcost){
            state.totalCost = totalcost;
        },

        setCostForMin(state, payload){
            state.totalCostMin = payload;
        },

        setCostPerSamHistory(state, payload){
            state.samHistories = payload
        },
        setSams(state, payload){
            state.sams = payload;
        },
        setCPSAM(state, payload){
            state.cpsamhistory = payload;
        },
        setCPSamID(state, payload){
            state.cpsamId = payload;
        },
        setCostPerMin(state, payload){
            state.costPerMins = payload
        },
        setCostPerMinDialog(state, payload){
            state.costPMdialog = payload
        },
        setCPMId(state, payload){
            state.costPerMinId = payload;
        },
        setCPMforChart(state, payload){
            state.cpms = payload;
        },
        setCurrentMonthCost(state, payload){
            state.currentMonthCost = payload;
        },
        setPrevMonthCost(state, payload){
            state.prevMonthCost = payload;
        },
        setCurrentYearCost(state, payload){
            state.currentYearCost = payload;
        },
        setPrevYearCost(state, payload){
            state.prevYearCost = payload;
        }
    },
    
    actions: {

        async getTotalMinsProduced({commit}, data){
            let date = data;
            let year = data.substr(0, 4);
            let month = data.substr(5, 7);
            // let totalamount = 0;
            let totalmin = 0;
            // let filter = {where: {date: {like: data}}};
            await api.create({year, month}, "/CostPerSamHistories/getCostPerSamWithDateRange").then(res =>{
                // console.log(res);
               
                for (let i = 0; i < res.length; i++) { // for each operation bulletind id
                    // console.log(res[i])
                    
                    let opbulid = res[i];
                    api.create({opbulid, date}, "/OperationBulletins/totalMinutesProduced").then(rs =>{
                        // console.log(rs)
                        
                        for (let j = 0; j < rs.length; j++) {
                            // console.log("Amount: "+rs[j].totalAmountDone)
                            // totalamount += rs[j].totalAmountDone;
                            totalmin += rs[j].minutesProduced;
                            // console.log("TOTAL: "+ total)

                            if(i === (res.length-1)){
                                // commit('setTotalAmount', totalamount);
                                // console.log("FINAL TOTAL: " + totalamount);
                                commit('setTotalMinProduced', totalmin);
                                // console.log("FINAL TOTAL MIN: " + totalmin);
                                
                            }
                        }
                        
                    })
                }
  
            });
        },

        async getOperationCost({commit}, data){
            // console.log(data);
            let fromdate = data+"-01";
            let todate = data+"-31";

            console.log("FROM: "+fromdate);
            console.log("TO: "+todate);

            await api.create({fromdate, todate}, "/OperationalCosts/getOperationCostSummary").then(res =>{
               
                let totalcost = res.totalCost;
                // console.log("TOTAL COST: "+totalcost);
                commit('setTotalCost', totalcost);
            })
        },

        async getCostForCostPerMin({commit}, data){
            let fromdate = data+"-01";
            let todate = data+"-31";

            console.log("FROM: "+fromdate);
            console.log("TO: "+todate);

            await api.create({fromdate, todate}, "/OperationalCosts/getOperationCostSummary").then(res =>{
               
                let totalcost = res.totalCost;
                // console.log("TOTAL COST: "+totalcost);
                commit('setCostForMin', totalcost);
            })
        },

        async createCostPerSamHistory({commit}, data){
            await api.create(data, path.costPerSam).then(res =>{

            })
            .catch(e => {
                console.log("Unable to post to cost-per-sam-history")
            })
        },

        async getCostPerSamHistory({commit}){
            await api.all(path.costPerSam).then(res =>{
                let data = res.rows;
                // console.log(data);
                commit('setCostPerSamHistory', data);
            })
        },

        async fetchSamHistoryByDate({commit}, data){
            let filter = {where: {and: [{month: data[0]}, {year: data[1]}]}};
            await api.all(path.costPerSam, filter).then(res =>{
                let data = res.rows;
                console.log(data);
                commit('setCostPerSamHistory', data);

            })
        },
        async fetchCostPerSams({commit}, data){
            // console.log(data);
            let filter = {where: {and: [{month: data[0]}, {year: data[1]}]}};
            await api.all(path.costPerSam, filter).then(res =>{
                let data = res.rows;
                let sams = 0;
                for (let i = 0; i < data.length; i++) {
                    // console.log("CPSM: "+data[i].costPerSam)
                    sams += parseFloat(data[i].costPerSam);
                    
                }
                console.log("CSM TOTAL: "+sams)
                commit('setSams', sams);
            })
        },

        async getCPSamHistoryByDate({commit}, data){
            let filter = {where: {and: [{month: data[0]}, {year: data[1]}]}};
            await api.all(path.costPerSam, filter).then(res =>{
                let data = res.rows;
                // console.log(data);
                commit('setCPSAM', data);

            })
        },
        
        async updateCostPerSamHistory({commit}, data){
            await api.update(data, path.costPerSam).then(() =>{
                // console.log("Updated Succesfully.")
            })
            .catch(e => {
                console.log("Unable to post to cost-per-sam-history")
            })
            
        },
        async getIdOfCPSamHistory({commit}, data){
            let filter = {where: {and: [{month: data[0]}, {year: data[1]}]}};
            await api.all(path.costPerSam, filter).then(res =>{
                let data = res.rows;
                // console.log("ID: "+data[0].id);
                commit('setCPSamID', data[0].id);

            })
        },

        async createCostPerMinute({commit}, data){
            await api.create(data, path.costPerMinute).then(res =>{

            })
            .catch(e => {
                console.log("Unable to post to cost-per-minute")
            })
        },

        async getCostPerMinutes({commit}){
            await api.all(path.costPerMinute).then(res =>{
                // let data = res;
                // console.log(res);
                commit('setCostPerMin', res);
            })
        },

        async getCostPerMinsByDate({commit}, data){
            // console.log(data);
            let filter = {where: {date: {like: data}}};
            await api.all(path.costPerMinute, filter).then(res =>{
                // console.log(res);
                commit('setCostPerMinDialog', res);
            })
        },

        async getIdOfCostPerMin({commit}, data){
            let filter = {where: {date: {like: data}}};
            await api.all(path.costPerMinute, filter).then(res =>{
                // console.log(res[0].id);
                commit('setCPMId', res[0].id);
            })
        },

        async updateCostPerMinute({commit}, data){
            await api.update(data, path.costPerMinute).then(() =>{
                // console.log("Updated Succesfully.")
            })
            .catch(e => {
                console.log("Unable to post to cost-per-sam-history")
            })
        },

        async fetchCPMForChart({commit}, data){
            let filter = {where: {date: {like: data}}};
            await api.all(path.costPerMinute, filter).then(res =>{
                // console.log("COST PER MINUTE: "+res[0].costPerMinute)
                commit('setCPMforChart', res[0].costPerMinute);
                
            })
            .catch(e => {
                commit('setCPMforChart', 0)
            })
        },

        async fetchCurrentMonthCost({commit}, data){
            // console.log("THIS MONTH: "+data)
            let filter = {where: {date: {like: data}}};
            await api.all(path.costPerMinute, filter).then(res =>{
                // console.log(res[0].costPerMonth);
                commit('setCurrentMonthCost', res[0].costPerMonth)
            })

        },

        async fetchPrevMonthCost({commit}, data){
            // console.log("Prev MONTH: "+data)
            let filter = {where: {date: {like: data}}};
            await api.all(path.costPerMinute, filter).then(rs =>{
                // console.log("PREV RES: "+rs);
                if(rs.length ==0){
                    commit('setPrevMonthCost', 0)
                }
                else{
                    commit('setPrevMonthCost', rs[0].costPerMonth);
                }
                
            })

        },

        async fetCurrentYearCost({commit}, data){
            let filter = {where: {date: {like: data}}};
            await api.all(path.costPerMinute, filter).then(res =>{
                let currentYear = 0;
                for (let i = 0; i < res.length; i++) {
                    currentYear += res[i].costPerMonth;
                    if(i === res.length -1){
                        commit('setCurrentYearCost', currentYear)
                    }
                }
                // console.log("CURRENT: "+currentYear);
            })
        },
        async fetchPrevYearCost({commit}, data){
            // console.log("Prev Year: "+data);
            let filter = {where: {date: {like: data}}};
            await api.all(path.costPerMinute, filter).then(res =>{
                let prevYear = 0;
                for (let i = 0; i < res.length; i++) {
                    prevYear += res[i].costPerMonth;
                    if(i === (res.length - 1)){
                        commit('setPrevYearCost', prevYear);
                    }
                }
            })
        }

    }

}
