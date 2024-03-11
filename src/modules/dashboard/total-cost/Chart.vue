
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
  props: ["id", "width", "height", "line", "fBy"],
  computed: {
    ...mapState("losttime", ["costPieChart"])
  },

  async mounted() {
    await this.getCostDashboard(new Date()).then(res => {
      res;
      var ctx2 = document.getElementById(this.id).getContext("2d");
      new Chart(ctx2, this.costPieChart);
    });
  },
  methods: {
    ...mapActions("losttime", ["getCostDashboard"])
  }
};
</script>