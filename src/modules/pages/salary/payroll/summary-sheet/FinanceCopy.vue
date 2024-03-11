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
          @input="getReport"
        />
      </v-flex>

      <v-spacer></v-spacer>
      
      <v-btn
        color="primary"
        class="text-capitalize"
        v-if="tableValue.length > 0"
        @click="dialog = true"
        >{{ $t("print") }}</v-btn
      >
    </v-toolbar>


    <v-container grid-list-xs fluid>
      <v-data-table
        :headers="headers"
        :items="report"
        hide-actions
        class="elevation-1"
      >
      </v-data-table>
      <br />
      <v-layout row justify-center>
        <v-flex xs12 sm12 md8 lg8>
          <u color="primary">
            <h2 class="primary--text">SUMMARY TRANSACTION (dept. wise)</h2></u
          >
        </v-flex>
      </v-layout>
      <v-data-table
        :headers="summaryHeaders"
        :items="summaryTran"
        hide-actions
        class="elevation-1"
      >
      </v-data-table>
    </v-container>


    <v-dialog v-model="dialog" width="750">
        
      <v-card>
        <v-card-title class="headline primary lighten-2">
          print Employee payroll sheet report
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
                  label="Title of file"
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
                Generate Employee Payroll sheet report
              </v-btn>
              <v-spacer />
              <v-btn class="green white--text" text @click="exportBankReport">
                Generate Bank Report </v-btn
              ><v-spacer />
            </v-layout>
          </v-card-actions>
        </v-form>


      </v-card>
    </v-dialog>


  </div>
</template>

<script>
import { api, path } from "@/api";
// import { csvDownloadFinanceCopyMixin } from "@/shared/mixins";
import { mapActions, mapState } from "vuex";

export default {
  name: "Finance_copy",
  // mixins: [csvDownloadFinanceCopyMixin],
  data() {
    return {
      dialog: false,
      valid: true,
      itemHeader: {},
      rule: [v => !!v || "This field is requird"],
      size: 200,
      tableValue: [{
        idNo: 1,
        fullName : "Wendimu Sitotaw",
        department: "Tech.",
        workeDays: 30,
        position: "Tech Lead",
        monthlySalary: 30000,
        perDaySalary: 1000,
        workedDays: 30,
      }],
      da: new Date().toISOString().substr(0, 7),
      headers: [       
        { text: "Idno", value: "idno" },
        { text: "Employee name", value: "fullName" },
        { text: "Department", value: "department" },
        { text: "Work Days", value: "workedDays" },
        { text: "Position", value: "position" },
        { text: "Monthly salary", value: "salary" },
        { text: "Per day salary", value: "perDaySalary" },
      { text: "worked days", value: "workedDays" },
         { text: "OT days", value: "overTimeDays" },
        { text: "Worked Salary", value: "workedSalary" },
        { text: "OT payment", value: "OverTimePayment" },
        { text: "Resp Allow", value: "responseAllow" },
        { text: "Home allow", value: "homeAllow" },
        { text: "Non Tax Home All", value: "nonTaxableHomeAllow" },
        { text: "Tax. Home Allow ", value: "taxableHomeAllow" },
        { text: "Position Allow", value: "positionalAllow" },
        { text: "Prof Allow", value: "profAllow" },
        { text: "Tax. Prof Allow", value: "taxableProfAllow" },
        { text: "Non Tax. Prof Allow", value: "nonTaxableProfAllow" },
        { text: "Absent Incentive", value: "absentIncentive" },
        { text: "C.sharing", value: "costSharing" },
        { text: "Iron incentive", value: "ironIncentive" },
        { text: "Food Allow", value: "foodAllow" },
        { text: "Mobile Allow", value: "mobileAllow" },
        { text: "Incentive Allow", value: "incentiveSalary" },
        { text: "MISC Payment", value: "miscPayment" },
        { text: "Payback", value: "payback" },
        { text: "Gross Earn", value: "grossEarning" },
        { text: "Tax. Earn ", value: "taxableEarning" },
        { text: "Income tax", value: "incomeTax" },
        { text: "Pension(7%)", value: "pension7" },
        { text: "Pension(11%)", value: "pension11" },
        { text: "Pension(18%)", value: "pension18" },
        { text: "A/Receivable", value: "advancedRecievable" },
        { text: "Labour Union", value: "labourContribution" },
        { text: "woman union", value: "womanUnion" },
        { text: "Credit Asso", value: "creditAssociation" },
        { text: "Penality", value: "penality" },
        { text: "Medication Dedc", value: "medicationDeduction" },
        { text: "Total Dedc", value: "totalDeduction" },
        { text: "Net pay", value: "netSalary" },
        { text: "Account No", value: "bankAccountNum" }
      ],
      summaryHeaders: [
      { text: "No of Employee", value: "noOfEmployee" },
      { text: "Department", value: "department" },
      { text: "worked Salary", value: "workedSalary" },
      { text: "OT Payment", value: "otPayment" },
      { text: "Response Allow", value: "responseAllow" },
      { text: "Home Allow", value: "homeAllow" },
      { text: "Position Allow", value: "positionAllow" },
      { text: "Professional Allow", value: "professionalAllow" },
      { text: "Food Allow", value: "foodAllow" },
      { text: "Mobile Allow", value: "mobileAllow" },
      { text: "Incentive Allow ", value: "incentiveAllow" },
      { text: "Income tax", value: "incomeTax" },
      { text: "Pension(11%)", value: "pension11" },
      { text: "Pension(7%)", value: "pension7" },
      { text: "Cost sharing", value: "costSharing" },
      { text: "Labour union", value: "labourUnion" },
      { text: "woman union", value: "womanUnion" },
      { text: "Net pay", value: "netPay" }
    ],
    };
  },
  async created() {
   this.getReport(this.da);
   this.taxSlab = (await api.all(path.taxSlab)).rows;
    this.taxSlab = this.taxSlab.sort(function(a, b) {
      return parseFloat(a.initial) - parseFloat(b.initial);
    });
    if (this.taxSlab.length > 0) {
      this.getReport(new Date());
      // this.summary = (await api.all(this.path, this.filter)).rows;
      // this.getAttendance();
    } else {
      this.$notify({
        type: "danger",
        title: "Tax Slab not found",
        message: `${this.$t("Please create tax slab")} ${this.$t(" first?")}`
      });
      this.$router.push({ name: "create-tax-slab" });
    }
  },

  computed: {
    ...mapState("payrolls", ["report", "summaryTran"]),
  },
  methods: {
    ...mapActions("payrolls", ["getPFinanceReport"]),
    async getReport(date) {
      this.getPFinanceReport(date);
    },
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

