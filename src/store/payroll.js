import { api, path } from "@/api";

export default {
  namespaced: true,
  state: {
    report:[],
    summaryTran: [],
    },

  mutations: {
    financeReport(state, payload) {
      state.report = payload;
    },
    summarTrans(state, payload){
      state.summaryTran = payload;
    }
  },
  actions: {
    async getPFinanceReport({ commit }, date) {
      let summary = []
      let rep = []
      // let summary = []
      await api
        .create(
          {
            date: date
          },
          path.financeReport
        )
        .then(result => {
          rep = result
        });
      commit('financeReport', rep)

      let summaryTran = []
      const key = "department";
      const uniqueDept = [
        ...new Map(summary.map(item => [item[key], item])).values()
      ];
      for (let i = 0; i < uniqueDept.length; i++) {
        let noOEmp = 0,
          responseAllow = 0,
          homeAllow = 0,
          workedSalary = 0,
          otPayment = 0,
          positionAllow = 0,
          professionalAllow = 0,
          foodAllow = 0,
          mobileAllow = 0,
          incentiveAllow = 0,
          incomeTax = 0,
          pension11 = 0,
          pension7 = 0,
          costSharing = 0,
          labourUnion = 0,
          womanUnion = 0,
          netPay = 0;
        for (let j = 0; j < summary.length; j++) {
          if (uniqueDept[i].department == summary[j].department) {
            noOEmp += 1;
            workedSalary += parseFloat(summary[j].workedSalary);
            otPayment += parseFloat(summary[j].otPayment);
            responseAllow += parseFloat(summary[j].responseAllow);
            homeAllow += parseFloat(summary[j].homeAllow);
            positionAllow += parseFloat(summary[j].positionAllow);
            professionalAllow += parseFloat(
              summary[j].professionalAllow
            );
            foodAllow += parseFloat(summary[j].foodAllow);
            mobileAllow += parseFloat(summary[j].mobileAllow);
            incentiveAllow += parseFloat(summary[j].incentiveAllow);
            incomeTax += parseFloat(summary[j].incomeTax);
            pension11 += parseFloat(summary[j].pension11);
            pension7 += parseFloat(summary[j].pension7);
            costSharing += parseFloat(summary[j].costSharing);
            labourUnion += parseFloat(summary[j].labourUnion);
            womanUnion += parseFloat(summary[j].womanUnion);
            netPay += parseFloat(summary[j].netPay);
          }
        }
        summaryTran.push({
          noOfEmployee: noOEmp,
          department: uniqueDept[i].department,
          workedSalary: workedSalary.toFixed(2),
          otPayment: otPayment.toFixed(2),
          responseAllow: responseAllow,
          homeAllow: homeAllow,
          positionAllow: positionAllow,
          professionalAllow: professionalAllow,
          foodAllow: foodAllow,
          mobileAllow: mobileAllow,
          incentiveAllow: incentiveAllow,
          incomeTax: incomeTax.toFixed(2),
          pension11: pension11.toFixed(2),
          pension7: pension7.toFixed(2),
          costSharing: costSharing.toFixed(2),
          labourUnion: labourUnion.toFixed(2),
          womanUnion: womanUnion,
          netPay: netPay.toFixed(2)
        });
      }
      summaryTran.push({
        noOfEmployee: summaryTran.reduce(
          (acc, val) => parseFloat(acc) + parseFloat(val.noOfEmployee),
          0
        ),
        department: "Total",
        workedSalary: summaryTran
          .reduce(
            (acc, val) => parseFloat(acc) + parseFloat(val.workedSalary),
            0
          )
          .toFixed(2),
        otPayment: summaryTran
          .reduce((acc, val) => parseFloat(acc) + parseFloat(val.otPayment), 0)
          .toFixed(2),
        responseAllow: summaryTran
          .reduce(
            (acc, val) => parseFloat(acc) + parseFloat(val.responseAllow),
            0
          )
          .toFixed(2),
        homeAllow: summaryTran
          .reduce((acc, val) => parseFloat(acc) + parseFloat(val.homeAllow), 0)
          .toFixed(2),
        positionAllow: summaryTran
          .reduce(
            (acc, val) => parseFloat(acc) + parseFloat(val.positionAllow),
            0
          )
          .toFixed(2),
        professionalAllow: summaryTran
          .reduce(
            (acc, val) => parseFloat(acc) + parseFloat(val.professionalAllow),
            0
          )
          .toFixed(2),
        foodAllow: summaryTran
          .reduce((acc, val) => parseFloat(acc) + parseFloat(val.foodAllow), 0)
          .toFixed(2),
        mobileAllow: summaryTran
          .reduce(
            (acc, val) => parseFloat(acc) + parseFloat(val.mobileAllow),
            0
          )
          .toFixed(2),
        incentiveAllow: summaryTran
          .reduce(
            (acc, val) => parseFloat(acc) + parseFloat(val.incentiveAllow),
            0
          )
          .toFixed(2),
        incomeTax: summaryTran
          .reduce((acc, val) => parseFloat(acc) + parseFloat(val.incomeTax), 0)
          .toFixed(2),
        pension11: summaryTran
          .reduce((acc, val) => parseFloat(acc) + parseFloat(val.pension11), 0)
          .toFixed(2),
        pension7: summaryTran
          .reduce((acc, val) => parseFloat(acc) + parseFloat(val.pension7), 0)
          .toFixed(2),
        costSharing: summaryTran
          .reduce(
            (acc, val) => parseFloat(acc) + parseFloat(val.costSharing),
            0
          )
          .toFixed(2),
        labourUnion: summaryTran
          .reduce(
            (acc, val) => parseFloat(acc) + parseFloat(val.labourUnion),
            0
          )
          .toFixed(2),
        womanUnion: summaryTran
          .reduce((acc, val) => parseFloat(acc) + parseFloat(val.womanUnion), 0)
          .toFixed(2),
        netPay: summaryTran
          .reduce((acc, val) => parseFloat(acc) + parseFloat(val.netPay), 0)
          .toFixed(2)
      });
      // eslint-disable-next-line no-console
      console.log(summaryTran)
      commit('summarTrans', summaryTran)

    },
  },
};