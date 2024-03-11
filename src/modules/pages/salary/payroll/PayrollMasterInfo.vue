
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
      <!-- <v-breadcrumbs :items="camps">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs> -->
      <v-spacer />
      <v-flex xs12 sm12 md4 lg4 pa-1>
        <v-text-field
          :label="$t('filter-by-date')"
          placeholder="YYYY-MM"
          dense
          outlined
          hide-details
          v-model="date"
          v-validate="'required'"
          type="month"
          @input="loadData"
        />
      </v-flex>
      <v-spacer />
      <v-btn small text color="primary" class="text-capitalize" @click="show">{{
        $t("payback-misc-payment")
      }}</v-btn>
      <v-spacer />
      <v-btn
        small
        text
        class="primary--text text-capitalize"
        @click="$router.push({ name: 'over-time-list', params: item.id })"
        >{{ $t("overtime") }}</v-btn
      >
      <!-- <v-spacer />
      <v-btn
        small
        color="primary"
        class="text-capitalize"
        @click="$router.push({ name: 'attendance-list', params: item.id })"
        >{{ $t("attendance") }}</v-btn  >-->

      <v-spacer />
    </v-toolbar>

    <v-container grid-list-xs>
      <v-layout row wrap justify-center>
        <v-flex xs12 sm12 md12 lg12 pa-2>
          <v-flex xs12 sm12 md12 lg12 pa-2 dense class="primary white--text">
            <v-layout row wrap justify-center>
              <h3 xs12 sm12 md6 lg6>
                {{ $t("employee-payroll-master-information") }}
              </h3>
            </v-layout>
          </v-flex>
          <v-card outlined>
            <v-card-text>
              <v-layout row wrap justify-center>
                <v-flex xs12 sm12 md2 lg2>
                  <b>{{ $t("idno") }}:</b>
                  {{ item.idno }}
                </v-flex>
                <v-flex xs12 sm12 md2 lg2>
                  <b>{{ $t("fullName") }}:</b>
                  {{ item.fullName }}
                </v-flex>
                <v-flex xs12 sm12 md2 lg2>
                  <b>{{ $t("gender") }}:</b>
                  {{ item.gender }}
                </v-flex>
                <v-flex xs12 sm12 md2 lg2>
                  <b>{{ $t("joiningDate") }}:</b>
                  {{ new Date(item.joiningDate).toLocaleDateString("en-US") }}
                </v-flex>
                <v-flex xs12 sm12 md2 lg2>
                  <b>{{ $t("department") }}:</b>
                  {{ item.department }}
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
        <!--Employee Payroll Information=====================-->
        <v-flex xs12 sm12 md12 lg12 pa-2>
          <v-card outlined>
            <v-card-text>
              <v-layout row wrap justify-center>
                <v-flex xs12 sm12 md3 lg3 pa-2>
                  <v-card outlined height="100%">
                    <v-card-text>
                      <p>
                        <b>{{ $t("subDept") }}:</b>
                        {{ item.subDept }}
                      </p>
                      <p>
                        <b>{{ $t("salary") }}:</b>
                        {{ item.salary }}
                      </p>
                      <p>
                        <b>{{ $t("salary-per-work-day") }}:</b>
                        {{ item.salaryPerWorkDay }}
                      </p>
                      <p>
                        <b>{{ $t("gross-salary") }}:</b>
                        {{ item.grossSalary }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-flex>

                <v-flex xs12 sm12 md3 lg3 pa-2>
                  <v-card outlined height="100%">
                    <v-card-text>
                      <p>
                        <b>{{ $t("att-bonus") }}:</b>
                        {{ item.attBonus }}
                      </p>
                      <p>
                        <b>{{ $t("daily-rate") }}:</b>
                        {{ item.dailyRate }}
                      </p>
                      <p>
                        <b>{{ $t("per-hr-rate") }}:</b>
                        {{ item.perHrRate }}
                      </p>
                      <p>
                        <b>{{ $t("transportPay") }}:</b>
                        {{ item.transportPay }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-flex>

                <v-flex xs12 sm12 md3 lg3 pa-2>
                  <v-card outlined height="100%">
                    <v-card-text>
                      <p>
                        <b>{{ $t("labour-union") }}(1%):</b>
                        {{ item.labourUnion }}
                      </p>
                      <p>
                        <b>{{ $t("ironIncentive") }}:</b>
                        {{ item.ironIncentive }}
                      </p>
                      <p>
                        <b>{{ $t("pensionDeduction") }}(7%):</b>
                        {{ item.pensionContribution }}
                      </p>

                      <p>
                        <b>{{ $t("pensionContribution") }}(11%):</b>
                        {{ item.pensionDeduction }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-flex>

                <v-flex xs12 sm12 md3 lg3 pa-2>
                  <v-card outlined height="100%">
                    <v-card-text>
                      <p>
                        <b>{{ $t("costSharing") }}:</b>
                        {{ item.costSharing }}%
                      </p>

                      <p>
                        <b>{{ $t("responseAllow") }}:</b>
                        {{ item.responseAllow }}
                      </p>
                      <p>
                        <b>{{ $t("homeAllow") }}:</b>
                        {{ item.homeAllow }}
                      </p>

                      <p>
                        <b>{{ $t("incentive") }}:</b>
                        {{ item.incentiveSalary }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12 pa-2>
          <v-card outlined>
            <v-card-text>
              <v-layout row wrap justify-center>
                <v-flex xs12 sm12 md3 lg3>
                  <b>{{ $t("taxable-income") }}:</b>
                  {{ item.taxIncome }}
                </v-flex>
                <v-flex xs12 sm12 md3 lg3>
                  <b>{{ $t("income-tax-deduction") }}:</b>
                  {{ item.incomeTaxDeduction }}
                </v-flex>
                <v-flex xs12 sm12 md3 lg3>
                  <b>{{ $t("al-carry-frwd") }}:</b>
                  {{
                    parseFloat(item.attendance[0].totalAL) +
                      parseFloat(item.remainingAl)
                  }}
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
        <!--Employee Attendannce Information=====================-->
        <v-flex xs12 sm12 md12 lg12 pa-2>
          <v-flex xs12 sm12 md12 lg12 pa-2 dense class="primary white--text">
            <v-layout row wrap justify-center>
              <h3 xs12 sm12 md6 lg6>{{ $t("employee-attendance-summary") }}</h3>
            </v-layout>
          </v-flex>
          <v-card outlined>
            <v-card-text>
              <v-layout row wrap justify-center>
                <v-flex xs12 sm12 md3 lg3 pa-2>
                  <v-card outlined height="100%">
                    <v-card-text>
                      <p>
                        <b>{{ $t("total-present") }}:</b>
                        {{ item.attendance[0].totalP }}
                      </p>
                      <p>
                        <b>{{ $t("total-absent") }}:</b>
                        {{ item.attendance[0].totalA }}
                      </p>
                      <p>
                        <b>{{ $t("total-permission") }}:</b>
                        {{ item.attendance[0].totalPr }}
                      </p>
                      <p>
                        <b>{{ $t("total-paternity-lv") }}:</b>
                        {{ item.attendance[0].totalPL }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-flex>

                <v-flex xs12 sm12 md3 lg3 pa-2>
                  <v-card outlined height="100%">
                    <v-card-text>
                      <p>
                        <b>{{ $t("total-mouring-lv") }}:</b>
                        {{ item.attendance[0].totalDL }}
                      </p>
                      <p>
                        <b>{{ $t("total-marriage-lv") }}:</b>
                        {{ item.attendance[0].totalMGL }}
                      </p>
                      <p>
                        <b>{{ $t("total-maternity-lv") }}:</b>
                        {{ item.attendance[0].totalML }}
                      </p>
                      <p>
                        <b>{{ $t("total-al-availed") }}:</b>
                        {{ item.attendance[0].totalAL }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-flex>

                <v-flex xs12 sm12 md3 lg3 pa-2>
                  <v-card outlined height="100%">
                    <v-card-text>
                      <p>
                        <b>{{ $t("total-hlpr") }}:</b>
                        {{ item.attendance[0].totalHLPr }}
                      </p>
                      <p>
                        <b>{{ $t("total-hla") }}:</b>
                        {{ item.attendance[0].totalHLA }}
                      </p>
                      <p>
                        <b>{{ $t("total-free-leave") }}:</b>
                        {{ item.attendance[0].totalFL }}
                      </p>
                      <p>
                        <b>{{ $t("special-leave") }}:</b>
                        {{ item.attendance[0].totalSpecialL }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 sm12 md3 lg3 pa-2>
                  <v-card outlined height="100%">
                    <v-card-text>
                      <p>
                        <b>{{ $t("total-late-minutes") }}:</b>
                        {{ item.attendance[0].totalLate }}
                      </p>
                      <p>
                        <b>{{ $t("total-sl") }}:</b>
                        {{ item.attendance[0].totalSL }}
                      </p>
                      <p>
                        <b>{{ $t("working-days") }}:</b>
                        {{ item.attendance[0].workingDays }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
        <!--=============Employee Overtime info======================-->
        <v-flex xs12 sm12 md5 lg5 pa-2>
          <v-card outlined height="100%">
            <v-card-text>
              <v-layout row justify-center class="primary">
                <h3 xs12 sm12 md5 lg5 ma-3 class="white--text">
                  <u>{{ $t("over-time-hour") }}</u>
                </h3>
              </v-layout>
              <v-data-table :headers="headers" :items="item.otHr" />
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md5 lg5 pa-2>
          <v-card outlined height="100%">
            <v-card-text>
              <v-layout row justify-center class="primary">
                <h3 xs12 sm12 md5 lg5 ma-3 class="white--text">
                  <u>{{ $t("over-time-payment") }}</u>
                </h3>
              </v-layout>
              <v-data-table :headers="headerPayment" :items="item.otBirr" />
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12 pa-2>
          <v-card outlined>
            <v-card-text>
              <v-layout row wrap justify-center>
                <v-flex xs12 sm12 md4 lg4 pa-2>
                  <v-card outlined height="100%">
                    <v-card-text>
                      <p>
                        <b>{{ $t("remainingAl") }}:</b>
                        {{ item.remainingAl }}
                      </p>
                      <p>
                        <b>{{ $t("att-bonus") }}:</b>
                        {{ item.attBonus }}
                      </p>
                      <p>
                        <b>{{ $t("miscPayment") }}:</b>
                        {{ item.miscPayment }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-flex>

                <v-flex xs12 sm12 md4 lg4 pa-2>
                  <v-card outlined height="100%">
                    <v-card-text>
                      <p>
                        <b>{{ $t("misc-payment") }}:</b>
                        {{ item.miscBirr }}
                      </p>
                      <p>
                        <b>{{ $t("tax-deduction") }}:</b>
                        {{ item.taxDeduction }}
                      </p>
                      <p>
                        <b>{{ $t("total-deduction") }}:</b>
                        {{ item.totalDeduction }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-flex>

                <v-flex xs12 sm12 md4 lg4 pa-2>
                  <v-card outlined height="100%">
                    <v-card-text>
                      <p>
                        <b>{{ $t("net-payment") }}:</b>
                        {{ item.netPayment }}
                      </p>
                      <p>
                        <b>{{ $t("payback") }}:</b>
                        {{ item.payback }}
                      </p>
                      <p>
                        <b>{{ "net-salary" }}:</b>
                        {{ item.netSalary }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md4 lg4 pa-2>
          <v-btn
            outlined
            block
            rounded
            color="primary"
            class="text-capitalize"
            @click="
              $router.push({
                name: 'update-payroll-master',
                params: { payrollId: item.id }
              })
            "
          >
            <v-icon class="mx-2">edit</v-icon>
            {{ $t("change_info") }}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Payback Register-->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-divider :inset="inset"></v-divider>
        <v-layout column justify-center align-center>
          <h1>{{ $t("create-payback") }}</h1>
          <v-form @submit.prevent="save">
            <form-error-messages :messages="errorMessage" />
            <v-layout row justify-center align-center>
              <v-flex xs12 sm12 md12 lg12 pa-1>
                <v-text-field
                  v-validate="'required'"
                  v-model="paybackItem.payback"
                  :error-messages="errors.collect('payback')"
                  :label="$t('payback')"
                  name="payback"
                  outlined
                  dense
                  type="number"
                />
              </v-flex>
              <v-flex xs12 sm12 md12 lg12 pa-1>
                <v-text-field
                  v-validate="'required'"
                  v-model="paybackItem.miscPayment"
                  :error-messages="errors.collect('miscPayment')"
                  :label="$t('miscPayment')"
                  name="miscPayment"
                  outlined
                  dense
                  type="number"
                />
              </v-flex>
            </v-layout>
            <v-flex xs12 sm12 md8 lg8>
              <div class="text-center">
                <v-btn
                  rounded
                  outlined
                  block
                  color="primary"
                  class="text-capitalize"
                  @click="registerPayback"
                  >{{ $t("save") }}</v-btn
                >
              </div>
            </v-flex>
          </v-form>
        </v-layout>
        <br />
      </v-card>
    </v-dialog>
    <!-- Line And Operator dialog -->
  </div>
</template>

<script>
import { api, path } from "@/api";

export default {
  name: "payrollInfo",
  data() {
    return {
      resourceName: "Payroll Master",
      item: {},
      inset: false,
      path: path.payroll,
      size: 150,
      date: new Date().toISOString().substr(0, 7),
      payrollId: "",
      // overtime: [],
      paybackItem: {},
      dialog: false,
      // overtimeTable: [],
      // errorMessage: null,
      // overtimePayment: [],
      // attendance: [],
      // tempAttend: [],
      // attendanceTable: [],
      // totalWorkDays: 30,
      // salaryPerWorkDay: 0,
      // grossSalary: 0,
      // labourUnion: 0,
      // dailyRate: 0,
      // perHrRate: 0,
      // idno: "",
      // filter: {
      //   include: ["employee"]
      // },
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
          text: "Payroll Master info",
          disabled: true
        }
      ],
      headers: [
        {
          text: this.$t("normal-day"),
          value: "otHr125"
        },
        {
          text: this.$t("night"),
          value: "otHr15"
        },
        {
          text: this.$t("rest-day"),
          value: "otHr20"
        },
        {
          text: this.$t("holiy-day"),
          value: "otHr25"
        }
      ],
      headerPayment: [
        {
          text: this.$t("normal-day"),
          value: "otHr125"
        },
        {
          text: this.$t("night"),
          value: "otHr15"
        },
        {
          text: this.$t("rest-day"),
          value: "otHr20"
        },
        {
          text: this.$t("holiy-day"),
          value: "otHr25"
        },
        {
          text: this.$t("total"),
          value: "total"
        }
      ]
      // totalP: 0,
      // totalA: 0,
      // totalPr: 0,
      // totalMOL: 0,
      // totalMGL: 0,
      // totalML: 0,
      // totalPL: 0,
      // totalLate: 0,
      // totalSL: 0,
      // totalHLA: 0,
      // totalHLPR: 0,
      // totalAL: 0,
      // totalSpecialL: 0,
      // totalFL: 0,
      // workingDays: 0,
      // al: {},
      // attBonus: 0,
      // totalOvertime: 0,
      // taxableIncome: 0,
      // taxDeduction: 0,
      // taxSlab: [],
      // payment: 0,
      // paymentTax: 0,
      // totalDeduction: 0,
      // netPayment: 0,
      // netSalary: 0,
      // months: [
      //   { month: "January", number: "1" },
      //   { month: "February", number: "2" },
      //   { month: "March", number: "3" },
      //   { month: "April", number: "4" },
      //   { month: "May", number: "5" },
      //   { month: "June", number: "6" },
      //   { month: "July", number: "7" },
      //   { month: "August", number: "8" },
      //   { month: "September", number: "9" },
      //   { month: "October", number: "10" },
      //   { month: "November", number: "11" },
      //   { month: "December", number: "12" }
      // ],
      // temp: 0
    };
  },
  async created() {
    // this.taxSlab = (await api.all(path.taxSlab)).rows;
    // this.taxSlab = this.taxSlab.sort(function(a, b) {
    //   return parseFloat(a.initial) - parseFloat(b.initial);
    // });
    // if (this.taxSlab.length > 0) {
    const { payrollId } = this.$route.params;
    this.payrollId = payrollId;
    // let date = new Date();
    this.loadData(new Date());
    // } else {
    //   this.$notify({
    //     type: "danger",
    //     title: "Tax Slab not found",
    //     message: `${this.$t("Please create tax slab")} ${this.$t(" first?")}`
    //   });
    //   this.$router.push({ name: "create-tax-slab" });
    // }
  },
  methods: {
    async loadData(d) {
      let dat = new Date(d);
      await api
        .create({ date: dat, payrollId: this.payrollId }, path.payrollInfo)
        .then(result => {
          if (result[0].type == "success") {
            this.item = result[0].item;
            this.paybackItem = {
              date: this.item.date,
              remainingAl: this.item.remainingAl,
              miscPayment: this.item.miscPayment,
              payback: this.item.payback,
              employeeId: this.item.employeeId,
              id: this.item.id
            };
          } else {
            this.$notify({
              type: "danger",
              title: "No data",
              message: `${this.$t("please register")} ${this.$t(" tax slab?")}`
            });
            this.$router.push({ name: "create-tax-slab" });
          }
        });
      // this.makeValuesNull();
      // this.item = await api.get(this.payrollId, this.path, this.filter);
      // this.paybackItem = {
      //   date: this.item.date,
      //   remainingAl: this.item.remainingAl,
      //   miscPayment: this.item.miscPayment,
      //   payback: this.item.payback,
      //   employeeId: this.item.employee.id,
      //   id: this.item.id
      // };
      let date = new Date();
      let dd = new Date(this.item.date);
      if (dd.getFullYear() !== date.getFullYear()) {
        this.changeAL();
      }
      // this.getTotalWorkDays(month);
    },
    show() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    registerPayback() {
      api
        .update(this.paybackItem, this.path)
        .then(() => {
          this.$notify({
            type: "success",
            title: "Register Payback and MISC",
            message: `${this.$t("Payback and MISC")} ${this.$t(
              " value is created!!!"
            )}`
          });
          this.loadData();
        })
        .catch(err => {
          this.showErrors(err);
        });
    },
    changeAL() {
      // ===================Joining Date===================================
      let jod = new Date(this.item.joiningDate);
      let jd = jod.getDate();
      let jm = jod.getMonth() + 1;
      let jy = jod.getFullYear();
      // ===================Current Date===================================
      let date = new Date();
      let cd = date.getDate();
      let cm = date.getMonth() + 1;
      let cy = date.getFullYear();
      let m, y, d;
      y = cy - jy;
      if (cm >= jm) m = cm - jm;
      else {
        y--;
        m = 12 + cm - jm;
      }

      if (cd >= jd) d = cd - jd;
      else {
        m--;
        d = 31 + cd - jd;

        if (m < 0) {
          m = 11;
          y--;
        }
      }
      let tal;

      if (y == 0) {
        tal = 0;
        this.al = {
          date: new Date(),
          remainingAl: tal,
          id: this.item.id,
          employeeId: this.item.employeeId
        };
        api
          .update(this.al, this.path)
          .then(() => {
            this.$notify({
              type: "success",
              title: "Update Anual leave",
              message: `${this.$t("Anual leave")} ${this.$t(
                " value is changed!!!"
              )}`
            });
          })
          .catch(err => {
            this.showErrors(err);
          });
        this.loadData();
      }
      if (y == 1) {
        tal = 16;
        this.al = {
          date: new Date(),
          remainingAl: tal,
          id: this.item.id,
          employeeId: this.item.employeeId
        };
        api
          .update(this.al, this.path)
          .then(() => {
            this.$notify({
              type: "success",
              title: "Update Anual leave",
              message: `${this.$t("Anual leave")} ${this.$t(
                " value is changed!!!"
              )}`
            });
          })
          .catch(err => {
            this.showErrors(err);
          });
        this.loadData();
      }
      if (y == 2) {
        tal = 17 + parseInt(this.item.remainingAl);
        this.al = {
          date: new Date(),
          remainingAl: tal,
          id: this.item.id,
          employeeId: this.item.employeeId
        };
        api
          .update(this.al, this.path)
          .then(() => {
            this.$notify({
              type: "success",
              title: "Update Anual leave",
              message: `${this.$t("Anual leave")} ${this.$t(
                " value is changed!!!"
              )}`
            });
          })
          .catch(err => {
            this.showErrors(err);
          });
        this.loadData();
      }
      if (y == 3 || y == 4) {
        tal = 18 + parseInt(this.item.remainingAl);
        this.al = {
          date: new Date(),
          remainingAl: tal,
          id: this.item.id,
          employeeId: this.item.employeeId
        };
        api
          .update(this.al, this.path)
          .then(() => {
            this.$notify({
              type: "success",
              title: "Update Anual leave",
              message: `${this.$t("Anual leave")} ${this.$t(
                " value is changed!!!"
              )}`
            });
          })
          .catch(err => {
            this.showErrors(err);
          });
        this.loadData();
      }
      if (y >= 5) {
        tal = parseInt(this.item.remainingAl) + 18 + Math.floor((y - 5) / 2);
        this.al = {
          date: new Date(),
          remainingAl: tal,
          id: this.item.id,
          employeeId: this.item.employeeId
        };
        api
          .update(this.al, this.path)
          .then(() => {
            this.$notify({
              type: "success",
              title: "Update Anual leave",
              message: `${this.$t("Anual leave")} ${this.$t(
                " value is changed!!!"
              )}`
            });
          })
          .catch(err => {
            this.showErrors(err);
          });
        this.loadData();
      }
      this.temp = m + d;
    }
  }
};
</script>
