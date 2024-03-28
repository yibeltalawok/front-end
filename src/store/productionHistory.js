/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { api, path, API_ROOT } from "@/api";

export default {
    namespaced: true,
    state: {
        productionHistory: 0,
        productionHistoryHistory: [],
        deleteResult: "",
        hourlyProductionReport: [],
        clothProducedByWHo: [],
        totalProduced: 0,
    },

    mutations: {
        setTotalProduced(state, payload) {
            state.totalProduced = payload;
        },
        setClothProducedByWHo(state, payload) {
            state.clothProducedByWHo = payload;
        },
        setProductionHistory(state, payload) {
            state.productionHistory = payload
        },
        setProductionHistoryHistory(state, payload) {
            state.productionHistoryHistory = payload
        },
        setDeleteSingleProductionHistory(state, payload) {
            state.deleteResult = payload;
        },
        setHourlyProductionReport(state, payload) {
            state.hourlyProductionReport = payload
        }
    },

    actions: {
        async getClothProducedByWHo({ commit }) {
            var today = new Date();
            var date = today.getDate();
            if (date < 10)
                date = "0" + date;
            var month = today.getMonth() + 1;
            if (month < 10)
                month = "0" + month;

            today = [today.getFullYear(), month, date].join('-');

            var data = [];
            var totalProduced = 0;
            var empList = [];
            var empIdDist = [];
            var empExist = 0;

            var filter = { include: ['Employee', 'ScannedOrderStatus'], where: { date: { like: today } } };
            await api.all(path.productionHistory, filter).then(res => {
                res = res['rows'];
                for (var i = 0; i < res.length; i++) {
                    var empListTemp = [];
                    var totalHolderIndex = 0;
                    //Distinict employee finder
                    for (var k = 0; k < empIdDist.length; k++) {
                        if (res[i].employeeId === empIdDist[k]) {
                            totalHolderIndex = k;
                            empExist = 1;
                            break;
                        } else empExist = 0;
                    }
                    var bundleQua = parseInt(res[i].ScannedOrderStatus.to) - parseInt(res[i].ScannedOrderStatus.from) + 1;
                    if (empExist === 0) {
                        empIdDist.push(res[i].employeeId);
                        var fullname = res[i].Employee.fullName;

                        empListTemp.push(fullname);
                        empListTemp.push(API_ROOT + "/containers/profilePictures/download/" + res[i].Employee.phoneNumber);
                        empListTemp.push(bundleQua);
                        empList.push(empListTemp);
                    } else {
                        empList[k][2] = parseInt(empList[k][2]) + bundleQua;
                    }

                }

                //Sorter by total made
                for (var e = 0; e < empList.length; e++) {
                    var temp = [];
                    for (var o = e; o < empList.length; o++) {
                        if (empList[e][2] < empList[o][2]) {
                            temp = empList[e];
                            empList[e] = empList[o];
                            empList[o] = temp;
                        }
                    }
                }

                //Top three finder
                for (var j = 0; j < empList.length; j++) {
                    data.push(empList[j]);
                    totalProduced += empList[j][2];
                    if (j === 2)
                        break;
                }

                commit("setTotalProduced", totalProduced);
                commit("setClothProducedByWHo", data);
            });
        },

        async getHourlyProductionReport({ commit }, val) {
            var filter = "&date=" + val[0] + "&hour=" + val[1];
            await api.all(path.getHourlyProductionReport, filter).then(data => {
                commit("setHourlyProductionReport", data);
            });
        },

        async getBundlleNumberById(bundleId) {
            var filter = { fields: ['bundleNo'], where: { id: bundleId } };
            var bunNo = await api.all(path.scannedOrders, filter);
            return bunNo[0].bundleNo;
        },

        async getProductionHistoryHistory({ commit }, date) {
            //fullname, order, bundle, startTime, endTime, line, operation, section
            console.log(date);
            var dataList = [];
            var filter = { include: ['Employee', 'ScannedOrderStatus', 'Job', 'Order', 'Operation'], where: { date: { like: date } } };
            await api.all(path.productionHistory, filter).then(res => {
                res = res['rows'];
                for (var i = 0; i < res.length; i++) {
                    //Used to create object displyed in the productionHistpry table
                    var fullname = res[i].Employee.fullName;
                    var orderDesc = res[i].Order.styleName + " (#" + res[i].Order.orderNumber + ")";
                    var bundleQua = parseInt(res[i].ScannedOrderStatus.to) - parseInt(res[i].ScannedOrderStatus.from) + 1;

                    var bundleNo = res[i].ScannedOrderStatus.bundleNo;

                    //Bellow algorithm used to convert float to timefromat
                    var from = res[i].from.toString();
                    if (from.charAt(1) === '.')
                        from = "0" + from.charAt(0) + ":" + from.charAt(2) + from.charAt(3);
                    else
                        from = from.charAt(0) + from.charAt(1) + ":" + from.charAt(3) + from.charAt(4);

                    var to = res[i].to.toString();
                    if (to.charAt(1) === '.')
                        to = "0" + to.charAt(0) + ":" + to.charAt(2) + to.charAt(3);
                    else
                        to = to.charAt(0) + to.charAt(1) + ":" + to.charAt(3) + to.charAt(4);


                    if (to.length === 4)
                        to += '0';
                    if (from.length === 4)
                        from += '0';

                    var lineBundle = res[i].Job.line;
                    var operation = res[i].Operation.operationName;
                    var section = res[i].Operation.section;
                    var id = res[i].id;

                    dataList.push({ fullname: fullname, order: orderDesc, bundleQua: bundleQua, bundle: bundleNo, startTime: from, endTime: to, line: lineBundle, operation: operation, section: section, id: id });
                }
                commit("setProductionHistoryHistory", dataList);
            });
        },


        async deleteSingleProductionHistory({ commit }, id) {
            await api.remove(id, path.productionHistory);
            commit("setDeleteSingleProductionHistory", id);
        },

        async processProductionHistory({ commit }, proHisData) {
            //"Product Operation History Exist!"
            var response = 0;
            var employee = proHisData.employeeId;
            var job = proHisData.jobId;
            var operation = proHisData.operationId;
            var order = proHisData.orderId;
            var scanOrder = proHisData.scannedOrderStatusId;

            var filter = { where: { employeeId: employee, jobId: job, operationId: operation, orderId: order, scannedOrderStatusId: scanOrder } };
            await api.all(path.productionHistory, filter).then(resp => {
                resp = resp['rows'];
                if (resp.length === 0) {
                    //"New product Operation History record successful!"
                    api.create(proHisData, path.productionHistory).then(() => {
                        commit("setProductionHistory", 1);
                    });
                } else
                    commit("setProductionHistory", response);
            });

        }
    }
}