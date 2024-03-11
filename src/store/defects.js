/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { api, path } from "@/api";

export default {
  namespaced: true,
  state: {
    defects: [],
    defectImages: [],
    modules: [],
    DataList:[],
    lineChart:[],
    years:[]
  
  },

  mutations: { 
    setDefects (state, payload) {
      state.defects = payload     
  },

  setModules (state, payload) {
    state.modules = payload     
},

  setdefectImages(state, payload){
    state.defectImages = payload
  },
   setlinechart(state, payload){
    state.lineChart = payload[0]
    state.years=payload[1]

  },
  setRengeData(state,payload){
    state.lineChart=payload
  }
  },

  actions: { 
    async getlinechart({commit},date){
      await api
           .create({date:date},path.getTotaldeffect)
           .then(result => {
             // eslint-disable-next-line no-console
        console.log(this.result+"******************************************")
             // eslint-disable-next-line no-console
        console.log(this.DataList)
        commit('setlinechart',result)
               });  
           },

           async getDashboardWithRange({ commit }, data) {
            // eslint-disable-next-line no-console
            console.log(data[0] + "     " + data[1])
            await api
              .create({ start: data[0], end: data[1] }, path.getDashboardWithRange)
              .then(response => {
                commit('setRengeData', response)
              });
          },
          
    async fetchdefectImages({commit})  {
      try {  
          const resp = await api.all(path.defectImages)      
          commit('setdefectImages', resp)
          
      }
      catch(e){
        // eslint-disable-next-line no-console
        console.log("failed to fetch defect images")
      }
    },

    async uploadFiletoServer({commit}, d){
      var tempurl = d.tempurl
      var dataURI = d.dataURI
      console.log(dataURI)
      var byteString;
          if (dataURI.split(',')[0].indexOf('base64') >= 0)
              byteString = atob(dataURI.split(',')[1]);
          else
              byteString = unescape(dataURI.split(',')[1]);

          // separate out the mime component
          var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

          // write the bytes of the string to a typed array
          var ia = new Uint8Array(byteString.length);
          for (var i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
          }
          
          var blob = new Blob([ia], {type:mimeString});
          const fd = new FormData()
          fd.append('image', blob, tempurl)
          // eslint-disable-next-line no-console
          console.log(fd)

      await api.upload("defectImages",fd, "/containers").then(res => {
        console.log(res)
      })
    },

    async fetchDefects({commit})  {
      try {  
          const resp = await api.all(path.defects) 
              commit('setDefects', resp)
              return resp.data;
          
      }
      catch(e){
        console.log("failed to fetch defects")
      }
    },


    async uploadMainDefectImages({commit} , formdata){
      await api.upload("staticStyles",formdata, "/containers")
    },


    async deleteDefects({commit}, id)  {
      try {  
         await api.remove(id, path.defects) 
      }
      catch(e){
        console.log("failed to delete defects")
      }
    },

    async addADefect({commit}, data)  {
      try {  
          const resp = await api.create(data, path.defects)   
          return true;        
      }
      catch(e){
        console.log("failed to fetch defects")
        return false
      }
    },

    async deleteModule({commit}, id)  {
      try {  
          const resp = await api.remove(id, path.modules) 
              return true;
          
      }
      catch(e){
        console.log("failed to delete module")
        return false;
      }
    },

    async fetchModules({commit}, st)  {
      console.log(path.oprBltn + "/" + st)
      try {  
          const resp = await api.all(path.oprBltn + "/" + st, {include: "modules"}) 
          console.log(resp)
              commit('setModules', resp.modules)
              return resp.modules;
          
      }
      catch(e){
        console.log("failed to fetch modules")
      }
    },

    async addModule({commit}, data)  {
      try {  
          const resp = await api.create(data , path.modules).then( res => {
            
          })
          return true;
      }
      catch(e){
        console.log("failed to fetch defects")
        return false;
      }
    },
  }
  }
 

