
<template>
  <div>
    <canvas :width="width" :height="height" :id="id"></canvas>
  </div>
</template>

<script>
// import { api, path } from "@/api";
import Chart from "chart.js";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {};
  },
  props: [
    "id",
    "width",
    "height",
    // "type",
    // "title",
    // "labels",
    // "data",
    // "fill",
    // "backgroundColor",
    // "borderColor",
    // "borderWidth",
    // "year",
    "line",
    "fBy"
  ],
  computed: {
    ...mapState("losttime", ["lineChart", "pieChart", "dashboardData"])
  },

  async mounted() {
    await this.getLostimeDashboard([new Date(), this.line, this.fBy]).then(
      res => {
        res;
        // let lbls = [];
        // let mcn;
        // if (this.type == "line") {
        //   lbls = this.dashboardData[0].map(x => x.monthName);

        //   mcn = this.dashboardData[0].map(x => x.totalmins);
        // } else {
        //   lbls = this.dashboardData[1].map(x => x.name);

        //   mcn = this.dashboardData[1].map(x => x.value);
        // }
        if (this.id == "pie") {
          var ctx2 = document.getElementById(this.id).getContext("2d");
          new Chart(ctx2, this.pieChart);
        }
        if (this.id == "line") {
          var ctx = document.getElementById(this.id).getContext("2d");
          new Chart(ctx, this.lineChart);
        }

        // {
        //   type: this.type ? this.type : "pie",
        //   data: {
        //     labels: lbls,
        //     datasets: [
        //       {
        //         label: this.title,
        //         data: mcn,
        //         fill: this.fill,
        //         backgroundColor: [
        //           "#00ff40",
        //           "#00ffff",
        //           "#ff0000",
        //           "#ffbf00",
        //           "#00bfff",
        //           "#0040ff",
        //           "#8000ff",
        //           "#ff00ff"
        //         ],
        //         borderColor: this.borderColor,
        //         borderWidth: this.borderWidth ? this.borderWidth : 1
        //       }
        //     ]
        //   }
        // }
      }
    );
  },
  methods: {
    ...mapActions("losttime", ["getLostimeDashboard"])
  }
};
</script>