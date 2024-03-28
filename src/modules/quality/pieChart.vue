<template>
  <div class="small">
    <line-chart
      :chart-data="qualitypiechartdata"
      :options="options"
    ></line-chart>
  </div>
</template>

<script>
import LineChart from "./lineChart.js";
import { mapActions, mapState } from "vuex";
export default {
  name: "piechart",
  components: {
    LineChart,
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: "right",
          align: "start",
          labels: {
            render: "percentage",
            fontColor: ["green", "white", "red"],
            precision: 2,
          },
        },
      },
    };
  },
  computed: {
    ...mapState("evaluation", ["qualitypiechartdata"]),
  },
  mounted() {
    this.fetchQualityPieChart();
  },
  methods: {
    ...mapActions("evaluation", ["fetchQualityPieChart"]),
  },
};
</script>

<style scoped>
.small {
  max-width: 70%;
  margin-left: 30%;
}
</style>