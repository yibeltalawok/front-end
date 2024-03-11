<template>
  <div>
    <v-card class="white">
      <!-- <v-toolbar flat class="white">
        
        <v-spacer></v-spacer>
        <v-card class="mx-3" flat>
          <v-combobox
            v-model="year"
            dense
            label="Filter by Line"
            :items="years"
            @input="startingFunction"
            hide-details
          />
        </v-card>
       
      </v-toolbar> -->
      <v-toolbar flat class="white">
        <h2 class="text-center " style="color: #2a682a;">
          {{ $t("cost per minute") }}
        </h2>
        <v-spacer></v-spacer>
        <v-card class="mx-3" flat>
          <v-combobox
            v-model="year"
            background-color="white"
            item-color="black"
            light
            hide-details
            dense
            label="filter by year"
            :items="years"
            outlined
            @input="startingFunction"
          />
        </v-card>
      </v-toolbar>
      <v-layout row justify-center>
        <v-flex xs12 sm12 md8 lg8>
          <div class="small">
            <line-chart :chart-data="lineChart" :options="options"></line-chart>
          </div>
        </v-flex>
        <v-flex xs12 sm12 md4 lg4>
          <pie-chart :chart-data="pieChart" :options="options"></pie-chart>
          <!-- <v-flex xs12 pa-2>
          <v-layout row justify-center>
            <v-flex xs12 sm12 md12 lg12 pa-2>
              <viewCard
                    :tittle="outPutData[0].averageLostTime"
                    subtittle="average lost time"
                    icon="avelosttime"
                  />
            </v-flex>
          </v-layout>
        </v-flex> -->
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import PieChart from "./pieChart.js";
import LineChart from "./lineChart";
// import viewCard from "../../quality/viewCard";
export default {
  data() {
    return {
      year: "",
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
  components: {
    PieChart,
    LineChart
    // viewCard
  },
  computed: {
    ...mapState("costs", ["lineChart", "pieChart", "years"])
  },
  mounted() {
    let date = new Date();
    this.startingFunction(date.getFullYear());
  },
  methods: {
    ...mapActions("costs", ["getCostDashboard"]),
    async startingFunction(year) {
      this.getCostDashboard(year);
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