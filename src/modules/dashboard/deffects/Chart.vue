
<template>
  <div>
    <canvas :width="width" :height="height" :id="id"></canvas>
  </div>
</template>

<script>
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
    "line",
    "fBy"
  ],
  computed: {
    ...mapState("defects", ["lineChart"])
  },

  async mounted() {
    await this.getTotalDeffects(new Date()).then(
      res => {
        res;
          var ctx = document.getElementById(this.id).getContext("2d");
          new Chart(ctx, this.lineChart);
      }
    );
  },
  methods: {
    ...mapActions("defects", ["getTotalDeffects"])
  }
};
</script>