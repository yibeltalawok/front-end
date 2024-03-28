
<template>
  <div>
    <canvas :width="width" :height="height" :id="id"></canvas>
  </div>
</template>

<script>
import { api, path } from "@/api";
import Chart from "chart.js";
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
    "year"
  ],
  async mounted() {
    let fd = { where: { year: this.year } };
    let costSummary = (await api.all(path.costSummary, fd)).rows;
    costSummary.sort(function(a, b) {
      var m1 = new Date(a.month),
        m2 = new Date(b.month);
      return m1 - m2;
    });
    let lbls = costSummary.map(x => x.mName);

    let mcn = costSummary.map(x => x.costPerMinute);

    var ctx = document.getElementById(this.id).getContext("2d");
    new Chart(ctx, {
      type: this.type ? this.type : "pie",
      // type: this.type ? this.type : "bar",
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
              "#ff00ff"
            ],
            borderColor: this.borderColor,
            borderWidth: this.borderWidth ? this.borderWidth : 1
          }
        ]
      }
    });
  }
};
</script>