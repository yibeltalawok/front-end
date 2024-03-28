<template>
  <div>
    <v-card class="white">
      <v-toolbar flat class="white">
        <h3 
        class="text-center amber--text">
          {{ $t("Lost time chart") }}
        </h3>
        <v-spacer></v-spacer>
        <v-card class="mx-3" flat>
          <v-combobox
            v-model="line"
            background-color="white"
            item-color="black"
            light
            dense
            label="Filter by Line"
            :items="lines"
            item-text="number"
            item-value="number"
            @input="filterByLine(line.number, 'line')"
            hide-details
            hide-selected
            return-object
          />
        </v-card>
        <v-btn 
        color="amber" 
        outlined
        small
        @click="$router.push({ name: 'lost-time' })"
        >{{
          $t("see_detail")
        }}</v-btn>
      </v-toolbar>
      <v-layout row justify-center>
        <v-flex xs12 sm12 md8 lg8>
          <div class="small">
            <line-chart :chart-data="lineChart" :options="options"></line-chart>
          </div>
        </v-flex>
        <v-flex xs12 sm12 md4 lg4>
          <pie-chart :chart-data="pieChart" :options="options"></pie-chart>

          <v-flex xs12 pa-2>
            <v-layout row justify-center>
              <v-flex xs12 sm12 md12 lg12 pa-2>
                <viewCard
                  :tittle="outPutData[0].averageLostTime"
                  subtittle="average lost time"
                  icon="avelosttime"
                />
              </v-flex>
            </v-layout>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import PieChart from "./pieChart.js";
import LineChart from "./lineChart";
import { api, path } from "@/api";
import { mapActions, mapState } from "vuex";
import viewCard from "../../quality/viewCard";
export default {
  name: "piechart",
  components: {
    PieChart,
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
  computed: {
    ...mapState("losttime", ["lineChart", "pieChart"]),
    ...mapState("employee", ["outPutData"])
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
    ...mapActions("losttime", ["getLostimeDashboard"]),
    filterByLine(line, fBy) {
      this.getLostimeDashboard([new Date(), line, fBy]);
    }
  }
};
</script>

<style>
.small {
  max-width: 1000px;
  margin: 150px auto;
}
</style>
     