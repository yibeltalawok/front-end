/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { api, path } from "@/api";
export default {
    namespaced: true,
    state: {
        historyData: [],
        bundleNumbers: [],
        bCSheets: [],
        scannedOrders: [],
        lineNums: [],
        dailyReports: [],
        garments: 0
    },
    mutations: {
        setBundleHistory(state, bundlehis){
            state.historyData = bundlehis; 
        },
        setBundleNumbers(state, bundleNos){
            state.bundleNumbers = bundleNos
        },
        setbCSheets(state, bCSheets){
            state.bCSheets = bCSheets
        },
        setBundles(state, bundles){
            state.scannedOrders = bundles
        },
        setLineNumbers(state, bndlHistories){
            state.lineNums = bndlHistories
        },
        setDailyReport(state, payload){
            state.dailyReports = payload
        },
        setGarmentQuantity(state, payload){
            state.garments = payload
        }
        
    },
    
    actions: {
        
        async postBundleHistory({commit}, data){
            // console.log(data);
            await api.create(data, path.bundleHistory)
        },

        async getBundleHistory({ commit }) {
            let filter = { include: ["ScannedOrderStatus"] }
            await api.all(path.bundleHistory, filter).then(res =>{
                // console.log(res)
                commit('setBundleHistory', res);
            })
            // console.log(his)
            
        },

        async getLineNumbers({commit}){
            let bndlHistories = [];
            await api.all(path.bundleHistory).then(res =>{
                for (let i = 0; i < res.length; i++) {
                    if(bndlHistories.indexOf(res[i].lineNumber) == -1){
                        bndlHistories.push(res[i].lineNumber)
                    }
                    
                }
                // console.log(bndlHistories)
                // sort the array for ordered display.
                bndlHistories = bndlHistories.sort(function(a, b){
                    return a-b
                });
                // console.log(bndlHistories)

                commit("setLineNumbers", bndlHistories)
            })

            
        },

        async getBCSheets({commit}, data){
            // console.log(data)
            let filter = {where: {'orderId': data}}
            let cuts = await api.all(path.laysheet, filter);
            let ct = cuts.rows
            // console.log(ct)
            let bCSheets = ct.map(x => {
                return {
                    id: x.id,
                    cutNo: x.cutNo
                };
            });

            commit('setbCSheets', bCSheets)
        },

        async getBundles({commit}, data){
            let filter = {where: {'bCSheetId': data}}
            let bndls = await api.all(path.scannedOrders, filter);
            let bndl = bndls.rows;
            let scannedOrders = bndl.map(x => {
                return {
                    id: x.id,
                    bundleNo: x.bundleNo
                };
            });

            commit('setBundles', scannedOrders)

        },

        async filterHistoryByOrder({commit}, data){
            let histories = [];
            let filter = {where: {'OrderId': data}}
            await api.all(path.scannedOrders, filter).then(res =>{
                let result = res.rows;
                // console.log(result)
                for (let i = 0; i < result.length; i++) {
                    let bundleid = result[i].id;
                    let filterHis = { include: ["ScannedOrderStatus"], where: {'scannedOrderStatusId': bundleid}}
                    api.all(path.bundleHistory, filterHis).then(rs =>{
                        
                        if(rs.length > 0){
                            for (let j = 0; j < rs.length; j++) {
                                // console.log(rs[j])
                                histories.push(rs[j]); // push every history into an array.
                            }
                            
                        }
                        
                    })
                }

                commit('setBundleHistory', histories);
            })
        },

        async filterByCutNumber({commit}, data){
            let histories = [];
            let filter = {where: {'bCSheetId': data}}
            await api.all(path.scannedOrders, filter).then(res =>{
                let result = res.rows;
                // console.log(result)
                for (let i = 0; i < result.length; i++) {
                    let bundleid = result[i].id;
                    let filterHis = {include: ["ScannedOrderStatus"], where: {'scannedOrderStatusId': bundleid}}
                    api.all(path.bundleHistory, filterHis).then(rs =>{
                        
                        if(rs.length > 0){
                            for (let j = 0; j < rs.length; j++) {
                                // console.log(rs[j])
                                histories.push(rs[j]); // push every history into an array.
                            }
                            
                        }
                        
                    })
                }

                commit('setBundleHistory', histories);
            })

        },

        async filterHistoryByDate({commit}, data){
            // console.log(data)
            let filter = {include: ["ScannedOrderStatus"], where :{date: {like: data}}}
            await api.all(path.bundleHistory, filter).then(res =>{
                commit('setBundleHistory', res);
            });
        },

        async filterByOrderDate({commit}, data){
            let histories = [];
            let filter = {where: {'OrderId': data[0]}}
            await api.all(path.scannedOrders, filter).then(res =>{
                let result = res.rows;
                // console.log(result)
                for (let i = 0; i < result.length; i++) {
                    let bundleid = result[i].id;
                    let filterHis = { include: ["ScannedOrderStatus"], where: { and:[{'scannedOrderStatusId': bundleid}, {date: {like: data[1]}}]}};
                    api.all(path.bundleHistory, filterHis).then(rs =>{
                        
                        if(rs.length > 0){
                            for (let j = 0; j < rs.length; j++) {
                                // console.log(rs[j])
                                histories.push(rs[j]); // push every history into an array.
                            }
                            
                        }
                        
                    })
                }
                // console.log(histories);

                commit('setBundleHistory', histories);
            })
        },

        async filterHistoryByBundleNum({commit}, data){
            let filter = {include: ["ScannedOrderStatus"], where: {'scannedOrderStatusId': data}}
            await api.all(path.bundleHistory, filter).then(res =>{
                // console.log(res)
                commit('setBundleHistory', res);
            });
            // console.log(data)
        },

        async filterHistoryByLine({commit}, data){
            // console.log(data)
            let filter = {include: ["ScannedOrderStatus"], where: {'lineNumber': data}}
            await api.all(path.bundleHistory, filter).then(res =>{
                console.log(res);
                commit('setBundleHistory', res);
            });
        },

        async getBundleNumbers({commit}){
            var bundlenums = [];
            await api.all(path.scannedOrders).then(res =>{
                var result = res.rows;
                
                for (let i = 0; i < result.length; i++) {
                    bundlenums.push(result[i].bundleNo);
                }

                // console.log(bundlenums);
                commit('setBundleNumbers', bundlenums)
            });
            
        },
        async fetchReportByFirstDate({commit}, data){
            let filter = {include: ["ScannedOrderStatus"], where: {date: {like: data}}}
            await api.all(path.bundleHistory, filter).then(res =>{
                // console.log(res)
                commit('setDailyReport', res);
            })
        },
        async fetchDailyReport({commit}, data){
            // console.log(data)
            let filter = { include: ['ScannedOrderStatus'], where: { and: [{ date: { gte: data[0] } }, { date: { lte: data[1] } }] } };
            await api.all(path.bundleHistory, filter).then(res =>{
                commit('setDailyReport', res);
            })
        },
        async fetchGarmentQuantity({commit}, date){
            
            // let filter = {where :{date: '2021-04-06'}}
            await api.all(path.garmentsByDate+"?date="+date ).then(res =>{
                // console.log(res)
                commit('setGarmentQuantity', res);
            })
    
        },
        async fetchGarmentByLine({commit}, data){
            await api.all(path.garmentsByLine+"?date="+data[0]+"&lineNumber="+data[1]).then(res =>{
                console.log(res)
                commit('setGarmentQuantity', res);
            })
        }

        
    }

        
    

}
