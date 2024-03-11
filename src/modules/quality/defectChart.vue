<template>
  <!-- <div class="small"> -->
    <!-- <line-chart :chart-data="totaldefect" :options="options"></line-chart> -->

  <div>
    <v-card class="white">
      <v-toolbar flat class="white">
        <h2 class="text-center primary--text">
          {{ $t("Lost time chart") }}
        </h2>
        <v-spacer></v-spacer>
        <v-card class="mx-3" flat>
          <v-combobox
            v-model="line"
            dense
            label="Filter by Line"
            :items="lines"
            item-text="number"
            item-value="number"
            hide-details
            hide-selected
            return-object
          />
                      <!-- @input="filterByLine(line.number, 'line')" -->

        </v-card>
        <!-- <v-btn color="primary" @click="$router.push({ name: 'lost-time' })">{{
          $t("see_detail")
        }}</v-btn> -->
      </v-toolbar>
      <v-layout row justify-center>
        <v-flex xs12 sm12 md8 lg8>
          <div class="small">
            <line-chart :chart-data="lineChart" :options="options"></line-chart>
          </div>
        </v-flex>
        <v-flex xs12 sm12 md4 lg4>
          <!-- <pie-chart :chart-data="pieChart" :options="options"></pie-chart> -->

          <v-flex xs12 pa-2>
            <v-layout row justify-center>
              <v-flex xs12 sm12 md12 lg12 pa-2>
                <!-- <viewCard
                  :tittle="outPutData[0].averageLostTime"
                  subtittle="average lost time"
                  icon="avelosttime"
                /> -->
              </v-flex>
            </v-layout>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-card>
  </div>

</template>



<script>
import defectLineChart from './defectLineChart.js'
import { api, path } from "@/api";
import { mapActions, mapState } from "vuex";
import viewCard from "../../quality/viewCard";
export default {
  name: "piechart",
  components: {
    defectLineChart,
    LineChart,
    viewCard
  },
  data() {
    return {
      line: "",
      fBy: "all",
      lines: [],
      lineFiltered: [],

      dialog: false,

      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: "right",
          align: "right",
          labels: {
            render: "percentage",
            fontColor: ["green", "white", "red"],
            precision: 2
          }
        }
      }
    };
  },

    // mounted () {
    //   this.getTotalDeffect()
    // },
  // computed: {
  //   ...mapState("losttime", ["lineChart"]),
  //   ...mapState("employee", ["outPutData"])
  // },
      computed: {
      ...mapState('defects', [
       "totaldefect"
    ]),
    },
  async mounted() {
    let lines = (await api.all(path.line)).rows
      .filter(a => a.number > 0)
      .map(x => {
        return {
          number: x.number
        };
      });

    const key = "number";
    this.lines = [...new Map(lines.map(item => [item[key], item])).values()];

    this.line = this.lines[0].number;
    this.filterByLine(1, "all");
  },
  methods: {
     ...mapActions('defects', [
        'getTotalDeffect',       
      ]),
      filterByLine(line, fBy) {
      this.getLostimeDashboard([new Date(), line, fBy]);
    }
  }
};
</script>