<template>
  <div>
    <div class="performancechartview">
      <v-container>
        <v-row>
          <v-col cols="12" sm="11"
            ><h4 class="card-title">Performance</h4></v-col
          >
          <v-col cols="12" sm="1">
            <dateIcon class="dateIcon" @click="datePickerPerformance = true" />
            <v-row justify="center">
              <v-dialog
                v-model="datePickerPerformance"
                persistent
                max-width="290"
              >
                <v-date-picker color="amber" v-model="datesPerformance">
                  <v-spacer />
                  <v-btn
                    text
                    color="green"
                    @click="
                      (datePickerPerformance = false), displayBestPerformer()
                    "
                    >Ok</v-btn
                  ></v-date-picker
                >
              </v-dialog>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <div id="chartdivPerformance" v-show="yearlyPerformanceData"></div>
      <div v-if="performanceChartSHow === false" class="nd">
        <nodata class="nodata" />
        <span style="margin: auto">There is no attendance data!</span>
      </div>
    </div>
    <v-layout v-if="this.employyeName" class="performancedataview">
      <div class="profilepic-cover">
        <div class="profilepic">
          <img
            v-if="this.image"
            class="profilepic-image"
            v-bind:src="this.image"
          />
          <contactIcon v-else />
        </div>
      </div>

      <div class="performance-title" style="margin: 2%; margin-top: 5%">
        <p id="tittle">{{ this.employyeName }}</p>
        <p id="subtitle">{{ this.department }}</p>
      </div>
      <div class="performance-trailing">{{ this.performance }}</div>
    </v-layout>
  </div>
</template>

<script>
import dateIcon from "@/assets/icons/date_icon.svg";
import contactIcon from "@/assets/icons/contacts_icon.svg";
import nodata from "@/assets/icons/nodata_icon.svg";
import { mapActions, mapState } from "vuex";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export default {
  computed: {
    ...mapState("dashboard", ["yearlyPerformanceData"]),
  },

  created() {
    this.loadYearlyPerformanceCHsrtData();
  },
  methods: {
    ...mapActions("dashboard", ["getYearlyPerformanceData"]),

    async loadYearlyPerformanceCHsrtData() {
      await this.getYearlyPerformanceData();
      this.drawYearlyPerformanceChart();
      this.displayBestPerformer();
    },

    async drawYearlyPerformanceChart() {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create("chartdivPerformance", am4charts.XYChart);

      // Add data
      for (let i = 0; i < this.yearlyPerformanceData.length; i++) {
        chart.data.push({
          date: this.yearlyPerformanceData[i].date,
          visits: this.yearlyPerformanceData[i].average,
        });
      }

      // Create axes
      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.minGridDistance = 50;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.minGridDistance = 50;

      // Create series
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "visits";
      series.dataFields.dateX = "date";
      series.strokeWidth = 2;
      series.minBulletDistance = 10;
      series.tooltipText = "{valueY}";
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.background.cornerRadius = 20;
      series.tooltip.background.fillOpacity = 0.5;
      series.tooltip.label.padding(12, 12, 12, 12);

      // Add scrollbar
      // chart.scrollbarX = new am4charts.XYChartScrollbar();
      // chart.scrollbarX.series.push(series);

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.xAxis = dateAxis;
      chart.cursor.snapToSeries = series;
    },

    async displayBestPerformer() {
      for (let i = 0; i < this.yearlyPerformanceData.length; i++) {
        if (this.yearlyPerformanceData[i].date === this.datesPerformance) {
          this.employyeName =
            this.yearlyPerformanceData[i].fullName +
            "(" +
            this.yearlyPerformanceData[i].gender +
            ")";
          this.department = this.yearlyPerformanceData[i].department;
          this.performance = this.yearlyPerformanceData[i].topValue + "%";
          this.image = this.yearlyPerformanceData[i].image;
          break;
        } else {
          if (i === this.yearlyPerformanceData.length - 1) {
            this.employyeName = "";
            this.department = "";
            this.performance = "";
            this.image = "";
          }
        }
      }
    },
  },

  data() {
    return {
      datesPerformance: new Date().toISOString().substr(0, 10),
      performanceChartSHow: true,
      menuPerformance: "",
      employyeName: "",
      department: "",
      performance: "",
      image: "",
      datePickerPerformance: false,
    };
  },
  components: {
    nodata,
    dateIcon,
    contactIcon,
  },
};
</script>

<style scoped>
.dateIcon {
  width: 20px;
  height: 20px;
}
.dateIcon:hover {
  transform: scale(1.25);
}
#tittle {
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  font-size: 20px;
  font-weight: bold;
  color: grey;
}
#subtitle {
  font-family: "Courier New", Courier, monospace;
  font-size: 15px;
  font-weight: lighter;
  color: grey;
  margin-top: -8%;
}
.performance-trailing {
  margin-top: auto;
  margin-bottom: auto;
  font-size: 30px;
  color: #f0bd46;
  font-weight: bold;
  float: right;
}

.profilepic img {
  object-fit: cover;
  width: 78px;
  height: 78px;
}

.profilepic {
  width: 78px;
  height: 78px;
  border: 2px solid #ffda82;
  border-radius: 100px;
  overflow: hidden;
}

.profilepic-cover {
  width: 90px;
  height: 90px;
  margin-left: 20px;
  margin-top: 3px;
  margin-bottom: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 4px solid #f0bd46;
  border-radius: 100px;
}
.performancechartview {
  width: 100%;
  height: 35vh;
}

.performancedataview {
  border: 1px solid rgb(236, 230, 230);
  border-radius: 10px;
  border: outset 0.5px;
  width: 97%;
  height: 13vh;
  margin-top: 30px;
  margin-left: 10px;
  display: flex;
}

.card-title {
  margin-left: 10px;
  color: rgb(124, 123, 123);
}
#chartdivPerformance {
  font-size: 8pt;
  margin-top: -3%;
  height: 30vh;
}
/*
#chartdivPerformance:hover {
  height: 30vh;
} */
.nodata {
  align-items: center;
  animation: shake 4.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) both infinite;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 100px;
}
.nd {
  height: 100px;
  width: 80%;
  display: flex;
  flex-direction: column;
  margin-top: -5%;
}
</style>