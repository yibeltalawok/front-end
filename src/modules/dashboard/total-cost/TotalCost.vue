<template>
  <div>
    <v-card flat>
      <v-container grid-list-xs class="white">
        <v-layout row justify-center>
          <v-flex xs12 pa-2 mt-15>
            <chart
              width="1000"
              height="700"
              id="pie"
              :line="line"
              :fBy="fBy"
            ></chart>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import Chart from "./Chart";
export default {
  data: () => ({}),

  components: {
    // apexchart: VueApexCharts,
    Chart
  }
};
</script>
