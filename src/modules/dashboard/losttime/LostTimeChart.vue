
<template>
  <div>
    <canvas :width="width" :height="height" :id="id"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";
// import { api, path } from "@/api";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
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
      ]
    };
  },
  computed: { ...mapState("losttime", ["dashboardData"]) },

  async mounted() {
    await this.getLostimeDashboard(new Date()).then(res => {
      res;
      let lbls = this.dashboardData.map(x => x.name);
      let mcn = this.dashboardData.map(x => x.value);
      var ctx = document.getElementById(this.id).getContext("2d");
      new Chart(ctx, {
        type: this.type ? this.type : "bar",
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
    });
  },
  methods: {
    ...mapActions("losttime", ["getLostimeDashboard"])
  }
};
</script>