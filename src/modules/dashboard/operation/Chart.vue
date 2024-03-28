
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
    return {
      filter: {
        include: ["machine"]
      }
    };
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
    "borderWidth"
  ],
  async mounted() {
    let operations = (await api.all(path.operation, this.filter)).rows;

    let lbls = operations.map(x => x.operationName);

    let mcn = operations.map(x => x.mcAllocated);

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