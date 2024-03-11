/* eslint-disable no-unused-vars */
/* eslint no-param-reassign:0 */
import { api, path } from "@/api";

export default {
    namespaced: true,
    state: {
        employee: [],
        orders: []
    },

    mutations: {
        setEmployee(state, emp) {
            state.employee = emp
        },
        setOrder(state, order) {
            state.orders = order
        }
    },
    actions: {

        async employeeItem({ commit }) {
            let emp = (await api.all(path.employee)).rows;
            let employee = emp.map(x => {
                return {
                    id: x.id,
                    fullName: x.fullName,
                    idno: x.idno
                };
            });
            commit("setEmployee", employee)
        },
        async orderItem({ commit }) {
            let item = (await api.all(path.order)).rows.map(x => {
                return {
                    id: x.id,
                    quantity: x.quantity,
                    orderNumber: x.orderNumber + " => " + x.styleName,

                    styleName: `${x.styleName}(#${x.orderNumber})`,
                    producedOrder: x.producedOrder,

                    styleNumber: x.styleNumber,
                };
            });
            commit('setOrder', item)
        }
    },
};


