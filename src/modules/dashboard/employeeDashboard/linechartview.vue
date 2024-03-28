<template>
  <div class="mainDiv">
    <v-container>
      <v-row>
        <v-col cols="12" sm="11"> <h4 class="card-title">Attendance</h4></v-col>
        <v-col cols="12" sm="1">
          <dateIcon class="dateIcon" @click="datePickerAttendance = true" />
          <v-row justify="center">
            <v-dialog v-model="datePickerAttendance" persistent max-width="290">
              <v-date-picker color="amber" v-model="datesAttendance" range>
                <v-spacer />
                <v-btn
                  text
                  color="green"
                  @click="
                    (datePickerAttendance = false), reloadAttendanceChart()
                  "
                  >Ok</v-btn
                ></v-date-picker
              >
            </v-dialog>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <div class="mainInner">
      <div class="leftDiv">
        <v-card flat v-if="attendanceChartSHow" class="leftDivStatus">
          <h3>{{ this.absent }}</h3>
          <label>Abesent</label>
        </v-card>
      </div>
      <div class="rightDiv">
        <div id="chartdiv" v-show="attendanceChartSHow"></div>
        <div v-if="attendanceChartSHow === false" class="nd">
          <nodata class="nodata" />
          <span style="margin: auto">There is no attendance data!</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dateIcon from "@/assets/icons/date_icon.svg";
import nodata from "@/assets/icons/nodata_icon.svg";
import { mapActions, mapState } from "vuex";

/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export default {
  computed: {
    ...mapState("employee", ["reloadAttendanceChartData"]),
  },

  created() {
    this.reloadAttendanceChart();
  },
  methods: {
    ...mapActions("employee", ["getReloadAttendanceChart"]),
    async reloadAttendanceChart() {
      if (this.datesAttendance.length > 1) {
        this.attendanceChartSHow = false;
        await this.getReloadAttendanceChart(this.datesAttendance);
        await this.drawAttendanceChart();

        if (this.reloadAttendanceChartData.length > 0)
          this.attendanceChartSHow = true;
        else this.attendanceChartSHow = false;
      } else this.attendanceChartSHow = false;
    },

    async drawAttendanceChart() {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create("chartdiv", am4charts.XYChart);

      let data = [];
      this.present = 0;
      this.absent = 0;

      for (var i = 0; i < this.reloadAttendanceChartData.length; i++) {
        data.push({
          Department: this.reloadAttendanceChartData[i].department,
          Absent: this.reloadAttendanceChartData[i].absent,
          Present: this.reloadAttendanceChartData[i].present,
        });
        this.absent += this.reloadAttendanceChartData[i].absent;
        this.present += this.reloadAttendanceChartData[i].present;
      }

      chart.data = data;
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = "Department";
      categoryAxis.renderer.minGridDistance = 15;
      categoryAxis.renderer.grid.template.location = 0.5;
      categoryAxis.renderer.grid.template.strokeDasharray = "1,3";
      categoryAxis.renderer.labels.template.rotation = -90;
      categoryAxis.renderer.labels.template.horizontalCenter = "left";
      categoryAxis.renderer.labels.template.location = 0.5;
      categoryAxis.renderer.inside = true;

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
      series.dataFields.categoryX = "Department";
      series.dataFields.openValueY = "Absent";
      series.dataFields.valueY = "Present";
      series.tooltipText = "Absent: {openValueY.value} Present: {valueY.value}";
      series.sequencedInterpolation = true;
      series.fillOpacity = 0;
      series.strokeOpacity = 1;
      series.columns.template.width = 0.01;
      series.tooltip.pointerOrientation = "horizontal";

      let openBullet = series.bullets.create(am4charts.CircleBullet);
      openBullet.fill = chart.colors.getIndex(8);
      openBullet.locationY = 1;

      let closeBullet = series.bullets.create(am4charts.CircleBullet);

      closeBullet.fill = chart.colors.getIndex(15);
      closeBullet.stroke = closeBullet.fill;

      chart.cursor = new am4charts.XYCursor();
    },
  },

  data() {
    return {
      datesAttendance: [
        new Date().toISOString().substr(0, 10),
        new Date().toISOString().substr(0, 10),
      ],
      attendanceChartSHow: false,
      menu: "",
      present: 0,
      absent: 0,
      datePickerAttendance: false,
    };
  },
  components: {
    nodata,
    dateIcon,
  },
};
</script>

<style scoped>
.card-title {
  margin-left: 10px;
  color: rgb(124, 123, 123);
}
.dateIcon {
  width: 20px;
  height: 20px;
}
.dateIcon:hover {
  transform: scale(1.25);
}
.mainDiv {
  height: 260px;
  width: 600px;
  margin-top: 10px;
  border-radius: 10px;
  border: outset 0.5px;
}

/* .mainDiv:hover {
  height: 320px;
  width: 630px;
  margin-left: 50px;
  margin: 10px;
  border-radius: 10px;
  border: rgb(223, 216, 216) solid 1px;
  background-color: white;
  box-shadow: 2px 4px 10px 0px #e7e0d0;
} */
.mainInner {
  display: flex;
  width: 100%;
  height: 100%;
}
.leftDiv {
  width: 20%;
  height: 100%;
  margin-left: 10px;
  margin-top: 5%;
}

.leftDivStatus {
  height: 80px;
  padding: 10%;
  margin-top: 5%;
  margin-left: -9%;
  border-radius: 20px;
}

.leftDivStatus h3 {
  margin-left: 35%;
  font-size: 45px;
  margin-top: -25%;
  color: rgb(165, 96, 96);
}
.leftDivStatus label {
  margin-left: 20%;
  font-family: cursive;
}
.rightDiv {
  width: 80%;
  height: 100%;
}

#chartdiv {
  font-size: 8pt;
  margin-top: -5%;
  width: 100%;
  height: 28vh;
}
/*
#chartdiv:hover {
  height: 31vh;
} */
.nodata {
  align-items: center;
  animation: shake 4.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) both infinite;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 100px;
}
.nd {
  margin-top: 10%;
  height: 100px;
  width: 80%;
  display: flex;
  flex-direction: column;
}

.titleMain {
  color: #76bd7b;
}
</style>