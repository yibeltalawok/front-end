
<template>
  <v-app>
    <!-- <v-breadcrumbs :items="camps">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs> -->

    <v-container grid-list-xs>
      <v-card outlined style="border-radius:13px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="
              $router.push({
                name: 'employee-detail',
                params: { employeeId: employeeId }
              })
            "
          >
            <v-icon class="mx-3">mdi-chevron-left</v-icon>
            {{ $t("go_back") }}
          </v-btn>
          <v-spacer />
          <h1 class="primary--text">{{ $t("list-of-attendance") }}</h1>
          <!-- </v-flex> -->
          <v-spacer />
          <!-- <v-flex xs12 sm12 md4 lg4 pa-1> -->
          <v-autocomplete
            :label="$t('filter-by-month')"
            :items="months"
            item-text="month"
            item-value="number"
            outlined
            dense
            hide-details
            @input="getAttendance"
          />
          <v-text-field
            v-model="attendanceYear"
            name="name"
            label="Year"
            id="id"
            hide-details
            dense
            outlined
          ></v-text-field>
          <v-spacer />
          <!-- </v-flex> -->
          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout row wrap justify-center>
          <v-flex
            xs6
            sm6
            md2
            lg2
            pa-5
            v-for="item in tempAttend"
            :key="item.value"
          >
            <v-layout row wrap justify-center>
              <v-flex dense class="primary white--text" xs6 sm6 md8 lg8 pa-1>
                <b>{{ $t("date") }}:</b>
                {{ new Date(item.dateAttended).getDate() }}
              </v-flex>
              <v-flex dense class="primary white--text" xs4 sm4 md4 lg4>
                <v-btn
                  text
                  small
                  color="success"
                  class="text-capitalize"
                  @click="deleteItem(item.id, path, item.month)"
                  v-if="item.type == 'update'"
                >
                  <v-icon small class="red--text">delete</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-card outlined>
              <v-card-text>
                <v-layout row wrap justify-center>
                  <v-flex xs6 sm6 md5 lg5 pa-1>
                    <!-- <b>{{ $t("value") }}:</b> -->
                    <b>{{ item.value == "MOL" ? "DL" : item.value }}</b>
                  </v-flex>
                  <v-divider vertical></v-divider>
                  <v-flex xs6 sm6 md6 lg6 pa-1>
                    <v-btn
                      text
                      small
                      class="primary--text text-capitalize"
                      @click="show(item)"
                    >
                      <v-icon small class="primary--text">edit</v-icon>
                      <!-- {{ $t("edit") }} -->
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-overlay :value="overlay">
            <v-card class="yellow" width="300px">
              <v-card-text>
                <p class="text-center">Don't close till complete.....</p>
                <v-progress-linear
                  color="primary"
                  indeterminate
                  rounded
                  height="6"
                />
              </v-card-text>
            </v-card>
          </v-overlay>
        </v-layout>
      </v-card>
    </v-container>

    <!-- Rating Register-->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-divider :inset="inset"></v-divider>
        <v-layout column justify-center align-center>
          <h1>Create Reason</h1>
          <v-form @submit.prevent="save">
            <v-layout row justify-center align-center>
              <v-flex xs12 sm12 md8 lg8 pa-1>
                <v-autocomplete
                  label="Select reason"
                  v-model="selectedAtt.value"
                  :items="reasons"
                  item-text="name"
                  item-value="value"
                  outlined
                  dense
                  @input="checkAL_MGL(selectedAtt.value)"
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-1 v-if="showLateMinutes">
                <v-text-field
                  v-validate="'required'"
                  v-model="selectedAtt.lateMinutes"
                  :error-messages="errors.collect('lateMinutes')"
                  :label="$t('Late Minutes')"
                  name="lateMinutes"
                  outlined
                  dense
                  type="number"
                />
              </v-flex>
              <v-flex xs12 sm12 md5 lg5 pa-1 v-if="isSL || isML || isPL">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="slStartDate"
                      label="Select Start Date"
                      readonly
                      v-on="on"
                      outlined
                      dense
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="slStartDate"
                    @input="menu1 = false"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm12 md5 lg5 pa-1 v-if="isSL">
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="slEndDate"
                      label="Select End Date"
                      readonly
                      v-on="on"
                      outlined
                      dense
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="slEndDate"
                    @input="menu2 = false"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
            </v-layout>
            <v-flex xs12 sm12 md11 lg11>
              <div class="text-center">
                <v-btn
                  rounded
                  outlined
                  block
                  color="primary"
                  class="text-capitalize"
                  @click="save"
                  >Save</v-btn
                >
              </div>
            </v-flex>
          </v-form>
        </v-layout>
        <br />
        {{itemdata}}
      </v-card>
    </v-dialog>
    <!-- Line And Operator dialog -->
    <v-overlay :absolute="absolute" :value="tableOverlay">
      <v-progress-circular indeterminate size="64">
        Loading...
      </v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import { api, path } from "@/api";
import { mapActions, mapState } from "vuex";
//import { tableMixin, csvDownloadMixin } from "@/shared/mixins";
export default {
  name: "Attendance",
  // mixins: [tableMixin, csvDownloadMixin],
  data() {
    return {
      overlay: false,
      tableOverlay: false,
      menu1: false,
      menu2: false,
      inset: false,
      resource: api,
      path: path.attendance,
      filter: { include: ["employee"], where: {} },
      joiningDate: "",
      attendance: [],
      payroll: [],
      resourceName: "Attendance",
      searchField: "date",
      payrollId: "",
      dialog: false,
      slectedId: "",
      selectedAtt: [],
      attend: [],
      tempAttend: [],
      createA: {},
      allInOne: [],
      reasons: [
        { name: "Present", value: "P" },
        { name: "Absent", value: "A" },
        { name: "Permision", value: "Pr" },
        { name: "Anual Live", value: "AL" },
        { name: "Death Leave", value: "MOL" },
        { name: "HLPR", value: "HLPR" },
        { name: "HLA", value: "HLA" },
        { name: "Maternity Leave", value: "ML" },
        { name: "paternity Leave", value: "PL" },
        { name: "Sick Leave", value: "SL" },
        { name: "Marriage Leave", value: "MGL" },
        { name: "Late minutes", value: "LeM" },
        { name: "Special L", value: "Special L" },
        { name: "Free Leave", value: "FL" }
      ],
      isReasnable: true,
      camps: [],
      days: ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur"],
      al: {},
      value: "",
      months: [
        { month: "January", number: "1" },
        { month: "February", number: "2" },
        { month: "March", number: "3" },
        { month: "April", number: "4" },
        { month: "May", number: "5" },
        { month: "June", number: "6" },
        { month: "July", number: "7" },
        { month: "August", number: "8" },
        { month: "September", number: "9" },
        { month: "October", number: "10" },
        { month: "November", number: "11" },
        { month: "December", number: "12" }
      ],
      slectedMonth: "",
      showLateMinutes: false,
      isSL: false,
      isML: false,
      isPL: false,
      slStartDate: null,
      slEndDate: null,
      noOfDays: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      count: 0,
      percent: 0,
      barDailog: false,
      employeeId: "",
      attendanceYear: ""
    };
  },
  async created() {
    // const { payrollId } = this.$route.params;
    // this.payrollId = payrollId;
    const { employeeId } = this.$route.params;
    this.employeeId = employeeId;
    let temp = (
      await api.all(path.payroll, {
        where: { employeeId: employeeId }
      })
    ).rows;
    this.payroll = temp[0];
    // this.joiningDate = this.payroll.employee.joiningDate;
    let date = new Date();
    this.attendanceYear = date.getFullYear();
    this.getAttendance(date.getMonth() + 1);
    this.camps = [
      {
        text: "Dashboard",
        disabled: false,
        to: "dasboard"
      },
      {
        text: "Employee",
        disabled: false,
        to: "/app/employees"
      },
      {
        text: "Employee Detail",
        disabled: false,
        // to: "/app/payroll/master/" + employeeId + "/info"
        to: "/app/employee/" + this.employeeId + "/detail"
      },
      {
        text: "Attendance List",
        disabled: true
      }
    ];
  },
  watch: {
    overlay(val) {
      val &&
        setTimeout(() => {
          this.overlay = false;
        }, 5000);
    }
  },
  computed: {
    ...mapState("attendance", ["attendEmp"]),
   ...mapState("taxslab", ["itemdata"])

  },
  updated() {
    setTimeout(() => {
      this.tableOverlay = false;
    }, 5000); //
  },
  methods: {
    ...mapActions("attendance", ["mapAttendance"]),
   ...mapActions("taxslab", ["getAttendanceList"]),
    async show(item) {
      this.selectedAtt = item;
      this.showLateMinutes = false;
      this.isSL = false;
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    //===============================================getAttendance============================================
    async getAttendance(month) {
      this.attendance = [];
      this.tempAttend = [];
      this.isReasnable = true;
      this.dialog = false;
      this.overlay = false;
      // this.barDailog = true;
      this.isSL = false;
      this.isSL = false;
      this.isPL = false;
      // let date = new Date();
      // let year = date.getFullYear();
      // let fil = {
      //   where: {
      //     // employeeId: this.payroll.employee.id,
      //     employeeId: this.employeeId,
      //     month: month,
      //     year: year
      //   }
      // };
      // this.attendance = (await api.all(path.attendance, fil)).rows;
      // this.attendance.sort(function(a, b) {
      //   var dateA = new Date(a.dateAttended),
      //     dateB = new Date(b.dateAttended);
      //   return dateA - dateB;
      // });
      this.tableOverlay = true;
      await api
        .create(
          {
            value: this.employeeId,
            type: "employee",
            month: month,
            year: this.attendanceYear
          },
          path.getAttendance
        )
        .then(result => {
          this.tempAttend = result[0].attendance;
          this.tableOverlay = false;
        });
      // this.manageAtendanceUI();
    },
    //===========================================checkAL_MGL-===================================================================
    async checkAL_MGL(value) {
      this.showLateMinutes = false;
      this.isSL = false;
      this.isPL = false;
      this.isML = false;
      this.value = value;

      if (value == "AL") {
        //alert(value);
        this.isReasnable =
          parseInt(this.payroll.remainingAl) > 0 ? true : false;
        if (this.isReasnable == false) {
          this.$notify({
            type: "danger",
            title: this.$t("Getting Anual leave"),
            message: `${this.$t("You use all of of your ")} ${this.$t(
              "Anual leave!"
            )}`
          });
        }
      }
      if (value == "LeM") {
        this.showLateMinutes = true;
      }
      if (value == "SL") {
        this.checkSL();
      }
      if (value == "ML") {
        this.isReasnable = false;
        this.isML = true;
      }
      if (value == "PL") {
        this.isReasnable = false;
        this.isPL = true;
      }
      if (value == "MGL") {
        this.isPL = true;
        let fil = {
          where: {
            value: value,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            // employeeId: this.payroll.employee.id
            employeeId: this.employeeId
          }
        };
        let mgl = (await api.all(path.attendance, fil)).rows;
        this.isReasnable = mgl.length == 0 ? true : false;
        if (this.isReasnable == false) {
          this.isPL = false;
          this.$notify({
            type: "danger",
            title: this.$t("Getting marriage leave"),
            message: `${this.$t("You use all of of your ")} ${this.$t(
              "marriage leave!"
            )}`
          });
        }
      }
    },
    //=======================================Save============================================================
    save() {
      this.overlay = true;
      if (this.isReasnable) {
        if (this.value == "AL") {
          // this.al = {
          //   date: new Date(),
          //   remainingAl: parseInt(this.payroll.remainingAl) - 1,
          //   id: this.payrollId,
          //   // employeeId: this.payroll.employeeId
          //   employeeId: this.employeeId
          // };
          this.payroll.date = new Date();
          this.payroll.remainingAl = parseInt(this.payroll.remainingAl) - 1;
          api
            .update(this.payroll, path.payroll)
            .then(() => {
              this.updateAttendance();
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
        } else {
          if (this.value != "MGL") {
            this.updateAttendance();
          } else {
            this.registerPL(5);
          }
        }
      } else if (this.value == "SL") {
        if (
          this.slStartDate <= this.slEndDate &&
          this.slStartDate != null &&
          this.slEndDate != null
        ) {
          this.registerSL(this.slStartDate, this.slEndDate);
        } else {
          this.$notify({
            type: "danger",
            title: this.$t("Error"),
            message: `${this.$t("Invalid Date Selection")} ${this.$t("!")}`
          });
        }
      } else if (this.value == "PL") {
        this.registerPL(3);
      } else if (this.value == "ML") {
        this.giveMaternityLeave();
      } else {
        this.$notify({
          type: "danger",
          title: this.$t("Getting "),
          message: `${this.$t("Reason is not accepted")} ${this.$t("!")}`
        });
      }
      this.overlay = false;
    },
    //==================================================checkSL=========================
    checkSL() {
      // ===================Joining Date===================================
      let jod = new Date(this.joiningDate);
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
      let probationP = y * 365 + m * 30 + d + 8;
      if (probationP > 60) {
        this.isSL = true;
        this.isReasnable = false;
      } else {
        this.isReasnable = false;
        this.$notify({
          type: "danger",
          title: "Sick Leave",
          message: `${this.$t("Sick Leave")} ${this.$t(
            " is  allowed after probation period of 60 working Days!!"
          )}`
        });
      }
    },
    //==============================updateAttendance=========================================
    updateAttendance() {
      this.isReasnable = true;
      if (this.selectedAtt.type == "update") {
        this.createA = {
          dateAttended: this.selectedAtt.dateAttended,
          month: this.selectedAtt.month,
          year: this.selectedAtt.year,
          value: this.selectedAtt.value,
          lateMinutes: this.selectedAtt.lateMinutes,
          employeeId: this.selectedAtt.employeeId,
          id: this.selectedAtt.id
        };
        api
          .update(this.createA, path.attendance)
          .then(() => {
            // this.getAttendance(this.selectedAtt.month);
            this.$notify({
              type: "success",
              title: "Attendance",
              message: `${this.$t("Attendance information")} ${this.$t(
                " is Changed!!!"
              )}`
            });
          })
          .catch(err => {
            this.showErrors(err);
          });
      } else {
        this.createA = {
          dateAttended: this.selectedAtt.dateAttended,
          month: this.selectedAtt.month,
          year: this.selectedAtt.year,
          value: this.selectedAtt.value,
          lateMinutes: this.selectedAtt.lateMinutes,
          employeeId: this.selectedAtt.employeeId
        };
        api
          .create(this.createA, path.attendance)
          .then(() => {
            this.$notify({
              type: "success",
              title: "Attendance",
              message: `${this.$t("Attendance information")} ${this.$t(
                " is created!!!"
              )}`
            });
          })
          .catch(err => {
            this.showErrors(err);
          });
      }
      this.getAttendance(this.selectedAtt.month);
    },
    //======================================manageAtendanceUI================================================
    manageAtendanceUI() {
      this.tempAttend = [];
      for (let j = 1; j <= new Date().getDate(); j++) {
        let date = new Date();
        date.setDate(j);
        this.tempAttend.push({
          dateAttended: date,
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          value: date.getDay() == 0 ? "P" : "A",
          type: "create",
          lateMinutes: 0,
          employeeId: this.employeeId
        });
      }
      for (let i = 0; i < this.attendance.length; i++) {
        let date = new Date(this.attendance[i].dateAttended);
        this.tempAttend[date.getDate() - 1].date = this.attendance[
          i
        ].dateAttended;
        this.tempAttend[date.getDate() - 1].value = this.attendance[i].value;
        this.tempAttend[date.getDate() - 1].id = this.attendance[i].id;
        this.tempAttend[date.getDate() - 1].type = "update";
      }
    },

    registerSL(startDate, endDate) {
      this.allInOne = [];
      let sDate = new Date(startDate);
      let eDate = new Date(endDate);
      let sy = sDate.getFullYear();
      let ey = eDate.getFullYear();
      if (sy == ey) {
        this.sameYear(startDate, endDate);
      }

      // ==============================For the Last Month========================================================================
      else {
        this.diffYear(startDate, endDate);
      }
    },
    sameYear(startDate, endDate) {
      let sd = new Date(startDate);
      let ed = new Date(endDate);
      if (sd.getMonth() == ed.getMonth()) {
        this.sameMonth(startDate, endDate);
      } else {
        this.diffMonth(startDate, endDate);
      }
    },
    diffYear(startDate, endDate) {
      this.firstYear(startDate, endDate);
    },

    sameMonth(startDate, endDate) {
      let sDate = new Date(startDate);
      let eDate = new Date(endDate);
      // ==============================For the Start Month========================================================================

      for (let j = sDate.getDate(); j <= eDate.getDate(); j++) {
        let date = new Date(startDate);
        date.setDate(j);

        let value = "SL";
        let slValue = 1;
        this.allInOne.push({
          dateAttended: date,
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          value: value,
          slValue: slValue,
          employeeId: this.employeeId
        });
      }
      api
        .create(this.allInOne, path.attendance)
        .then(() => {
          this.$notify({
            type: "success",
            title: "Attendance",
            message: `${this.$t("Attendance information")} ${this.$t(
              " is created!!!"
            )}`
          });
        })
        .catch(err => {
          this.showErrors(err);
        });

      this.getAttendance(sDate.getMonth() + 1);
    },
    diffMonth(startDate, endDate) {
      let count = 0;
      let sDate = new Date(startDate);
      let eDate = new Date(endDate);
      let sm = sDate.getMonth() + 1;
      let em = eDate.getMonth() + 1;
      for (let i = sm; i < em; i++) {
        if (i == sm) {
          for (let j = sDate.getDate(); j <= this.noOfDays[i - 1]; j++) {
            let date = new Date(startDate);
            date.setMonth(i - 1);
            count += 1;
            date.setDate(j);
            let value = "SL";
            let slValue = 1;
            this.allInOne.push({
              dateAttended: date,
              month: date.getMonth() + 1,
              year: date.getFullYear(),
              value: value,
              slValue: slValue,
              employeeId: this.employeeId
            });
          }
        } else {
          for (let k = 1; k <= this.noOfDays[i - 1]; k++) {
            let date = new Date(startDate);
            date.setMonth(i - 1);
            count += 1;
            date.setDate(k);
            let value = "SL";
            let slValue = 1;
            if (count > 30 && count <= 90) {
              slValue = 0.5;
            } else if (count > 90) {
              slValue = 0;
              value = "A";
            }
            this.allInOne.push({
              dateAttended: date,
              month: date.getMonth() + 1,
              year: date.getFullYear(),
              value: value,
              slValue: slValue,
              employeeId: this.employeeId
            });
          }
        }
      }

      this.endMonths(endDate, count);
    },
    endMonths(endDate, count) {
      let eDate = new Date(endDate);
      // ==============================For the End Month========================================================================
      for (let k = 1; k <= eDate.getDate(); k++) {
        let d = new Date(endDate);
        d.setDate(k);
        count += 1;
        let value = "SL";
        let slValue = 1;
        if (count > 30 && count <= 90) {
          slValue = 0.5;
        } else if (count > 90) {
          slValue = 0;
          value = "A";
        }
        this.allInOne.push({
          dateAttended: d,
          month: d.getMonth() + 1,
          year: d.getFullYear(),
          value: value,
          slValue: slValue,
          employeeId: this.employeeId
        });
      }
      api
        .create(this.allInOne, path.attendance)
        .then(() => {
          this.$notify({
            type: "success",
            title: "Attendance",
            message: `${this.$t("Attendance information")} ${this.$t(
              " is created!!!"
            )}`
          });
        })
        .catch(err => {
          this.showErrors(err);
        });

      this.getAttendance(eDate.getMonth() + 1);
    },
    firstYear(startDate, endDate) {
      let sDate = new Date(startDate);
      let count = 0;
      let sm = new Date(startDate).getMonth() + 1;
      for (let i = sm; i <= 12; i++) {
        if (i == sm) {
          for (let j = sDate.getDate(); j <= this.noOfDays[i - 1]; j++) {
            let date = new Date(startDate);
            date.setMonth(i - 1);
            count += 1;
            date.setDate(j);
            let value = "SL";
            let slValue = 1;
            this.allInOne.push({
              dateAttended: date,
              month: date.getMonth() + 1,
              year: date.getFullYear(),
              value: value,
              slValue: slValue,
              employeeId: this.employeeId
            });
          }
        } else {
          for (let k = 1; k <= this.noOfDays[i - 1]; k++) {
            let date = new Date(startDate);
            date.setMonth(i - 1);
            count += 1;
            date.setDate(k);
            let value = "SL";
            let slValue = 1;
            this.allInOne.push({
              dateAttended: date,
              month: date.getMonth() + 1,
              year: date.getFullYear(),
              value: value,
              slValue: slValue,
              // employeeId: this.payroll.employee.id
              employeeId: this.employeeId
            });
          }
        }
      }
      this.nextYear(endDate, count);
    },
    nextYear(endDate, count) {
      let eDate = new Date(endDate);
      for (let i = 1; i <= eDate.getMonth(); i++) {
        for (let k = 1; k <= this.noOfDays[i - 1]; k++) {
          let date = new Date(endDate);
          date.setMonth(i - 1);
          count += 1;
          date.setDate(k);
          let value = "SL";
          let slValue = 1;
          this.allInOne.push({
            dateAttended: date,
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            value: value,
            slValue: slValue,
            // employeeId: this.payroll.employee.id

            employeeId: this.employeeId
          });
        }
      }
      for (let k = 1; k <= eDate.getDate(); k++) {
        let d = new Date(endDate);
        d.setDate(k);
        count += 1;
        let value = "SL";
        let slValue = 1;
        if (count > 30 && count <= 90) {
          slValue = 0.5;
        } else if (count > 90) {
          slValue = 0;
          value = "A";
        }
        this.allInOne.push({
          dateAttended: d,
          month: d.getMonth() + 1,
          year: d.getFullYear(),
          value: value,
          slValue: slValue,
          // employeeId: this.payroll.employee.id

          employeeId: this.employeeId
        });
      }
      api
        .create(this.allInOne, path.attendance)
        .then(() => {
          this.$notify({
            type: "success",
            title: "Attendance",
            message: `${this.$t("Attendance information")} ${this.$t(
              " is created!!!"
            )}`
          });
        })
        .catch(err => {
          this.showErrors(err);
        });

      this.getAttendance(new Date().getMonth() + 1);
    },
    giveMaternityLeave() {
      this.allInOne = [];
      let sDate = new Date(this.slStartDate);
      let sm = sDate.getMonth() + 1;
      this.count = 0;
      if (sm < 8) {
        this.monthLessThanEight(this.slStartDate);
      } else {
        this.monthMorethanEight(this.slStartDate);
      }
    },
    monthLessThanEight(startDate) {
      let sDate = new Date(startDate);
      let sm = sDate.getMonth() + 1;
      for (let i = sm; i < sm + 5; i++) {
        if (i == sm) {
          for (let j = sDate.getDate(); j <= this.noOfDays[i - 1]; j++) {
            let date = new Date(startDate);
            date.setDate(j);
            let value = null;
            if (date.getDay() == 0) {
              value = "P";
            } else {
              value = "ML";
              this.count += 1;
            }

            this.allInOne.push({
              dateAttended: date,
              month: date.getMonth() + 1,
              year: date.getFullYear(),
              value: value,
              // employeeId: this.payroll.employee.id

              employeeId: this.employeeId
            });
          }
        } else {
          for (let k = 1; k <= this.noOfDays[i - 1]; k++) {
            let date = new Date(startDate);
            date.setMonth(i - 1);
            date.setDate(k);
            let value = null;
            if (date.getDay() == 0) {
              value = "P";
            } else {
              this.count += 1;
              value = "ML";
            }
            this.allInOne.push({
              dateAttended: date,
              month: date.getMonth() + 1,
              year: date.getFullYear(),
              value: value,
              // employeeId: this.payroll.employee.id
              employeeId: this.employeeId
            });
            if (this.count >= 120) {
              break;
            }
          }
        }
      }

      api
        .create(this.allInOne, path.attendance)
        .then(() => {
          this.$notify({
            type: "success",
            title: "Attendance",
            message: `${this.$t("Attendance information")} ${this.$t(
              " is created!!!"
            )}`
          });
        })
        .catch(err => {
          this.showErrors(err);
        });

      this.getAttendance(new Date().getMonth() + 1);
    },
    monthMorethanEight(startDate) {
      let sDate = new Date(startDate);
      let sm = sDate.getMonth() + 1;
      this.count = 0;
      for (let i = sm; i <= 12; i++) {
        if (i == sm) {
          for (let j = sDate.getDate(); j <= this.noOfDays[i - 1]; j++) {
            let date = new Date(startDate);
            date.setDate(j);
            let value = null;
            if (date.getDay() == 0) {
              value = "P";
            } else {
              value = "ML";
              this.count += 1;
            }

            this.allInOne.push({
              dateAttended: date,
              month: date.getMonth() + 1,
              year: date.getFullYear(),
              value: value,
              // employeeId: this.payroll.employee.id
              employeeId: this.employeeId
            });
          }
        } else {
          for (let k = 1; k <= this.noOfDays[i - 1]; k++) {
            let date = new Date(startDate);
            date.setMonth(i - 1);
            date.setDate(k);
            let value = null;
            if (date.getDay() == 0) {
              value = "P";
            } else {
              this.count += 1;
              value = "ML";
            }
            this.allInOne.push({
              dateAttended: date,
              month: date.getMonth() + 1,
              year: date.getFullYear(),
              value: value,
              // employeeId: this.payroll.employee.id
              employeeId: this.employeeId
            });
            if (this.count >= 120) {
              break;
            }
          }
        }
        if (this.count >= 120) {
          break;
        }
      }
      if (this.count < 120) {
        this.mlNextYear(startDate, this.count);
      } else {
        api
          .create(this.allInOne, path.attendance)
          .then(() => {
            this.$notify({
              type: "success",
              title: "Attendance",
              message: `${this.$t("Attendance information")} ${this.$t(
                " is created!!!"
              )}`
            });
          })
          .catch(err => {
            this.showErrors(err);
          });
      }
    },
    mlNextYear(startDate, count) {
      let eDate = new Date(startDate);
      for (let i = 1; i <= 5; i++) {
        for (let k = 1; k <= this.noOfDays[i - 1]; k++) {
          let date = new Date();

          date.setMonth(i - 1);
          date.setDate(k);
          date.setFullYear(eDate.getFullYear() + 1);
          let value = null;
          if (date.getDay() == 0) {
            value = "P";
          } else {
            count += 1;
            value = "ML";
          }
          this.allInOne.push({
            dateAttended: date,
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            value: value,
            // employeeId: this.payroll.employee.id
            employeeId: this.employeeId
          });
          if (count >= 120) {
            break;
          }
        }
        if (count >= 120) {
          break;
        }
      }
      api
        .create(this.allInOne, path.attendance)
        .then(() => {
          this.$notify({
            type: "success",
            title: "Attendance",
            message: `${this.$t("Attendance information")} ${this.$t(
              " is created!!!"
            )}`
          });
        })
        .catch(err => {
          this.showErrors(err);
        });

      this.getAttendance(new Date().getMonth() + 1);
    },

    registerPL(length) {
      this.allInOne = [];
      let sDate = new Date(this.slStartDate);
      if (sDate.getDate() < 24) {
        this.plOnSameMonth(length);
      } else {
        this.plOnDeffMonth(length);
      }
    },
    plOnSameMonth(length) {
      this.count = 0;
      let sDate = new Date(this.slStartDate);
      for (let k = sDate.getDate(); k <= this.noOfDays[sDate.getMonth()]; k++) {
        let date = new Date(this.slStartDate);
        date.setDate(k);
        let value = this.value;
        if (date.getDay() == 0) {
          value = "P";
        } else {
          //this.percent += 33;
          value = this.value;
          this.count += 1;
        }
        this.allInOne.push({
          dateAttended: date,
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          value: value,
          // employeeId: this.payroll.employee.id
          employeeId: this.employeeId
        });

        if (this.count >= length) {
          break;
        }
      }
      api
        .create(this.allInOne, path.attendance)
        .then(() => {
          this.$notify({
            type: "success",
            title: "Attendance",
            message: `${this.$t("Attendance information")} ${this.$t(
              " is created!!!"
            )}`
          });
        })
        .catch(err => {
          this.showErrors(err);
        });

      this.getAttendance(new Date().getMonth() + 1);
    },
    plOnDeffMonth(length) {
      let sDate = new Date(this.slStartDate);
      let sm = sDate.getMonth() + 1;
      if (sm < 12) {
        this.count = 0;
        for (let i = 1; i <= 2; i++) {
          if (i == 1) {
            for (
              let j = sDate.getDate();
              j <= this.noOfDays[sDate.getMonth()];
              j++
            ) {
              let date = new Date(this.slStartDate);
              date.setDate(j);
              let value = this.value;
              if (date.getDay() == 0) {
                value = "P";
              } else {
                value = this.value;
                this.count += 1;
              }

              this.allInOne.push({
                dateAttended: date,
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                value: value,
                // employeeId: this.payroll.employee.id
                employeeId: this.employeeId
              });

              if (this.count >= length) {
                break;
              }
            }
          } else {
            for (let k = 1; k <= length; k++) {
              let date = new Date(this.slStartDate);
              date.setMonth(date.getMonth() + 1);
              date.setDate(k);
              let value = this.value;
              if (date.getDay() == 0) {
                value = "P";
              } else {
                value = this.value;
                this.count += 1;
              }
              this.allInOne.push({
                dateAttended: date,
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                value: value,
                // employeeId: this.payroll.employee.id
                employeeId: this.employeeId
              });
              if (this.count >= length) {
                break;
              }
            }
          }
          if (this.count >= length) {
            break;
          }
        }
        api
          .create(this.allInOne, path.attendance)
          .then(() => {
            this.$notify({
              type: "success",
              title: "Attendance",
              message: `${this.$t("Attendance information")} ${this.$t(
                " is created!!!"
              )}`
            });
          })
          .catch(err => {
            this.showErrors(err);
          });
        this.getAttendance(new Date().getMonth() + 1);
      } else {
        this.plDiffYear(length);
      }
    },
    plDiffYear(length) {
      let sDate = new Date(this.slStartDate);
      this.count = 0;
      for (let i = 1; i <= 2; i++) {
        if (i == 1) {
          for (
            let j = sDate.getDate();
            j <= this.noOfDays[sDate.getMonth()];
            j++
          ) {
            let date = new Date(this.slStartDate);
            date.setDate(j);
            let value = this.value;
            if (date.getDay() == 0) {
              value = "P";
            } else {
              value = this.value;
              this.count += 1;
            }

            this.allInOne.push({
              dateAttended: date,
              month: date.getMonth() + 1,
              year: date.getFullYear(),
              value: value,
              // employeeId: this.payroll.employee.id
              employeeId: this.employeeId
            });
            if (this.count >= length) {
              break;
            }
          }
        } else {
          for (let k = 1; k <= length; k++) {
            let date = new Date();
            date.setFullYear(sDate.getFullYear() + 1);
            date.setMonth(0);
            date.setDate(k);
            let value = this.value;
            if (date.getDay() == 0) {
              this.value = "P";
            } else {
              value = this.value;
              this.count += 1;
            }
            this.allInOne.push({
              dateAttended: date,
              month: date.getMonth() + 1,
              year: date.getFullYear(),
              value: value,
              // employeeId: this.payroll.employee.id
              employeeId: this.employeeId
            });

            if (this.count >= length) {
              break;
            }
          }
        }
        if (this.count >= length) {
          break;
        }
      }
      api
        .create(this.allInOne, path.attendance)
        .then(() => {})
        .catch(err => {
          this.showErrors(err);
        });
      this.getAttendance(new Date().getMonth() + 1);
    },
    async deleteItem(id, path, month) {
      const confirmed = await this.$confirm(this.$t("are_you_sure"), {
        buttonTrueText: this.$t("yes"),
        buttonFalseText: this.$t("no")
      });
      if (confirmed) {
        await this.resource.remove(id, path);
        this.mapAttendance(new Date().toISOString().substr(0, 10));
        this.$notify({
          type: "success",
          title: "Success",
          message: `${this.resourceName} ${this.$t("deleted")} ${this.$t(
            "successfully"
          )}.`
        });
        this.getAttendance(month);
      }
    }
  }
};
</script>
