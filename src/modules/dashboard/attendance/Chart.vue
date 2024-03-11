
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
    "type",
    "title",
    "labels",
    "data",
    "fill",
    "backgroundColor",
    "borderColor",
    "borderWidth",
    "year",
  ],
  computed: {
    ...mapState("employee", ["attendanceReason"]),
  },

  async mounted() {
    await this.getReasonDashboard(new Date()).then((res) => {
      res;
      let lbls = this.attendanceReason.map((x) => x.name);

      let mcn = this.attendanceReason.map((x) => x.value);

      var ctx = document.getElementById(this.id).getContext("2d");
      new Chart(ctx, {
        type: this.type ? this.type : "pie",
        data: {
          labels: lbls,
          datasets: [
            {
              label: this.title,
              data: mcn,
              fill: this.fill,
              backgroundColor: [
                "#00ff40",
                "#00ffff",
                "#ff0000",
                "#ffbf00",
                "#00bfff",
                "#0040ff",
                "#8000ff",
                "#ff00ff",
              ],
              borderColor: this.borderColor,
              borderWidth: this.borderWidth ? this.borderWidth : 1,
            },
          ],
        },
      });
    });
    // eslint-disable-next-line no-unused-vars
    // await this.getAttendanceChart(new Date()).then(res => {
    //   let temp = [];
    //   let categories = this.chartOptions.xaxis.categories;
    //   // let data =
    //   for (let i = 0; i < this.attendanceChartSeries.length; i++) {
    //     for (let j = 0; j < this.attendanceChartSeries[i].data.length; j++) {
    //       temp.push({
    //         label:
    //           this.attendanceChartSeries[i].name + " " + categories[j] + "s",
    //         value: this.attendanceChartSeries[i].data[j]
    //       });
    //     }
    //   }
    //   let lbls = temp.map(x => x.label);

    //   let mcn = temp.map(x => x.value);

    //   var ctx = document.getElementById(this.id).getContext("2d");
    //   new Chart(ctx, {
    //     type: this.type ? this.type : "pie",
    //     // type: this.type ? this.type : "bar",
    //     data: {
    //       labels: lbls,
    //       datasets: [
    //         {
    //           label: this.title,
    //           data: mcn,
    //           fill: this.fill,
    //           backgroundColor: [
    //             "#00ff40",
    //             "#00ffff",
    //             "#ff0000",
    //             "#ffbf00",
    //             "#00bfff",
    //             "#0040ff",
    //             "#8000ff",
    //             "#ff00ff"
    //           ],
    //           borderColor: this.borderColor,
    //           borderWidth: this.borderWidth ? this.borderWidth : 1
    //         }
    //       ]
    //     }
    //   });
    // });
    // let fd = { where: { year: 2020 } };
    // let samCost = (await api.all(path.costPerSam, fd)).rows;
    // samCost.sort(function(a, b) {
    //   var m1 = new Date(a.month),
    //     m2 = new Date(b.month);
    //   return m1 - m2;
    // });
    // let lbls = samCost.map(x => x.mName);

    // let mcn = samCost.map(x => x.costPerSam);

    // var ctx = document.getElementById(this.id).getContext("2d");
    // new Chart(ctx, {
    //   type: this.type ? this.type : "pie",
    //   // type: this.type ? this.type : "bar",
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
    // });
  },
  methods: {
    ...mapActions("employee", ["getAttendanceChart"]),

    ...mapActions("employee", ["getReasonDashboard"]),
  },
};
</script>