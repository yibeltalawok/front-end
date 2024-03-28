<template>
  
  <div class="chartsui" ref="chartdiv">  </div>

</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {mapState, mapActions} from "vuex";
am4core.useTheme(am4themes_animated);


export default {
  name: "Gantt",

  mounted() {
    this.prepareChartData()
    this.localFetchTimeActions()
  },

  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  },

  computed:{
    ...mapState("tna", ["tnaGantChartData"])
  },


  methods: {

    ...mapActions("tna", [
      "fetchTimeAction",
    ]),

    async localFetchTimeActions(){
     await this.fetchTimeAction(this.$route.params.tnaId)
    },

    prepareChartData(){
      
    var chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);
      // chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      chart.paddingRight = 30;
      chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm";

      var colorSet = new am4core.ColorSet();
      colorSet.saturation = 0.4;

       chart.data = this.tnaGantChartData;

      let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "name";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.grid.template.disabled = true;

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.dateFormatter.dateFormat = "yyyy-MM-dd HH:mm";
      dateAxis.renderer.minGridDistance = 70;
      dateAxis.baseInterval = { count: 30, timeUnit: "second" };
      dateAxis.renderer.tooltipLocation = 0;
      

      let series1 = chart.series.push(new am4charts.ColumnSeries());

      // let bullet = series1.bullets.push(new am4charts.CircleBullet());
      // bullet.strokeOpacity = 0.2;
      // bullet.stroke = am4core.color("#ffffff");
      // bullet.nonScalingStroke = true;
      // bullet.tooltipText = "x:{toDate} y:{toDate}";
      // series1.heatRules.push({
      //   target: bullet.circle,
      //   min: 0,
      //   max: 60,
      //   property: "diff"
      // });

      series1.columns.template.width = am4core.percent(80);
      series1.columns.template.tooltipText = "{name} \n start -> {openDateX}\n end -> {dateX} \n Gap -> {diff} days";

      series1.dataFields.openDateX = "fromDate";
      series1.dataFields.dateX = "toDate";
      series1.dataFields.value = "diff";
      // series1.name = "name";
      series1.dataFields.categoryY = "name";
      series1.columns.template.propertyFields.fill = "color"; // get color from data
      series1.columns.template.propertyFields.stroke = "color";
      series1.columns.template.strokeOpacity = 0;
      series1.columns.template.column.cornerRadiusTopRight = 15;
      series1.columns.template.column.cornerRadiusBottomRight = 15;
      series1.columns.template.column.cornerRadiusTopLeft = 15;
      series1.columns.template.column.cornerRadiusBottomLeft = 15;
      series1.columns.template.column.fillOpacity = 0.8;
      let hoverState = series1.columns.template.column.states.create("hover");
      hoverState.properties.cornerRadiusTopLeft = 0;
      hoverState.properties.cornerRadiusTopRight = 0;
      hoverState.properties.cornerRadiusBottomLeft = 0;
      hoverState.properties.cornerRadiusBottomRight = 0;
      hoverState.properties.fillOpacity = 1;
      // series1.dataFields.openValueY = 22;
      

       var labelBullet = series1.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.hideOversized = true;
        labelBullet.label.fill = am4core.color("#fff");
        labelBullet.label.text = "{name}";
        labelBullet.label.adapter.add("text", function(text, target) {
            /* eslint no-console: 0 */
          // console.log(target.dataItem)
          return  target.dataItem.value;
        });
        labelBullet.locationY = 0.5;

      chart.scrollbarX = new am4core.Scrollbar();
    

      
      
    },
  }
};
</script>
 
<style>
.chartsui {
  width: 100%;
  height: 600px;
}
</style>