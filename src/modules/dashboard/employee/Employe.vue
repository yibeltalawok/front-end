<template>
  <div>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm12 md4 lg4 pa-2>
        <h1 class="text-center info--text py-3">
          {{ $t("employee_summary") }}
        </h1>
      </v-flex>
      <v-flex xs12 sm12 md4 lg4 pa-2>
        <h1 class="text-center pink--text py-3">
          {{ employees.length }}
          <span class="title info--text">
            employees
            <v-btn
              text
              small
              color="purple"
              class="text-capitalize"
              @click="$router.push({ name: 'employee-list' })"
              >More detail</v-btn
            >
          </span>
        </h1>
      </v-flex>
      <v-flex xs12></v-flex>
      <v-flex xs12 sm12 md4 lg4 pa-2>
        <chart
          width="1000"
          height="700"
          id="chart1"
          title="# of Votes"
          :labels="labels"
          :background-color="backgroundColor"
          :border-color="'rgba(153, 102, 255, 1)'"
        ></chart>
      </v-flex>
      <v-flex xs12 sm12 md4 lg4 pa-2>
        <chart
          type="bar"
          width="1000"
          height="700"
          id="chart2"
          title="# of employees"
          :background-color="backgroundColor"
          :border-color="'rgba(153, 102, 255, 1)'"
        ></chart>
      </v-flex>

      <v-flex xs12 sm12 md4 lg4 pa-2>
        <chart
          width="1000"
          height="700"
          id="chart3"
          type="line"
          title="# of employees"
          :border-color="'rgba(153, 102, 255, 1)'"
          border-width="2"
          fill="false"
        ></chart>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { api, path } from "@/api";
import Chart from "./Chart";

export default {
  data: () => ({
    employees: [],
    roles: [],
    filter: { include: ["userRole"] },
    labels: [],
  }),
  components: {
    Chart,
  },
  async created() {
    this.employees = (await api.all(path.employee, this.filter)).rows;
  },
};
</script>


<style lang="css">
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>