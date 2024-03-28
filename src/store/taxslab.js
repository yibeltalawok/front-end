/* eslint-disable no-console */
/* eslint no-param-reassign:0 */
export default {
  namespaced: true,
  state: {
    aa: [],
  },

  mutations: {
    attendancelist(state,payload){
       state.aa=payload
    }
  },
  actions: {
   getAttendanceList({commit},item){

    
    commit("attendancelist",item)
   }

  },
};
