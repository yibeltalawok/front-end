<template>
  <div>
    <v-row style="margin-top: 20px; margin-right: 6%">
      <v-spacer />
      <rtfDhu />
      <addDefect />
      <viewDefect />
    </v-row>

    <v-card outlined class="filter-card">
      <v-card flat class="filter-card">
        <!-- From date picker  -->
        <v-row>
          <v-menu
            ref="frommenu"
            v-model="frommenu"
            :close-on-content-click="false"
            :return-value.sync="fromdate"
            transition="scale-transition"
            offset-y
            min-width="300px"
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
            <v-date-picker v-model="fromdate" no-title scrollable range>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="frommenu = false"
                >Cancel</v-btn
              >
              <v-btn text color="primary" @click="$refs.frommenu.save(fromdate)"
                >OK</v-btn
              >
            </v-date-picker>
          </v-menu>

          <v-spacer />

          <!-- Line number overflow btn  -->
          <v-select
            class="my-2"
            v-model="selectedLineNum"
            :items="line_num_choices"
            label="Line number"
          />

          <v-spacer />
          <!-- Filter using styles overflow btn  -->
          <v-select
            class="my-2"
            v-model="selectedStyleid"
            :items="stylesList"
            item-text="order.orderNumber"
            item-value="id"
            value="id"
            label="Order Number"
          />

          <v-spacer />

          <v-col>
            <v-spacer />
            <v-btn
              :loading="this.filtering"
              :disabled="filtering"
              @click.stop="filterGantChart"
              outlined
              color="#79b700"
            >
              Filter
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>mdi-loading </v-icon>
                </span>
              </template>
            </v-btn>
            <v-spacer />
          </v-col>

          <v-spacer />
        </v-row>
      </v-card>

      <!--------------------------------------------------------------------- Chart card  ------------------------------------------>
      <v-card flat class="uppercard-chart">
        <v-card-subtitle>Defects</v-card-subtitle>
        <v-row class="pa-0 ma-0">
          <div class="chartsui pa-0 ma-0" ref="chartdiv" />
          <v-card flat id="piChart" class="chartsui">
            <piechart />
          </v-card>
        </v-row>
      </v-card>

      <rftDhuChart />

      <v-card flat class="uppercard">
        <v-layout>
          <v-card-subtitle style="font-size: 25px">
            Evaluations History</v-card-subtitle
          >
          <v-spacer />
          <v-autocomplete
            :items="ordersList"
            item-text="order"
            item-value="id"
            label="Order*"
            v-model="selectedOrder"
            required
            outlined
            dense
            @change="selectOrder($event)"
          >
          </v-autocomplete>
          <v-spacer />
          <v-autocomplete
            :items="bunddlesList"
            item-text="bundle"
            item-value="id"
            label="Bunddle*"
            v-model="selectedBunddle"
            required
            outlined
            dense
            @change="selectBunddle($event)"
          >
          </v-autocomplete>
          <v-spacer />
          <v-autocomplete
            :items="linesList"
            item-text="line"
            item-value="line"
            label="Line*"
            v-model="selectedLine"
            required
            outlined
            dense
            @change="selectLine()"
          >
          </v-autocomplete>
          <v-spacer />
        </v-layout>
        <v-data-table
          :headers="headers"
          :items="loadEvalutionsHistoryData"
          :page.sync="page"
          hide-default-footer
          :items-per-page="5"
          class="elevation-1"
          @page-count="pageCount = $event"
        >
         <!-- <template v-slot:item.stateEva="{ item }">
            <v-chip :color="getColor(item.stateEva)" dark>{{
              item.stateEva
            }}</v-chip>
          </template> -->
        </v-data-table>

        <div class="text-center pt-2">
          <v-pagination v-model="page" :length="pageCount"></v-pagination>
        </div>

        <!-- end of the last table  -->
      </v-card>

      <!-- end of the last table  -->
    </v-card>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions, mapMutations } from "vuex";
// import InfoCard from 'vue-info-card';
//import viewCard from "./viewCard";
import viewDefect from "./defectsList";
import rftDhuChart from "./rftDhuChart";
import rtfDhu from "./rftDhu";
import addDefect from "./addDefect";
import piechart from "./pieChart";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export default {
  components: {
    //viewCard,
    rtfDhu,
    addDefect,
    rftDhuChart,
    viewDefect,
    // InfoCard,
    piechart,
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      filtering: true,
      frommenu: false,
      fromdate: [
        new Date().toISOString().substr(0, 10),
        new Date().toISOString().substr(0, 10),
      ],
      selectedStyle: null,
      selectedStyleid: null,
      selectedLineNum: 4,
      filterdefectids: [],
      item: 1,
      styles_id_choices: [],
      styles_name_choices: [],
      headers: [
        { text: "Date", value: "date" },
        {
          text: "Order#",
          align: "start",
          sortable: false,
          value: "styleName",
        },
        { text: "Bunddle#", value: "bunddleNum" },
        { text: "Line#", value: "linenum" },
        { text: "Size", value: "size" },
        { text: "Inspection level", value: "ilevel" },
        { text: "Inspection method", value: "imethod" },
        { text: "Lot quantity", value: "lotquantity" },
        { text: "AQL Level", value: "aqllvel" },
        { text: "Sample size", value: "samplesize" },
        { text: "Defect#", value: "defect" },
        { text: "Checked", value: "quantitychecked" },
        { text: "State", value: "stateEva" },
      ],
      defectids: [],
      defectvlas: [],
      defectlist: {},
      chartdata: [],
      evals: [],
      totaldefectsvals: undefined,
      filterlist: [],
      selectedOrder: "",
      selectedBunddle: "",
      selectedLine: "",
    };
  },
  computed: {
    ...mapState("evaluation", [
      "evaluations",
      "gantchartdata",
      "singleEvaluations",
      "evaluationHistory",
      "line_num_choices",
    ]),

    ...mapState("defects", ["defects"]),

    ...mapState("Styles", ["stylesList"]),

    ...mapState("order", [
      "loadEvalutionsHistoryData",
      "ordersList",
      "bunddlesList",
      "linesList",
    ]),
  },

  mounted() {
    this.fetchAllEvaluations();
    // // this.fetchSingleEvaluationsForChart()
    this.localFetchAllStyles();
    this.localOnload();
    this.fetchEvaluationHistory();
  },

  created() {
    this.getline_num_choices();
    this.reloadTableData();
    this.getOrdersList();
  },

  beforeMount() {
    this.defectExtranctor();
  },

  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  },

  methods: {
    ...mapActions("evaluation", [
      "fetchAllEvaluations",
      "fetchAllGantChartData",
      "fetchSingleEvaluationsForChart",
      "fetchGantChartData",
      "fetchEvaluationHistory",
      "getline_num_choices",
    ]),

    ...mapActions("Styles", [
      // 'fetchAllStyles',
      "fetchAllStylesWithoutid",
    ]),

    ...mapActions("defects", ["fetchDefects", "fetchSingleDefects"]),

    ...mapMutations("evaluation", ["setSingleEvaluations"]),

    ...mapActions("order", [
      "loadEvalutionsHistory",
      "getOrdersList",
      "getBunddlesList",
      "getLinesList",
    ]),

    getColor(status) {
      if (status.toString().toLowerCase() == "failed") return "red";
      else if (status.toString().toLowerCase() == "altered") return "orange";
      else if (status.toString().toLowerCase() == "pending") return "blue";
      else return "green";
    },

    async selectOrder(id) {
      await this.getBunddlesList(id);
      this.reloadTableData();
    },

    async selectBunddle(id) {
      await this.getLinesList(id);
      this.reloadTableData();
    },

    async selectLine() {
      await this.reloadTableData();
    },

    async reloadTableData() {
      this.loadEvalutionsHistory({
        orderId: this.selectedOrder,
        bunddleId: this.selectedBunddle,
        lineNum: this.selectedLine,
      });
    },

    async localOnload() {
      // eslint-disable-next-line no-unused-vars
      await this.fetchAllGantChartData().then((res) => {
        this.lineChart();
      });
    },

    async local_fetchGantChartData() {
      if (this.fromdate.length === 2) {
        var data = {
          from: this.fromdate[0] + "T13:28",
          to: this.fromdate[1] + "T13:28",
          line: this.selectedLineNum,
          opbltn: this.selectedStyleid,
        };

        try {
          // eslint-disable-next-line no-unused-vars
          await this.fetchGantChartData(data).then((ret) => {
            this.lineChart();
          });
        } catch {
          this.$notify({
            type: "danger",
            title: "Error!",
            message: "No Data available!",
          });
        }
      } else {
        this.$notify({
          type: "danger",
          title: "Error!",
          message: "Please select both start and end dates!",
        });
      }
    },

    async filterGantChart() {
      this.local_fetchGantChartData();
      // var fromdate = this.fromdate + "T13:28"
      // // eslint-disable-next-line no-console
      // console.log(fromdate)
    },

    async finalFiltering() {
      this.filtering = true;

      try {
        var filtereddata = [];
        this.defectids = [];
        this.evals = [];
        this.totaldefectsvals = 0;
        var dt;
        var ft;
        var ttt;
        var tempsplit;
        var tempsplit2;

        // eslint-disable-next-line no-console
        console.log(this.templist);

        for (var i = 0; i < this.templist.length; i++) {
          dt = new Date(this.templist[0].date.split(" ")[0].split("-"));
          tempsplit = this.fromdate[0].toString().split("-");
          tempsplit2 = this.todate[1].toString().split("-");
          ft = new Date(tempsplit);
          ttt = new Date(tempsplit2);

          if (
            dt > ft &&
            dt < ttt &&
            this.selectedStyleid.toString() ==
              this.templist[i].styleid.toString() &&
            this.selectedLineNum.toString() ==
              this.templist[i].linenum.toString()
          ) {
            filtereddata.push(this.templist[i]);
          }
        }

        // eslint-disable-next-line no-redeclare
        for (var i = 0; i < filtereddata.length; i++) {
          // console.log(filtereddata[i])
          if (!this.defectids.includes(filtereddata[i].defectid)) {
            this.defectids.push(filtereddata[i].defectid);
            this.evals.push(filtereddata[i]);
            this.totaldefectsvals += filtereddata[i].total;
          } else {
            var temp = this.defectids.indexOf(filtereddata[i].defectid);
            this.evals[temp].total += filtereddata[i].total;
            this.totaldefectsvals += filtereddata[i].total;
          }
        }

        var tempsort;

        for (var j = 0; j < this.evals.length - 1; j++) {
          // eslint-disable-next-line no-redeclare
          for (var i = j; i <= this.evals.length - 1; i++) {
            if (this.evals[i].total > this.evals[j].total) {
              tempsort = this.evals[i];
              this.evals[i] = this.evals[j];
              this.evals[j] = tempsort;
            }
          }
        }

        this.evals[0].minor =
          (this.evals[0].total * 100) / this.totaldefectsvals;
        this.evals[0].major = this.evals[0].minor;

        // eslint-disable-next-line no-redeclare
        for (var i = 1; i < this.evals.length; i++) {
          this.evals[i].minor =
            (this.evals[i].total * 100) / this.totaldefectsvals;
          this.evals[i].major = this.evals[i - 1].major + this.evals[i].minor;
        }

        this.setSingleEvaluations(this.evals);
        this.lineChart();

        this.filtering = false;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);

        this.$notify({
          type: "danger",
          title: "Error!",
          message: "Unable to filter! Please chaeck your internet!",
        });
        this.filtering = false;
      }
    },

    async localFetchAllStyles() {
      this.styles_name_choices = [];
      this.styles_id_choices = [];
      await this.fetchAllStylesWithoutid();
    },

    async defectExtranctor() {
      await this.fetchDefects();
    },

    lineChart() {
      var chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);

      chart.data = this.gantchartdata;
      // Create axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "name";
      categoryAxis.renderer.labels.template.disabled = true;
      categoryAxis.title.text = "Defects";
      categoryAxis.renderer.grid.template.disabled = true;
      categoryAxis.renderer.labels.template.horizontalCenter = "right";
      categoryAxis.renderer.labels.template.verticalCenter = "middle";
      categoryAxis.renderer.labels.template.rotation = 90;
      categoryAxis.tooltip.disabled = true;
      categoryAxis.renderer.minHeight = 10;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = "Frequency";
      valueAxis.renderer.grid.template.disabled = true;

      // Create series
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "total";
      series.dataFields.categoryX = "name";
      series.name = "Defects";
      series.columns.template.tooltipText =
        "Type = {name}\nFrequency = {valueY}\n Percentage = {percentage} \n Comulative = {commulative}";
      series.columns.template.fill = am4core.color("#00ff00"); // fill
      series.columns.template.strokeWidth = 0;

      var series2 = chart.series.push(new am4charts.LineSeries());
      series2.name = "Comm";
      // series2.stroke = am4core.color("#c67100");
      series2.strokeWidth = 3;
      series2.tooltipText = "{valueY}%";
      series2.dataFields.valueY = "commulative";
      series2.dataFields.categoryX = "name";
      series.tooltip.pointerOrientation = "horizontal";

      var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis2.renderer.opposite = true;
      valueAxis2.syncWithAxis = valueAxis;
      valueAxis2.tooltip.disabled = true;
      // valueAxis2.renderer.grid.template.disabled = true;
      valueAxis2.title.text = "Comm";
      series2.yAxis = valueAxis2;
      series2.bullets.push(new am4charts.CircleBullet());
      series2.stroke = chart.colors.getIndex(7);
      series2.fill = series2.stroke;
      series2.strokeWidth = 2;
      series2.snapTooltip = true;

      series.columns.template.column.cornerRadiusTopLeft = 10;
      series.columns.template.column.cornerRadiusTopRight = 10;
      series.columns.template.column.fillOpacity = 0.8;

      var hoverState = series.columns.template.column.states.create("hover");
      hoverState.properties.cornerRadiusTopLeft = 0;
      hoverState.properties.cornerRadiusTopRight = 0;
      hoverState.properties.fillOpacity = 1;

      chart.cursor = new am4charts.XYCursor();

      series.columns.template.adapter.add("fill", function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
      });

      chart.legend = new am4charts.Legend();

      chart.scrollbarX = new am4core.Scrollbar();
      chart.scrollbarX.parent = chart.bottomAxesContainer;
      this.filtering = false;
    },
  },
};
</script>

<style scoped>
.chartsui {
  width: 50%;
  height: 400px;
}

#piChart {
  align-content: center;
}
.uppercard-chart {
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 1%;
}

.uppercard {
  margin-left: 5%;
  margin-right: 2%;
  margin-top: 2%;
}

.filter-card {
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 1%;
  margin-top: 1%;
}

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>