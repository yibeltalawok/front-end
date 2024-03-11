<template>
  <div>
    <div
      v-if="performanceData.length > 0"
      style="width: 65%; margin-left: 2%;  padding-right: 2%; height: 45px"
    >
      <v-row style="padding-top: 20px">
        <v-spacer />
        <v-btn
          v-if=" performanceData.length > 0 &&this.dailyPerStatusResultSHow === false"
          outlined
          color="green"
          small
          @click="saveDailyPerformace()"
          >Save</v-btn
        >
        <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                rounded
                small
                outlined
                color="#ecbb44"
                class="text-capitalize mainbtn"
                @click="downloadReport()"
              >
                <v-icon  v-bind="attrs" v-on="on">mdi-download</v-icon>
              </v-btn>
            </template>
            <span>Download report in CSV</span>
        </v-tooltip>
      </v-row>
    </div>
    <div class="mainDiv">
      <div class="leftDiv">
        <br />
        <div
          class="cardPerformace"
          v-for="list in performanceData"
          :key="list.employeeid"
        >
          <img :src="list.employeeProfilePicture" alt="" />
          <div>
            <label>{{ list.employeeName }}</label
            ><br />
            <label style="font-size: x-small">{{ list.department }}</label>
          </div>
          <v-spacer />
          <p>{{ list.employeeGender }}</p>

          <v-spacer />
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
                <p v-bind="attrs" v-on="on">{{ list.sam }}</p>
            </template>
            <span>SAM</span>
          </v-tooltip>

          <v-spacer />
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <p v-bind="attrs" v-on="on">{{ list.amountDone }}</p>
            </template>
            <span>Amount Done</span>
          </v-tooltip>

          <v-spacer />
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <p v-bind="attrs" v-on="on">{{ list.efficiency }}</p>
            </template>
            <span>Efficiency</span>
          </v-tooltip>

          <v-spacer />
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <p v-bind="attrs" v-on="on">{{ list.lotTime }}</p>
            </template>
            <span>Lost Time</span>
          </v-tooltip>

          <v-spacer />
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <p v-bind="attrs" v-on="on">{{ list.performance }}</p>
            </template>
            <span>Performance</span>
          </v-tooltip>
          <v-spacer />
        </div>
        <div v-if="performanceData.length === 0" class="nd">
          <nodata class="nodata" />
          <span style="margin: auto">There is no job data!</span>
        </div>
      </div>
      <div class="rightDiv">
        <div id="dateDiv">
          <v-date-picker
            class="mt-4"
            width="300px"
            v-model="datePerformance"
            color="amber"
            no-title
            @input="loadPerformanceData"
          />
        </div>

         <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on" id="chartdiv"></div>
            </template>
            <span>Performance chart</span>
          </v-tooltip>
        
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
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
      datePerformance: new Date().toISOString().substr(0, 10),
      totalAve: 0,
      dailyPerStatusResultSHow: false,
    };
  },
  created() {},
  mounted() {
    this.loadPerformanceData();
  },
  computed: {
    ...mapState("performance", [
      "performanceData",
      "averagePerformance",
      "topEmployeeId",
      "topvalue",
      "dailyPerStatusResult",
    ]),
  },
  methods: {
    ...mapActions("performance", [
      "getLoadPerformanceData",
      "saveDailyPerformance",
      "saveDailyPerStatusResult",
    ]),
    async dataToCsv(data) {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));

    for (const row of data) {
        const values = headers.map((header) => {
        const escape = ("" + row[header]).replace(/"/g, '\\"');
        return `"${escape}"`;
        });
        csvRows.push(values.join(","));
    }
    return csvRows.join("\n");
    },

    async downloadCsvData(data) {
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      var dt = new Date();
      var isoFormat = dt.toISOString();
      var substringedDt = isoFormat.substr(0,19);
      var tRemovedDt = substringedDt.replace('T', ' ');

      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute(
          "download",
          "Performance-" + tRemovedDt  + ".csv"
      );
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },

    async downloadReport(){
      this.item = this.performanceData.map(x => {
          return {
          EmployeeName: x.employeeName,
          Gender: x.employeeGender,
          Date: this.datePerformance,
          TotlaAmountDone: x.amountDone,
          TotalSAM: x.sam,
          TotalWorkedHour: x.workingTime,
          Performance: x.performance,
          LostTime: x.lotTime,
          efficiency: x.efficiency,
          };
      });

      const csvData = await Promise.resolve(this.dataToCsv(this.item));
      this.downloadCsvData(csvData);
    },

    async saveDailyPerformace() {
      var perfData = [];
      perfData.push({
        date: this.datePerformance,
        average: this.averagePerformance,
        employeeId: this.topEmployeeId,
        topValue: this.topvalue,
      });
      this.saveDailyPerStatusResult(perfData);
      this.dailyPerStatusResultSHow = true;
    },

    async loadPerformanceData() {
      var date = { date: this.datePerformance };
      await this.getLoadPerformanceData(date);
      if (this.performanceData.length > 0)
        this.totalAve = this.averagePerformance;
      else this.totalAve = 0;
      this.loadPerformanceChart();
      this.dailyPerStatusResultSHow = false;
    },
    async loadPerformanceChart() {
      am4core.useTheme(am4themes_animated);

      let chartMin = 0;
      let chartMax = 100;

      let data = {
        score: this.totalAve,
        gradingData: [
          {
            title: "Foundational",
            color: "#fdae19",
            lowScore: 0,
            highScore: 20,
          },
          {
            title: "Developing",
            color: "#f3eb0c",
            lowScore: 20,
            highScore: 40,
          },
          {
            title: "Maturing",
            color: "#b0d136",
            lowScore: 40,
            highScore: 60,
          },
          {
            title: "Sustainable",
            color: "#54b947",
            lowScore: 60,
            highScore: 80,
          },
          {
            title: "High Performing",
            color: "#0f9747",
            lowScore: 80,
            highScore: 100,
          },
        ],
      };

      /**
Grading Lookup
 */
      function lookUpGrade(lookupScore, grades) {
        // Only change code below this line
        for (var i = 0; i < grades.length; i++) {
          if (
            grades[i].lowScore < lookupScore &&
            grades[i].highScore >= lookupScore
          ) {
            return grades[i];
          }
        }
        return null;
      }

      // create chart
      let chart = am4core.create("chartdiv", am4charts.GaugeChart);
      chart.hiddenState.properties.opacity = 0;
      chart.fontSize = 10;
      chart.innerRadius = am4core.percent(80);
      chart.resizable = true;

      /**
       * Normal axis
       */

      let axis = chart.xAxes.push(new am4charts.ValueAxis());
      axis.min = chartMin;
      axis.max = chartMax;
      axis.strictMinMax = true;
      axis.renderer.radius = am4core.percent(80);
      axis.renderer.inside = true;
      axis.renderer.line.strokeOpacity = 0.1;
      axis.renderer.ticks.template.disabled = false;
      axis.renderer.ticks.template.strokeOpacity = 1;
      axis.renderer.ticks.template.strokeWidth = 0.5;
      axis.renderer.ticks.template.length = 5;
      axis.renderer.grid.template.disabled = true;
      axis.renderer.labels.template.radius = am4core.percent(15);
      axis.renderer.labels.template.fontSize = "0.9em";

      /**
       * Axis for ranges
       */

      let axis2 = chart.xAxes.push(new am4charts.ValueAxis());
      axis2.min = chartMin;
      axis2.max = chartMax;
      axis2.strictMinMax = true;
      axis2.renderer.labels.template.disabled = true;
      axis2.renderer.ticks.template.disabled = true;
      axis2.renderer.grid.template.disabled = false;
      axis2.renderer.grid.template.opacity = 0.5;
      axis2.renderer.labels.template.bent = true;
      axis2.renderer.labels.template.fill = am4core.color("#000");
      axis2.renderer.labels.template.fontWeight = "bold";
      axis2.renderer.labels.template.fillOpacity = 0.3;

      /**
Ranges
*/

      for (let grading of data.gradingData) {
        let range = axis2.axisRanges.create();
        range.axisFill.fill = am4core.color(grading.color);
        range.axisFill.fillOpacity = 0.8;
        range.axisFill.zIndex = -1;
        range.value = grading.lowScore > chartMin ? grading.lowScore : chartMin;
        range.endValue =
          grading.highScore < chartMax ? grading.highScore : chartMax;
        range.grid.strokeOpacity = 0;
        range.stroke = am4core.color(grading.color).lighten(-0.1);
        range.label.inside = true;
        range.label.text = grading.title.toUpperCase();
        range.label.inside = true;
        range.label.location = 0.5;
        range.label.inside = true;
        range.label.radius = am4core.percent(10);
        range.label.paddingBottom = -5; // ~half font size
        range.label.fontSize = "0.9em";
      }

      let matchingGrade = lookUpGrade(data.score, data.gradingData);

      /**
       * Label 1
       */

      let label = chart.radarContainer.createChild(am4core.Label);
      label.isMeasured = false;
      label.fontSize = "6em";
      label.x = am4core.percent(50);
      label.paddingBottom = 15;
      label.horizontalCenter = "middle";
      label.verticalCenter = "bottom";
      //label.dataItem = data;
      label.text = data.score.toFixed(1);
      //label.text = "{score}";
      label.fill = am4core.color(matchingGrade.color);

      /**
       * Label 2
       */

      let label2 = chart.radarContainer.createChild(am4core.Label);
      label2.isMeasured = false;
      label2.fontSize = "2em";
      label2.horizontalCenter = "middle";
      label2.verticalCenter = "bottom";
      label2.text = matchingGrade.title.toUpperCase();
      label2.fill = am4core.color(matchingGrade.color);

      /**
       * Hand
       */

      let hand = chart.hands.push(new am4charts.ClockHand());
      hand.axis = axis2;
      hand.innerRadius = am4core.percent(55);
      hand.startWidth = 8;
      hand.pin.disabled = true;
      hand.value = data.score;
      hand.fill = am4core.color("#444");
      hand.stroke = am4core.color("#000");

      hand.events.on("positionchanged", function () {
        label.text = axis2.positionToValue(hand.currentPosition).toFixed(1);
        //let value2 = axis.positionToValue(hand.currentPosition);
        let matchingGrade = lookUpGrade(
          axis.positionToValue(hand.currentPosition),
          data.gradingData
        );
        label2.text = matchingGrade.title.toUpperCase();
        label2.fill = am4core.color(matchingGrade.color);
        label2.stroke = am4core.color(matchingGrade.color);
        label.fill = am4core.color(matchingGrade.color);
      });
    },
  },
};
</script>
<style scoped>
.mainDiv {
  display: flex;
}

.leftDiv {
  width: 60%;
  margin-left: 2%;
}
.leftDiv .cardPerformace {
  margin-top: 7px;
}
.rightDiv {
  width: 40%;
  height: 90vh;
}
.cardPerformace {
  display: flex;
  position: relative;
  height: 50px;
  width: 110%;
  overflow: hidden;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  transition: height 0.3s, box-shadow 0.3s;
  border-radius: 10px;
  border: 1px solid green;
  font-size: 12px;
  padding-left: 3%;
  padding-right: 3%;
  align-items: center;
}
.cardPerformace:hover {
  height: 55px;
  box-shadow: 10px 10px 30px 0px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  background-color: #acf4ac;
  color: green;
  font-size: 13px;
}

.cardPerformace p {
  margin-top: 2%;
}

.cardPerformace img {
  height: 30px;
  width: 30px;
  margin: 10px;
  border-radius: 15px;
}

#dateDiv {
  margin-left: 30%;
  height: 50%;
}
#chartdiv {
  float: right;
  height: 35%;
  width: 80%;
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
  margin-top: 20%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.labelKey {
  font-size: 13px;
}
.mainbtn{
  /* padding: 0.5em; */
  margin: 0 0.5em;
}
</style>
