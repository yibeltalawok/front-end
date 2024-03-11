/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint no-param-reassign:0 */
import { api, path } from "@/api";

export default {
    namespaced: true,
    state: {
        bndls: [],
        operations: [],
        items: [],
        cards: [],
        orders: [],
        stylesList: []
    },

    mutations: {
        getStyle(state, bundls) {
            state.bndls = bundls
        },
        setOperation(state, operations) {
            state.operations = operations
        },
        setTkts(state, tkts) {
            state.cards = tkts
        },
        setEvaluations(state, payload) {
            state.stylesList = payload
        },
        setOrders(state, order) {
            state.orders = order
        }
    },
    actions: {

        async setStyle({ commit }) {
            let orderFilter = {
                include: ["order"]
            };
            let bndls = (await api.all(path.laysheet, orderFilter)).rows.map(x => {
                return {
                    id: x.id,
                    title:
                        "Cut No(" +
                        x.cutNo +
                        ") " +
                        x.order.styleName +
                        "(" +
                        x.order.styleNumber +
                        ")" +
                        ", " +
                        x.order.customer,
                    parts: x.parts,
                    qty: x.qty,
                    sr: x.sr,
                    styleName: x.order.styleName,
                    orderNumber: x.order.orderNumber,
                    orderId: x.orderId,
                    cutNo: x.cutNo,
                    noOfBundle: x.noOfBundle,
                    bQty: x.bQty,
                    styleNo: x.order.styleNumber,
                    buyer: x.order.customer,
                    design: x.order.design
                };
            });
            // (await api.all(path.laysheet, orderFilter)).rows.map(x => {
            //     return {
            //         id: x.id,
            //         title:
            //             x.order.styleName +
            //             "(" +
            //             x.order.styleNumber +
            //             ")" +
            //             ", " +
            //             x.order.customer,
            //         parts: x.parts,
            //         sr: x.sr,
            //         styleName: x.order.styleName,
            //         orderNumber: x.order.orderNumber,
            //         orderId: x.orderId,
            //         cutNo: x.cutNo,
            //         noOfBundle: x.noOfBundle,
            //         bQty: x.bQty,
            //         styleNo: x.order.styleNumber,
            //         buyer: x.order.customer,
            //         design: x.order.design
            //     };
            // });
            commit("getStyle", bndls)
        },
        async getOperation({ commit, dispatch }, item) {

            let filter = {
                where: {
                    orderId: item.orderId
                }
            };
            let oprBltn = [];
            oprBltn = (await api.all(path.oprBltn, filter)).rows;
            if (oprBltn.length > 0) {
                let styleId = oprBltn[0].id;

                let filter = {
                    where: {
                        oprBltnId: styleId
                    }
                };
                let operations
                operations = (await api.all(path.operation, filter)).rows.map(
                    x => x.operationName
                );

                if (operations.length > 0) {
                    let temp
                    await api
                        .create({ laysheetId: item.id }, path.getLaysheet)
                        .then(result => {
                            temp = result;
                            let tempTkts = [];
                            let tkts = result;
                            for (let i = 0; i < tkts.length; i++) {
                                for (let k = 0; k < tkts[i].No.length; k++) {
                                    tempTkts.push({
                                        id: item.id,
                                        tkt: tkts[i].val,
                                        label: tkts[i].label,
                                        color: tkts[i].color,
                                        bundle: tkts[i].No[k]
                                    });
                                }
                            }
                            tkts = [];
                            for (let b = 0; b < tempTkts.length; b++) {
                                tkts.push({
                                    id: item.id,
                                    color: tempTkts[b].color,
                                    label: tempTkts[b].label,
                                    tkt: tempTkts[b].tkt,
                                    bundle: tempTkts[b].bundle
                                });
                            }
                            let cards = []
                            for (let i = 0; i < tkts.length; i++) {
                                for (let j = 0; j < operations.length; j++) {
                                    cards.push({
                                        id: tkts[i].id,
                                        color: tkts[i].color,
                                        partName: operations[j],
                                        size: tkts[i].label,
                                        bundleNo: tkts[i].bundle.count,
                                        srFrom: tkts[i].bundle.from,
                                        srTo: tkts[i].bundle.to,
                                        qr: [
                                            "pr",
                                            tkts[i].color,
                                            operations[j],
                                            tkts[i].label,
                                            tkts[i].bundle.count,
                                            tkts[i].bundle.from,
                                            tkts[i].bundle.to,
                                            item.cutNo,
                                            "production"
                                        ]
                                    });
                                }
                            }

                            commit("setTkts", cards)
                        });
                    // dispatch('getBundleTkts', { item: item, op: operations })
                }
                else {
                    commit("setOperation", [])
                    commit("setTkts", [])
                }
                // commit(operations)
            } else {

                commit("setOperation", [])
                commit("setTkts", [])
            }
        },
        async getBundleTkts({ dispatch }, data) {
            let temp
            await api
                .create({ laysheetId: data.item.id }, path.getLaysheet)
                .then(result => {
                    temp = result;
                });
            dispatch('getnerateLaysheet', { operation: data.op, items: temp, item: data.item })


        },

        async fetchAllStylesWithoutid({ commit }) {
            try {
                const resp = await api.all(path.oprBltn, { include: "order" })
                commit('setEvaluations', resp.rows)
                return resp
            }
            catch (e) {
                console.log("failed to fetch defects")
                return null
            }
        },

        getnerateLaysheet({ commit }, data) {
            let tempTkts = [];
            let tkts = data.items;
            for (let i = 0; i < tkts.length; i++) {
                for (let k = 0; k < tkts[i].No.length; k++) {
                    tempTkts.push({
                        id: data.item.id,
                        tkt: tkts[i].val,
                        label: tkts[i].label,
                        color: tkts[i].color,
                        bundle: tkts[i].No[k]
                    });
                }
            }
            tkts = [];
            for (let b = 0; b < tempTkts.length; b++) {
                tkts.push({
                    id: data.item.id,
                    color: tempTkts[b].color,
                    label: tempTkts[b].label,
                    tkt: tempTkts[b].tkt,
                    bundle: tempTkts[b].bundle
                });
            }
            let cards = []
            for (let i = 0; i < tkts.length; i++) {
                for (let j = 0; j < data.operation.length; j++) {
                    cards.push({
                        id: tkts[i].id,
                        color: tkts[i].color,
                        partName: data.operation[j],
                        size: tkts[i].label,
                        bundleNo: tkts[i].bundle.count,
                        srFrom: tkts[i].bundle.from,
                        srTo: tkts[i].bundle.to,
                        qr: [
                            "pr",
                            tkts[i].color,
                            data.operation[j],
                            tkts[i].label,
                            tkts[i].bundle.count,
                            tkts[i].bundle.from,
                            tkts[i].bundle.to,
                            data.item.cutNo,
                            "production"
                        ]
                    });
                }
            }

            commit("setTkts", cards)
        },
        async ordersList({ commit }) {
            let orders = (await api.all(path.order)).rows;
            // eslint-disable-next-line no-console
            console.log(orders)
            commit("setOrders", orders)
        }

    },
};


