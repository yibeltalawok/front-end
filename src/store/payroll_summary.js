/* eslint no-param-reassign:0 */
// import { api, path } from '../api'
export default {
  // namespaced: true,
  state: {
    taxDe: ""
  },
  getters: {
    deducted(state) {
      return state.taxDe
    }
  },
  mutations: {
    calculateTaxSlab(state, taxableIncome, taxSlab) {
      // eslint-disable-next-line no-console
      console.log('--------------------------------------------------------------------')
      // eslint-disable-next-line no-console
      console.log(taxableIncome)
      // eslint-disable-next-line no-console
      console.log(taxSlab)
      // for (let i = 0; i < taxSlab.length - 1; i++) {
      //   if (
      //     taxableIncome >= parseFloat(taxSlab[i].initial) &&
      //     taxableIncome <= parseFloat(taxSlab[i].end)
      //   ) {
      //     let tax = (
      //       (parseFloat(taxSlab[i].deduction) * taxableIncome) / 100 -
      //       parseFloat(taxSlab[i].extraDeduction)
      //     ).toFixed(2);
      //     state.taxDe = tax
      //     break;
      //   }
      // }
      // let lastSlab = taxSlab.length - 1;

      // if (taxableIncome >= parseFloat(taxSlab[lastSlab].initial)) {
      //   let tax = (
      //     (parseFloat(taxSlab[lastSlab].deduction) * taxableIncome) / 100 -
      //     parseFloat(taxSlab[lastSlab].extraDeduction)
      //   ).toFixed(2);
      //   state.taxDe = tax
      // }

    }
  }
}
