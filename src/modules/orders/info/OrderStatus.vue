<template>
  <v-app>
    <v-card-title>
      <h3>Customer Order Status</h3>
    </v-card-title>
    <v-card-text>
      <div id="order_div">
        <h3>Total Orders : {{ this.orderStatusData[2] }}</h3>

        <v-spacer></v-spacer>
        <v-select
          @change="reloadChart($event)"
          label="Select Date Coverd"
          :items="['Weakly', 'Monthly', 'Yearly']"
        ></v-select>
      </div>

      <div id="chart_main">
        <div class="top_customer">
          <h4><u>Customer with maximum order</u></h4>
          <ul>
            <li
              v-for="maxlist in this.orderStatusData[1]"
              :key="maxlist.message"
            >
              {{ maxlist }}
            </li>
          </ul>
        </div>
        <div class="chartDisp" ref="chartDisp"></div>
      </div>
    </v-card-text>
  </v-app>
</template>

<script>
import { mapActions, mapState } from "vuex";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export default {
  data: () => ({
    dateCoverd: 7,
  }),

  computed: {
    ...mapState("order", ["orderStatusData"]),
    ...mapState("order", ["getOrderstatusFinshed"]),
    //, ["totalOrder"],  ["customerTolList"]
  },
  methods: {
    ...mapActions("order", ["getOrderstatus"]),
    ...mapActions("order", ["getOrderstatusFinshed"]),
    async refreshChartMethos() {
      this.getOrderstatus(this.dateCoverd);

      let chart = am4core.create(this.$refs.chartDisp, am4charts.XYChart);
      chart.data = this.orderStatusData[0];
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "category";

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;

      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = "category";
      series.dataFields.openValueY = "ordered";
      series.dataFields.valueY = "finshed";
      series.tooltipText =
        "ordered: {openValueY.value} finshed: {valueY.value}";
      series.columns.template.width = 1;

      var orderedBullet = series.bullets.create(am4charts.CircleBullet);
      orderedBullet.locationY = 1;

      var finshedBullet = series.bullets.create(am4charts.CircleBullet);
      finshedBullet.fill = chart.colors.getIndex(10);
      finshedBullet.stroke = finshedBullet.fill;

      chart.cursor = new am4charts.XYCursor();
    },
    reloadChart(byWhat) {
      if (byWhat === "Weakly") this.dateCoverd = 7;
      else if (byWhat === "Monthly") this.dateCoverd = 30;
      else if (byWhat === "Yearly") this.dateCoverd = 366;

      this.refreshChartMethos();
    },
  },
  mounted() {
    this.refreshChartMethos();
  },
};
</script>
<style>
.top_customer {
  width: 25%;
}
.chartDisp {
  width: 75%;
  height: auto;
}

#order_div,
#chart_main {
  display: flex;
}
</style>
