/* eslint-disable no-console */
import { api, path } from "@/api";
import {Notification} from 'vue-notifyjs'

export default {
    namespaced: true,
    state: {
        notifications: []
    },
    mutations: {
        setNotifications(state, payload){
            state.notifications = payload
        }
    },
    actions: {
        // eslint-disable-next-line no-unused-vars
        SOCKET_Notification_POST: async function ({commit}, data) {

            await api.all(path.notifications).then( res => {
                // eslint-disable-next-line no-console
              console.log('this method was fired by the socket server.')
              commit("setNotifications", res.rows)
           
              if(data) Notification.notify({type: 'danger', title: data.title, message: data.description})


            })

            
            },
    }
}