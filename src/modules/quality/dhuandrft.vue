<template>
  <div>
    <v-card flat class="uppercard-chart">
      <v-card-subtitle> DHU and RFT </v-card-subtitle>

      <div class="chartsui" ref="chartdiv"></div>
    </v-card>

    <!-- <v-card width="100%" >

       <v-card-text aria-expanded >
                    DHU Vs RFT table
        </v-card-text>

       <v-data-table

        :headers="[
                    { text: 'Eval id', align: 'start', sortable: false, value: 'date', },
                    { text: 'Line num', value: 'line' },
                    { text: 'Major Defects', value: 'value' },
                    { text: 'First time pass', value: 'pass' },
                    { text: 'Number of checked garments', value: 'checked' },
                    { text: 'DHU', value: 'dhu' },
                    { text: 'RFT', value: 'rft' },
        ]"
        :items="this.dhuchartdata"
        :items-per-page="5"
        class="elevation-1" >

  
        </v-data-table>

   </v-card> -->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export default {
  name: "dhuandrft",
  date() {
    return {
      tempdhulist: [],
      temparray: [],
      garmentsChecked: 0,
      smsmsms: false,
      page: 1,
      pageCount: 0,
    };
  },

  computed: {
    ...mapState("evaluation", ["dhuchartdata"]),
  },

  mounted() {
    this.fetchDHU();
  },

  methods: {
    ...mapActions("evaluation", ["fetchDHUChartDate"]),

    async fetchDHU() {
      // eslint-disable-next-line no-unused-vars
      await this.fetchDHUChartDate().then((r) => {
        this.dhuChartData();
      });
    },

    dhuChartData() {
      var chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);

      chart.data = this.dhuchartdata;

      // Set input format for the dates
      chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

      // Create axes
      var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      // eslint-disable-next-line no-unused-vars
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = "DHU";

      // Create series RFT
      var rftseries = chart.series.push(new am4charts.LineSeries());
      rftseries.dataFields.valueY = "rft";
      rftseries.dataFields.dateX = "date";
      rftseries.strokeWidth = 2;
      rftseries.minBulletDistance = 15;
      rftseries.name = "RFT";

      // Drop-shaped tooltips RFT
      rftseries.tooltip.background.cornerRadius = 20;
      rftseries.tooltip.background.strokeOpacity = 0;
      rftseries.tooltip.pointerOrientation = "vertical";
      rftseries.tooltip.label.minWidth = 40;
      rftseries.tooltip.label.minHeight = 40;
      rftseries.tooltip.label.textAlign = "middle";
      rftseries.tooltip.label.textValign = "middle";

      // Make bullets grow on hover RFT
      var rftbullet = rftseries.bullets.push(new am4charts.CircleBullet());
      rftbullet.circle.fill = am4core.color("#fff");

      var rftbullethover = rftbullet.states.create("hover");
      rftbullethover.properties.scale = 1.3;

      var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis2.renderer.opposite = true;
      valueAxis2.syncWithAxis = valueAxis;
      valueAxis2.tooltip.disabled = true;
      valueAxis2.title.text = "RFT";
      rftseries.yAxis = valueAxis2;

      // // // Make a panning cursor RFT
      // chart.cursor = new am4charts.XYCursor();
      // chart.cursor.behavior = "panXY";
      // chart.cursor.xAxis = dateAxis;
      // chart.cursor.snapToSeries = rftseries;

      // Create series
      var series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "dhu";
      series.dataFields.dateX = "date";
      series.stroke = chart.colors.getIndex(7);
      series.tooltipText = "RFT - {rft}% \nDHU - {dhu} \n On - {date}";
      series.strokeWidth = 2;
      series.minBulletDistance = 15;
      series.name = "DHU";

      // Drop-shaped tooltips
      series.tooltip.background.cornerRadius = 5;
      series.tooltip.background.strokeOpacity = 0;
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.label.minWidth = 40;
      series.tooltip.label.minHeight = 40;
      series.tooltip.label.textAlign = "middle";
      series.tooltip.label.textValign = "middle";

      // Make bullets grow on hover
      var bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.fill = am4core.color("#fff");

      var bullethover = bullet.states.create("hover");
      bullethover.properties.scale = 1.3;

      // Make a panning cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = "panXY";
      chart.cursor.xAxis = dateAxis;
      chart.cursor.snapToSeries = series;

      // Create a horizontal scrollbar with previe and place it underneath the date axis
      chart.scrollbarX = new am4charts.XYChartScrollbar();
      chart.scrollbarX.series.push(series);
      chart.scrollbarX.parent = chart.bottomAxesContainer;

      chart.legend = new am4charts.Legend();
    },
  },
};
</script>

<style scoped>
.chartsui {
  width: 100%;
  height: 400px;
}

.uppercard-chart {
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 5%;
  margin-top: 5%;
}
</style>>

