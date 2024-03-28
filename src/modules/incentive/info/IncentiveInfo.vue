<template>
  <v-app>
    <v-container grid-list-xs>
      <v-card outlined>
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'incentive-list' })"
          >
            <v-icon>arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>
          <v-spacer />
        </v-toolbar>
        <v-layout row justify-center align-center>
          <v-flex xs12 sm12 md5 lg5 pa-2>
            <v-card outlined height="100%">
              <v-card-text>
                <v-layout row wrap justify-center>
                  <v-flex xs12 pa-1>
                    <b>{{ $t("date") }}:</b>
                    {{
                      new Date(item.productionDate).toLocaleDateString("en-US")
                    }}
                  </v-flex>
                  <v-flex xs12 pa-1>
                    <b>{{ $t("line") }}:</b>
                    {{ item.lineNo }}
                  </v-flex>
                  <v-flex xs12 pa-1>
                    <b>{{ $t("styleName") }}:</b>
                    {{ item.order.styleName }}
                  </v-flex>
                  <v-flex xs12 pa-1>
                    <b>{{ $t("sam") }}:</b>
                    {{ samValue }}
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm12 md5 lg5 pa-2>
            <v-card outlined height="100%">
              <v-card-text>
                <v-layout row wrap justify-center>
                  <v-flex xs12 pa-1>
                    <b>{{ $t("targetPerDay") }}:</b>
                    {{ item.targetPerDay }}
                  </v-flex>
                  <v-flex xs12 pa-1 v-if="parseFloat(item.extraPerDay) > 0">
                    <b>{{ $t("extraPerDay") }}:</b>
                    {{ item.extraPerDay }}
                  </v-flex>
                  <v-flex xs12 pa-1 v-if="parseFloat(item.extraPerDay) <= 0">
                    <b>{{ $t("extraPerDay") }}:</b>
                    <em>No extra piece</em>
                  </v-flex>

                  <v-flex xs12 pa-1>
                    <b>{{ $t("extra-statandard-minute-earned") }}:</b>
                    {{ item.extraPieceMinute }}
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout row justify-center>
          <v-flex xs12 sm12 md6 lg6 pa-2>
            <h1 class="primary--text" pa-3>
              {{ $t("list-of-participating-operators") }}
            </h1>
            <v-data-table
              :headers="headers"
              :items="incentiveHistory"
              class="elevation-1"
            >
              <template v-slot:item.approve="{ item }">
                <div>
                  <v-btn text @click="removeEmp(item.id)">
                    <v-icon
                      color="red"
                      small
                      class="ml-2"
                      @click="deleteItem(item.id, path)"
                      >delete</v-icon
                    ></v-btn
                  >
                </div>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-card>
      <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">
            Want to remove?
          </v-card-title>
          <v-card-text
            ><v-checkbox
              label="Group incentive"
              color="red"
              @change="group = !group"
              hide-details
            ></v-checkbox>
            <v-checkbox
              label="Individual incentive"
              color="red"
              @change="individual = !individual"
              hide-details
            ></v-checkbox
          ></v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog = false">
              close
            </v-btn>
            <v-btn color="green darken-1" text @click="updateJob">
              Remove
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import { api, path } from "@/api";
import AccountService from "@/shared/services";
export default {
  name: "Incentive",
  data() {
    return {
      resourceName: "Incentive",
      item: {},
      jobs: [],
      roleItem: {},
      filter: { include: ["line", "order"] },
      user: AccountService.getProfile(),
      errMessage: "",
      resource: api,
      path: path.incentive,
      samValue: 0,
      serachForSam: [],
      serachForLineCapacity: [],

      per: [],
      incentiveId: "",
      getIncentive: "",
      performances: [],
      totalPerformance: 0,
      employeeId: "",
      jobId: "",
      searchForLineCapacity: [],
      operationSam: [],
      perf: [],
      perfo: [],
      oprBltnId: "",
      incentiveHistory: [],
      headers: [
        {
          text: this.$t("fullName"),
          value: "operatorName"
        },
        {
          text: this.$t("performance"),
          value: "avePer"
        },
        {
          text: "Approve",
          value: "approve",
          sortable: false
        }
        // {
        //   text: "Group incentive",
        //   value: "grIncentive"
        // }
      ],
      dialog: false,
      individual: false,
      group: false,
      jId: "",
      update_job: {}
    };
  },
  async created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const { incentiveId } = this.$route.params;
      this.item = await api.get(incentiveId, path.incentive, this.filter);

      this.incentiveId = incentiveId;
      this.calculateTotalSam();
      this.createHistory();
    },
    async calculateTotalSam() {
      let filterStyleNumber = {
        where: { orderId: this.item.orderId }
      };

      let opr = (await api.all(path.oprBltn, filterStyleNumber)).rows;
      for (const iterator of opr) {
        this.oprBltnId = iterator.id;
      }
      let f = {
        where: {
          oprBltnId: this.oprBltnId
        }
      };
      // fetch operations
      let operations = (await api.all(path.operation, f)).rows;
      for (const iterator of operations) {
        this.samValue = parseFloat(iterator.sam) + this.samValue;
      }
      this.samValue = this.samValue.toFixed(2);
    },
    removeEmp(id) {
      this.jId = id;
      this.dialog = true;
    },
    async updateJob() {
      this.dialog = false;
      this.update_job = {
        id: this.jId,
        allowIndividual: this.individual == true ? "no" : "yes",
        allowGroup: this.group == true ? "no" : "yes"
      };
      await api.update(this.update_job, path.job).then(() => {
        this.createHistory();
        this.$notify({
          type: "success",
          title: this.$t("Remove Participant"),
          message: `${this.$t("Participant")} ${this.$t(
            "is successfully  removed!"
          )}`
        });
      });
    },
    individualTrue() {
      this.individual = !this.individual;
    },
    groupTrue() {
      this.group = !this.group;
    },
    async createHistory() {
      this.incentiveHistory = [];
      for (let index = 0; index < this.item.jobId.length; index++) {
        let fp = {
          include: { jobs: ["employee"] },
          where: { jobId: this.item.jobId[index] }
        };
        let per = (await api.all(path.performance, fp)).rows;
        // for (const iterator of per) {
        //   if (iterator.employeeId == this.item.employeeId[index]) {
        if (
          per[0].jobs.allowGroup == "yes" &&
          per[0].jobs.allowIndividual == "yes"
        ) {
          this.incentiveHistory.push({
            id: per[0].jobId,
            operatorName: per[0].jobs.employee.fullName,
            avePer: per[0].value
          });
        }
        //   }
        // }
      }
    }
  }
};
</script>