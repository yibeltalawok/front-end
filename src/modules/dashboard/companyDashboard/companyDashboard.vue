<template>
  <div class="mainclass">
    <v-layout style="margin: 10px; display: flex" justify-space-around>
      <div class="smallCard" style="width: 190px">
        <div class="colview">
          <div class="tittle">{{ statData[0] }}</div>
          <div class="subtitle">Total Orders</div>
        </div>
        <div class="trailingicon">
          <order />
        </div>
      </div>

      <div class="smallCard" style="width: 190px">
        <div class="colview">
          <div class="tittle">{{ statData[1] }}</div>
          <div class="subtitle">Total Sewing</div>
        </div>
        <div class="trailingicon">
          <sweing />
        </div>
      </div>

      <div class="smallCard" style="width: 190px">
        <div class="colview">
          <div class="tittle">{{ statData[2] }}</div>
          <div class="subtitle">Total Cutting</div>
        </div>
        <div class="trailingicon">
          <cutting />
        </div>
      </div>

      <div class="smallCard" style="width: 200px">
        <div class="colview">
          <div class="tittle">{{ statData[3] }}</div>
          <div class="subtitle">Total Finishing</div>
        </div>
        <div class="trailingicon">
          <finishing />
        </div>
      </div>
    </v-layout>

    <div class="mainchartrows">
      <div class="attendancelosttime">
        <div class="attendanceChart">
          <v-layout row justify-space-between>
            <h4 class="card-title">Sewing Line</h4>
            <date @click.stop="attendanceDateClicked" class="icons" />
          </v-layout>

          <v-layout row justify-space-between>
            <v-flex xs12 sm2 md2 lg2>
              <div class="chartview">
                <v-autocomplete
                  :items="lineNums"
                  item-text="lineNumber"
                  item-value="id"
                  :label="$t('line')"
                  ref="linenum"
                  @input="selectLine"
                ></v-autocomplete>
                <v-btn
                  text
                  small
                  color="#ecbb44"
                  class="text-capitalize"
                  @click="clearLine()"
                  >{{ $t("clear") }}</v-btn
                >
              </div>
            </v-flex>

            <v-flex xs12 sm10 md10 lg10>
              <div class="dataview" id="chartdiv" />
            </v-flex>
          </v-layout>
        </div>

        <!-- <div class="losttimeChart">
        </div> -->
      </div>

      <div class="performanceChart" style="margin-right: 10px">
        <v-layout row justify-space-between>
          <h4 class="card-title">Cost per SAM</h4>
          <date @click.stop="attendanceDateClicked" class="icons" />
        </v-layout>

        <v-layout column justify-space-between>
          <div class="performancechartview">
            <v-flex xs12 sm12 md12 lg12>
              <div class="dataview" id="samchartdiv"></div>
            </v-flex>
          </div>
        </v-layout>
      </div>
    </div>

    <v-layout row justify-space-around>
      <div class="favProductsContainer">
        <v-layout row justify-space-between style="margin-top: 2%; margin-left: 2%; margin-bottom: 2%">
            <h4 class="card-title">Cost per Minute</h4>
        </v-layout>
        <div class="dataview" id="costsummarychart"></div>
      </div>
      <div class="recentordersContainer">
        <v-layout row justify-space-between style="margin-bottom: 10px">
          <h4 class="card-title">Recent Orders</h4>
        </v-layout>

        <div
          v-for="order in this.recentOrders"
          :key="order"
          class="singleProduct"
        >
          <v-layout row justify-space-between>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on" class="subtittle">
                    #{{ order.orderNumber }}
                  </div>
              </template>
              <span>Order Number</span>
            </v-tooltip>
            <!-- <div class="tittle">#{{ order.orderNumber }}</div> -->
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on" class="subtittle">
                    {{ order.quantity }}
                  </div>
              </template>
              <span>Order Quantity</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on" class="subtittle">
                    {{ order.producedOrder }}
                  </div>
              </template>
              <span>Produced Order</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on" class="subtittle">
                    {{ order.Customer.customerName }}
                  </div>
              </template>
              <span>Customer Name</span>
            </v-tooltip>
            
            <!-- <div class="subtittle">
              {{ order.producedOrder }}
            </div>
            <div class="subtittle">
              {{ order.Customer.customerName }}
            </div> -->
          </v-layout>
        </div>
        <div v-if="recentOrders.length === 0" class="nd">
          <nodata class="nodata" />
          <span style="margin: auto">There is no Orders data!</span>
        </div>
      </div>
    </v-layout>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import contacts from "@/assets/icons/contacts_icon.svg";
import puzzle from "@/assets/icons/puzzle.svg";
import order from "@/assets/icons/orders.svg";
import sweing from "@/assets/icons/sew.svg";
import cutting from "@/assets/icons/scissor.svg";
import finishing from "@/assets/icons/finishing.svg";
import nodata from "@/assets/icons/nodata_icon.svg";
import date from "@/assets/icons/date_icon.svg";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { mapState, mapActions } from "vuex";
am4core.useTheme(am4themes_animated);
export default {
  components: {
    order,
    sweing,
    cutting,
    finishing,
    date,
    nodata,
  },
  computed: {
    ...mapState("bundlehistory", ["garments", "lineNums"]),
    ...mapState("companyDashboard", ["statData", "recentOrders"]),
    ...mapState("bundlehistory", ["garments", "lineNums"]),
    ...mapState("cost", ["sams", "cpms"]),
  },
  async created() {
    this.getLineNumbers();
  },
  mounted() {
    this.loadstatData();
    this.laodrecentOrders();
    this.fetchCD();
    this.drawCostPerSamChart();
    this.drawCostSummaryChart();

    // this.fetchGarmentQuantity('2021-04-06');
  },

  data() {
    return {
      selectedDate: "",
      selectedYear: "",
      selectedMonth: "",
    };
  },
  methods: {
    ...mapActions("bundlehistory", [
      "fetchGarmentQuantity",
      "getLineNumbers",
      "fetchGarmentByLine",
    ]),
    ...mapActions("companyDashboard", ["getstatData", "getrecentOrders"]),
    ...mapActions("bundlehistory", [
      "fetchGarmentQuantity",
      "getLineNumbers",
      "fetchGarmentByLine",
    ]),
    ...mapActions("cost", ["fetchCostPerSams", "fetchCPMForChart"]),
    async loadstatData() {
      await this.getstatData();
    },
    async laodrecentOrders() {
      await this.getrecentOrders();
    },
    async fetchCD() {
      // Create chart instance
      let chart = am4core.create("chartdiv", am4charts.XYChart);
      // Add data
      chart.data = await this.generateChartData();
      // Create axes
      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.minGridDistance = 50;
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.minGridDistance = 35;
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
    async drawCostPerSamChart() {
      let dt = new Date().toISOString();
      let year = dt.substr(0, 4);
      let month = dt.substr(5, 2);
      // Create chart instance
      let chart = am4core.create("samchartdiv", am4charts.XYChart);
      let data = [];
      let value = 120;
      let names = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      for (var i = 0; i < names.length; i++) {
        // let isodate = new Date().toISOString().substr(0,10);
        switch (names[i]) {
          case "January":
            month = "01";
            break;
          case "February":
            month = "02";
            break;
          case "March":
            month = "03";
            break;
          case "April":
            month = "04";
            break;
          case "May":
            month = "05";
            break;
          case "June":
            month = "06";
            break;
          case "July":
            month = "07";
            break;
          case "August":
            month = "08";
            break;
          case "September":
            month = "09";
            break;

          case "October":
            month = "10";
            break;
          case "November":
            month = "11";
            break;
          case "December":
            month = "12";
            break;
          default:
            month = "01";
            break;
        }
        if (this.selectedDate) {
          // fetch cost per sam by the selected date.
          await this.fetchCostPerSams([month, this.selectedYear]).then(() => {
            value = this.sams;
            data.push({ category: names[i], value: value });
          });
        } else {
          await this.fetchCostPerSams([month, year]).then(() => {
            value = this.sams;
            data.push({ category: names[i], value: value });
          });
        }
        // value += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 5);
      }
      chart.colors.list = [am4core.color("#f5ba0a")];
      chart.data = data;
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = "category";
      categoryAxis.renderer.minGridDistance = 15;
      categoryAxis.renderer.grid.template.location = 0.5;
      categoryAxis.renderer.grid.template.strokeDasharray = "1,3";
      categoryAxis.renderer.labels.template.rotation = -90;
      categoryAxis.renderer.labels.template.horizontalCenter = "left";
      categoryAxis.renderer.labels.template.location = 0.5;
      categoryAxis.renderer.labels.template.fontSize = 12;
      categoryAxis.renderer.labels.template.adapter.add(
        "dx",
        function (dx, target) {
          return -target.maxRight / 2;
        }
      );
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.ticks.template.disabled = true;
      valueAxis.renderer.axisFills.template.disabled = true;
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = "category";
      series.dataFields.valueY = "value";
      series.tooltipText = "{valueY.value}";
      series.sequencedInterpolation = true;
      series.fillOpacity = 0;
      series.strokeOpacity = 1;
      series.strokeDashArray = "1,3";
      series.columns.template.width = 0.01;
      series.tooltip.pointerOrientation = "horizontal";
      let bullet = series.bullets.create(am4charts.CircleBullet);
      chart.cursor = new am4charts.XYCursor();
      // chart.scrollbarX = new am4core.Scrollbar();
      // chart.scrollbarY = new am4core.Scrollbar();
    },
    async drawCostSummaryChart() {
      let dt = new Date().toISOString().substr(0, 7);
      let year = "";
      if (this.selectedDate) {
        year = this.selectedDate.substr(0, 4);
      } else {
        year = dt.substr(0, 4);
      }
      // let month = dt.substr(5, 2);
      let filter = "";
      // Create chart instance
      let chart = am4core.create("costsummarychart", am4charts.XYChart);
      let data = [];
      let value = 120;
      let names = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      for (var i = 0; i < names.length; i++) {
        // let isodate = new Date().toISOString().substr(0,10);
        switch (names[i]) {
          case "January":
            // month = '01';
            filter = year + "-01";
            break;
          case "February":
            // month = '02';
            filter = year + "-02";
            break;
          case "March":
            // month = '03';
            filter = year + "-03";
            break;
          case "April":
            // month = '04';
            filter = year + "-04";
            break;
          case "May":
            // month = '05';
            filter = year + "-05";
            break;
          case "June":
            // month = '06';
            filter = year + "-06";
            break;
          case "July":
            // month = '07';
            filter = year + "-07";
            break;
          case "August":
            // month = '08';
            filter = year + "-08";
            break;
          case "September":
            // month = '09';
            filter = year + "-09";
            break;

          case "October":
            // month = '10';
            filter = year + "-10";
            break;
          case "November":
            // month = '11';
            filter = year + "-11";
            break;
          case "December":
            // month = '12';
            filter = year + "-12";
            break;
          default:
            filter = year + "-01";
            break;
        }

        await this.fetchCPMForChart(filter).then(() => {
          value = this.cpms;
          data.push({ category: names[i], value: value });
        });
      }
      chart.colors.list = [am4core.color("#f5ba0a")];
      chart.data = data;
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = "category";
      categoryAxis.renderer.minGridDistance = 15;
      categoryAxis.renderer.grid.template.location = 0.5;
      categoryAxis.renderer.grid.template.strokeDasharray = "1,3";
      categoryAxis.renderer.labels.template.rotation = -90;
      categoryAxis.renderer.labels.template.horizontalCenter = "left";
      categoryAxis.renderer.labels.template.location = 0.5;
      categoryAxis.renderer.labels.template.fontSize = 12;
      categoryAxis.renderer.labels.template.adapter.add(
        "dx",
        function (dx, target) {
          return -target.maxRight / 2;
        }
      );
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.ticks.template.disabled = true;
      valueAxis.renderer.axisFills.template.disabled = true;
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = "category";
      series.dataFields.valueY = "value";
      series.tooltipText = "{valueY.value}";
      series.sequencedInterpolation = true;
      series.fillOpacity = 0;
      series.strokeOpacity = 1;
      series.strokeDashArray = "1,3";
      series.columns.template.width = 0.01;
      series.tooltip.pointerOrientation = "horizontal";
      let bullet = series.bullets.create(am4charts.CircleBullet);
      chart.cursor = new am4charts.XYCursor();
      // chart.scrollbarX = new am4core.Scrollbar();
      // chart.scrollbarY = new am4core.Scrollbar();
    },
    async generateChartData() {
      let chartData = [];
      let firstDate = new Date(); // we can set the date here from a filter.
      firstDate.setDate(firstDate.getDate() - 50);
      let visits = 100; // visits are the garment quantity.
      for (var i = 0; i < 300; i++) {
        visits = 0;
        // we create date objects here. In your data, you can have date strings
        // and then set format of your dates using chart.dataDateFormat property,
        // however when possible, use date objects, as this will speed up chart rendering.
        let newDate = new Date(firstDate);
        let ndate = newDate.setDate(newDate.getDate() + i);

        let filterdate = new Date(newDate);
        let isodate = filterdate.toISOString().substr(0, 10);
        // alert(isodate);
        if (this.selectedLine) {
          // fetch garment by line and date
          await this.fetchGarmentByLine([isodate, this.selectedLine]).then(
            () => {
              visits += this.garments;
            }
          );
        } else {
          // fetch garment by date only.
          await this.fetchGarmentQuantity(isodate).then(() => {
            visits += this.garments;
          });
        }

        chartData.push({
          date: ndate,
          visits: visits,
        });
      }
      return chartData;
    },
    async selectLine(val) {
      // alert(val)
      this.selectedLine = val;
      await this.fetchCD();
    },
    async filterByYear(date) {
      this.selectedDate = date;
      this.selectedYear = date.substr(0, 4);
      this.selectedMonth = date.substr(5, 7);
      this.drawCostPerSamChart();
    },
    async clearLine() {
      this.selectedLine = "";
      this.$refs.linenum.value = null;
      await this.fetchCD();
    },
    attendanceDateClicked() {
      // eslint-disable-next-line no-console
      console.log("Attendance clicked");
    },
  },
};
</script>

<style scoped>
.mainchartrows {
  display: flex;
  width: 95%;
  justify-content: space-around;
  margin-left: 30px;
}
.singleProduct {
  width: 37vw;
  border-bottom: 1px solid rgb(218, 213, 213);
  padding: 10px;
  margin-top: 10px;
}
.singleProduct .tittle {
  font-weight: bold;
  font-size: 14px;
}
.singleProduct .subtittle {
  font-weight: lighter;
  font-size: 13px;
  margin-right: 20px;
}
.recentordersContainer {
  width: 40vw;
  height: 400px;
  padding: 20px;
  margin: 20px;
  margin-right: 40px;
  border-radius: 10px;
}
.favProductsContainer {
  width: 35vw;
  height: 400px;
  margin: 20px;
  margin-left: 40px;
  border-radius: 10px;
  border: rgb(223, 216, 216) solid 1px;

}
.card-title {
  margin-left: 10px;
  color: rgb(138, 136, 136);
}
.performance-trailing {
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 20px;
  font-size: 30px;
  color: #f0bd46;
  font-weight: bold;
}
.performance-title {
  margin-left: 20px;
  margin-top: auto;
  margin-bottom: auto;
}
.profilepic-cover {
  width: 90px;
  height: 90px;
  margin-left: 20px;
  margin-top: auto;
  margin-bottom: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 4px solid #f0bd46;
  border-radius: 100px;
}
.profilepic {
  width: 78px;
  height: 78px;
  border: 2px solid #ffda82;
  border-radius: 100px;
  overflow: hidden;
}
.profilepic img {
  object-fit: cover;
  width: 78px;
  height: 78px;
}
.dataview {
  /* background-color: thistle; */
  width: 100%;
  height: 30vh;
}
.chartview {
  /* background-color: tomato; */
  /* width: 30%; */
  height: 100px;
}
.performancedataview {
  border: 1px solid rgb(236, 230, 230);
  border-radius: 10px;
  box-shadow: 2px 4px 10px 0px #f1f0ec;
  width: 100%;
  height: 13vh;
  margin-top: 10px;
  margin-left: 3px;
}
.performancechartview {
  /* background-color: rgb(235, 228, 227); */
  width: 100%;
  height: 30vh;
  margin-top: 20px;
}
.icons {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.icons:hover {
  width: 22px;
  height: 22px;
  margin-right: 10px;
}
.circularBar {
  flex: 2;
}
.smallCard {
  width: 270px;
  height: 60px;
  margin: 10px;
  margin-right: 20px;
  padding: 10px;
  padding-left: 30px;
  padding-right: 20px;
  border-radius: 20px;
  display: flex;
  border: rgb(223, 216, 216) solid 1px;
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
/* .smallCard:hover {
    width: 270px;
    height: 95px;
    margin: 10px;
    margin-right: 20px;
    padding: 10px;
    padding-left: 30px;
    padding-right: 20px;
    border-radius: 20px;
    display: flex;
    background-color: #f7e7c3;
    box-shadow: 2px 4px 10px 0px #ddd6c5;
} */
.colview {
  display: flex;
  flex: 5;
  flex-direction: column;
}
.tittle {
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  font-size: 20px;
  font-weight: bold;
  color: grey;
}
.subtitle{
  font-family: "Courier New", Courier, monospace;
  font-size: 10px;
  font-weight: lighter;
  color: grey;
}
.subtittle {
  font-family: "Courier New", Courier, monospace;
  font-size: 10px;
  font-weight: lighter;
  color: grey;
  width: 5vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.trailingicon {
  width: 40px;
  height: 40px;
  margin: auto;
}
/* .smallCard:hover .tittle {
    font-size: 40px;
} */
.smallCard:hover .trailingicon {
  width: 45px;
  height: 45px;
  margin: auto;
}
.losttimeChart {
  height: 200px;
  width: 600px;
  margin-left: 50px;
  margin: 10px;
  border-radius: 10px;
  border: rgb(223, 216, 216) solid 1px;
}
.performanceChart {
  height: 230px;
  width: 100px;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  border: rgb(223, 216, 216) solid 1px;
}
.attendanceChart {
  height: 420px;
  width: 600px;
  margin-left: 50px;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  border: rgb(223, 216, 216) solid 1px;
}
/* .attendanceChart:hover {
    height: 260px;
    width: 630px;
    margin-left: 50px;
    margin: 10px;
    border-radius: 10px;
    border: rgb(223, 216, 216) solid 1px;
    background-color: white;
    box-shadow: 2px 4px 10px 0px #e7e0d0;
} */
.attendancelosttime {
  display: flex;
  flex-direction: column;
}
.performanceChart {
  height: 420px;
  width: 600px;
  margin: 10px;
  margin-left: 50px;
  border-radius: 10px;
  border: rgb(223, 216, 216) solid 1px;
}
/* .performanceChart:hover {
    height: 430px;
    width: 630px;
    margin-left: 50px;
    border-radius: 10px;
    border: rgb(223, 216, 216) solid 1px;
    background-color: white;
    box-shadow: 2px 4px 10px 0px #e7e0d0;
}*/
#chartdiv {
  width: 100%;
  height: 355px;
  margin-left: 0;
  /* height: 100%; */
}
/* #chartdiv:hover{
    height: 225px;
} */
#samchartdiv {
  width: 100%;
  height: 355px;
  margin-left: 0;
  /* height: 100%; */
}
#costsummarychart {
  width: 100%;
  height: 350px;
  margin-left: 0;
}
/* #samchartdiv:hover{
    height: 210px;
} */
</style>