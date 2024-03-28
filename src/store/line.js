import { api, path } from "@/api";

export default {
  namespaced: true,
  state: {
    linelist: []
  },

  mutations: {
    setLineList(state, payload) {
      state.linelist = payload
    },
     
  },
  actions: {
    
    async fetchLineList({commit}){

        await api.all(path.line).then(res => {
            // eslint-disable-next-line no-console
            console.log(res)
          commit("setLineList", res.rows)  
        })
      },


  },
};


