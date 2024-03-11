/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { api, path } from "@/api";
import Vue from "vue";
import vuetify from "../plugins/vuetify";

export default {
    namespaced: true,
    state: {
        loadEvalutionsHistoryData: [],
        ordersList: [],
        bunddlesList: [],
        linesList: [],
        singleOrderStausData: [],
        treechartdata: [],
        bundles: [],
        updatedStatus: '',
        order: [],
        orders: [],
        ordersOprationHistory: [],
        bundlesOprationHistory: [],
        employeesOprationHistory: [],
        operationDescriptionList: [],
        colors: [],
        sizes: [],
        bundlesInOrder: [],
        orderData: [],
        totalCuts: '',
        actualOrders: '',
        cutNumbers: [],
        cuttedClrsArr: [],
        cuttedQtyArr: [],
        actualClrsArr: [],
        actualQtyArray: [],
        orderNumbers: []
    },
    mutations: {
        setLoadEvalutionsHistory(state, payload) {
            state.loadEvalutionsHistoryData = payload;
        },
        setOrdersList(state, payload) {
            state.ordersList = payload;
        },
        setBunddlesList(state, payload) {
            state.bunddlesList = payload;
        },
        setLinesList(state, payload) {
            state.linesList = payload;
        },
        setEmployees(state, payload) {
            state.employeesOprationHistory = payload;
        },
        setOperationDescription(state, payload) {
            state.operationDescriptionList = payload;
        },
        setBundles(state, payload) {
            state.bundlesOprationHistory = payload;
        },
        setOrdersOpration(state, payload) {
            state.ordersOprationHistory = payload;
        },

        setOrderstatus(state, payload) {
            state.orderStatusData = payload
        },
        setSingleOrderStaus(state, payload) {
            state.singleOrderStausData = payload
        },
        setBundlesInOrder(state, payload) {
            state.bundlesInOrder = payload
        },
        setOrder(state, ord) {
            state.orderData = ord
        },
        setOrders(state, orders) {
            state.orders = orders
        },
        setTreeChartData(state, payload) {
            state.treechartdata = payload
        },
        setBundleData(state, payload) {
            state.bundles = payload
        },
        pushBundleData(state, payload) {
            state.bundles.push(payload);
        },
        updateBndlStatus(state, payload) {
            state.updatedStatus = payload;
        },
        setColor(state, payload) {
            state.colors = payload
        },
        setSize(state, payload) {
            state.sizes = payload
        },
        setCutQty(state, payload) {
            state.totalCuts = payload
        },
        setActualOrder(state, totalOrder) {
            state.actualOrders = totalOrder
        },
        setCutNumber(state, cutnum) {
            state.cutNumbers = cutnum
        },
        setCuttedClrsArray(state, clrArr) {
            state.cuttedClrsArr = clrArr
        },
        setCuttedQtyArr(state, qtyArr) {
            state.cuttedQtyArr = qtyArr
        },
        setActualClrsArr(state, actualClrArr) {
            state.actualClrsArr = actualClrArr
        },
        setActualQtyArr(state, actualQtyArr) {
            state.actualQtyArray = actualQtyArr
        },
        setOrderNumber(state, ordernums) {
            state.orderNumbers = ordernums
        }
    },
    //orderStatusTemu
    actions: {
        //Get list data based on Order, bunddle number and line from single evalution model
        async loadEvalutionsHistory({ commit }, values) {
            var orderId = values.orderId;
            var bunddleId = values.bunddleId;
            var lineNum = values.lineNum;

            api.all(path.loadEvalutionsHistory + "?orderId=" + orderId + "&bunddleId=" + bunddleId + "&lineNum=" + lineNum).then(res => {
                commit("setLoadEvalutionsHistory", res);
            });
        },
        //Get list of orders list in evalution history
        async getOrdersList({ commit }) {
            api.all(path.simpleEvaluationDistinictOrderList).then(res => {
                commit("setOrdersList", res);
            });
        },
        //Get list of bunddle list in evalution history inside single order
        async getBunddlesList({ commit }, orderId) {
            api.all(path.simpleEvaluationDistinictBunddleList + "?orderId=" + orderId).then(res => {
                commit("setBunddlesList", res);
            });
        },
        //Get list of lines in evalution history inside single order/bunddle
        async getLinesList({ commit }, bunddleId) {
            api.all(path.simpleEvaluationDistinictLineList + "?bunddleId=" + bunddleId).then(res => {
                commit("setLinesList", res);
            });
        },


        async loadSingleOrderStatus({ commit }, OrderId) {
            OrderId = "?OrderId=" + OrderId;
            await api.all(path.loadSingleOrderStatus + OrderId).then(resp => {
                commit("setSingleOrderStaus", resp)
            });
        },
        async bundlesStatusInOrder({ commit }, OrderId) {
            OrderId = "?OrderId=" + OrderId;
            await api.all(path.bundlesStatusInOrder + OrderId).then(resp => {
                commit("setBundlesInOrder", resp)
            });
        },

        async getOrder({ commit }) {
            let filter = { include: ["Customer", "product"] }
            await api
                .all(path.order, filter)
                .then(res => {
                    //console.log(res);
                    commit('setOrder', res.rows)
                });
        },

        async getOperationDescription({ commit }, jobId) {
            let filter = { include: ['operation'], where: { id: jobId } }
            let op = (await api.all(path.job, filter)).rows;
            let operationDesc = op.map((x) => {
                return {
                    opration: x.operation.operationName,
                    section: x.operation.section,
                    line: x.line,
                    outputPerHourL: x.operation.outputPerHour,
                    progress: x.progress,
                    amountDone: x.amountDone,
                    operationId: x.operationId,
                    employeeId: x.employeeId
                };
            });
            commit("setOperationDescription", operationDesc)
        },

        async getEmployees({ commit }, date) {
            let filter = { include: ['employee'], where: { date: date } }
            let pep = (await api.all(path.job, filter)).rows;
            let employes = pep.map((x) => {
                return {
                    id: x.id,
                    fullname: x.employee.fullName,
                };
            });
            commit("setEmployees", employes)
        },

        async getBundles({ commit }, orderId) {
            let filter = { where: { OrderId: orderId } };
            let bundle = (await api.all(path.scannedOrders, filter)).rows;

            let bundles = bundle.map((x) => {
                return {
                    id: x.id,
                    bundleDescription: x.bundleNo,
                };
            });
            commit("setBundles", bundles)
        },

        async getOrdersOpration({ commit }) {
            let ord = (await api.all(path.order)).rows;
            let orders = ord.map((x) => {
                return {
                    id: x.id,
                    orderDescription: x.styleName + " (#" + x.orderNumber + ")",
                };
            });

            commit("setOrdersOpration", orders)
        },

        async getOrders({ commit }) {
            let ord = (await api.all(path.order)).rows;

            let orders = ord.map(x => {
                return {
                    id: x.id,
                    orderNumber: x.orderNumber
                };
            });

            commit("setOrders", orders)

        },

        async fetchTreeChartData({ commit }, data) {
            try {
                const res = await api
                    .create({ orderId: data }, path.getBcSheets)
                    .then(res => {
                        // console.log(res);
                        commit('setTreeChartData', res)
                    });
                // console.log(data);
            }

            catch (e) {
                console.log("Unable to fetch laysheet data")
                return null
            }
        },

        async fetchBundleData({ commit }, data) {
            try {
                var query = { where: { 'OrderId': data } }
                const res = await api
                    .all("/Orders/" + data + "/ScannedOrderStatus", query)
                    .then(res => {
                        // console.log(res)
                        commit('setBundleData', res)
                    });
            }
            catch (error) {
                console.log("Unable to fetch bundle data")
                return null
            }
        },

        async fetchByTypeandOrderId({ commit }, data) {
            try {
                var query = { where: { 'OrderId': data[1], 'type': data[0] } }

                const res = await api
                    .all("/Orders/" + data[1] + "/ScannedOrderStatus", query)
                    .then(res => {
                        commit('setBundleData', res)
                    });
            } catch (error) {
                console.log("Unable to fetch data")
                return null
            }
        },

        async updateBundleStatus({ commit }, data) {
            try {
                await api
                    .update({ id: data[0], type: data[1] }, path.scannedOrders)
                    .then(res => {
                        // console.log("successfully updated.")
                        commit('updateBndlStatus', res.type)
                    })

            } catch (e) {
                console.log("unable to update the data")
            }

        },

        async fetchColorData({ commit }, data) {
            try {
                var query = { where: { 'id': data } }
                await api
                    .all("/Orders/" + data, query)
                    .then(res => {
                        var color = []
                        var data = res.data
                        for (let i = 0; i < 1; i++) {
                            var colors = data[i].colors
                            // console.log(colors)
                            for (let j = 0; j < colors.length; j++) {
                                color.push(colors[j].color)
                            }
                        }

                        // console.log(color)

                        commit('setColor', color)
                    });

            } catch (error) {
                // console.log("Error")
                return null
            }
        },
        async fetchSizeData({ commit }, data) {
            try {
                var query = { where: { 'id': data } }
                await api
                    .all("/Orders/" + data, query)
                    .then(res => {
                        var size = []
                        var data = res.data
                        // console.log(data)
                        for (let i = 0; i < data.length; i++) {
                            size.push(data[i].size)

                        }


                        commit('setSize', size)
                    });

            } catch (error) {
                // console.log("Error")
                return null
            }
        },

        async filterByProcessandColor({ commit }, data) {
            try {
                var query = { where: { 'OrderId': data[0], 'type': data[1], 'color': data[2] } }

                await api
                    .all("/Orders/" + data[0] + "/ScannedOrderStatus", query)
                    .then(res => {
                        commit('setBundleData', res)
                    })
            } catch (error) {
                console.log("Unable to fetch data")
                return null
            }
        },

        async filterByProcessandSize({ commit }, data) {
            try {
                var query = { where: { 'OrderId': data[0], 'type': data[1], 'label': data[2] } }

                await api
                    .all("/Orders/" + data[0] + "/ScannedOrderStatus", query)
                    .then(res => {
                        commit('setBundleData', res)
                    })
            } catch (error) {
                console.log("Unable to fetch data")
                return null
            }
        },

        async filterByColorandSize({ commit }, data) {
            try {
                var query = { where: { 'OrderId': data[0], 'color': data[1], 'label': data[2] } }

                await api
                    .all("/Orders/" + data[0] + "/ScannedOrderStatus", query)
                    .then(res => {
                        commit('setBundleData', res)
                    })
            } catch (error) {
                console.log("Unable to fetch data")
                return null
            }
        },

        async filterByColor({ commit }, data) {
            try {
                var query = { where: { 'OrderId': data[0], 'color': data[1] } }

                await api
                    .all("/Orders/" + data[0] + "/ScannedOrderStatus", query)
                    .then(res => {
                        commit('setBundleData', res)
                    })
            } catch (error) {
                console.log("Unable to fetch data")
                return null
            }
        },

        async filterBySize({ commit }, data) {
            try {
                var query = { where: { 'OrderId': data[0], 'label': data[1] } }
                await api
                    .all("/Orders/" + data[0] + "/ScannedOrderStatus", query)
                    .then(res => {
                        commit('setBundleData', res)
                    })
            } catch (error) {
                console.log("Unable to fetch data")
                return null
            }
        },

        async filterByAll({ commit }, data) {
            try {
                var query = { where: { 'OrderId': data[0], 'type': data[1], 'color': data[2], 'label': data[3] } }

                await api
                    .all("/Orders/" + data[0] + "/ScannedOrderStatus", query)
                    .then(res => {
                        // console.log(res)
                        commit('setBundleData', res)
                    })
            } catch (error) {
                console.log("Unable to fetch data")
                return null
            }
        },

        // fetch the total quantity of cuts made under a given order
        async getCutData({ commit }, data) {
            var query = { where: { 'orderId': data } }
            await api.all("/Orders/" + data + "/bCSheets", query).then(res => {
                var cutTotal = 0;
                for (let i = 0; i < res.length; i++) {
                    var clrs = res[i].colors
                    for (let j = 0; j < clrs.length; j++) {
                        var size = clrs[j].sizes
                        for (let k = 0; k < size.length; k++) {
                            cutTotal += size[k].qty
                        }
                    }
                }
                commit('setCutQty', cutTotal)
            })
        },

        // get the actual order quantity of an order.
        async getActualOrders({ commit }, data) {
            var actualClrArr = [];
            var actualQtyArr = [];
            var query = { where: { 'id': data } }
            await api.get(data, "/Orders/", query).then(res => {
                var totalOrder = 0;
                var data = res.data
                // console.log(data)
                for (let i = 0; i < data.length; i++) {
                    totalOrder += data[i].total
                    var clrs = data[i].colors
                    // console.log(clrs)
                    for (let j = 0; j < clrs.length; j++) {
                        // var val = clrs[j].value
                        // var clr = clrs[j].color
                        // console.log(clr)
                        // console.log(val)

                        if (actualClrArr.indexOf(clrs[j].color) == -1) { // if it is not in the actualClrArr[]
                            actualClrArr.push(clrs[j].color)
                            actualQtyArr.push(clrs[j].value)
                        }
                        else {
                            for (let k = 0; k < actualClrArr.length; k++) {
                                if (actualClrArr[k] == clrs[j].color) {
                                    actualQtyArr[k] += clrs[j].value
                                }
                            }
                        }


                    }
                }

                console.log(actualClrArr)
                console.log(actualQtyArr)

                commit('setActualOrder', totalOrder)
                Vue.nextTick(function () {
                    commit('setActualClrsArr', actualClrArr)
                })
                Vue.nextTick(function () {
                    commit('setActualQtyArr', actualQtyArr)
                })


            })
        },

        // get the cut quantity of a color (if cut already made)
        async getCutQtyofColor({ commit }, data) {
            var clrArr = [];
            var qtyArr = [];
            var query = { where: { 'orderId': data } }
            await api.all("/Orders/" + data + "/bCSheets", query).then(res => {
                // console.log(res)
                for (let i = 0; i < res.length; i++) {
                    var clrs = res[i].colors
                    // console.log(clrs)
                    for (let j = 0; j < clrs.length; j++) {

                        var sizs = clrs[j].sizes
                        // console.log(sizs)

                        // If a color is not in the clrArr[]
                        if (clrArr.indexOf(clrs[j].color) == -1) {
                            // the current color is not in the array, so push it to the array
                            clrArr.push(clrs[j].color) // INDIVIDUAL COLOR

                            // get the qty inside the sizes
                            var qtybyclr = 0;
                            for (let k = 0; k < sizs.length; k++) {
                                qtybyclr += sizs[k].qty
                            }

                            // console.log(qtybyclr)

                            qtyArr.push(qtybyclr)

                        }

                        else {
                            // get the quantity under this color
                            var qtyofClr = 0;
                            for (let k = 0; k < sizs.length; k++) {
                                qtyofClr += sizs[k].qty
                            }

                            // console.log(qtyofClr)

                            // get the index of that color in the clrArr[]
                            for (let k = 0; k < clrArr.length; k++) {
                                if (clrArr[k] == clrs[j].color) {
                                    // console.log(clrArr[k] + " is the same as " + clrs[j].color)
                                    qtyArr[k] += qtyofClr
                                }
                            }
                        }

                    }
                }

                // console.log(clrArr)
                // console.log(qtyArr)

                commit('setCuttedClrsArray', clrArr)
                Vue.nextTick(function () {
                    commit('setCuttedQtyArr', qtyArr)
                })


            })
        },

        // fetch all the order numbers already registered
        async getOrderNumbers({ commit }) {
            let order = (await api.all(path.order)).rows
            var ordernums = [];
            for (let i = 0; i < order.length; i++) {
                ordernums.push(order[i].orderNumber)
            }
            // console.log(ordernums)
            commit("setOrderNumber", ordernums)
        }
    }
}
