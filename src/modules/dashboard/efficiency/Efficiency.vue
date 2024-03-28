<template>
  <div>
    <v-card>
      <v-container grid-list-xs class="white">
        <v-toolbar dense flat class="white">
          <h2 class="text-center py-3" style="color: #2a682a;">{{ $t("efficiency") }}</h2>

          <v-spacer></v-spacer>
          <v-btn text color="success" @click="dialog = true">
            {{ $t("select_date_range") }}
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
          <v-spacer></v-spacer>

          <v-spacer></v-spacer>{{ $t("line") }}
          <v-card width="100" flat>
            <v-combobox
              v-model="line"
              background-color="white"
              item-color="black"
              light
              hideDetails
              dense
              label="select"
              :items="lines"
              item-text="number"
              item-value="id"
              solo
              flat
              @input="setLine"
            />
          </v-card>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-layout style="margin-bottom: 30px;" row justify-center>
          
          <v-flex xs12 pa2>
            <apexchart
              type="line"
              height="450"
              :options="chartOptions"
              :series="series"
            ></apexchart>
          </v-flex>

          <viewCard
            :tittle="outPutData[0].averageEfficiency"
            subtittle="average efficiency"
            icon="efficiency"
          />

          
        </v-layout>
      </v-container>
      <v-spacer></v-spacer>

      <!-- date dialog -->
      <v-dialog
        v-model="dialog"
        scrollable
        persistent
        :overlay="false"
        max-width="300px"
        transition="dialog-transition"
        height="200"
      >
        <v-date-picker v-model="dates" range scrollable>
          <v-toolbar dense flat>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="dialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="filterByDate">OK</v-btn>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-date-picker>
      </v-dialog>
      <!-- date dialog -->
    </v-card>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import _ from "lodash";
import { api, path } from "@/api";
import { mapState } from "vuex";
import viewCard from "../../quality/viewCard";
export default {
  data: () => ({
    line: "",
    lines: [],
    outputs: [],
    groupedByLine: {},
    currentEff: [],

    dialog: false,
    dates: [],

    //line graph
    series: [],
    chartOptions: {
      chart: {
        zoom: {
          enabled: true
        }
      },
      colors: [
        "#77B6EA",
        "#545454",
        "#ff0000",
        "#fffc00",
        "#0300ff",
        "#b700ff",
        "#0ab912"
      ],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Line Efficiency per day",
        align: "left"
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      markers: {
        size: 1
      },
      xaxis: {
        type: "category",
        categories: [" "],
        title: {
          text: "Days"
        }
      },
      yaxis: {
        title: {
          text: "Efficiency"
        },
        min: 10,
        max: 100
      },
      legend: {
        position: "bottom",
        horizontalAlign: "right",
        floating: true,
        offsetY: 5,
        offsetX: -5
      }
    }
  }),
  computed: {
    ...mapState("employee", ["outPutData"]),
    dateRangeText() {
      return this.dates.join(" ~ ");
    }
  },
  components: {
    apexchart: VueApexCharts,
    viewCard
  },
  async created() {
    //Set one month date range
    this.setDate();

    //Get Efficiency by date
    this.filterByDate();
  },
  methods: {
    setDate() {
      var today = new Date().toISOString();
      this.dates.push(today.substring(0, 10));
      var before = new Date(today);
      before.setMonth(parseInt(before.getMonth()) - 1);
      this.dates.push(before.toISOString().substring(0, 10));
    },
    async filterByDate() {
      let dateOne = this.dates[0];
      let dateTwo = this.dates[1];
      let smallestDate = dateOne < dateTwo ? dateOne : dateTwo;
      let biggerDate = dateOne < dateTwo ? dateTwo : dateOne;

      let filter = {
        where: {
          date: { between: [smallestDate, biggerDate] }
        }
      };
      this.outputs = (await api.all(path.efficiency, filter)).rows;

      this.setLineGroupd();
      this.setLine();

      this.dialog = false;
    },
    setLineGroupd() {
      let values = this.outputs;
      let groupedByLine = _.groupBy(values, "line");

      this.groupedByLine = groupedByLine;

      ///Lines
      this.lines = Object.keys(groupedByLine);
      if (this.lines) {
        this.line = this.lines[0];
      }
    },
    setLine() {
      this.currentEff = this.groupedByLine[this.line];
      let dateGroup = _.groupBy(this.currentEff, "date");
      let dates = [...new Set(Object.keys(dateGroup))];

      this.setValue();

      this.setXaxis(dates);
    },
    setValue() {
      this.series = [];
      let result = this.currentEff.map(e => {
        return e.eff;
      });
      this.series.push({
        name: this.line,
        data: result
      });
    },
    setXaxis(dates) {
      let x = this.chartOptions.xaxis.categories;

      if (x.length > 1) {
        for (let i = 0; i < x.length; i++) {
          this.chartOptions.xaxis.categories[i].pop();
        }
        this.chartOptions.xaxis.categories[0] = "";
      }

      for (let i = 0; i < dates.length; i++) {
        var d = dates[i];
        if (i == 0) {
          this.chartOptions.xaxis.categories[0] = new Date(d).toDateString();
        } else {
          this.chartOptions.xaxis.categories.push(new Date(d).toDateString());
        }
      }
    }
  }
};
</script>
