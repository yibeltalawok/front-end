/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
import { api, path} from "@/api"

export default {
    namespaced: true,
    state: {
        attendanceList: [],
        numberOfAbsents: undefined,
        numberOfPresents: undefined,
        numberOfReasons: undefined
    },

    mutations: {

        setAtendanceList(state, payload){
            state.attendanceList = payload;
        },
        setNumberOfAbsents(state, payload){
            state.numberOfAbsents = payload
        },
        setNumberOfPresents(state, payload){
            state.numberOfPresents = payload
        },
        setNumberOfReasons(state, payload){
            state.numberOfReasons = payload
        }
    },

    actions: {
        async fetchAttendance({commit} , flt){ 
            flt = JSON.parse(JSON.stringify(flt));
            delete flt.where.value
            // console.log("yibe filter==",flt)
              await api.all(path.attendance, flt).then( res => {
                  commit("setAtendanceList", res.rows)
                //   console.log("yibe res.rows==", res.rows)
              })
        },

        async fetchNumberOfAbsents({commit} , filter){ 
            filter.where.value = "A"           
            await api.all(path.attendance, filter).then( res => {
                var total = 0;
                for( var element of res.rows) {
                    if( 'employee' in element){
                        total++ 
                    }
                }
                commit("setNumberOfAbsents", total)
            })
        },

        async fetchNumberOfReasons({commit} , filter){ 
            filter.where.value = {
                nin: ["P", "A"]
            }           
            await api.all(path.attendance, filter).then( res => {
                var total = 0;
                for( var element of res.rows) {
                    if( 'employee' in element){
                        total++ 
                    }
                }
                commit("setNumberOfReasons", total)
            })
        },
        async fetchNumberOfPresents({commit} , filter){ 
            filter.where.value = "P"           
            await api.all(path.attendance, filter).then( res => {
                var total = 0;
                for( var element of res.rows) {
                    if( 'employee' in element){
                        total++ 
                    }
                }
                commit("setNumberOfPresents", total)
            })
      },

        async updateAttendance({commit} , value){
            commit
            await api.update(value, path.attendance).then().catch()
        }
        
    }
}