<template>
  <div class="small">
    <line-chart :chart-data="LostTimeSummaryData"></line-chart>
  </div>
</template>

<script>
import LineChart from "./BarChart.js";
import { mapState } from "vuex";
export default {
  name: "barChartView",
  components: {
    LineChart,
  },
  data() {
    return {
      datacollection: null,
    };
  },
  mounted() {
    this.fillData();
  },
  computed: {
    ...mapState("losttime", ["LostTimeSummaryData"]),
  },
  methods: {},
};
</script>

<style scoped>
.small {
  max-width: 260px;
  margin: 10px auto;
}
</style>