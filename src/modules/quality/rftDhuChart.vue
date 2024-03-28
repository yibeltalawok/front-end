<template>
  <div style="margin: 3%">
    <h3>RFT and DHU chart</h3>
    <v-row>
      <v-col cols="12" sm="2">
        <v-menu
          ref="frommenu"
          v-model="frommenu"
          :close-on-content-click="false"
          :return-value.sync="fromdate"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              flat
              v-on="on"
              v-bind="attrs"
              v-model="fromdate"
              label="Start and End Date"
            ></v-text-field>
          </template>
          <v-date-picker
            color="amber"
            v-model="fromdate"
            no-title
            scrollable
            range
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="frommenu = false">Cancel</v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.frommenu.save(fromdate), loadChartData()"
              >OK</v-btn
            >
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="1"></v-col>
      <v-col cols="12" sm="2">
        <v-autocomplete
            :items="lineListDistinict"
            label="Line*"
            v-model="selectedLine"
            required
            @change="loadChartData()"
          ></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="1"></v-col>
      <v-col cols="12" sm="2">
        <v-text-field
          v-model="dhuMaxInput"
          label="DHU Max Value"
          type="number"
          @change="drawChart"
        ></v-text-field>
      </v-col>
    </v-row>
    <div v-show="chartShow" id="chartdivRFTDHU"></div>
    <div v-show="!chartShow" class="nd">
      <nodata class="nodata" />
      <span style="margin: auto">There is no RFT and DHU data!</span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
/* Imports */
import nodata from "@/assets/icons/nodata_icon.svg";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export default {
  components: {
    nodata,
  },
  data() {
    return {
      frommenu: false,
      fromdate: [
        new Date().getFullYear() + "-01-01",
        new Date().toISOString().substr(0, 10),
      ],
      chartShow: false,
      dhuMaxInput: 20,
      maxDhu: 0,
      selectedLine: 1,
    };
  },
  computed: {
    ...mapState("rftanddhu", ["loadAllDataUseingDate", "afterreloadDate", "lineListDistinict"]),
  },
  watch: {
    loadAllDataUseingDate: function () {
      this.drawChart();
      this.fromdate = this.afterreloadDate;
    },
  },
  mounted() {
    this.loadChartData();
    this.drawChart();
    this.getDistinictLineFromSingleEvalution();
  },

  methods: {
    ...mapActions("rftanddhu", ["getloadAllDataUseingDate","getDistinictLineFromSingleEvalution"]),

    async loadChartData() {
      if (this.fromdate.length === 2) {
        await this.getloadAllDataUseingDate({date:this.fromdate, line: this.selectedLine});
        if (this.loadAllDataUseingDate.length > 0) this.chartShow = true;
        else this.chartShow = false;
        this.drawChart();
      } else {
        this.$notify({
          type: "danger",
          title: "Error!",
          message: "Please select both start and end date properly!",
        });
      }
    },

    async drawChart() {
      am4core.useTheme(am4themes_animated);
      let chart = am4core.create("chartdivRFTDHU", am4charts.XYChart);

      //to get maxValue dhu
      for (var l = 0; l < this.loadAllDataUseingDate.length; l++) {
        if (this.maxDhu < this.loadAllDataUseingDate[l].dhu)
          this.maxDhu = this.loadAllDataUseingDate[l].dhu;
      }

      // Add data
      chart.data = this.loadAllDataUseingDate;

      // Create axes
      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.minGridDistance = 50;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.minGridDistance = 50;

      // Create series
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "rft";
      series.dataFields.dateX = "date";
      series.strokeWidth = 2;
      series.minBulletDistance = 10;
      series.tooltipText =
        "[bold]Total Defect:[/]{totalDefect}\n[bold]Total Garment Checked:[/]{totalGarmentChecked}\n[bold]First Time Pass:[/]{ftp}\n[bold]RFT:[/] {rft}\n[bold]DHU:[/] {dhu}";
      series.tooltip.pointerOrientation = "vertical";

      // Create series
      let series2 = chart.series.push(new am4charts.LineSeries());
      series2.dataFields.valueY = "dhu";
      series2.dataFields.dateX = "date";
      series2.strokeWidth = 2;
      series2.minBulletDistance = "20";
      series2.stroke = series.stroke;
      series2.stroke = chart.colors.getIndex(7);

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.xAxis = dateAxis;
      chart.scrollbarX = new am4core.Scrollbar();

      // Create a range to change stroke for values below 0
      let range = valueAxis.createSeriesRange(series2);
      range.value = 0;
      range.endValue = this.dhuMaxInput;
      range.contents.stroke = chart.colors.getIndex(15);
      range.contents.fill = range.contents.stroke;
      range.contents.strokeOpacity = 0.7;
      range.contents.fillOpacity = 0.5;

      range = valueAxis.createSeriesRange(series2);
      range.value = this.dhuMaxInput;
      range.endValue = this.maxDhu;
      range.contents.stroke = chart.colors.getIndex(10);
      range.contents.fill = range.contents.stroke;
      range.contents.strokeOpacity = 0.7;
      range.contents.fillOpacity = 0.5;
    },
  },
};
</script>

<style scoped>
#chartdivRFTDHU {
  height: 350px;
}
.nodata {
  width: 200px;
  height: 100px;
  margin: auto;
  animation: shake 4.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) both infinite;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}
.nd {
  height: 150px;
  margin-top: 5%;
  margin-bottom: 10%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>