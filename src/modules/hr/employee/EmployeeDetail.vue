<template>
  <div>
    <v-container grid-list-xs>
      <v-card >
        <v-toolbar elevation="1">
          <v-btn
            text
            color="black"
            class="text-capitalize"
            @click="$router.push({ name: 'hr' })"
          >
          <arrowRight style="width: 20px; height: 20px; transform: scaleX(-1); margin-right: 0.5em;"/>
            {{ $t("go_back") }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            rounded
            small
            outlined
            color="#ECBB44"
            class="text-capitalize ml-3 mr-3"
            @click="calculateIncentiveValue()"
          >
            {{$t("Calculate-Incentive")}}
          </v-btn>
          <v-btn
            rounded
            small
            outlined
            color="#ECBB44"
            class="text-capitalize ml-3 mr-3"
            @click="viewSalaryBreakDown(payrollId)"
          >
            {{$t("view-salary-breakup")}}
          </v-btn>
          <v-btn
            rounded
            small
            outlined
            color="#ECBB44"
            class="text-capitalize ml-3 mr-3"
            @click="remainingAL"
          >
              {{ $t("RemainingAL") }}
          </v-btn>
        </v-toolbar>


        <v-container> 
          <v-row>
            <v-col cols="4">
              <v-card flat>
                <v-card-text>
                  <v-layout column wrap > 
                      <v-img :src="this.profileImage" id="rounded-card">
                        <v-btn
                          :ripple="false"
                          icon
                          fab
                          color="pink"
                          id="no-background-hover"
                          style="postion:absolute; left: 22%; top: 20% "
                          @click="$refs.fileInput1.click()"
                        >
                          <v-icon color="green"> mdi-camera </v-icon>
                        </v-btn>
                      </v-img>
                      <br />
                      <input
                        type="file"
                        style="display:none"
                        @change="onIdFileSelected"
                        ref="fileInput1"
                      />
                    <p>
                      <b>{{ item.fullName }}</b>
                    </p>
                    <v-spacer></v-spacer>
                    <p>
                      <b>{{ $t("idno") }}:</b>
                      {{ item.idno }}
                    </p>
                    <v-spacer></v-spacer>
                    <p>
                      <b>{{ $t("gender") }}:</b>
                      {{ item.gender }}
                    </p>
                    <v-spacer></v-spacer>
                    <p v-if="item.userRole">
                      <b>{{ $t("itspurpose") }}:</b>
                      {{ item.userRole.name }}
                    </p>
                    <v-spacer></v-spacer>
                    <p>
                      <b>{{ $t("joined-since") }}:</b>
                      {{ new Date(item.joiningDate).toLocaleDateString("en-US") }}
                    </p>
                    <v-spacer></v-spacer>
                    <p>
                      <b>{{ $t("phoneNumber") }}:</b>
                      {{ item.phoneNumber }}
                    </p>
                    <v-spacer></v-spacer>
                    <p>
                      <b>{{ $t("department") }}:</b>
                      {{ item.department }}
                    </p>
                    <v-spacer></v-spacer>
                    <p>
                      <b>{{ $t("position") }}:</b>
                      {{ item.position }}
                    </p>
                    <v-card  flat height="100%">
                      <v-card-text id="printMe">
                        <v-layout column justify-center align-center>
                          <div ref="content">
                            <qrcode-vue :value="qrtext" :size="size" level="H" />
                          </div>
                          <div class="my-3">
                            <v-btn
                              rounded
                              
                              block
                              small
                              color="amber"
                              class="text-capitalize"
                              @click="print"
                              >{{ $t("print") }} {{ $t("qr-code") }}</v-btn
                            >
                          </div>
                        </v-layout>
                      </v-card-text>
                    </v-card>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-col>

             
            <v-col cols="8">
              <v-row>
                <v-col cols="6">
                  <v-card flat  height="100%">
                    <v-card-text>
                      <p v-if="item.prfrm">
                        <b>{{ $t("performance") }}:</b>
                        {{ item.prfrm }}%
                      </p>
                      <p v-if="!item.prfrm">
                        <em>No performance history</em>
                      </p>
                      <p>
                        <b>{{ $t("incentive") }}:</b>
                        {{ item.incentiveSalary }}
                      </p>
                      <p>
                        <b>{{ $t("absentIncentive") }}:</b>
                        {{ item.absentIncentive }}
                      </p>
                      <p>
                        <b>{{ $t("womanUnion") }}:</b>
                        {{ item.womanUnion }}
                      </p>
                      <p>
                        <b>{{ $t("medicationDeduction") }}:</b>
                        {{ item.medicationDeduction }}
                      </p>
                      <p>
                        <b>{{ $t("creditAssociation") }}:</b>
                        {{ item.creditAssociation }}
                      </p>
                      <p>
                        <b>{{ $t("costSharing") }}:</b>
                        {{ item.costSharing }}%
                      </p>
                      <p>
                        <b>{{ $t("bankAccountNum") }}:</b>
                        <em>{{ item.bankAccountNum }}</em>
                      </p>
                      <p>
                        <b>{{ $t("emergencyContact") }}:</b>
                        <em>{{ item.emergencyContact }}</em>
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card  flat height="100%">
                    <v-card-text>
                      <p>
                        <b>{{ $t("salary") }}:</b>
                        {{ item.salary }}
                      </p>
                      <p>
                        <b>{{ $t("homeAllow") }}:</b>
                        {{ item.homeAllow }}
                      </p>
                      <p>
                        <b>{{ $t("taxableHomeAllow") }}:</b>
                        {{ item.taxableHomeAllow }}
                      </p>
                      <p>
                        <b>{{ $t("nonTaxableHomeAllow") }}:</b>
                        {{ item.nonTaxableHomeAllow }}
                      </p>
                      <p>
                  <b>{{ $t("profAllow") }}:</b>
                  {{ item.profAllow }}
                </p>
                <p>
                  <b>{{ $t("taxableProfAllow") }}:</b>
                  {{ item.taxableProfAllow }}
                </p>
                <p>
                  <b>{{ $t("nonTaxableProfAllow") }}:</b>
                  {{ item.nonTaxableProfAllow }}
                </p>
                      <p>
                        <b>{{ $t("transportPay") }}:</b>
                        {{ item.transportPay }}
                      </p>
                      <p>
                        <b>{{ $t("positionalAllow") }}:</b>
                        {{ item.positionalAllow }}
                      </p>
                      <p>
                        <b>{{ $t("mobileAllow") }}:</b>
                        {{ item.mobileAllow }}
                      </p>
                      <p>
                        <b>{{ $t("foodAllow") }}:</b>
                        {{ item.foodAllow }}
                      </p>
                       <p>
                        <b>{{ $t("responseAllow") }}:</b>
                        {{ item.responseAllow }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="2">
                  <p>
                    <b>Attendance Summary</b>
                  </p>
                  <v-form>
                   <!-- <v-auto-complete
                      label="Year"
                      :items="years"
                    >
                    </v-auto-complete>
                    -->
                    <v-select
                      label="Year"
                      :items="years"
                    >
                    </v-select>
                  </v-form>
                </v-col>
                <v-col cols="10">
                  
                  <!-- <CalendarHeatmap no-data-text="no data for this day" :range-color="colors" :values="vals" :end-date="endDate" tooltip-unit="" /> -->
                  <!-- <Attendance /> -->
                  <heatmap v-if="getItemAttendance.length > 0" no-data-text="no data for this day" :range-color="colors" :values="getItemAttendance" :end-date="endDate" tooltip-unit=""/>
                </v-col>
              </v-row>

            </v-col>
          </v-row>
        </v-container>
      </v-card>  
    </v-container>
  </div>
</template>
<script>
import { api, path, API_ROOT } from "@/api";
// import { CalendarHeatmap } from "vue-calendar-heatmap";
import heatmap from "./heatmap/CalendarHeatmap"
import QrcodeVue from "qrcode.vue";
import { mapActions, mapState } from "vuex";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import arrowRight from "@/assets/icons/arrow-right.svg"
export default {
  name: "employeeInfo",
  data() {
    return {
      colors: ['#edf0eb', '#e2efda', '#ddf9c0', '#112233', '#86e138', '#ff5638'],
      vals: [
        { dateAttended: '2021-04-08T22:04:57.815616', value: "P" },
        { dateAttended: '2021-2-4', value: 6 },
        { dateAttended: '2021-2-5', value: 6 },
        { dateAttended: '2021-2-9', value: 4 },
        { dateAttended: '2021-2-10', value: 6 },
        { dateAttended: '2021-2-11', value: 6 },
        { dateAttended: '2021-2-12', value: 6 },
        { dateAttended: '2021-2-13', value: 6 },
        { dateAttended: '2021-2-16', value: 6 },
        { dateAttended: '2021-2-17', value: 6 },
        { dateAttended: '2021-2-18', value: 6 },
        { dateAttended: '2021-2-19', value: 6 },
        { dateAttended: '2021-2-20', value: 6 },
        { dateAttended: '2021-2-24', value: 6 },
        { dateAttended: '2021-2-25', value: 6 },
        { dateAttended: '2021-2-26', value: 6 },
      ],
      endDate: '2022',
      resourceName: "Employee",
      item: {},
      dataval: {},
      role: {},
      profilePic: "",
      pathEmployee: path.employee,
      pathRole: path.userRole,
      pathContainer: path.container,
      qrtext: "",
      size: 150,
      remainAL: 0,
      alDialog: false,
      // incentive: [],
      incentiveValue: [],
      slabe: [],
      // weightage: [],
      idPictureInfo: "",
      selectedFileId: null,
      idDone: false,
      totalIncentive: 0,
      performance: 0,
      employeeId: "",
      dialog: false,
      dialogAB: false,
      filter: {
        include: ["performance", "incentive", "userRole", "attendances"]
      },
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard"
        },
        {
          text: "Employee",
          disabled: false,
          to: "/app/employee/list"
        },
        {
          text: "Employee info",
          disabled: true
        }
      ],
      slabePercent: 1,
      isDesciplineValid: true,
      isQualityValid: true,
      month: "",
      year: "",
      incentiveShare: {},
      costSummary: {},
      incentives: [],
      discipline: 0,
      quality: 0,
      //=============================================
      costPerMinute: 0,
      share: [],
      perf: 0,
      slab: [],
      weightage: [],
      incentiveItem: [],
      allPerformance: [],
      indexes: [],
      allIncentive: [],
      lastP: [],
      // attendEmpp: [],
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
      attendanceMonth: "",
      attendanceYear: "",
      monthNo: "",
      payroll: []
      // uniqueColors: []
    };
  },
  components: {
    QrcodeVue,
    heatmap,
    arrowRight
    // CalendarHeatmap
  },
  async created() {
    const { employeeId } = this.$route.params;
    this.employeeId = employeeId;
    this.item = await api.get(employeeId, this.pathEmployee, this.filter);
    // eslint-disable-next-line no-console
    console.log("==============rerererer===============")
    // eslint-disable-next-line no-console
    console.log(this.item)
    let qrcode = [
      // this.item.id,
      this.item.fullName,
      // this.item.userRole.name,
      // this.item.idno,
      this.item.phoneNumber,
      // this.item.gender,
      // this.item.joiningDate,
      this.item.department,
      // this.item.subDept,
      "employee"
    ];
    this.payroll = (
      await api.all(path.payroll, { where: { employeeId: employeeId } })
    ).rows;
    if (this.payroll.length > 0) {
      this.remainAL = this.payroll[0].remainingAl;
      this.payrollId = this.payroll[0].id;
    }
    this.qrtext = JSON.stringify(qrcode);
    let date = new Date();
    this.attendanceMonth = this.months[date.getMonth()].month;
    this.attendanceYear = date.getFullYear();
    this.monthNo = this.months[date.getMonth()].number;
    // this.role = await api.get(this.item.role, this.pathRole);
    this.getAttendance(this.monthNo);
    this.getProfileImage(this.item.phoneNumber);
  },
  computed: {
    ...mapState("employee", ["attendEmpp","uniqueColors","profileImage"]),
    getItemAttendance(){
      return this.item.attendances
    }
  },
  mounted() {
    // this.fetchAttendance({
    // })
    
  },
  methods: {
    ...mapActions("employee", ["getAttend","getProfileImage"]),
    ...mapActions("Nattendance", [
      "fetchAttendance",
    ]),
    show(show) {
      this.dialog = show;
    },
    showDesc(type) {
      if (type == "P") {
        this.dialogAB = true;
        this.dataval.title = "P(present)";
        this.dataval.body = "";
      } else if (type == "PL") {
        this.dialogAB = true;
        this.dataval.title = "PL(paternity leave)";
        this.dataval.body =
          "A male employee shall be entitled to three" +
          "consecutive days paternity leave with full pay" +
          "A worker shall been titled to leave with pay" +
          "for three working days where;";
      } else if (type == "Pr") {
        this.dialogAB = true;
        this.dataval.title = "P(Permission(1 day penalty))";
        this.dataval.body = "";
      } else if (type == "A") {
        this.dialogAB = true;
        this.dataval.title = "Absent(2 days penalty)";
        this.dataval.body = "";
      } else if (type == "AL") {
        this.dialogAB = true;
        this.dataval.title = "AL";
        this.dataval.body =
          "Sixteen (16) working days for the first year of service; \n b)Sixteen (16) working days" +
          " plus one working day for every additional two years’ service.\nEligbile for AL leave\nFor purpose of determining the qualifying period of service required for the" +
          "entitlement of an annual leave, 26 days of service in an undertaking shall be deemed to be equivalent" +
          "to one month of employment.";
      } else if (type == "SL") {
        this.dialogAB = true;
        this.dataval.title = "Sick Leave(Pd)	";
        this.dataval.body =
          "Where a worker, after having completed his probation, is rendered incapable of working due to sickness other" +
          " than employment injury, he shall be entitled to a sick leave .\n Payment\nThe period of sick leave provided for in Article 85\n" +
          "shall be granted to a worker in the following manner:\n1/ For the first one month, with payment of\n100% of his wages;\n" +
          "2/ For the next two months, with payment of 50% of his wage;\n3/ For the next three months, without pay.\n" +
          "Maternity leave\n\n" +
          "Leave for family events";
      } else if (type == "MOL") {
        this.dialogAB = true;
        this.dataval.title = "Death leave";
        this.dataval.body = "";
      } else if (type == "HLPR") {
        this.dialogAB = true;
        this.dataval.title = "Half Leave permision";
        this.dataval.body = "";
      } else if (type == "HLA") {
        this.dialogAB = true;
        this.dataval.title = "Half Leave Absent";
        this.dataval.body = "";
      } else if (type == "ML") {
        this.dialogAB = true;
        this.dataval.title = "Maternity leave";
        this.dataval.body =
          "A pregnant worker shall be granted a period of	30 consecutive days of leave with pay of " +
          "pre-natal leave and a period of 90 consecutive	days of leave post- natal.";
      } else if (type == "Special L") {
        this.dialogAB = true;
        this.dataval.title =
          "A worker shall be entitled to leave without pay for up to five" +
          " consecutive days in the case of exceptional and serious events.However, such leave may be granted only	twice in a budget year.";
        this.dataval.body = "";
      } else if (type == "MGL") {
        this.dialogAB = true;
        this.dataval.title = "Marriage Leave(5 Pd Days)";
        this.dataval.body =
          "nA worker shall been titled to leave with pay	for three working days where;\n	marriage; or\n b) His spouse," +
          "descendants, ascendants, brother, sister, uncle, aunt relative whether by consanguinity or affinity dies.	";
      } else if (type == "FL") {
        this.dialogAB = true;
        this.dataval.title = "Free leave";
        this.dataval.body = "";
      } else if (type == "LeM") {
        this.dialogAB = true;
        this.dataval.title = "Late minute";
        this.dataval.body = "";
      }
    },
    close() {
      this.dialog = false;
    },
    async getAttendance(monthNo) {
      // let attended = [];
      // this.attendEmpp = [];
      if (monthNo != "" && this.attendanceYear != "") {
        this.getAttend([this.employeeId, monthNo, this.attendanceYear]);
        // await api
        //   .create(
        //     {
        //       value: this.employeeId,
        //       type: "employee",
        //       month: monthNo,
        //       year: this.attendanceYear
        //     },
        //     path.getAttendance
        //   )
        //   .then(result => {
        //     attended = result;
        //   });
        // this.attendEmpp = attended;
        // const key = "value";
        // this.uniqueColors = [
        //   ...new Map(
        //     this.attendEmpp[0].attendance.map(item => [item[key], item])
        //   ).values()
        // ];
      }
    },
    async viewSalaryBreakDown(payrollId) {
      // let payroll = (
      //   await api.all(path.payroll, { where: { employeeId: employeeId } })
      // ).rows;
      if (this.payroll.length > 0) {
        // this.remainAL = payroll[0].remainingAl;
        this.$router.push({
          name: "payroll-master-info",
          params: { payrollId: payrollId }
        });
      } else {
        this.$notify({
          type: "danger",
          title: "Payroll not found",
          message: "Please create payroll first!"
        });
      }
    },
    remainingAL() {
      this.alDialog = true;
    },
    // payPayment() {
    //   this.item.pay = true;
    //   this.item.incentiveSalary = 0;
    //   this.item.totalSalary = this.item.salary;
    //   api
    //     .update(this.item, this.pathEmployee)
    //     .then(() => {
    //       this.$notify({
    //         type: "success",
    //         title: this.$t("Salary Payment"),
    //         message: `${this.$t("Employee")} ${this.$t(
    //           "salary payment successfully done!"
    //         )}`
    //       });
    //     })
    //     .catch(err => {
    //       this.showErrors(err);
    //     });
    // },
    checkDiscipline(value) {
      this.isDesciplineValid = true;
      if (parseFloat(value) < 0 || parseFloat(value) >= 100) {
        this.isDesciplineValid = false;
      }
    },
    async calculateIncentiveValue() {
      let date = new Date();
      this.performance = this.item.prfrm;
      this.discipline = this.item.discipline;
      this.quality = this.item.quality;
      let ins = [];
      await api
        .create(
          {
            year: date.getFullYear(),
            month: date.getMonth(),
            employeeId: this.employeeId,
            performance: this.performance,
            discipline: this.discipline,
            quality: this.quality
          },
          path.incentiveCalculation
        )
        .then(result => {
          ins = result;
        });
      if (ins[0].type == "success") {
        this.costPerMinute = ins[1][2];
        this.share = ins[2];
        this.perf = ins[3];
        this.slab = ins[4];
        this.weightage = ins[5];
        this.incentiveItem = ins[6];
        this.getIncentives();
      } else {
        this.$notify({
          type: "danger",
          title: ins[0].title,
          message: ins[0].message
        });
      }
    },
    async getIncentives() {
      for (let i = 0; i < this.incentiveItem.length; i++) {
        let tempP = [];
        for (let j = 0; j < this.incentiveItem[i].jobId.length; j++) {
          let count = 0,
            totalPerformance = 0;
          let filter = {
            where: {
              month: 10,
              year: 2020,
              jobId: this.incentiveItem[i].jobId[j]
            },
            include: { jobs: ["employee"] }
          };
          let perf = (await api.all(path.performance, filter)).rows;
          if (perf.length > 0) {
            for (let c = 0; c < perf.length; c++) {
              count += 1;
              totalPerformance += parseFloat(perf[c].value);
              if (perf.length - 1 == c) {
                let pe =
                  this.weightage.length == 0
                    ? parseFloat(totalPerformance / count) / 100
                    : (parseFloat(totalPerformance / count) / 100) *
                      (parseFloat(this.weightage.performance) / 100);
                let disc =
                  this.weightage.length == 0
                    ? 0
                    : (parseFloat(perf[c].jobs.employee.discipline) / 100) *
                      (parseFloat(this.weightage.discipline) / 100);
                let quality =
                  this.weightage.length == 0
                    ? 0
                    : (parseFloat(perf[c].jobs.employee.quality) / 100) *
                      (parseFloat(this.weightage.quality) / 100);
                tempP.push({
                  totalP:
                    parseFloat(pe) + parseFloat(disc) + parseFloat(quality),
                  performance: parseFloat(pe) * 100,
                  discipline: parseFloat(disc) * 100,
                  quality: parseFloat(quality) * 100,
                  allowGroup: perf[c].jobs.allowGroup,
                  allowIndividual: perf[c].jobs.allowIndividual
                });
              }
              if (tempP.length == this.incentiveItem[i].jobId.length) {
                for (let x = 0; x < tempP.length; x++) {
                  this.allPerformance.push({
                    perf: tempP[x].totalP,
                    performance: tempP[x].performance,
                    discipline: tempP[x].discipline,
                    quality: tempP[x].quality,
                    empId: this.incentiveItem[i].employeeId[x],
                    extraPieceMinute: this.incentiveItem[i].extraPieceMinute,
                    allowGroup: tempP[x].allowGroup,
                    allowIndividual: tempP[x].allowIndividual,
                    index: i
                  });
                }
              }
            }
          } else {
            tempP.push({
              totalP: 0,
              allowGroup: "no",
              allowIndividual: "no",
              performance: 0,
              discipline: 0,
              quality: 0
            });
            if (tempP.length == this.incentiveItem[i].jobId.length) {
              for (let x = 0; x < tempP.length; x++) {
                this.allPerformance.push({
                  perf: parseFloat(tempP[x].totalP) * 100,
                  performance: tempP[x].performance,
                  discipline: tempP[x].discipline,
                  quality: tempP[x].quality,
                  empId: this.incentiveItem[i].employeeId[x],
                  extraPieceMinute: this.incentiveItem[i].extraPieceMinute,
                  allowGroup: tempP[x].allowGroup,
                  allowIndividual: tempP[x].allowIndividual,
                  index: i
                });
              }
            }
          }
        }
      }
      this.getIncentiveSlab();
    },
    getIncentiveSlab() {
      for (let i = 0; i < this.allPerformance.length; i++) {
        for (let j = 0; j < this.slab.length; j++) {
          if (
            parseFloat(this.allPerformance[i].perf) >=
              parseFloat(this.slab[j].from) &&
            parseFloat(this.allPerformance[i].perf) <=
              parseFloat(this.slab[j].to)
          ) {
            this.allPerformance[i].perf =
              parseFloat(this.slab[j].percent) / 100;
          }
        }
      }
      for (let k = 0; k < this.allPerformance.length; k++) {
        const indexp = this.indexes.indexOf(this.allPerformance[k].index);
        if (indexp == -1) {
          this.indexes.push(this.allPerformance[k].index);
        }
      }
      this.manageIndexss();
    },
    manageIndexss() {
      for (let i = 0; i < this.indexes.length; i++) {
        let total = 0;
        let count = 0;
        let cost = 0;
        for (let j = 0; j < this.allPerformance.length; j++) {
          if (this.indexes[i] == this.allPerformance[j].index) {
            if (this.allPerformance[j].allowGroup == "yes") {
              count += 1;
            }
            if (this.allPerformance[j].allowIndividual == "yes") {
              total += parseFloat(this.allPerformance[j].perf);
            }
            cost =
              parseFloat(this.allPerformance[j].extraPieceMinute) *
              this.costPerMinute;
          }
        }
        this.lastP.push({
          length: count == 0 ? 1 : count,
          total: total == 0 ? 1 : total,
          extraPieceMinute: cost
        });
      }
      this.calculateIncentive();
    },
    calculateIncentive() {
      let indexcou = 0;
      for (let i = 0; i < this.incentiveItem.length; i++) {
        let forEmployee =
          (parseFloat(this.incentiveItem[i].extraPieceMinute) *
            parseFloat(this.costPerMinute) *
            parseFloat(this.share[0].forEmployee)) /
          100;
        let forLine =
          (parseFloat(forEmployee) * parseFloat(this.share[0].forLine)) / 100;
        let forOperator =
          (parseFloat(forEmployee) * parseFloat(this.share[0].forOperator)) /
          100;
        for (let j = 0; j < this.incentiveItem[i].employeeId.length; j++) {
          this.allIncentive.push({
            forE: forEmployee,
            employeeId: this.incentiveItem[i].employeeId[j],
            individual:
              this.allPerformance[indexcou].allowIndividual == "no"
                ? 0
                : (parseFloat(forOperator) *
                    parseFloat(this.allPerformance[indexcou].perf)) /
                  parseFloat(this.lastP[i].total),
            group:
              this.allPerformance[indexcou].allowGroup == "no"
                ? 0
                : parseFloat(forLine) / parseFloat(this.lastP[i].length)
          });
          indexcou += 1;
        }
      }
      this.manageUI();
    },
    manageUI() {
      for (let j = 0; j < this.allIncentive.length; j++) {
        if (this.employeeId === this.allIncentive[j].employeeId) {
          this.totalIncentive =
            parseFloat(this.totalIncentive) +
            parseFloat(this.allIncentive[j].individual) +
            parseFloat(this.allIncentive[j].group);
        }
      }
      this.updateEmployee();
    },
    updateEmployee() {
      this.item.pay = false;
      this.item.incentiveSalary = this.totalIncentive.toFixed(2);
      this.item.totalSalary =
        parseFloat(this.totalIncentive) + parseFloat(this.item.salary);
      api
        .update(this.item, this.pathEmployee)
        .then(() => {
          this.$notify({
            type: "success",
            title: this.$t("Salary Payment"),
            message: `${this.$t("Employee")} ${this.$t(
              "salary payment successfully done!"
            )}`
          });
        })
        .catch(err => {
          this.showErrors(err);
        });
    },
    checkQuality(value) {
      this.isQualityValid = true;
      if (parseFloat(value) < 0 || parseFloat(value) >= 100) {
        this.isQualityValid = false;
      }
    },
    save() {
      if (this.isDesciplineValid && this.isQualityValid) {
        api
          .update(this.item, this.pathEmployee)
          .then(() => {
            this.$notify({
              type: "success",
              title: this.$t("Update Information"),
              message: `${this.$t("Employee")} ${this.$t(
                "Information successfully updated!"
              )}`
            });
          })
          .catch(err => {
            this.showErrors(err);
          });
      }
    },
    async getSlab() {
      this.slabe = (await api.all(path.slabe)).rows;
      if (this.slabe !== null) {
        for (const iterator of this.slabe) {
          if (
            parseFloat(this.performance) >= parseFloat(iterator.from) &&
            parseFloat(this.performance) <= parseFloat(iterator.to)
          )
            this.slabePercent = parseFloat(iterator.percent) / 100;
        }
      }
    },
    onIdFileSelected(event) {
      this.selectedFileId = event.target.files[0];
      this.idPictureInfo = this.selectedFileId.name;
      this.checkImage(this.selectedFileId);
      this.idDone = true;
    },
    async checkImage(file) {
      await api
        .checkFile("idPictures", this.item.phoneNumber, this.pathContainer)
        .then(() => this.changePicture(file))
        .catch(() => this.uploadPicture(file));
    },
    async uploadPicture(file) {
      const formData = new FormData();
      formData.append("Image", file, this.item.phoneNumber);
      await api
        .upload("/idPictures", formData, this.pathContainer)
        .then(() => {
          this.$notify({
            type: "success",
            title: this.$t("primary"),
            message: `${this.$t("picture")} ${this.$t("updated_primaryfully")}`
          });
        })
        .catch(() => {
          this.$notify({
            type: "error",
            title: "Failure",
            message: `${this.$t("picture not uploaded right now.")} ${this.$t(
              "Try later."
            )}`
          });
        });
    },
    async changePicture(file) {
      const path = this.pathContainer;
      await api
        .removeFile("idPictures", this.item.phoneNumber, path)
        .then(() => {
          const formData = new FormData();
          formData.append("Image", file, this.item.phoneNumber);
          api
            .upload("idPictures", formData, path)
            .then(() => {
              this.$notify({
                type: "success",
                title: this.$t("seccuess"),
                message: `${this.$t("picture changed  now ")} ${this.$t(
                  "primaryfully."
                )}`
              });
            })
            .catch(() => {
              this.$notify({
                type: "red",
                title: this.$t("Failure"),
                message: `${this.$t(
                  "picture not changed right now."
                )} ${this.$t("Try later.")}`
              });
            });
        })
        .catch(() => {
          this.$notify({
            type: "red",
            title: this.$t("Failure"),
            message: `${this.$t("picture not changed right now.")} ${this.$t(
              "Try later."
            )}`
          });
        });
    },
    profilePicUrl() {
      return (
        API_ROOT +
        "/containers" +
        "/profilePictures" +
        "/download/" +
        this.item.profilePicture
      );
    },
    print() {
      const doc = new jsPDF();
      var canvasElement = document.createElement("canvas");
      html2canvas(this.$refs.content, { canvas: canvasElement }).then(function(
        canvas
      ) {
        // eslint-disable-next-line no-unused-vars
        const img = canvas.toDataURL("image/png", 10);
        doc.addImage(img, "JPEG", 50, 50);
        doc.save("employee.pdf");
      });
    }
  }
};
</script>
<style scoped>
#no-background-hover::before {
  background-color: transparent !important;
}
#no-background-hover:hover {
  background-color: palegreen;
}
#rounded-card {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  vertical-align: middle;
  margin-left: 28%;
}
.amber {
  color: #fff;
}
.wh > *{
  color: #ecbb44;
}
</style>