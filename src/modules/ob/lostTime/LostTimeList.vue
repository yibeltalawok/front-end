
<template>
  <div>
    <div class="mainDiv">
      <div class="leftDiv">
        <v-fab-transition>
          <v-card v-if="LostTimeSummaryData != null" class="chartcard">
            <barChartView />
          </v-card>
        </v-fab-transition>

        <v-container grid-list-xs>
          <v-card outlined style="border-radius: 12px">
            <v-toolbar dense flat>
              <v-spacer />
              <v-btn
                small
                outlined
                color="primary"
                style="margin-right: 10px"
                @click="registerlosttime = true"
              >
                Register lost time
              </v-btn>

              <v-btn
                color="primary"
                style="margin-left: 10px"
                dense
                outlined
                small
                class="text-capitalize white--text"
                @click="lostTimeDialog = true"
                >Register Power loss</v-btn
              >
            </v-toolbar>
            <v-divider></v-divider>
            <v-layout row wrap justify-center>
              <v-flex xs12 sm12 md3 lg3 pa-3> </v-flex>
            </v-layout>
            <v-divider></v-divider>

            <v-data-table
              :headers="headers"
              :items-per-page="10"
              :loading="loading"
              :items="losttimelist"
              item-key="id"
              footer-props.items-per-page-text="`Performance per page`"
              :search="search"
            >
              <template v-slot:item.action="{ item }">
                <v-btn
                  x-small
                  color="red"
                  icon
                  @click="localDelete(item.id, path)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>

              <template v-slot:item.date="{ item }">
                {{ momentDate(item.date) }}
              </template>
            </v-data-table>

            <v-row>
              <v-spacer />
              <div class="chartsui" ref="chartdiv"></div>
              <v-spacer />
            </v-row>
          </v-card>
        </v-container>
      </div>

      <div class="rightDiv">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search ID Number..."
          single-line
          hide-details
        ></v-text-field>

        <br />
        <br />
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
              hide-details
              v-model="dates"
              :error-messages="errors.collect('day')"
              :label="$t('filter-by-date')"
              name="day"
              prepend-inner-icon="event"
              dense
              v-on="on"
              flat
            ></v-text-field>
          </template>
          <v-date-picker color="amber" v-model="dates" range
            ><v-spacer />
            <v-btn text color="green" @click="(pickDate = false), datePicked()"
              >Ok</v-btn
            ></v-date-picker
          >
        </v-menu>

        <br />
        <br />
        <v-text-field
          style="margin-bottom: -1.5%"
          v-model="lineNumber"
          small
          label="Filter By Line"
          type="number"
          @change="reloadTabel"
        ></v-text-field>
      </div>
    </div>

    <!-- Power Loss registration  -->

    <v-dialog v-model="lostTimeDialog" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t("power-outage-lost-time") }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12 lg12 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="powerLoss"
                  :label="$t('lost-minutes')"
                  name="minutes"
                  type="number"
                  autocomplete
                  outlined
                  dense
                />
              </v-flex>
            </v-layout>
          </v-container>
          <small>*{{ $t("if-no-power-loss-continuee-without-input") }}</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            class="text-capitalize white--text"
            @click="lostTimeDialog = false"
            >{{ $t("close") }}</v-btn
          >
          <v-btn
            color="primary"
            class="text-capitalize white--text"
            @click.stop="registerPowerLoss"
            >{{ $t("save") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="registerlosttime" width="600px">
      <v-card wrap>
        <v-app-bar color="amber">
          <v-card-title>
            <span class="headline">Register</span>
          </v-card-title>
        </v-app-bar>

        <v-card-text style="padding-top: 20px">
          <v-form v-model="valid" ref="asform">
            <v-select
              :items="this.iotlist"
              color="grey"
              item-text="iotid"
              item-value="iotid"
              v-model="losttime.iotId"
              label="IoT"
              required
              outlined
              dense
              @input="iotSelected"
            />

            <v-select
              :items="this.reasonelist"
              color="grey"
              item-text="name"
              item-value="id"
              v-model="losttime.reasonid"
              label="reason"
              required
              outlined
              dense
            />

            <v-text-field
              dense
              v-model="losttime.totalmins"
              outlined
              type="number"
              suffix="minutes"
            />

            <v-btn
              width="100%"
              outlined
              color="primary"
              small
              @click.stop="register"
              >Assign</v-btn
            >
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { path, api } from "@/api";
import { mapActions, mapState, mapMutations } from "vuex";
import { tableMixin } from "@/shared/mixins";
import barChartView from "./barchartView";
// eslint-disable-next-line no-unused-vars
import moment from "moment";

export default {
  mixins: [tableMixin],
  components: {
    barChartView,
  },
  data() {
    return {
      lineNumber: "",
      path: path.lostTime,
      datesList: [],
      sampleid: "sampl",
      dates: [
        new Date().toISOString().substr(0, 10),
        new Date().toISOString().substr(0, 10),
      ],
      valid: false,
      barChartData: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: "Dataset 1",
            backgroundColor: "#00ff40",
            data: [15, 54, 36, 98, 20, 77],
          },
          {
            label: "Dataset 2",
            backgroundColor: "#ffbf00",
            data: [89, 54, 78, 98, 98, 77],
          },
          {
            label: "Dataset 3",
            backgroundColor: "#ffbf77",
            data: [89, 54, 78, 98, 98, 77],
          },
        ],
      },
      losttime: {},
      registerlosttime: false,
      powerLoss: undefined,
      pickDate: false,
      search: "",
      lostTimeDialog: false,
      reasonelist: [
        {
          id: 1,
          name: "Miscellaneous",
        },
        {
          id: 2,
          name: "Machine Breakdown",
        },
        {
          id: 3,
          name: "No Work",
        },
        {
          id: 4,
          name: "Power Loss",
        },
      ],
      options: {
        title: {
          display: true,
          text: "Chart.js Bar Chart - Stacked",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        responsive: true,
        scales: {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              stacked: true,
            },
          ],
        },
      },
      resource: api,
      resourceName: "LostTime",
    };
  },
  mounted() {
    this.fetchIotDevices();
    this.reloadTabel();
    // eslint-disable-next-line no-console
  },
  computed: {
    ...mapState("losttime", [
      "iotlist",
      "iotDevId",
      "losttimelist",
      "losttimefiltering",
      "LostTimeSummaryData",
    ]),

    headers() {
      return [
        {
          text: this.$t("date"),
          filterable: false,
          value: "date",
        },
        {
          text: this.$t("line"),
          filterable: false,
          value: "linenumber",
        },
        {
          text: this.$t("idno"),
          filterable: true,
          value: "job.employee.idno",
        },
        {
          text: this.$t("fullName"),
          filterable: true,
          value: "job.employee.fullName",
        },


        {
          text: this.$t("reason"),
          filterable: false,
          value: "reasonlabel",
        },
        {
          text: this.$t("totalmins"),
          filterable: false,
          value: "totalmins",
        },

        {
          text: this.$t("operationName"),
          filterable: false,
          value: "job.operation.operationName",
        },
        {
          text: this.$t("machine"),
          filterable: false,
          value: "job.operation.machine.modelNumber",
        },
        {
          text: this.$t("action"),
          value: "action",
          align: "center",
          filterable: false,
          sortable: false,
        },
      ];
    },
  },

  methods: {
    ...mapActions("losttime", [
      "fetchIotDevices",
      "registerLostTime",
      "fetchLostTime",
      "fetchIotId",
      "fetchLostTimeWithDateFilter",
    ]),

    ...mapMutations("losttime", ["setLostTimeFiltering"]),

    momentDate(date) {
      return date.toString().split("T")[0];
    },
    datePicked() {
      this.pickDate = false;
      this.fetchLostTimeWithDateFilter(this.dates);
      this.reloadTabel();
    },
    async reloadTabel() {
      var filterationData = { date: this.dates, line: this.lineNumber };
      this.fetchLostTime(filterationData);
    },
    async localDelete(id, path) {
      await this.deleteItem(id, path);
      this.reloadTabel();
    },

    // This function assigns the fk iotDeviceId to the id value of the iot.
    async iotSelected(val) {
      await this.fetchIotId(val);
      this.losttime["iotDeviceId"] = this.iotDevId;
      console.log(this.losttime);
    },

    async register() {
      try {
        await this.registerLostTime(this.losttime).then((r) => {
          r;
          this.$notify({
            type: "success",
            title: "Register",
            message: "Successfully registered lost time",
          });

          this.registerlosttime = false;
          this.reloadTabel();
        });
      } catch {
        this.$notify({
          type: "danger",
          title: "Failed",
          message: "Failed to register lost time",
        });
      }
    },
    async registerPowerLoss() {
      // eslint-disable-next-line no-console
      console.log("somethi");
      // eslint-disable-next-line no-unused-vars
      await api
        .create({ totalmins: this.powerLoss }, "/LostTimes/registerpowerloss")
        .then(() => {
          // eslint-disable-next-line no-undef
          this.lostTimeDialog = false;
          this.loadData();
        });
    },
  },
};
</script>

<style scoped>
.mainDiv {
  width: 100%;
  display: flex;
}
.leftDiv {
  width: 75%;
}
.rightDiv {
  padding-left: 2%;
  width: 25%;
}
.chartcard {
  max-width: 450px;
  margin: 10px auto;
}
</style>

	