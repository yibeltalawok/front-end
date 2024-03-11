/* eslint no-param-reassign:0 */
import { api, path } from "@/api"
import * as am4core from "@amcharts/amcharts4/core";
import moment from "moment";

var colorSet = new am4core.ColorSet();


export default {
  state: {
    tnaGantChartData: JSON.parse(localStorage.getItem("gantChartData")),
    timeActionsResp: undefined
  },
  getters: {
    getTnaGantChartData(state) {
      return state.tnaGantChartData
    },
    getTimeActionsResp(state) {
      return state.timeActionsResp
    },
  },


  mutations: {
    setTnaGantChartData(state, payload) {
      state.tnaGantChartData = payload
      localStorage.setItem("gantChartData", JSON.stringify(payload))
    },

    setTimeActionsResp(state, payload) {
      state.timeActionsResp = payload
    }

  },

  actions: {
    async fetchTimeAction({ commit }, id) {
      commit("setTnaGantChartData", [])
      commit("setTimeActionsResp", [])
      try {
        await api.all(path.timeAction + "/" + id.toString()).then(resp => {
          var temp = []
          
          temp.push({
            
            name: " Planned Cutting ",
            fromDate: resp.startPlannedCutDate,
            toDate: resp.endPlannedCutDate,
            color: colorSet.getIndex(1).brighten(0),
            diff: Math.abs(new Date(resp.endPlannedCutDate) - new Date(resp.startPlannedCutDate)) / 1000 / 60 / 60 / 24
          })

          if(resp.endActualCutDate == "" && resp.startActualCutDate != "" ) {
            var td = new Date(resp.startActualCutDate)
              temp.push({
                name: " Actual Cutting ",
                fromDate: resp.startActualCutDate,
                toDate: moment(td.setDate(td.getDate() + 2)).format("YYYY-MM-DD"),
                color: colorSet.getIndex(1).brighten(2),
                diff: 0
              })  
          }

          else if(resp.endActualCutDate != "" && resp.startActualCutDate != "") {
            temp.push({
              name: " Actual Cutting ",
              fromDate: resp.startActualCutDate,
              toDate: resp.endActualCutDate,
              color: colorSet.getIndex(1).brighten(2),
              diff: Math.abs(new Date(resp.endActualCutDate) - new Date(resp.startActualCutDate)) / 1000 / 60 / 60 / 24
            })  
          }

          temp.push({
            name: " Planned Sewing ",
            fromDate: resp.plannedSewingStart,
            toDate: resp.plannedSewingEnd,
            color: colorSet.getIndex(6).brighten(0),
            diff: Math.abs(new Date(resp.plannedSewingEnd) - new Date(resp.plannedSewingStart)) / 1000 / 60 / 60 / 24
          })

          if(resp.actualSewingStart == "" && resp.actualSewingEnd != "" ) {
            var td2 = new Date(resp.actualSewingStart)
              temp.push({
                name: " Actual Sewing ",
                fromDate: resp.actualSewingStart,
                toDate: moment(td2.setDate(td2.getDate() + 2)).format("YYYY-MM-DD"),
                color: colorSet.getIndex(6).brighten(2),
                diff: 0
              })  
          }
          else if(resp.actualSewingStart != "" && resp.actualSewingEnd != ""){
            temp.push({
              name: " Actual Sewing ",
              fromDate: resp.actualSewingStart,
              toDate: resp.actualSewingEnd,
              color: colorSet.getIndex(6).brighten(2),
              diff: Math.abs(new Date(resp.actualSewingEnd) - new Date(resp.actualSewingStart)) / 1000 / 60 / 60 / 24
            })  
          }

          temp.push({
            name: " Planned Finishing ",
            fromDate: resp.plannedFinishStart,
            toDate: resp.plannedFinishEnd,
            color: colorSet.getIndex(14).brighten(0),
            diff: Math.abs(new Date(resp.plannedFinishEnd) - new Date(resp.plannedFinishStart)) / 1000 / 60 / 60 / 24
          })

          if(resp.actualFinishStart == "" && resp.actualFinishEnd != "" ) {
            var td3 = new Date(resp.actualFinishStart)
              temp.push({
                name: "Actual Finishing",
                fromDate: resp.actualFinishStart,
                toDate: moment(td3.setDate(td3.getDate() + 2)).format("YYYY-MM-DD"),
                color: colorSet.getIndex(14).brighten(2),
                diff: 0
              })  
          }
          else if(resp.actualFinishStart != "" && resp.actualFinishEnd != "") {
            temp.push({
              name: "Actual Finishing",
              fromDate: resp.actualFinishStart,
              toDate: resp.actualFinishEnd,
              color: colorSet.getIndex(14).brighten(2),
              diff: Math.abs(new Date(resp.actualFinishEnd) - new Date(resp.actualFinishStart)) / 1000 / 60 / 60 / 24
            })  
          }

          temp.push({
            name: "Planned Packing",
            fromDate: resp.plannedPackingStart,
            toDate: resp.plannedPackingEnd,
            color: colorSet.getIndex(10),
            diff: Math.abs(new Date(resp.plannedPackingEnd) - new Date(resp.plannedPackingStart)) / 1000 / 60 / 60 / 24
          })

          if(resp.actualPackedStart == "" && resp.actualPackedEnd != "" ) {
            var td4 = new Date(resp.actualPackedStart)
              temp.push({
                name: "Actual Packing",
                fromDate: resp.actualPackedStart,
                toDate: moment(td4.setDate(td4.getDate() + 2)).format("YYYY-MM-DD"),
                color: colorSet.getIndex(10).brighten(2),
                diff: 0
              })  
          }
          else if(resp.actualPackedStart != "" && resp.actualPackedEnd != "") {
            temp.push({
              name: "Actual Packing",
              fromDate: resp.actualPackedStart,
              toDate: resp.actualPackedEnd,
              color: colorSet.getIndex(10).brighten(2),
              diff: Math.abs(new Date(resp.actualPackedEnd) - new Date(resp.actualPackedStart)) / 1000 / 60 / 60 / 24
            })  
          }


          if(resp.plannedShippingDate != "" ) {
            var td5 = new Date(resp.plannedShippingDate)
              temp.push({
                name: " Planned Shiping",
                fromDate: resp.plannedShippingDate,
                toDate: moment(td5.setDate(td5.getDate() + 2)).format("YYYY-MM-DD"),
                color: colorSet.getIndex(12),
              })  
          }
          
          if(resp.actualShipedDate != "") {
            var td6 = new Date(resp.actualShipedDate)
              temp.push({
                name: " Actual Shiping",
                fromDate: resp.actualShipedDate,
                toDate: moment(td6.setDate(td6.getDate() + 2)).format("YYYY-MM-DD"),
                color: colorSet.getIndex(12),
              
              })  
          }

          
          
          

          commit("setTimeActionsResp", resp)
          commit("setTnaGantChartData", temp)
          console.log(temp)

        })
      }
      catch (e) {
        /* eslint no-console: 0 */
        // console.log(e)
      }
    },
  },
  namespaced: true
};
