<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'incentive-summary-list' })"
          >
            <v-icon>arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>

          <v-text-field
            class="mt-7"
            v-model="date"
            :label="$t('month')"
            outlined
            disabled
            dense
          />

          <v-text-field
            :label="$t('line')"
            v-model="line"
            outlined
            disabled
            dense
            class="mt-7"
            @input="getDate"
          ></v-text-field>
          <v-text-field
            name="name"
            class="mt-7"
            outlined
            disabled
            dense
            label="ttlMinEarned"
            v-model="ttlMinEarned"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-text-field
            name="name"
            class="mt-7"
            outlined
            disabled
            dense
            label="ttl Earning"
            v-model="ttlEarning"
          ></v-text-field>
          <v-btn class="success" @click="save" v-if="summary.length > 0">{{
            $t("save")
          }}</v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card>
          <v-overlay :absolute="absolute" :value="overlay">
            <v-progress-circular indeterminate size="64">
              Loading...
            </v-progress-circular>
          </v-overlay>
          <v-data-table :headers="headers" :items="summary" :search="search">
            <template slot="headerCell" slot-scope="props">
              <span class="table-header-text caption font-weight-bold">{{
                $t(props.header.text)
              }}</span>
            </template>
            <!-- <template v-slot:item.cummulative="{ item }">
            <span>
              {{
                parseFloat(item.performance) +
                  parseFloat(item.discipline) +
                  parseFloat(item.quality)
              }}
            </span>
          </template> -->
          </v-data-table>
        </v-card>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import { api, path } from "@/api";
export default {
  data() {
    return {
      absolute: true,
      opacity: 1,
      overlay: false,
      items: [],
      summary: [],
      incentiveItem: [],
      perfromance: [],
      share: [],
      costPerMinute: 0,
      slab: [],
      path: path.incentiveSummary,
      allPerformance: [],
      indexes: [],
      weightage: [],
      lastP: [],
      allIncentive: [],
      date: "",
      modal: false,
      ttlMinEarned: 0,
      ttlEarning: 0,
      headers: [],
      month: "",
      year: "",
      line: ""
    };
  },
  created() {
    const { item } = this.$route.params;
    let a = item.split("-");
    this.month = a[0];
    this.year = a[1];
    this.date = this.year + "-" + this.month;
    this.line = a[2];
    this.loadData();
  },
  methods: {
    async loadData() {
      this.overlay = true;
      await api
        .create(
          {
            month: this.month,
            year: this.year,
            line: this.line
          },
          this.path
        )
        .then(result => {
          this.items = result;
        });
      this.summary = this.items[0];
      this.incentiveItem = this.items[1];
      this.perfromance = this.items[2];
      this.share = this.items[3];
      this.costPerMinute = this.items[4][0];
      this.slab = this.items[5];
      this.weightage = (await api.all(path.weightage)).rows;
      this.ttlMinEarned = this.incentiveItem.reduce(
        (acc, val) => acc + parseFloat(val.extraPieceMinute),
        0
      );
      this.ttlEarning = (
        parseFloat(this.ttlMinEarned) * parseFloat(this.costPerMinute)
      ).toFixed(2);
      this.getIncentives();
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
              jobId: this.incentiveItem[i].jobId[j],
              line: 1
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
                      (parseFloat(this.weightage[0].performance) / 100);
                let disc =
                  this.weightage.length == 0
                    ? 0
                    : (parseFloat(perf[c].jobs.employee.discipline) / 100) *
                      (parseFloat(this.weightage[0].discipline) / 100);
                let quality =
                  this.weightage.length == 0
                    ? 0
                    : (parseFloat(perf[c].jobs.employee.quality) / 100) *
                      (parseFloat(this.weightage[0].quality) / 100);
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
      // let total = 0;
      for (let i = 0; i < this.summary.length; i++) {
        this.summary[i].individual = 0;
        this.summary[i].group = 0;
        this.summary[i].total = 0;
      }
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
      for (let i = 0; i < this.summary.length; i++) {
        for (let j = 0; j < this.allIncentive.length; j++) {
          if (this.summary[i].id === this.allIncentive[j].employeeId) {
            this.summary[i].individual = (
              parseFloat(this.summary[i].individual) +
              parseFloat(this.allIncentive[j].individual)
            ).toFixed(2);
            this.summary[i].group = (
              parseFloat(this.summary[i].group) +
              parseFloat(this.allIncentive[j].group)
            ).toFixed(2);
            this.summary[i].total =
              parseFloat(this.summary[i].individual) +
              parseFloat(this.summary[i].group);
          }
        }
      }
      this.headers = [
        {
          text: "Operator Name",
          value: "fullName"
        },
        {
          text: "IDNo",
          value: "idno"
        },
        {
          text: "Performance",
          value: "performance"
        },
        {
          text: "Discipline",
          value: "discipline"
        },
        {
          text: "Quality",
          value: "quality"
        },
        {
          text: "Cummulative Perfo",
          value: "cummulative"
        },
        {
          text: "Individual incentive",
          value: "individual"
        },
        {
          text: "Group incentive",
          value: "group"
        },
        {
          text: "Total incentive",
          value: "total"
        }
      ];
      this.overlay = false;
    },
    save() {
      let tempL = this.summary.map(x => {
        return {
          month: this.month,
          year: this.year,
          line: this.line,
          ttlMinEarned: this.ttlMinEarned,
          ttlEarning: this.ttlEarning,
          fullName: x.fullName,
          idno: x.idno,
          performance: x.performance,
          discipline: x.discipline,
          quality: x.quality,
          cummulative: x.cummulative,
          individual: x.individual,
          group: x.group,
          total: x.total
        };
      });

      api
        .create(tempL, path.incentiveSummaryL)
        .then(() => {
          this.$notify({
            type: "success",
            title: "Register Salve",
            message: `${this.$t("Incentive ")} ${this.$t(
              "Slabe successfully registered!"
            )}`
          });
          this.$router.push({ name: "incentive-summary-list" });
        })
        .catch(err => {
          this.showErrors(err);
        });
    }
  }
};
</script>