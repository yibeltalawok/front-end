<template>
  <div>
    <v-toolbar dense flat>
      <v-btn
        text
        class="text-capitalize primary--text"
        @click="$router.push({ name: 'payroll-master-list' })"
      >
        <v-icon class="mx-3">mdi-chevron-left</v-icon>
        {{ $t("go_back") }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-flex xs12 sm12 md4 lg4 pa-2>
        <v-text-field
          :label="$t('filter-by-date')"
          placeholder="YYYY-MM"
          dense
          outlined
          hide-details
          v-model="da"
          v-validate="'required'"
          type="month"
          @input="getData"
        />
      </v-flex>
      <v-spacer></v-spacer>
      <v-btn color="primary" class="text-capitalize" @click="dialog = true"
        >Print</v-btn
      >
    </v-toolbar>
    <v-container grid-list-xs fluid>
      <!-- <v-tooltip bottom v-if="items.length > 0">
        <v-btn
          slot="activator"
          text
          class="csv-download-icon primary--text"
          @click="downloadDataAsCsv('opmsPayrollMasterList')"
        >
          <v-icon large>open_in_browser</v-icon>
        </v-btn>
        <span>{{ $t("Download CSV") }}</span>
      </v-tooltip> -->
      <v-data-table
        :headers="headers"
        :items="tableValue"
        hide-actions
        class="elevation-1"
      >
      </v-data-table>
    </v-container>
    <v-dialog v-model="dialog" width="750">
      <v-card>
        <v-card-title class="headline primary lighten-2">
          Packing List print Data
        </v-card-title>
        <v-form
          @submit.prevent="save"
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-card-text>
            <v-layout row wrap justify-center>
              <v-flex xs12 sm12 md6 lg6 pa-2>
                <v-text-field
                  v-validate="required"
                  v-model="itemHeader.factoryName"
                  label="Factory name"
                  name="factoryName"
                  outlined
                  dense
                  :rules="rule"
                />
              </v-flex>
              <v-flex xs12 sm12 md6 lg6 pa-2>
                <v-text-field
                  v-validate="required"
                  v-model="itemHeader.content"
                  label="CSV Content"
                  name="content"
                  outlined
                  dense
                  :rules="rule"
                />
              </v-flex>
              <v-flex xs12 sm12 md6 lg6 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="itemHeader.month"
                  :label="$t('Month')"
                  name="netWight"
                  outlined
                  dense
                  :rules="rule"
                />
              </v-flex>
              <v-flex xs12 sm12 md6 lg6 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="itemHeader.year"
                  label="Year"
                  name="year"
                  outlined
                  dense
                  :rules="rule"
                />
              </v-flex>
            </v-layout>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-layout row wrap justify-center>
              <v-spacer />
              <v-btn class="green white--text" text @click="exportCSV">
                Generate CSV
              </v-btn>
              <v-spacer />
            </v-layout>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import { api, path } from "@/api";

import { csvDownloadFinanceCopyMixin } from "@/shared/mixins";
import { mapActions, mapState } from "vuex";

export default {
  name: "OperationList",
  mixins: [csvDownloadFinanceCopyMixin],
  data() {
    return {
      size: 200,
      valid: true,
      // resource: api,
      dialog: false,
      itemHeader: {},
      da: new Date().toISOString().substr(0, 7),
      // path: path.payroll,
      // items: [],
      // filter: {
      //   include: ["employee"]
      // },
      headers: [
        { text: "Idno", value: "idno" },
        { text: "Name", value: "fullName" },
        { text: "Department", value: "department" },
        { text: "DOJ", value: "joiningDate" },
        { text: "Position", value: "position" },
        { text: "Basic Salary", value: "salary" },
        { text: "Ttl Present(P)", value: "totalP" },
        { text: "Ttl Absent(A)", value: "totalA" },
        { text: "Ttl Permision(Pr)", value: "totalPr" },
        { text: "Ttl DL", value: "totalDL" },
        { text: "Ttl Maternity Lv(ML)", value: "totalML" },
        { text: "Ttl Paternity Lv(PL)", value: "totalPL" },
        { text: "Ttl Marriage Lv(MGL)", value: "totalMGL" },
        { text: "AL Availd", value: "totalAL" },
        { text: "Ttl HLPr", value: "totalHLPr" },
        { text: "Ttl HLA", value: "totalHLA" },
        { text: "Ttl SL", value: "totalSL" },
        { text: "Ttl FL", value: "totalFL" },
        { text: "Ttl Special L", value: "totalSpecialL" },
        { text: "Ttl Late", value: "totalLate" },
        { text: "Working Days", value: "workingDays" },
        { text: "O/T HR(1.25)", value: "otHr125" },
        { text: "O/T HR(1.5)", value: "otHr15" },
        { text: "O/T HR(2.0)", value: "otHr20" },
        { text: "O/T HR(2.5)", value: "otHr25" },
        { text: "Total OT days", value: "totalOtDays" }
      ],
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard"
        },
        {
          text: "Payroll Master",
          disabled: false,
          to: "/app/payroll/master/list"
        },
        {
          text: "Payroll calculation",
          disabled: true
        }
      ],
      // day: [],
      // summary: [],
      // ot: [],
      // otHr15: [],
      // otHr20: [],
      // otHr25: [],
      // otBirr: [],
      // incomeTax: [],
      // taxableIncome: [],
      // taxSlab: [],
      // totalDeduction: [],
      // payment: [],
      // netPay: [],
      // paymentTax: [],
      // netSalary: [],
      // grossSalary: [],
      // // tableValue: [],
      // totalWorkDays: 30,
      // attendance: [],
      // totalP: [],
      // totalA: [],
      // totalPr: [],
      // totalMOL: [],
      // totalMGL: [],
      // totalML: [],
      // totalPL: [],
      // totalAL: [],
      // totalHLPR: [],
      // totalHLA: [],
      // totalLate: [],
      // totalSL: [],
      // totalFL: [],
      // totalSpecialL: [],
      // workingDays: [],
      // salaryPerWorkDay: [],
      // dailyRate: [],
      perHrRate: []
    };
  },
  async created() {
    this.getData(new Date());
    // this.summary = (await api.all(this.path, this.filter)).rows;
    // let date = new Date();
    // this.getTotalWorkDays(date.getMonth() + 1);
  },
  computed: {
    ...mapState("payrolls", ["tableValue"])
  },
  methods: {
    ...mapActions("payrolls", ["getPayrolCulcReport"]),
    async getData(date) {
      this.getPayrolCulcReport(date);
    },

    // async getTotalWorkDays(month) {
    //   let f = { where: { month: month } };
    //   this.day = (await api.all(path.workDay, f)).rows;
    //   if (this.day.length > 0) {
    //     this.totalWorkDays = this.day[0].noDays;
    //   }
    //   this.getAttendance();
    // },
    // async getAttendance() {
    //   for (let i = 0; i < this.summary.length; i++) {
    //     let f = {
    //       where: {
    //         employeeId: this.summary[i].employee.id,
    //         month: new Date().getMonth() + 1,
    //         year: new Date().getFullYear()
    //       }
    //     };

    //     this.attendance = (await api.all(path.attendance, f)).rows;
    //     this.attendance.sort(function(a, b) {
    //       var dateA = new Date(a.dateAttended),
    //         dateB = new Date(b.dateAttended);
    //       return dateA - dateB;
    //     });

    //     if (this.attendance.length == 0) {
    //       this.totalP[i] = 0;
    //       this.totalA[i] = 0;
    //       for (let j = 1; j <= new Date().getDate(); j++) {
    //         let date = new Date();
    //         date.setDate(j);
    //         if (date.getDay() == 0) {
    //           this.totalP[i] += 1;
    //         } else {
    //           this.totalA[i] += 1;
    //         }
    //       }
    //       this.totalPr[i] = 0;
    //       this.totalMOL[i] = 0;
    //       this.totalMGL[i] = 0;
    //       this.totalML[i] = 0;
    //       this.totalPL[i] = 0;
    //       this.totalAL[i] = 0;
    //       this.totalHLPR[i] = 0;
    //       this.totalHLA[i] = 0;
    //       this.totalLate[i] = 0;
    //       this.totalSL[i] = 0;
    //       this.totalFL[i] = 0;
    //       this.totalSpecialL[i] = 0;
    //       this.workingDays[i] = this.totalP[i];
    //     } else {
    //       this.totalP[i] = 0;
    //       this.totalA[i] = 0;
    //       this.totalPr[i] = 0;
    //       this.totalMOL[i] = 0;
    //       this.totalMGL[i] = 0;
    //       this.totalML[i] = 0;
    //       this.totalPL[i] = 0;
    //       this.totalAL[i] = 0;
    //       this.totalHLPR[i] = 0;
    //       this.totalHLA[i] = 0;
    //       this.totalLate[i] = 0;
    //       this.totalSL[i] = 0;
    //       this.totalFL[i] = 0;
    //       this.totalSpecialL[i] = 0;
    //       this.workingDays[i] = 0;
    //       let used = false;
    //       // alert(this.attendance.length);
    //       for (let j = 0; j < this.attendance.length; j++) {
    //         if (j < this.attendance.length - 1) {
    //           let da = new Date(this.attendance[0].dateAttended);
    //           let fd = new Date(this.attendance[j].dateAttended);
    //           let nd = new Date(this.attendance[j + 1].dateAttended);
    //           if (da.getDate() != 1 && used == false) {
    //             used = true;
    //             for (let l = 1; l < da.getDate(); l++) {
    //               let d = new Date();
    //               d.setDate(l);
    //               if (d.getDay() == 0) {
    //                 this.totalP[i] += 1;
    //               }
    //             }
    //           }
    //           if (fd.getDate() + 1 != nd.getDate()) {
    //             for (let l = fd.getDate() + 1; l < nd.getDate(); l++) {
    //               let dm = new Date();
    //               dm.setDate(l);
    //               if (dm.getDay() == 0) {
    //                 this.totalP[i] += 1;
    //               }
    //             }
    //           }
    //         } else {
    //           let nd = new Date(this.attendance[j].dateAttended);
    //           let cd = new Date();
    //           if (nd.getDate() < cd.getDate()) {
    //             for (let g = nd.getDate() + 1; g < cd.getDate(); g++) {
    //               let d = new Date();
    //               d.setDate(g);
    //               if (d.getDay() == 0) {
    //                 this.totalP[i] += 1;
    //               }
    //             }
    //           }
    //         }
    //       }

    //       for (let iterator of this.attendance) {
    //         if (iterator.value == "P") {
    //           this.totalP[i] += 1;
    //         }
    //         if (iterator.value == "A") {
    //           this.totalA[i] += 1;
    //         }
    //         if (iterator.value == "Pr") {
    //           this.totalPr[i] += 1;
    //         }
    //         if (iterator.value == "AL") {
    //           this.totalAL[i] += 1;
    //         }
    //         if (iterator.value == "MOL") {
    //           this.totalMOL[i] += 1;
    //         }
    //         if (iterator.value == "HLPR") {
    //           this.totalHLPR[i] += 0.5;
    //           this.totalP[i] += 0.5;
    //         }
    //         if (iterator.value == "HLA") {
    //           this.totalHLA[i] += 0.5;
    //           this.totalP[i] += 0.5;
    //         }
    //         if (iterator.value == "MGL") {
    //           this.totalMGL[i] += 1;
    //         }
    //         if (iterator.value == "ML") {
    //           this.totalML[i] += 1;
    //         }
    //         if (iterator.value == "PL") {
    //           this.totalPL[i] += 1;
    //         }
    //         if (iterator.value == "SL") {
    //           this.totalSL[i] += 1;
    //         }
    //         if (iterator.value == "LeM") {
    //           this.totalLate[i] += parseFloat(iterator.lateMinutes) / 480;
    //           this.totalP[i] +=
    //             1 - (parseFloat(iterator.lateMinutes) / 480).toFixed(2);
    //         }
    //         if (iterator.value == "FL") {
    //           this.totalFL[i] += 1;
    //         }
    //         if (iterator.value == "Special L") {
    //           this.totalSpecialL[i] += 1;
    //         }
    //       }
    //     }
    //     let totalPd = 0;
    //     totalPd =
    //       this.totalP[i] +
    //       this.totalMOL[i] +
    //       this.totalMGL[i] +
    //       this.totalML[i] +
    //       this.totalPL[i] +
    //       this.totalAL[i] +
    //       this.totalSL[i] +
    //       this.totalFL[i];
    //     let totalAd = 0;
    //     totalAd =
    //       this.totalA[i] +
    //       this.totalPr[i] +
    //       this.totalHLA[i] +
    //       this.totalHLPR[i] +
    //       this.totalLate[i] +
    //       this.totalSpecialL[i];
    //     this.totalLate[i] = this.totalLate[i].toFixed(2);
    //     let ld = new Date();
    //     this.totalA[i] = ld.getDate() - totalPd - totalAd;
    //     this.workingDays[i] = totalPd;
    //     this.salaryPerWorkDay[i] = (
    //       (parseFloat(this.workingDays[i]) *
    //         parseFloat(this.summary[i].employee.salary)) /
    //       parseInt(this.totalWorkDays)
    //     ).toFixed(2);
    //     this.dailyRate[i] = (
    //       parseFloat(this.summary[i].employee.salary) / this.totalWorkDays
    //     ).toFixed(2);
    //     this.perHrRate[i] = (this.salaryPerWorkDay[i] / 208).toFixed(2);
    //   }
    //   this.manageTabe();
    // },
    // async manageTabe() {
    //   for (let i = 0; i < this.summary.length; i++) {
    //     this.ot[i] = 0;
    //     let f = {
    //       where: { payrollId: this.summary[i].id }
    //     };
    //     this.ot = (await api.all(path.overtime, f)).rows;
    //     if (this.ot.length == 0) {
    //       this.otHr15[i] = 0;
    //       this.otHr20[i] = 0;
    //       this.otHr25[i] = 0;
    //     } else {
    //       this.otHr15[i] = 0;
    //       this.otHr20[i] = 0;
    //       this.otHr25[i] = 0;
    //       for (const iterator of this.ot) {
    //         if (iterator.type == "Normal Day") {
    //           this.otHr15[i] += parseFloat(iterator.value);
    //         }
    //         if (iterator.type == "Rest Day") {
    //           this.otHr20[i] += parseFloat(iterator.value);
    //         }
    //         if (iterator.type == "Public Holly Day") {
    //           this.otHr25[i] += parseFloat(iterator.value);
    //         }
    //       }
    //     }
    //     this.otBirr[i] =
    //       (parseFloat(this.otHr15[i]) *
    //         parseFloat(this.salaryPerWorkDay[i]) *
    //         1.75) /
    //         192 +
    //       (parseFloat(this.otHr20[i]) *
    //         parseFloat(this.salaryPerWorkDay[i]) *
    //         2.0) /
    //         192 +
    //       (parseFloat(this.otHr25[i]) *
    //         parseFloat(this.salaryPerWorkDay[i]) *
    //         2.5) /
    //         192;
    //     //this.otBirr[i] = this.otBirr[i].toFixed(2);
    //   }
    //   this.calculateSalary();
    // },
    // calculateSalary() {
    //   for (let i = 0; i < this.summary.length; i++) {
    //     let attBonus = 0;
    //     if (this.totalWorkDays == this.workingDays[i]) {
    //       attBonus = 75;
    //     }
    //     if (this.summary[i].employee.department == "Supervisor") {
    //       this.grossSalary[i] = this.salaryPerWorkDay[i] + this.otBirr[i];
    //     } else {
    //       this.grossSalary[i] = (
    //         parseFloat(this.salaryPerWorkDay[i]) +
    //         parseFloat(this.otBirr[i]) +
    //         parseFloat(attBonus) +
    //         parseFloat(this.summary[i].ironIncentive) +
    //         parseFloat(this.summary[i].employee.salary) * 0.11 +
    //         parseFloat(this.summary[i].responseAllow) +
    //         parseFloat(this.summary[i].homeAllow) +
    //         parseFloat(this.summary[i].transportPay)
    //       ).toFixed(2);
    //     }
    //   }
    //   this.calculateTax();
    // },
    // async calculateTax() {
    //   this.taxableIncome = [];
    //   this.incomeTax = [];
    //   this.taxSlab = (await api.all(path.taxSlab)).rows;
    //   for (let i = 0; i < this.summary.length; i++) {
    //     let attBonus = 0;
    //     if (this.totalWorkDays == this.workingDays[i]) {
    //       attBonus = 75;
    //     }
    //     let tax =
    //       parseFloat(this.salaryPerWorkDay[i]) +
    //       parseFloat(this.summary[i].ironIncentive) +
    //       parseFloat(this.otBirr[i]) +
    //       parseFloat(attBonus) +
    //       parseFloat(this.summary[i].employee.incentiveSalary) +
    //       parseFloat(this.summary[i].payback) * parseFloat(this.dailyRate[i]);
    //     if (parseFloat(this.summary[i].responseAllow) > 500) {
    //       this.tax += parseFloat(this.summary[i].responseAllow) - 500;
    //     }
    //     if (this.summary[i].employee.department == "GM") {
    //       this.taxableIncome[i] = tax;
    //     } else {
    //       if (parseFloat(this.summary[i].homeAllow) > 500) {
    //         tax += parseFloat(this.summary[i].homeAllow) - 500;
    //         this.taxableIncome[i] = tax.toFixed(2);
    //       } else {
    //         this.taxableIncome[i] = tax.toFixed(2);
    //       }
    //     }
    //     for (let iterator of this.taxSlab) {
    //       if (
    //         this.taxableIncome[i] >= parseFloat(iterator.initial) &&
    //         this.taxableIncome[i] <= parseFloat(iterator.end)
    //       ) {
    //         this.incomeTax[i] = (
    //           (parseFloat(iterator.deduction) * this.taxableIncome[i]) / 100 -
    //           parseFloat(iterator.extraDeduction)
    //         ).toFixed(2);
    //       }
    //     }
    //   }
    //   this.calculateNetValues();
    // },
    // calculateNetValues() {
    //   for (let i = 0; i < this.summary.length; i++) {
    //     this.payment[i] = (
    //       this.dailyRate[i] * this.summary[i].miscPayment
    //     ).toFixed(2);
    //     for (let iterator of this.taxSlab) {
    //       if (
    //         this.payment[i] >= parseFloat(iterator.initial) &&
    //         this.payment[i] <= parseFloat(iterator.end)
    //       ) {
    //         this.paymentTax[i] = (
    //           (parseFloat(iterator.deduction) * this.payment[i]) / 100 -
    //           parseFloat(iterator.extraDeduction)
    //         ).toFixed(2);
    //       }
    //     }
    //     this.totalDeduction[i] = (
    //       parseFloat(this.summary[i].employee.salary) * 0.07 +
    //       parseFloat(this.summary[i].employee.salary) * 0.11 +
    //       (parseFloat(this.summary[i].costSharing) *
    //         parseFloat(this.summary[i].employee.salary)) /
    //         100 +
    //       parseFloat(this.incomeTax[i]) +
    //       parseFloat(this.salaryPerWorkDay[i]) * 0.01
    //     ).toFixed(2);

    //     this.netPay[i] = (this.payment[i] - this.paymentTax[i]).toFixed(2);

    //     this.netSalary[i] = (
    //       this.grossSalary[i] - this.totalDeduction[i]
    //     ).toFixed(2);
    //   }
    //   this.assignToTable();
    // },
    // assignToTable() {
    //   for (let i = 0; i < this.summary.length; i++) {
    //     this.tableValue.push({
    //       idno: this.summary[i].employee.idno,
    //       fullName: this.summary[i].employee.fullName,
    //       department: this.summary[i].employee.department,
    //       joiningDate: new Date(
    //         this.summary[i].employee.joiningDate
    //       ).toLocaleDateString("en-US"),
    //       position: this.summary[i].employee.position,
    //       salary: this.summary[i].employee.salary,
    //       totalA: this.totalA[i].toFixed(2),
    //       totalP: this.totalP[i],
    //       totalPr: this.totalPr[i],
    //       totalMOL: this.totalMOL[i],
    //       totalML: this.totalML[i],
    //       totalSL: this.totalSL[i],
    //       totalFL: this.totalFL[i],
    //       totalSpecialL: this.totalSpecialL[i],
    //       totalAL: this.totalAL[i],
    //       totalHLPR: this.totalHLPR[i],
    //       totalHLA: this.totalHLA[i],
    //       totalLate: this.totalLate[i],
    //       workingDays: this.workingDays[i].toFixed(2),
    //       otHr15: this.otHr15[i],
    //       otHr20: this.otHr20[i],
    //       otHr25: this.otHr25[i],

    //       totalOtDays: (
    //         (this.otHr15[i] + this.otHr20[i] + this.otHr25[i]) /
    //         8
    //       ).toFixed(2)
    //     });
    //   }
    // },
    exportCSV() {
      if (this.$refs.form.validate()) {
        this.dialog = false;
        const arrayHeader = ["", this.itemHeader.factoryName];
        let items = [];
        items.push(
          {
            a: "",
            it: " " + this.itemHeader.content
          },
          {
            a: "",
            it:
              "FOR THE MONTH OF " +
              this.itemHeader.month +
              " IN " +
              this.itemHeader.year
          }
        );
        items.push({
          header: "Idno",
          header1: "Full Name",
          header2: "Department",
          header45: "DOJ",
          header4: "Position",
          header46: "Basic Salary",
          header5: "Ttl Absent(A)",
          header3: "Ttl Present(P)",
          header6: "Ttl Permision(Pr)",
          header47: "Ttl DL",
          header48: "Ttl Maternity Lv(ML)",
          header60: "Ttl Paternity LV(PL)",
          header62: "Ttl Marriage Lv(MGL)",
          header57: "Ttl SL",
          header52: "Ttl FL",
          header58: "Ttl Special L",
          header49: "AL Availd",
          header50: "Ttl HLPr",
          header51: "Ttl HLA",
          header53: "Ttl Late",
          header7: "Working Days",
          header54: "O/T HR(1.25)",
          header59: "O/T HR(1.5)",
          header9: "O/T HR(2.0)",
          header10: "O/T HR(2.5)",
          header11: "Total OT days"
        });
        for (const iterator of this.tableValue) {
          items.push(iterator);
        }

        let fileName = "Payroll sheet";
        let delimiter = ",";

        let header = arrayHeader.join(delimiter) + "\n";
        let csv = header;
        if (items.length > 0) {
          items.forEach(obj => {
            let row = [];
            for (let key in obj) {
              if (obj.hasOwnProperty(key)) {
                row.push(obj[key]);
              }
            }
            csv += row.join(delimiter) + "\n";
          });

          let csvData = new Blob([csv], { type: "text/csv" });
          let csvUrl = URL.createObjectURL(csvData);

          let hiddenElement = document.createElement("a");
          hiddenElement.href = csvUrl;
          hiddenElement.target = "_blank";
          hiddenElement.download = fileName + ".csv";
          hiddenElement.click();
        }
      }
    }
  }
};
</script>

<style lang="css" scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #5e7c8a;
  text-align: left;
  padding: 8px;
  font-size: 10px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

/* tr:nth-child(even) {
  background-color: #dddddd;
} */
th {
  cursor: pointer;
}
</style>
