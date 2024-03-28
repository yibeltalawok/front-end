<template>
  <div>
    <v-app-bar elevation="0" style="margin-top: 20px">
      <v-menu
        v-model="filterpickDate"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="filterdate"
            :label="$t('date')"
            prepend-inner-icon="event"
            outlined
            required
            dense
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="filterdate"
          @input="filterByDate"
        ></v-date-picker>
      </v-menu>

      <v-spacer />
      <v-dialog  width="400px" persistent v-model="attendnceChooser">
        <v-card>
          <v-card-title class="headline amber lighten-2">
            <label style="color: white">Attendance default</label>
          </v-card-title>

          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                outlined
                color="red"
                text
                @click="recordAbsentAttendance('A'), attendnceChooser=false"
              >
                Absent
              </v-btn>

              <v-spacer></v-spacer>
              <v-btn
              outlined
                color="green"
                text
                @click="recordAbsentAttendance('P'), attendnceChooser= false"
              >
                Present
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn
        :disabled="intiateAttendance"
        class="text-capitalize white--text"
        style="margin-right: 20px"
        outlined
        color="amber"
        small
        @click="attendnceChooser = true"
        >Initiate Attendance
      </v-btn>

      <v-btn
        class="text-capitalize white--text"
        style="margin-right: 20px"
        outlined
        color="amber"
        small
        @click.stop="bulkAssignment"
        >Bulk Job Assignment
      </v-btn>

      <v-btn
        class="text-capitalize white--text"
        style="margin-right: 20px"
        outlined
        color="amber"
        small
        @click.stop="localfetchAllJobs"
        >View all
      </v-btn>

      <v-btn outlined color="amber" small @click.stop="assigndialog = true"
        >Asign job
      </v-btn>
    </v-app-bar>

    <v-data-table
      :headers="headers"
      :items-per-page="10"
      :loading="loading"
      :items="jobslist"
      item-key="id"
      footer-props.items-per-page-text="`Performance per page`"
      :search="search"
    >
      <template v-slot:item.action="{ item }">
        <v-btn x-small color="red" icon @click="deleteItem(item.id, path)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.date="{ item }">
        {{ getdate(item) }}
      </template>
    </v-data-table>

    <v-dialog v-model="assigndialog" width="600px">
      <v-card wrap>
        <v-app-bar color="amber">
          <v-card-title>
            <span class="headline">Assign new job</span>
          </v-card-title>
        </v-app-bar>

        <v-card-text style="padding-top: 20px">
          <v-form @submit.prevent="assignJob" v-model="valid" ref="asform">
            <v-menu
              v-model="pickDate"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="asignjob.date"
                  :error-messages="errors.collect('day')"
                  :label="$t('date')"
                  name="day"
                  prepend-inner-icon="event"
                  outlined
                  required
                  v-validate="'required'"
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="asignjob.date"
                @input="pickDate = false"
              ></v-date-picker>
            </v-menu>

            <v-row>
              <v-menu
                ref="menu2"
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="asignjob.from"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="asignjob.from"
                    label="Picker starting time"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    name="from"
                    :error-messages="errors.collect('from')"
                    v-validate="'required'"
                    required
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="menu2"
                  v-model="asignjob.from"
                  full-width
                  @click:minute="$refs.menu2.save(asignjob.from)"
                ></v-time-picker>
              </v-menu>

              <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="asignjob.to"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="asignjob.to"
                    label="Picker ending time"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    name="to"
                    :error-messages="errors.collect('to')"
                    v-validate="'required'"
                    required
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="menu1"
                  v-model="asignjob.to"
                  full-width
                  @click:minute="$refs.menu1.save(asignjob.to)"
                ></v-time-picker>
              </v-menu>
            </v-row>

            <Select
              :items="this.employeeSearchResult"
              v-model="asignjob.employeeId"
              label="Search Employee name"
              name="employee"
              item-text="fullName"
              item-value="id"
              :search-input.sync="search2"
              hide-selected
              persistent-hint
              small-chips
              :noData="noData"
              :loading="isLoading"
              @search="onMachineSearch"
              outline
            />

            <v-select
              style="margin-top: 20px"
              :items="this.linelist"
              color="grey"
              item-text="number"
              item-value="number"
              v-model="asignjob.line"
              label="Line"
              name="line_number"
              :error-messages="errors.collect('line_number')"
              v-validate="'required'"
              required
              outlined
              dense
            />

            <v-select
              :items="this.operationList"
              color="grey"
              item-text="operationName"
              item-value="id"
              v-model="asignjob.operationId"
              label="Operation"
              name="Operation"
              required
              v-validate="'required'"
              :error-messages="errors.collect('Operation')"
              outlined
              dense
            />

            <v-btn
              width="100%"
              class="text-capitalize white--text"
              outlined
              color="primary"
              small
              @click.stop="assignJob"
              >Assign job</v-btn
            >
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="bulkdialog" width="1000px">
      <v-card>
        <v-app-bar color="amber">
          <v-card-subtitle style="color: white">
            Bulk Job Assignment Status
          </v-card-subtitle>
          <v-spacer />

          <v-btn icon dark @click="bulkdialog = false" color="red">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>

        <v-card-text style="padding-top: 20px">
          <v-data-table
            :headers="statusheaders"
            :items-per-page="10"
            :loading="loading"
            :items="selectedJobsList"
            item-key="id"
            footer-props.items-per-page-text="`Performance per page`"
            :search="search"
          >
            <template v-slot:item.employee.attendances[0].value="{ item }">
              {{
                item.employee.attendances[0].value == "P"
                  ? "Successful"
                  : "Absent"
              }}
              <!-- <span :class="{success: item.employee.attendances[0].value == 'P'}"></span> -->
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import moment from "moment";
import { mapActions, mapState, mapMutations } from "vuex";
import { tableMixin } from "@/shared/mixins";
import { path, api } from "@/api";
import { formErrorHandling } from "@/shared/mixins";
import Select from "@/shared/select/Select";

export default {
  mixins: [tableMixin, formErrorHandling],
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Select,
  },
  data() {
    return {
      attendnceChooser: false,
      intiateAttendance: true,
      filterdate: new Date().toISOString().substr(0, 10),
      loading: true,
      pickDate: "",
      filterpickDate: "",
      assigndialog: false,
      bulkdialog: false,
      searchresult: [],
      search: "",
      menu2: "",
      search2: "",
      menu1: "",
      isLoading: false,
      noData: "No matching result ",
      valid: false,
      path: path.job,
      resource: api,
      machineDialog: false,
      selectedDate: "",
      asignjob: {
        date: "",
        status: true,
        progress: "assigned",
        amountDone: "0",
        perf: "0",
        done: "0",
        whichLine: "newLine",
        mp: "2",
      },
      resourceName: "Job",
      filter: {
        include: "employee",
      },
      headers: [
        {
          text: "Date",
          value: "date",
        },
        {
          text: "Employee Name",
          value: "employee.fullName",
        },
        {
          text: "Employee Id",
          value: "employee.idno",
        },
        {
          text: "Line",
          value: "line",
        },
        {
          text: "Start time",
          value: "from",
        },
        {
          text: "Finish time",
          value: "to",
        },
        // {
        //   text: "Amount done",
        //   value: "amountDone",
        //   align: "center"
        // },

        {
          text: this.$t("action"),
          value: "action",
          align: "center",
          sortable: false,
        },
      ],
      statusheaders: [
        {
          text: "Date",
          value: "date",
        },
        {
          text: "Employee Name",
          value: "employee.fullName",
        },
        {
          text: "Employee Id",
          value: "employee.idno",
        },
        {
          text: "Line",
          value: "line",
        },
        {
          text: "Start time",
          value: "from",
        },
        {
          text: "Finish time",
          value: "to",
        },

        {
          text: "Status",
          value: "employee.attendances[0].value",
          align: "center",
          sortable: false,
        },
      ],
    };
  },

  mounted() {
    this.loadData();
    this.fetchAllEmployees();
    this.fetchLineList();
    this.fetchAllOperations();
    this.filterByDate();
    this.validateRecordAbsentAttendanceButton();
    this.SOCKET_Notification_POST()
  },

  computed: {
    ...mapState("jobs", ["jobslist", "selectedJobsList"]),
    ...mapState("jobs", ["jobslist", "checkTodayAttendance"]),

    ...mapState("employee", ["employeeList", "employeeSearchResult"]),

    ...mapState("line", ["linelist"]),

    ...mapState("operation", ["operationList"]),
  },

  methods: {
    ...mapActions("jobs", [
      "fetchAllJobs",
      "deleteJob",
      "assignNewJobs",
      "bulkJobAssignment",
      "recordAbsentAttendanceAll",
      "checkTodayAttendanceInsertOrNot",
      "fetchJobsOfSelectedDate",
    ]),

    ...mapMutations("jobs", ["setJobsList"]),
    ...mapActions("notifications", ["SOCKET_Notification_POST"]),
    ...mapActions("employee", ["fetchAllEmployees"]),
    ...mapActions("line", ["fetchLineList"]),
    ...mapActions("operation", ["fetchAllOperations"]),

    ...mapMutations("jobs", ["setJobsList"]),

    ...mapMutations("employee", ["setSearchResult"]),

    getdate(item) {
      return moment(item.date).format("YYYY-MM-DD");
    },

    showMachine(show) {
      this.machineDialog = show;
    },
    // eslint-disable-next-line no-unused-vars
    async onMachineSearch(val) {
      this.searchresult = [];
      // eslint-disable-next-line no-unused-vars
      this.searchresult = this.employeeList.filter(function (item) {
        if (item.fullName.includes(val)) {
          return true;
        } else {
          return false;
        }
      });

      this.searchresult = this.searchresult.map((x) => {
        return {
          id: x.id,
          name: x.fullName + "   =>    " + x.idno,
          fullName: x.fullName,
        };
      });
      this.setSearchResult(this.searchresult);
      // eslint-disable-next-line no-console
      console.log(this.searchresult);
    },

    async localfetchAllJobs() {
      await this.fetchAllJobs();
    },
    async assignJob() {
      if (this.asignjob.employeeId != null) {
        // eslint-disable-next-line no-unused-vars
        var val = this.$validator.validateAll().then((valid) => {
          // eslint-disable-next-line no-console
          console.log(valid);
          if (valid) {
            this.assignNewJobs(this.asignjob).then((r) => {
              r;
              this.assigndialog = false;
              this.$notify({
                type: "success",
                title: "Job Assigned",
                message: "You have successfuly asign a job",
              });
            });
          }
        });
      } else {
        this.$notify({
          type: "danger",
          title: "Employee Error",
          message: "You does not select an employee",
        });
      }
    },

    async filterByDate() {
      this.selectedDate = this.filterdate;
      this.filterpickDate = false;
      await this.fetchAllJobs({ where: { date: { like: this.filterdate } } });
    },

    async bulkAssignment() {
      var today = new Date().toISOString().substr(0, 10);
      if (this.selectedDate && this.selectedDate != today) {
        // enforce to select the date...
        // await this.bulkJobAssignment([this.jobslist, this.selectedDate])
        await this.bulkJobAssignment(this.selectedDate).then(() => {
          this.fetchJobsOfSelectedDate(this.selectedDate).then(() => {
            // TODO ask whether to check the attendance first. If no attended employes, It should display appropriate message.
            // The attendance is always initiated before assigning the job.

            this.$notify({
              type: "success",
              title: "Bulk Job Assignment",
              message: "Assignment Successful.",
            });
            this.bulkdialog = true;
          });
        });
      } else if (this.selectedDate == today) {
        this.$notify({
          type: "danger",
          title: "Date Error",
          message: "You can't assign Today's jobs for Today.",
        });
        // alert("You can't assign today's jobs for today.")
      } else {
        this.$notify({
          type: "danger",
          title: "Date Error",
          message: "You need to select a date.",
        });
        // alert("You need to select date.")
      }
    },

    async validateRecordAbsentAttendanceButton() {
      await this.checkTodayAttendanceInsertOrNot();
      this.intiateAttendance = this.checkTodayAttendance;
    },

    async recordAbsentAttendance(state) {
      this.recordAbsentAttendanceAll(state);
      this.intiateAttendance = true;
    },
  },
};
</script>

<style scoped>
.success {
  color: green;
}
.absent {
  color: red;
}
</style>

