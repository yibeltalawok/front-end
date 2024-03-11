/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { api, path } from "@/api";
import { data } from "jquery";


export default {
    namespaced: true,
    state: {
        loadExistData: [],
        loadnewDataToInsert: [],
        loadAllDataUseingDate: [],
        afterreloadDate: [new Date().getFullYear() + "-01-01", new Date().toISOString().substr(0, 10)],
        lineListDistinict: [],
    },

    mutations: {
        setloadExistData(state, payload) {
            state.loadExistData = payload
        },
        setloadnewDataToInsert(state, payload) {
            state.loadnewDataToInsert = payload;
        },
        setloadAllDataUseingDate(state, payload) {
            state.loadAllDataUseingDate = payload;
        },
        setDateForRFTandDHU(state, payload) {
            state.afterreloadDate = payload;
        },
        setDistinictLineFromSingleEvalution(state, payload){
            state.lineListDistinict = payload;
        }
    },
    actions: {
        SOCKET_Singleevaluations_POST: async function ({ commit }, recievd) {
            var totalGarmentChecked = 0; // used to hold every state value
            var ftp = 0; //used to hold if state value equals to FTP
            var rft = 0; //used to hold (ftp*100)/totalGarmentChecked
            var dhu = 0; //used to hold (totalDefect*100)/totalGarmentChecked
            var totalDefect = 0; //used to hold total defect from single evalution model, for RFT and DHU model

            var date = recievd.date.toString().substr(0, 10);//date from single evalition new row inserted

            //get all execpt dhu data used in RFTanDHU model from sacnOrderStatus
            let res = await api.all(path.scannedOrders, { where: { date: { like: date } } });
            res = res['rows'];
            for (let i = 0; i < res.length; i++) {
                if (res[i].state === "FTP")
                    ftp += parseInt(res[i].to) - parseInt(res[i].from) + 1;
                totalGarmentChecked += parseInt(res[i].to) - parseInt(res[i].from) + 1;

                if (i === (res.length - 1))
                    rft = (ftp * 100) / totalGarmentChecked;
            }

            //get dhu from single evalution model
            res = await api.all(path.singleevaluations);
            for (let i = 0; i < res.length; i++) {
                if (res[i].date.toString().substr(0, 10) === date.toString())
                    totalDefect += parseFloat(res[i].total);

                if (i === (res.length - 1))
                    dhu = (totalDefect * 100) / totalGarmentChecked;
            }

            //check dhu and rft inserted or not in data vale
            var checkExist = 0;
            var id = '';
            await api.all(path.rftanddhu, { where: { date: date } }).then(res => {
                if (res.length > 0) {
                    checkExist = 1;
                    id = res[0].id;
                }
            });

            var create = { date: date, rtf: rft, dhu: dhu, totalGarmentChecked: totalGarmentChecked, totalDefect: totalDefect, firstTimePass: ftp };
            var update = { date: date, rtf: rft, dhu: dhu, totalGarmentChecked: totalGarmentChecked, totalDefect: totalDefect, firstTimePass: ftp, id: id };
            console.log(update);

            if (checkExist === 0)
                await api.create(create, path.rftanddhu);
            else
                await api.update(update, path.rftanddhu);
        },

        SOCKET_Rtfanddhu_POST: async function ({ commit }, data) {
            if (data.dhu > 20) {
                var insertedData = { date: data.date, title: "DHU status", type: "DHU", route: "companyDashboard", description: "DHU value more than 20!" };
                await api.create(insertedData, path.notifications);
            }//Notification.notify({ type: 'danger', title: "RFT and DHU", message: "DHU value greater than 20!" });

            var startDate = new Date().getFullYear() + "-01-01";
            var endDate = new Date().toISOString().substr(0, 10);

            await api.all(path.rftanddhu, { order: 'date ASC', where: { and: [{ date: { gte: startDate } }, { date: { lte: endDate } }] } }).then(res => {
                commit("setloadAllDataUseingDate", res);
                commit("setDateForRFTandDHU", [startDate, endDate]);
                // commit("setloadExistData", []);
                // commit("setloadnewDataToInsert", []);
            });
        },

        async getloadExistData({ commit }, date) {
            api.all(path.rftanddhu, {order: 'line ASC', where: { date: date } }).then(res => {
                commit("setloadExistData", res);
            });
        },

        async getloadnewDataToInsert({ commit }, date) {
            var data = [];
            
            let lineLIst = await api.all(path.getlineList);
            for (let f = 0; f < lineLIst.length; f++) {
                var totalGarmentChecked = 0; // used to hold every state value
                var ftp = 0; //used to hold if state value equals to FTP
                var rft = 0; //used to hold (ftp*100)/totalGarmentChecked
                var dhu = 0; //used to hold (totalDefect*100)/totalGarmentChecked
                var totalDefect = 0; //used to hold total defect from single evalution model, for RFT and DHU model
                
                let res = await api.all(path.singleevaluations, {include: 'ScannedOrderStatus' , where: {linenum: lineLIst[f].line}});
                for (let i = 0; i < res.length; i++) {
                    if (res[i].date.toString().substr(0, 10) === date.toString()){
                        totalDefect += parseFloat(res[i].total);

                        if (res[i].ScannedOrderStatus.state === "FTP")
                            ftp += parseInt(res[i].ScannedOrderStatus.to) - parseInt(res[i].ScannedOrderStatus.from) + 1;

                        totalGarmentChecked += parseInt(res[i].ScannedOrderStatus.to) - parseInt(res[i].ScannedOrderStatus.from) + 1;

                        if (i === (res.length - 1)){
                            rft = (ftp * 100) / totalGarmentChecked;
                            dhu = (totalDefect * 100) / totalGarmentChecked;
                        }
                    }
                }
                if(totalGarmentChecked === 0 && ftp === 0 && totalDefect === 0 && rft === 0 && dhu === 0){
                    //Don't push data
                }else
                    data.push({line:lineLIst[f].line,  totalGarmentChecked, ftp, totalDefect, rft, dhu });
            }
            commit("setloadnewDataToInsert", data);
        },

        async saveNewDataTorftanddhu({ commit }, data) {
            var date = data[(data.length-1)];

            for (let i = 0; i < data.length-1; i++) {
                var rft = data[i].rft;
                var dhu = data[i].dhu;
                var totalGarmentChecked = data[i].totalGarmentChecked;
                var firstTimePass = data[i].ftp;
                var totalDefect = data[i].totalDefect;
                var line = data[i].line;

                var checkExist = 0;
                var id = '';
                await api.all(path.rftanddhu, { where: { date: date , line: line} }).then(res => {
                    if (res.length > 0) {
                        checkExist = 1;
                        id = res[0].id;
                    }
                });

                var create = {line: line, date: date, rft: rft, dhu: dhu, totalGarmentChecked: totalGarmentChecked, totalDefect: totalDefect, ftp: firstTimePass };
                var update = {line: line, date: date, rft: rft, dhu: dhu, totalGarmentChecked: totalGarmentChecked, totalDefect: totalDefect, ftp: firstTimePass, id: id };

                if (checkExist === 0)
                    await api.create(create, path.rftanddhu);
                else
                    await api.update(update, path.rftanddhu);
            }
            commit(null, null)
        },

        async getloadAllDataUseingDate({ commit }, date) {
            var startDate = date.date[0].toString();
            var endDate = date.date[1].toString();
            var line = date.line;

            await api.all(path.rftanddhu, { order: 'date ASC', where: { and: [{ date: { gte: startDate } }, { date: { lte: endDate } }], line: line } }).then(res => {
                commit("setloadAllDataUseingDate", res);
            });
        },

        async getDistinictLineFromSingleEvalution({commit}){
            let lines = [];
            await api.all(path.getlineList).then(res=>{
                for (let i = 0; i < res.length; i++) {
                    lines.push(res[i].line);
                }
                commit("setDistinictLineFromSingleEvalution", lines);
            });
        }
    },
}
